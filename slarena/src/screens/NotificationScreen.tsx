import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Card, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import { notificationService, Notification } from '../services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: 1 }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setDialogVisible(true);
    if (notification.is_read === 0) {
      markAsRead(notification.notification_id);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'trophy';
      case 'message':
        return 'chatbubble';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Card style={[styles.notificationCard, item.is_read === 0 && styles.unreadCard]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#000080', '#000066']}
              style={styles.iconGradient}
            >
              <Ionicons 
                name={getNotificationIcon(item.type)} 
                size={24} 
                color="#FFD700" 
              />
            </LinearGradient>
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
          {item.is_read === 0 && (
            <View style={styles.unreadIndicator} />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000080', '#000066']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Notifications</Text>
      </LinearGradient>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.notification_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Notification Details</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogIconContainer}>
              <LinearGradient
                colors={['#000080', '#000066']}
                style={styles.dialogIconGradient}
              >
                <Ionicons 
                  name={selectedNotification ? getNotificationIcon(selectedNotification.type) : 'notifications'} 
                  size={32} 
                  color="#FFD700" 
                />
              </LinearGradient>
            </View>
            <Paragraph style={styles.dialogMessage}>{selectedNotification?.message}</Paragraph>
            <Paragraph style={styles.dialogTimestamp}>
              {selectedNotification && new Date(selectedNotification.created_at).toLocaleString()}
            </Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#000080',
    marginBottom: 4,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#5f6368',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginLeft: 8,
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    color: '#000080',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dialogIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogMessage: {
    fontSize: 16,
    color: '#000080',
    textAlign: 'center',
    marginBottom: 8,
  },
  dialogTimestamp: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
});

export default NotificationScreen; 