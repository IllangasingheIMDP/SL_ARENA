import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsItem from '../../../components/organisation/SettingsItem';
import { useAuth } from '../../../context/AuthContext';

const SettingsTab = () => {
  const { logout } = useAuth();

  const settingsOptions = [
    { id: '1', title: 'Profile Settings', icon: 'person', description: 'Update organization profile information' },
    { id: '2', title: 'Team Management', icon: 'groups', description: 'Manage teams and players' },
    { id: '3', title: 'Tournament Settings', icon: 'emoji-events', description: 'Configure tournament settings' },
    { id: '4', title: 'Notification Preferences', icon: 'notifications', description: 'Manage notification settings' },
    { id: '5', title: 'Payment Methods', icon: 'payment', description: 'Manage payment methods and billing' },
    { id: '6', title: 'Privacy & Security', icon: 'security', description: 'Configure privacy and security settings' },
    { id: '7', title: 'Help & Support', icon: 'help', description: 'Get help and contact support' },
    { id: '8', title: 'About', icon: 'info', description: 'About SL Arena and version information' },
  ];

  const handleSettingPress = (settingId: string) => {
    console.log(`Navigate to setting ${settingId}`);
    // Navigate to the appropriate setting screen
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderSettingsItem = ({ item }: { item: any }) => (
    <SettingsItem
      title={item.title}
      description={item.description}
      icon={item.icon}
      onPress={() => handleSettingPress(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Settings</Text>
      <FlatList
        data={settingsOptions}
        renderItem={renderSettingsItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SettingsTab; 