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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Import tab components
import FeedTab from './tabs/FeedTab';
import LeaderBoardTab from './tabs/LeaderBoardTab';
import ScheduleTab from './tabs/ScheduleTab';

type TrainerDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TrainerDashboard'
>;

const TrainerDashboard = () => {
  const { user, logout, setSelectedRole } = useAuth();
  const navigation = useNavigation<TrainerDashboardNavigationProp>();
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
                  <View style={styles.avatarContainer}>
                    <Icon name="person" size={40} color="#FFD700" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.name}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            

            {/* Today's Schedule */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Schedule</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.scheduleList}>
                <View style={styles.scheduleItem}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>9:00 AM</Text>
                    <Text style={styles.scheduleDuration}>1.5h</Text>
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleTitle}>Team Training Session</Text>
                    <Text style={styles.scheduleLocation}>Main Field</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#000080" />
                </View>
                <View style={styles.scheduleItem}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>2:00 PM</Text>
                    <Text style={styles.scheduleDuration}>1.5h</Text>
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleTitle}>Individual Training</Text>
                    <Text style={styles.scheduleLocation}>Training Room 2</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#000080" />
                </View>
              </View>
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
      case 'feed':
        return <FeedTab />;
      case 'leaderboard':
        return <LeaderBoardTab />;
      case 'schedule':
        return <ScheduleTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          style={[styles.navItem, activeTab === 'feed' && styles.activeNavItem]} 
          onPress={() => setActiveTab('feed')}
        >
          <Icon name="rss-feed" size={24} color={activeTab === 'feed' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'feed' && styles.activeNavText]}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'leaderboard' && styles.activeNavItem]} 
          onPress={() => setActiveTab('leaderboard')}
        >
          <Icon name="leaderboard" size={24} color={activeTab === 'leaderboard' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'leaderboard' && styles.activeNavText]}>LeaderBoard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'schedule' && styles.activeNavItem]} 
          onPress={() => setActiveTab('schedule')}
        >
          <Icon name="schedule" size={24} color={activeTab === 'schedule' ? '#000080' : '#5f6368'} />
          <Text style={[styles.navText, activeTab === 'schedule' && styles.activeNavText]}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    flex: 1,
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
  quickActions: {
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
  quickActionButton: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#000080',
    fontWeight: '500',
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
  scheduleList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  scheduleTimeContainer: {
    width: 80,
    alignItems: 'center',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000080',
  },
  scheduleDuration: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2,
  },
  scheduleDetails: {
    flex: 1,
    marginLeft: 15,
  },
  scheduleTitle: {
    fontSize: 16,
    color: '#000080',
    marginBottom: 4,
    fontWeight: '500',
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#5f6368',
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

export default TrainerDashboard; 