import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import { notificationService, Notification } from '../services/notificationService';

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

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Card style={[styles.notificationCard, item.is_read === 0 && styles.unreadCard]}>
        <Card.Content>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.notification_id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Notification Details</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{selectedNotification?.message}</Paragraph>
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
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 8,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#fff3e0',
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  dialogTimestamp: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationScreen; 