import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, List, Divider, Button, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'matches' | 'training' | 'achievements' | 'team' | 'general';
}

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  value: 'public' | 'friends' | 'private';
}

const PlayerSettingsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Match Notifications',
      description: 'Get notified about upcoming matches and results',
      enabled: true,
      category: 'matches',
    },
    {
      id: '2',
      title: 'Training Reminders',
      description: 'Receive reminders for scheduled training sessions',
      enabled: true,
      category: 'training',
    },
    {
      id: '3',
      title: 'Achievement Alerts',
      description: 'Get notified when you unlock new achievements',
      enabled: true,
      category: 'achievements',
    },
    {
      id: '4',
      title: 'Team Updates',
      description: 'Stay informed about team announcements and changes',
      enabled: true,
      category: 'team',
    },
    {
      id: '5',
      title: 'General Notifications',
      description: 'Receive general app updates and announcements',
      enabled: true,
      category: 'general',
    },
  ]);

  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: '1',
      title: 'Profile Visibility',
      description: 'Control who can view your profile',
      value: 'public',
    },
    {
      id: '2',
      title: 'Match History',
      description: 'Control who can view your match history',
      value: 'friends',
    },
    {
      id: '3',
      title: 'Achievements',
      description: 'Control who can view your achievements',
      value: 'public',
    },
    {
      id: '4',
      title: 'Training Schedule',
      description: 'Control who can view your training schedule',
      value: 'friends',
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotificationSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const updatePrivacySetting = (id: string, value: PrivacySetting['value']) => {
    setPrivacySettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };

  const renderNotificationSettings = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notificationSettings.map(setting => (
          <List.Item
            key={setting.id}
            title={setting.title}
            description={setting.description}
            left={props => (
              <Avatar.Icon
                {...props}
                icon={getNotificationIcon(setting.category)}
                style={{ backgroundColor: getNotificationColor(setting.category) }}
              />
            )}
            right={() => (
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleNotification(setting.id)}
                color={theme.colors.primary}
              />
            )}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderPrivacySettings = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Privacy</Text>
        {privacySettings.map(setting => (
          <View key={setting.id}>
            <List.Item
              title={setting.title}
              description={setting.description}
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="shield-account"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
            />
            <View style={styles.privacyOptions}>
              <Button
                mode={setting.value === 'public' ? 'contained' : 'outlined'}
                onPress={() => updatePrivacySetting(setting.id, 'public')}
                style={styles.privacyButton}
              >
                Public
              </Button>
              <Button
                mode={setting.value === 'friends' ? 'contained' : 'outlined'}
                onPress={() => updatePrivacySetting(setting.id, 'friends')}
                style={styles.privacyButton}
              >
                Friends
              </Button>
              <Button
                mode={setting.value === 'private' ? 'contained' : 'outlined'}
                onPress={() => updatePrivacySetting(setting.id, 'private')}
                style={styles.privacyButton}
              >
                Private
              </Button>
            </View>
            <Divider style={styles.divider} />
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  const getNotificationIcon = (category: NotificationSetting['category']) => {
    switch (category) {
      case 'matches':
        return 'cricket';
      case 'training':
        return 'dumbbell';
      case 'achievements':
        return 'trophy';
      case 'team':
        return 'account-group';
      case 'general':
        return 'bell';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (category: NotificationSetting['category']) => {
    switch (category) {
      case 'matches':
        return theme.colors.primary;
      case 'training':
        return theme.colors.secondary;
      case 'achievements':
        return theme.colors.success;
      case 'team':
        return theme.colors.warning;
      case 'general':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderNotificationSettings()}
        {renderPrivacySettings()}

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account</Text>
            <List.Item
              title="Change Password"
              description="Update your account password"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="lock"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Linked Accounts"
              description="Manage your connected social accounts"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="link"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              onPress={() => navigation.navigate('LinkedAccounts')}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Delete Account"
              description="Permanently delete your account and data"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="delete"
                  style={{ backgroundColor: theme.colors.error }}
                />
              )}
              onPress={() => navigation.navigate('DeleteAccount')}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>About</Text>
            <List.Item
              title="Version"
              description="1.0.0"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="information"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Terms of Service"
              description="Read our terms and conditions"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="file-document"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              onPress={() => navigation.navigate('TermsOfService')}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="shield-check"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
          </Card.Content>
        </Card>
      </ScrollView>
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
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  privacyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  privacyButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default PlayerSettingsScreen; 