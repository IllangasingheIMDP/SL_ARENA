import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlayerStats, Team, TeamPlayer } from '../../types/tournamentTypes';
import { tournamentService } from '../../services/tournamentService';
import { RootStackParamList } from '../../navigation/AppNavigator';

type RouteParams = {
  team_: Team;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const TeamDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { team_ } = route.params as RouteParams;
  
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch player stats from the backend
      const stats = await tournamentService.getTeamPlayerStats(team_.team_id);
      console.log('Player stats:', stats);
      
      // Create a team object from the first player's data
      if (stats && stats.length > 0) {
        const firstPlayer = stats[0];
        
        const teamData: Team = {
          team_id: team_.team_id,
          team_name: team_.team_name,
          captain_id: team_.captain_id,
        };
        
        setTeam(teamData);
        
        // Create player objects from the stats data
        const playerData: TeamPlayer[] = stats.map((stat: PlayerStats) => ({
          player_id: stat.player_id,
          role: stat.role,
        }));
        
        setPlayers(playerData);
      } else {
        // If no stats available, create a basic team object
        const teamData: Team = {
          team_id: teamId,
          team_name: `Team ${teamId}`,
          captain_id: undefined,
        };
        
        setTeam(teamData);
        setPlayers([]);
      }
      
      setPlayerStats(stats);
    } catch (error) {
      console.error('Error fetching team details:', error);
      Alert.alert('Error', 'Failed to load team details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [team_]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeamDetails();
  };

  const handleViewPlayerDetails = (playerId: number) => {
    // Navigate to player details screen
    // Comment out or remove this navigation until PlayerDetails screen is implemented
    // navigation.navigate('PlayerDetails', { playerId });
    Alert.alert('Coming Soon', 'Player details screen will be available soon.');
  };

  const renderPlayerItem = ({ item }: { item: TeamPlayer }) => {
    // Find player stats if available
    const stats = playerStats.find(stat => stat.player_id === item.player_id);
    
    // Check if this player is the captain
    const isCaptain = team?.captain_id === item.player_id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.playerItem,
          isCaptain && styles.captainItem
        ]}
        onPress={() => handleViewPlayerDetails(item.player_id)}
      >
        <View style={styles.playerInfo}>
          <View style={styles.nameContainer}>
            <Text style={[
              styles.playerName,
              isCaptain && styles.captainName
            ]}>
              {stats?.name || `Player ${item.player_id}`}
            </Text>
            {isCaptain && (
              <View style={styles.captainBadge}>
                <Text style={styles.captainBadgeText}>Captain</Text>
              </View>
            )}
          </View>
          <Text style={styles.playerRole}>{stats?.role || item.role}</Text>
          {stats && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Matches: {stats.total_matches}</Text>
              <Text style={styles.statsText}>Runs: {stats.total_runs}</Text>
              <Text style={styles.statsText}>Wickets: {stats.total_wickets}</Text>
            </View>
          )}
        </View>
        <Icon name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      
      <View style={styles.teamInfoContainer}>
        <Text style={styles.teamName}>{team?.team_name}</Text>
        {team?.captain_id && (
          <View style={styles.captainInfoContainer}>
            <Icon name="stars" size={16} color="#f4511e" />
            <Text style={styles.captainText}>
              Captain: {playerStats.find(p => p.player_id === team.captain_id)?.name || `Player ${team.captain_id}`}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.sectionTitle}>Players</Text>
      
      {players.length > 0 ? (
        <FlatList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={item => item.player_id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Icon name="person" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No players found for this team</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  teamInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  captainInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captainText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  captainItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#f4511e',
    backgroundColor: '#fff8f5',
  },
  playerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  captainName: {
    color: '#f4511e',
  },
  captainBadge: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  captainBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerRole: {
    fontSize: 14,
    color: '#666',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
});

export default TeamDetailsScreen; 