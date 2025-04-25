import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchLeaderboard, fetchPlayerDetails } from '../../services/leaderBoard';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  PlayerDetails: { playerData: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerDetails'>;

type Player = {
  player_id: string;
  name: string;
  batting_points?: number;
  bowling_points?: number;
  allrounder_points?: number;
  bio?: string;
  batting_style?: string;
  bowling_style?: string;
  fielding_position?: string;
  role?: string;
  achievements?: Array<{
    achievement_type: string;
    match_type: string;
    venue_name: string;
  }>;
};

const LeaderBoardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('bowling');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const fetchPlayers = async (role: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchLeaderboard(role);
      //console.log(response);
      setPlayers(response);
    } catch (err) {
      setError('Failed to fetch leaderboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(activeTab);
  }, [activeTab]);

  const handlePlayerPress = async (playerId: string) => {
    try {
      const response = await fetchPlayerDetails(playerId);
      //console.log(response);
      setSelectedPlayer(response);
      setModalVisible(true);
    } catch (err) {
      console.error('Error fetching player details:', err);
    }
  };

  const toggleExpand = (playerId: string) => {
    if (expandedPlayerId === playerId) {
      setExpandedPlayerId(null);
    } else {
      setExpandedPlayerId(playerId);
    }
  };

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={styles.playerItem}
      onPress={() => toggleExpand(item.player_id)}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.playerItemGradient}
      >
        <View style={styles.playerHeader}>
          <Text style={styles.playerName}>{item.name}</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.playerPoints}>
              {activeTab === 'batting' && item.batting_points}
              {activeTab === 'bowling' && item.bowling_points}
              {activeTab === 'allrounder' && item.allrounder_points}
            </Text>
          </View>
        </View>
        {expandedPlayerId === item.player_id && (
          <View style={styles.expandedContent}>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handlePlayerPress(item.player_id)}
            >
              <LinearGradient
                colors={['#4A90E2', '#007AFF']}
                style={styles.buttonGradient}
              >
                <Text style={styles.viewDetailsText}>View Full Details</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['bowling', 'batting', 'allrounder'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <LinearGradient
            colors={activeTab === tab ? ['#4A90E2', '#007AFF'] : ['#f5f5f5', '#f5f5f5']}
            style={styles.tabGradient}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'allrounder' ? 'All Rounder' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPlayerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>×</Text>
          </TouchableOpacity>
          <ScrollView>
            {selectedPlayer && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPlayer.name}</Text>
                  <View style={styles.pointsContainer}>
                    <View style={styles.pointItem}>
                      <Text style={styles.pointLabel}>Batting</Text>
                      <Text style={styles.pointValue}>{selectedPlayer.batting_points || '0'}</Text>
                    </View>
                    <View style={styles.pointItem}>
                      <Text style={styles.pointLabel}>Bowling</Text>
                      <Text style={styles.pointValue}>{selectedPlayer.bowling_points || '0'}</Text>
                    </View>
                    <View style={styles.pointItem}>
                      <Text style={styles.pointLabel}>All Rounder</Text>
                      <Text style={styles.pointValue}>{selectedPlayer.allrounder_points || '0'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Profile</Text>
                  <View style={styles.profileCard}>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileLabel}>Bio</Text>
                      <Text style={styles.profileValue}>{selectedPlayer.bio || 'No bio available'}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileLabel}>Batting Style</Text>
                      <Text style={styles.profileValue}>{selectedPlayer.batting_style || 'Unknown'}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileLabel}>Bowling Style</Text>
                      <Text style={styles.profileValue}>{selectedPlayer.bowling_style || 'Unknown'}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileLabel}>Fielding Position</Text>
                      <Text style={styles.profileValue}>{selectedPlayer.fielding_position || 'Unknown'}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileLabel}>Role</Text>
                      <Text style={styles.profileValue}>{selectedPlayer.role || 'Unknown'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Achievements</Text>
                  {selectedPlayer.achievements && selectedPlayer.achievements.length > 0 ? (
                    selectedPlayer.achievements.map((achievement, index) => (
                      <View key={index} style={styles.achievementItem}>
                        <View style={styles.achievementHeader}>
                          <Text style={styles.achievementType}>{achievement.achievement_type}</Text>
                          <Text style={styles.achievementMatch}>{achievement.match_type}</Text>
                        </View>
                        <Text style={styles.achievementVenue}>{achievement.venue_name}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.noAchievements}>
                      <Text style={styles.noAchievementsText}>No achievements available</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderTabs()}
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderTabs()}
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.backgroundGradient}
      >
        {renderTabs()}
        <FlatList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item.player_id}
          contentContainerStyle={styles.listContainer}
        />
        {renderPlayerModal()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundGradient: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'transparent',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    marginHorizontal: 4,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabGradient: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTab: {
    borderWidth: 0,
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  playerItem: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  playerItemGradient: {
    borderRadius: 12,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  playerPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  pointItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
  },
  pointLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pointValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  expandedContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  viewDetailsButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    marginBottom: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 15,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalCloseButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  profileItem: {
    marginBottom: 15,
  },
  profileLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  achievementItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  achievementMatch: {
    fontSize: 14,
    color: '#666',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  achievementVenue: {
    fontSize: 14,
    color: '#666',
  },
  noAchievements: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  noAchievementsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default LeaderBoardScreen; 