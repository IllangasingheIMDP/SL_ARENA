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
import { Team, TeamPlayer } from '../../types/tournamentTypes';
import { tournamentService } from '../../services/tournamentService';
import { RootStackParamList } from '../../navigation/AppNavigator';

type RouteParams = {
  teamId: number;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TeamDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { teamId } = route.params as RouteParams;
  
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call to get team details
      // For now, we'll use mock data
      const mockTeam: Team = {
        team_id: teamId,
        team_name: 'Team ' + teamId,
        captain_id: 1,
      };
      
      const mockPlayers: TeamPlayer[] = [
        { player_id: 1, role: 'Captain' },
        { player_id: 2, role: 'Batsman' },
        { player_id: 3, role: 'Bowler' },
        { player_id: 4, role: 'All-rounder' },
        { player_id: 5, role: 'Wicket-keeper' },
      ];
      
      setTeam(mockTeam);
      setPlayers(mockPlayers);
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
  }, [teamId]);

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

  const renderPlayerItem = ({ item }: { item: TeamPlayer }) => (
    <TouchableOpacity 
      style={styles.playerItem}
      onPress={() => handleViewPlayerDetails(item.player_id)}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerId}>Player ID: {item.player_id}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{team?.team_name || 'Team Details'}</Text>
      </View>
      
      <View style={styles.teamInfoContainer}>
        <Text style={styles.teamName}>{team?.team_name}</Text>
        {team?.captain_id && (
          <Text style={styles.captainText}>Captain ID: {team.captain_id}</Text>
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
  captainText: {
    fontSize: 14,
    color: '#666',
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
  playerInfo: {
    flex: 1,
  },
  playerId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
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
});

export default TeamDetailsScreen; 