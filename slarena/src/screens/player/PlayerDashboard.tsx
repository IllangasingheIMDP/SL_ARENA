import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import new screens
import TeamsScreen from './TeamsScreen';
import LeaderBoardScreen from './LeaderBoardScreen';

const PlayerDashboard = () => {
  const { user, logout, setSelectedRole } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('home');

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
      case 'home':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Player Dashboard</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>

            <View style={styles.content}>
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('PlayerProfile')}
              >
                <Text style={styles.cardTitle}>Player Profile</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <Text style={styles.infoValue}>Active Player</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Quick Actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Matches</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>My Teams</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Tournaments</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Statistics</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Upcoming Events</Text>
                <View style={styles.eventItem}>
                  <Text style={styles.eventTitle}>Team Practice</Text>
                  <Text style={styles.eventDate}>Today, 6:00 PM</Text>
                </View>
                <View style={styles.eventItem}>
                  <Text style={styles.eventTitle}>League Match</Text>
                  <Text style={styles.eventDate}>Saturday, 2:00 PM</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.switchRoleButton} onPress={handleSwitchRole}>
                <Text style={styles.switchRoleButtonText}>Manage Roles</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'teams':
        return <TeamsScreen />;
      case 'leaderboard':
        return <LeaderBoardScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
          onPress={() => setActiveTab('home')}
        >
          <Icon name="home" size={24} color={activeTab === 'home' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'teams' && styles.activeNavItem]} 
          onPress={() => setActiveTab('teams')}
        >
          <Icon name="group" size={24} color={activeTab === 'teams' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'teams' && styles.activeNavText]}>Teams</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'leaderboard' && styles.activeNavItem]} 
          onPress={() => setActiveTab('leaderboard')}
        >
          <Icon name="leaderboard" size={24} color={activeTab === 'leaderboard' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'leaderboard' && styles.activeNavText]}>LeaderBoard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  switchRoleButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  switchRoleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default PlayerDashboard; 