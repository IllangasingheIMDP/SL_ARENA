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
import TournamentsScreen from './TournamentsScreen';
import SportsCalendar from '../../components/SportsCalendar';

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

              <SportsCalendar />

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
      case 'tournaments':
        return <TournamentsScreen />;
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
          <Icon name="home" size={24} color={activeTab === 'home' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'teams' && styles.activeNavItem]} 
          onPress={() => setActiveTab('teams')}
        >
          <Icon name="group" size={24} color={activeTab === 'teams' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'teams' && styles.activeNavText]}>Teams</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'tournaments' && styles.activeNavItem]} 
          onPress={() => setActiveTab('tournaments')}
        >
          <Icon name="emoji-events" size={24} color={activeTab === 'tournaments' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'tournaments' && styles.activeNavText]}>Tournaments</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'leaderboard' && styles.activeNavItem]} 
          onPress={() => setActiveTab('leaderboard')}
        >
          <Icon name="leaderboard" size={24} color={activeTab === 'leaderboard' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'leaderboard' && styles.activeNavText]}>LeaderBoard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 25,
    backgroundColor: '#000080', // Navy blue
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFD700', // Gold
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold
    marginTop: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080', // Navy blue
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    color: '#5f6368',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#000080', // Navy blue
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#000080', // Navy blue
    padding: 18,
    borderRadius: 15,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFD700', // Gold
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  eventItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000080', // Navy blue
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  switchRoleButton: {
    backgroundColor: '#000080', // Navy blue
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchRoleButtonText: {
    color: '#FFD700', // Gold
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: '#000080',
  },
  navText: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#000080',
    fontWeight: 'bold',
  },
});

export default PlayerDashboard; 