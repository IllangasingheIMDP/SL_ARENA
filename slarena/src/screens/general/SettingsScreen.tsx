import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Text, List, Divider, Button, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/theme';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Handle logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Account</Text>
        <List.Section>
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account" />}
            onPress={() => navigation.navigate('Profile')}
          />
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          />
          <List.Item
            title="Privacy Settings"
            left={props => <List.Icon {...props} icon="shield" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          />
        </List.Section>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Preferences</Text>
        <List.Section>
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Location Services"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Language"
            description={language}
            left={props => <List.Icon {...props} icon="translate" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          />
        </List.Section>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Support</Text>
        <List.Section>
          <List.Item
            title="Help & FAQ"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          />
          <List.Item
            title="Contact Us"
            left={props => <List.Icon {...props} icon="email" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          />
          <List.Item
            title="About"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={() => Alert.alert('About', 'SL Arena v1.0.0\nA cricket talent platform for Sri Lanka.')}
          />
        </List.Section>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          color={theme.colors.error}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  logoutContainer: {
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  logoutButton: {
    borderRadius: borderRadius.md,
  },
});

export default SettingsScreen; 