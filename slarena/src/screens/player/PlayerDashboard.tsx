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
import { LinearGradient } from 'expo-linear-gradient';

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
            {/* Header Section */}
            <LinearGradient
              colors={['#000080', '#000066']}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <View style={styles.profileSection}>
                  <TouchableOpacity 
                    style={styles.avatarContainer}
                    onPress={() => navigation.navigate('PlayerProfile')}
                  >
                    <Icon name="person" size={40} color="#FFD700" />
                  </TouchableOpacity>
                  <View style={styles.userInfo}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <TouchableOpacity 
                      style={styles.viewProfileButton}
                      onPress={() => navigation.navigate('PlayerProfile')}
                    >
                      <Text style={styles.viewProfileText}>View Profile</Text>
                      <Icon name="chevron-right" size={20} color="#FFD700" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Quick Stats Section */}
            <View style={styles.quickStats}>
              <View style={styles.statCard}>
                <Icon name="sports-soccer" size={24} color="#000080" />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="emoji-events" size={24} color="#000080" />
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Trophies</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="group" size={24} color="#000080" />
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Teams</Text>
              </View>
            </View>

            {/* Upcoming Events */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <SportsCalendar />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.switchRoleButton]} 
                onPress={handleSwitchRole}
              >
                <Icon name="swap-horiz" size={20} color="#000080" />
                <Text style={styles.switchRoleButtonText}>Switch Role</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.logoutButton]} 
                onPress={handleLogout}
              >
                <Icon name="logout" size={20} color="#fff" />
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
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFD700',
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000080',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000080',
    letterSpacing: 0.5,
  },
  viewAllText: {
    color: '#000080',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    width: '48%',
  },
  switchRoleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000080',
  },
  logoutButton: {
    backgroundColor: '#000080',
  },
  switchRoleButtonText: {
    color: '#000080',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
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
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  viewProfileText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default PlayerDashboard; 