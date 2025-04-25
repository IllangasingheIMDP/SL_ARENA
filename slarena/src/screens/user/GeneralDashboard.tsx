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

// Import new screens
import TournamentsScreen from './TournamentsScreen';
import FeedScreen from './FeedScreen';
import LeaderBoardScreen from './LeaderBoardScreen';

type GeneralDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GeneralDashboard'
>;

const GeneralDashboard = () => {
  const { user } = useAuth();
  const navigation = useNavigation<GeneralDashboardNavigationProp>();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>

            <View style={styles.content}>
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('UserProfile')}
              >
                <Text style={styles.cardTitle}>Profile Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Role:</Text>
                  <Text style={styles.infoValue}>
                    {Array.isArray(user?.role) 
                      ? user.role.join(', ')
                      : user?.role || 'No role'
                    }
                  </Text>
                </View>
                <Text style={styles.viewProfileText}>Tap to view full profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'tournaments':
        return <TournamentsScreen />;
      case 'feed':
        return <FeedScreen />;
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
          style={[styles.navItem, activeTab === 'tournaments' && styles.activeNavItem]} 
          onPress={() => setActiveTab('tournaments')}
        >
          <Icon name="emoji-events" size={24} color={activeTab === 'tournaments' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'tournaments' && styles.activeNavText]}>Tournaments</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'feed' && styles.activeNavItem]} 
          onPress={() => setActiveTab('feed')}
        >
          <Icon name="rss-feed" size={24} color={activeTab === 'feed' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'feed' && styles.activeNavText]}>Feed</Text>
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
    backgroundColor: '#f4511e',
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
  viewProfileText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
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

export default GeneralDashboard; 