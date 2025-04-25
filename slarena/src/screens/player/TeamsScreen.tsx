import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { teamService } from '../../services/teamService';
import { Team, TeamPlayer } from '../../types/team';





const TeamsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMyTeams();
  }, []);

  const loadMyTeams = async () => {
    try {
      setLoading(true);
      const teams = await teamService.getMyTeams();
      setMyTeams(teams as Team[]);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const results = await teamService.getAllTeams();
      const filteredResults = results?.filter(team => 
        team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults as Team[]);
    } catch (error) {
      console.error('Error searching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamPress = async (team: Team) => {
    try {
      setLoading(true);
      setSelectedTeam(team);
      const players = await teamService.getTeamPlayers(team.team_id);
      setTeamPlayers(players as TeamPlayer[]);
    } catch (error) {
      console.error('Error loading team players:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TouchableOpacity 
      style={styles.teamItem}
      onPress={() => handleTeamPress(item)}
    >
      <Text style={styles.teamName}>{item.team_name}</Text>
      <Text style={styles.captainName}>Captain: {item.captain}</Text>
    </TouchableOpacity>
  );

  const renderTeamDetails = () => {
    if (!selectedTeam) return null;

    return (
      <View style={styles.teamDetails}>
        <Text style={styles.detailsTitle}>Team Details</Text>
        <Text style={styles.teamName}>{selectedTeam.team_name}</Text>
        <Text style={styles.captainName}>Captain: {selectedTeam.captain}</Text>
        
        <Text style={styles.playersTitle}>Players:</Text>
        {teamPlayers?.map((player, index) => (
          <View key={index} style={styles.playerItem}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerRole}>{player.role}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderTeamItem}
              keyExtractor={(item) => item.team_name}
              style={styles.list}
            />
          ) : (
            <FlatList
              data={myTeams}
              renderItem={renderTeamItem}
              keyExtractor={(item) => item.team_name}
              style={styles.list}
            />
          )}
          {renderTeamDetails()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  teamItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  captainName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  teamDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  playerName: {
    fontSize: 14,
    color: '#333',
  },
  playerRole: {
    fontSize: 14,
    color: '#666',
  },
});

export default TeamsScreen; 