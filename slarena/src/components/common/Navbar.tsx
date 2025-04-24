import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge } from 'react-native-paper';
import { notificationService } from '../../services/notificationService';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { io } from 'socket.io-client';
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

const Navbar: React.FC<NavbarProps> = ({
  showBackButton = true,
  showNotification = true,
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigation = useNavigation<NavigationProp>();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (showNotification) {
      // Initial fetch
      fetchUnreadCount();

      // Set up Socket.IO connection
      const setupSocket = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.warn('No token available for socket connection');
            return;
          }

          //console.log('Attempting to connect to socket at:', API_URL);

          const socket = io(API_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            timeout: 10000,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            forceNew: true,
            autoConnect: true,
            upgrade: true,
            rememberUpgrade: true,
            path: '/socket.io/',
            query: {
              userId: userId
            }
          });

          // Connection event handlers
          socket.on('connect', () => {
            //console.log('Socket connected successfully');
            // Join user's notification room with correct user ID
            socket.emit('join_notification_room', { userId });
            //console.log('Joined notification room for user:', userId);
          });

          socket.on('connect_error', (error) => {
            //console.error('Socket connection error:', error.message);
            //console.log('Connection state:', socket.connected);
            //console.log('Transport:', socket.io.engine.transport.name);
          });

          socket.on('disconnect', (reason) => {
            //console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
              // Server initiated disconnect, try to reconnect
              socket.connect();
            }
          });

          // Listen for new notifications
          socket.on('new_notification', (data) => {
            //console.log('New notification received:', data);
            // Immediately fetch updated count
            fetchUnreadCount();
          });

          // Listen for notification count updates
          socket.on('notification_count_update', (count) => {
            //console.log('Notification count updated:', count);
            setUnreadCount(count);
          });

          // Cleanup on unmount
          return () => {
            //console.log('Cleaning up socket connection');
            socket.disconnect();
          };
        } catch (error) {
          console.error('Error setting up socket:', error);
        }
      };

      setupSocket();
    }
  }, [showNotification]);

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