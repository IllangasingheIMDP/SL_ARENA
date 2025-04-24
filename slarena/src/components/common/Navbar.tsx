import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge } from 'react-native-paper';
import { notificationService } from '../../services/notificationService';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

const API_URL = Constants.expoConfig?.extra?.socketUrl;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
  showNotification?: boolean;
}

// Custom hook for socket management
const useSocketConnection = (userId: number | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      console.log('Fetching unread count...');
      const count = await notificationService.getUnreadCount();
      console.log('Unread count fetched:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const setupSocket = async () => {
      try {
        console.log('Setting up socket connection...');
        const token = await AsyncStorage.getItem('token');
        if (!token || !userId) {
          console.log('No token or userId available:', { token: !!token, userId });
          return;
        }

        console.log('Creating socket instance with URL:', API_URL, 'for user:', userId);
        // Create socket instance with optimized options
        socketInstance = io(API_URL, {
          auth: { token },
          transports: ['websocket'],
          timeout: 5000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 3000,
          forceNew: true,
          autoConnect: true,
          path: '/socket.io/',
          query: { userId: userId.toString() } // Convert userId to string
        });

        // Connection event handlers
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully for user:', userId);
          setIsConnected(true);
          // Join room and fetch initial count
          console.log('Joining notification room for user:', userId);
          socketInstance?.emit('join_notification_room', { userId: userId.toString() }); // Convert userId to string
          fetchUnreadCount();
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('Socket disconnected. Reason:', reason, 'for user:', userId);
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error for user:', userId, error.message);
          console.log('Connection state:', socketInstance?.connected);
          console.log('Transport:', socketInstance?.io?.engine?.transport?.name);
          setIsConnected(false);
        });

        // Listen for new notifications
        socketInstance.on('new_notification', (data) => {
          console.log('New notification received for user:', userId, data);
          // Immediately update count when new notification arrives
          setUnreadCount(prev => {
            console.log('Updating unread count from', prev, 'to', prev + 1);
            return prev + 1;
          });
        });

        // Listen for notification count updates
        socketInstance.on('notification_count_update', (count) => {
          console.log('Notification count update received for user:', userId, count);
          setUnreadCount(count);
        });

        // Debug socket state
        console.log('Socket instance created for user:', userId, {
          connected: socketInstance.connected,
          id: socketInstance.id,
          transport: socketInstance.io?.engine?.transport?.name
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Error setting up socket for user:', userId, error);
      }
    };

    setupSocket();

    // Cleanup function
    return () => {
      if (socketInstance) {
        console.log('Cleaning up socket connection for user:', userId);
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [userId]); // Only recreate socket when userId changes

  // Reconnect and fetch count if disconnected
  useEffect(() => {
    if (!isConnected && socket) {
      console.log('Attempting to reconnect socket...');
      socket.connect();
    }
  }, [isConnected, socket]);

  // Periodically check connection and fetch count
  useEffect(() => {
    if (isConnected) {
      console.log('Setting up periodic count check');
      const interval = setInterval(() => {
        console.log('Running periodic count check');
        fetchUnreadCount();
      }, 30000); // Check every 30 seconds

      return () => {
        console.log('Cleaning up periodic count check');
        clearInterval(interval);
      };
    }
  }, [isConnected]);

  return { unreadCount, fetchUnreadCount, isConnected };
};

const Navbar: React.FC<NavbarProps> = ({
  showBackButton = true,
  showNotification = true,
}) => {
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;
  const navigation = useNavigation<NavigationProp>();
  const { unreadCount, fetchUnreadCount, isConnected } = useSocketConnection(userId);

  // Fetch count when component mounts and when showNotification changes
  useEffect(() => {
    if (showNotification) {
      console.log('Fetching count due to showNotification change');
      fetchUnreadCount();
    }
  }, [showNotification]);

  // Refresh count when returning from Notifications screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (showNotification) {
        console.log('Fetching count due to screen focus');
        fetchUnreadCount();
      }
    });

    return unsubscribe;
  }, [navigation, showNotification]);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerContainer}>
        <Text style={styles.title}>SL ARENA</Text>
      </View>
      
      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.notificationButton}
          >
            <Ionicons name="notifications" size={24} color="#333" />
            {unreadCount > 0 && (
              <Badge
                size={16}
                style={styles.badge}
              >
                {unreadCount}
              </Badge>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#f4511e',
    color: '#fff',
  },
});

export default Navbar; 