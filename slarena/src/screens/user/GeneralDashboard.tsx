import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Tournament } from '../../types/tournamentTypes';

// Import new screens
import TournamentsScreen from './TournamentsScreen';
import FeedScreen from './FeedScreen';
import LeaderBoardScreen from './LeaderBoardScreen';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { tournamentService } from '../../services/tournamentService';
import TournamentMapView from '../../components/maps/TournamentMapView';

type GeneralDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GeneralDashboard'
>;

const GeneralDashboard = () => {
  const { user } = useAuth();
  const navigation = useNavigation<GeneralDashboardNavigationProp>();
  const [activeTab, setActiveTab] = useState('home');
  const [ongoingTournaments, setOngoingTournaments] = useState<Tournament[]>([]);
  

  useEffect(() => {
    getOngoingTournaments();
  }, []);

  const getOngoingTournaments = async () => {
    try {
      const result = await tournamentService.getOngoingAllTournaments();
      if (result) {
        setOngoingTournaments(result);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Image 
                  source={require('../../../assets/images/male.jpg')}
                  style={styles.profileImage}
                />
                <View style={styles.profileTextContainer}>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.userRole}>
                    General User
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('UserProfile')}
              >
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Today's Matches Summary */}
            <View style={styles.matchesContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <Icon name="sports-cricket" size={24} color="#4CAF50" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Today's Matches</Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Icon name="arrow-forward" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <View style={styles.matchTypeContainer}>
                    <Icon name="schedule" size={16} color="#666" style={styles.matchIcon} />
                    <Text style={styles.matchType}>T20</Text>
                  </View>
                  <Text style={styles.matchTime}>2:30 PM</Text>
                </View>
                <View style={styles.teamsContainer}>
                  <View style={styles.teamInfo}>
                    <Image 
                      source={require('../../../assets/images/default-team.png')}
                      style={styles.teamLogo}
                    />
                    <Text style={styles.teamName}>Team A</Text>
                  </View>
                  <View style={styles.vsContainer}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Image 
                      source={require('../../../assets/images/default-team1.png')}
                      style={styles.teamLogo}
                    />
                    <Text style={styles.teamName}>Team B</Text>
                  </View>
                </View>
                <View style={styles.matchFooter}>
                  <View style={styles.venueContainer}>
                    <Icon name="location-on" size={16} color="#666" style={styles.venueIcon} />
                    <Text style={styles.venueText}>Wanawadula Resort</Text>
                  </View>
                  <TouchableOpacity style={styles.liveButton}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveButtonText}>LIVE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Map View */}
            <View style={styles.mapContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <Icon name="map" size={24} color="#4CAF50" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Ongoing Tournaments</Text>
                </View>
              </View>
              <TournamentMapView 
                tournaments={ongoingTournaments}
                showUserLocation={true}
                height={250}
              />
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
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a2151',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileTextContainer: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userRole: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    padding: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a2151',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
    borderTopColor: '#4CAF50',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  mapContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a2151',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  matchesContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a2151',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  matchCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchType: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  matchTime: {
    fontSize: 14,
    color: '#1a2151',
    fontWeight: '600',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2151',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginHorizontal: 20,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  venueText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  liveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchIcon: {
    marginRight: 4,
  },
  vsContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueIcon: {
    marginRight: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
});

export default GeneralDashboard; 