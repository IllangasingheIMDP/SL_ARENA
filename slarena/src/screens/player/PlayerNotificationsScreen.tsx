import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, List, Divider, Chip, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Notification {
  id: string;
  type: 'match' | 'team' | 'tournament' | 'training' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    type: 'navigate' | 'dismiss';
    route?: string;
    params?: any;
  };
}

const PlayerNotificationsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'match',
      title: 'Match Reminder',
      message: 'Your match against Kandy Warriors is tomorrow at 2:00 PM',
      timestamp: '2024-04-20T10:00:00Z',
      read: false,
      action: {
        type: 'navigate',
        route: 'MatchDetails',
        params: { matchId: '1' },
      },
    },
    {
      id: '2',
      type: 'team',
      title: 'Team Update',
      message: 'New player John Smith has joined Colombo Kings',
      timestamp: '2024-04-19T15:30:00Z',
      read: true,
      action: {
        type: 'navigate',
        route: 'TeamDetails',
        params: { teamId: '1' },
      },
    },
    {
      id: '3',
      type: 'tournament',
      title: 'Tournament Invitation',
      message: 'You have been invited to join Premier Cricket League 2024',
      timestamp: '2024-04-18T09:15:00Z',
      read: false,
      action: {
        type: 'navigate',
        route: 'TournamentDetails',
        params: { tournamentId: '1' },
      },
    },
    {
      id: '4',
      type: 'training',
      title: 'Training Schedule',
      message: 'Your training session is scheduled for tomorrow at 10:00 AM',
      timestamp: '2024-04-17T14:45:00Z',
      read: true,
      action: {
        type: 'navigate',
        route: 'TrainingDetails',
        params: { trainingId: '1' },
      },
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'Your profile has been successfully updated',
      timestamp: '2024-04-16T11:20:00Z',
      read: true,
      action: {
        type: 'dismiss',
      },
    },
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match':
        return 'cricket';
      case 'team':
        return 'account-group';
      case 'tournament':
        return 'trophy';
      case 'training':
        return 'dumbbell';
      case 'system':
        return 'cog';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'match':
        return theme.colors.primary;
      case 'team':
        return theme.colors.info;
      case 'tournament':
        return theme.colors.success;
      case 'training':
        return theme.colors.warning;
      case 'system':
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }

    if (notification.action?.type === 'navigate' && notification.action.route) {
      navigation.navigate(notification.action.route, notification.action.params);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification =>
    activeFilter === 'all' ? true : !notification.read
  );

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      onPress={() => handleNotificationPress(notification)}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
    >
      <View style={styles.notificationIcon}>
        <Avatar.Icon
          size={40}
          icon={getNotificationIcon(notification.type)}
          style={{ backgroundColor: getNotificationColor(notification.type) }}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.filterContainer}>
          <Button
            mode={activeFilter === 'all' ? 'contained' : 'outlined'}
            onPress={() => setActiveFilter('all')}
            style={styles.filterButton}
          >
            All
          </Button>
          <Button
            mode={activeFilter === 'unread' ? 'contained' : 'outlined'}
            onPress={() => setActiveFilter('unread')}
            style={styles.filterButton}
          >
            Unread
          </Button>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(renderNotification)
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No notifications found</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {notifications.some(n => !n.read) && (
        <FAB
          style={styles.fab}
          icon="check-all"
          onPress={markAllAsRead}
          color={theme.colors.surface}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  unreadNotification: {
    backgroundColor: theme.colors.primary + '10',
  },
  notificationIcon: {
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.secondary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerNotificationsScreen; 