import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import tab components
import LogsTab from './tabs/LogsTab';
import UpcomingMatchesTab from './tabs/UpcomingMatchesTab';
import SettingsTab from './tabs/SettingsTab';
import OngoingTournamentsTab from './tabs/OngoingTournamentsTab';

type OrganisationDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrganisationDashboard'
>;

const OrganisationDashboard = () => {
  const { user, logout, setSelectedRole } = useAuth();
  const navigation = useNavigation<OrganisationDashboardNavigationProp>();
  const [activeTab, setActiveTab] = useState('logs');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSwitchRole = () => {
    setSelectedRole(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'logs':
        return <LogsTab />;
      case 'upcoming':
        return <UpcomingMatchesTab />;
      case 'ongoing':
        return <OngoingTournamentsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'logs' && styles.activeNavItem]} 
          onPress={() => setActiveTab('logs')}
        >
          <Icon name="history" size={24} color={activeTab === 'logs' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'logs' && styles.activeNavText]}>Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'upcoming' && styles.activeNavItem]} 
          onPress={() => setActiveTab('upcoming')}
        >
          <Icon name="event" size={24} color={activeTab === 'upcoming' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'upcoming' && styles.activeNavText]}>Upcoming</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'ongoing' && styles.activeNavItem]} 
          onPress={() => setActiveTab('ongoing')}
        >
          <Icon name="sports-cricket" size={24} color={activeTab === 'ongoing' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'ongoing' && styles.activeNavText]}>Ongoing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'settings' && styles.activeNavItem]} 
          onPress={() => setActiveTab('settings')}
        >
          <Icon name="settings" size={24} color={activeTab === 'settings' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'settings' && styles.activeNavText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default OrganisationDashboard; 