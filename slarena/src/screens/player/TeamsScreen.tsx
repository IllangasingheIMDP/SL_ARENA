import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Modal, Alert } from 'react-native';
import { teamService } from '../../services/teamService';
import { playerService } from '../../services/playerService';
import { Team, TeamPlayer } from '../../types/team';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

interface Player {
  player_id: number;
  name: string;
  user_id: number;
}

type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';

interface SelectedPlayer extends Player {
  role: PlayerRole;
}

type TeamsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Teams'>;

const TeamsScreen: React.FC = () => {
  const navigation = useNavigation<TeamsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [teamsLedByMe, setTeamsLedByMe] = useState<Team[]>([]);
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const [teams, ledTeams] = await Promise.all([
        teamService.getMyTeams(),
        teamService.getTeamsLedByMe()
      ]);
      setMyTeams(teams);
      setTeamsLedByMe(ledTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to reload teams when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTeams();
    }, [])
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const results = await teamService.getTeamByName(searchQuery);
      setSearchResults(results || []);
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
      setTeamPlayers(players);
    } catch (error) {
      console.error('Error loading team players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayers = async (team: Team) => {
    try {
      setLoading(true);
      const allPlayers = await playerService.getAllPlayers();
      //console.log(allPlayers,'all players');
      setPlayers(allPlayers);
      setSelectedTeam(team);
      setShowPlayerModal(true);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlayer = (player: Player) => {
    if (selectedPlayers.some(p => p.player_id === player.player_id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.player_id !== player.player_id));
    } else {
      setSelectedPlayers([...selectedPlayers, { ...player, role: 'Batsman' }]);
    }
  };

  const handleRoleChange = (playerId: number, role: PlayerRole) => {
    setSelectedPlayers(selectedPlayers.map(p => 
      p.player_id === playerId ? { ...p, role } : p
    ));
  };

  const handleAddSelectedPlayers = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      for (const player of selectedPlayers) {
        await teamService.addPlayerToTeam({
          team_id: selectedTeam.team_id,
          player_id: player.player_id,
          role: player.role
        });
      }
      setShowPlayerModal(false);
      setSelectedPlayers([]);
      setPlayerSearchQuery('');
      // Reload team players
      const players = await teamService.getTeamPlayers(selectedTeam.team_id);
      setTeamPlayers(players);
    } catch (error) {
      console.error('Error adding players:', error);
      alert('Failed to add players');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayer = async (teamId: number, playerId: number) => {
    try {
      setLoading(true);
      await teamService.removePlayerFromTeam(teamId, playerId);
      // Reload team players after removal
      const players = await teamService.getTeamPlayers(teamId);
      setTeamPlayers(players);
      alert('Player removed successfully');
    } catch (error) {
      console.error('Error removing player:', error);
      alert('Failed to remove player');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (team: Team) => {
    setTeamToDelete(team);
    setDeleteConfirmationVisible(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      setLoading(true);
      await teamService.deleteTeam(teamToDelete.team_id);
      setDeleteConfirmationVisible(false);
      setTeamToDelete(null);
      // Reload teams after deletion
      loadTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      Alert.alert('Error', 'Failed to delete team');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(playerSearchQuery.toLowerCase())
  );

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TouchableOpacity 
      style={styles.teamItem}
      onPress={() => handleTeamPress(item)}
    >
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.team_name}</Text>
        <Text style={styles.captainName}>Captain: {item.captain}</Text>
      </View>
      {teamsLedByMe.some(t => t.team_id === item.team_id) && (
        <View style={styles.teamActions}>
          <TouchableOpacity
            style={styles.addPlayerButton}
            onPress={() => handleAddPlayers(item)}
          >
            <Text style={styles.addPlayerButtonText}>Add Players</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTeam(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={[
        styles.playerItem,
        selectedPlayers.some(p => p.player_id === item.player_id) && styles.selectedPlayerItem
      ]}
      onPress={() => handleSelectPlayer(item)}
    >
      <View style={[
        styles.selectionIndicator,
        selectedPlayers.some(p => p.player_id === item.player_id) && styles.selectedIndicator
      ]}>
        {selectedPlayers.some(p => p.player_id === item.player_id) && (
          <Text style={{ color: '#fff', fontSize: 16 }}>✓</Text>
        )}
      </View>
      <Text style={styles.playerName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSelectedPlayer = (player: SelectedPlayer) => (
    <View key={player.player_id} style={styles.selectedPlayerContainer}>
      <Text style={styles.selectedPlayerName}>{player.name}</Text>
      <View style={styles.rolePickerContainer}>
        <Picker
          selectedValue={player.role}
          onValueChange={(value) => handleRoleChange(player.player_id, value as PlayerRole)}
          style={styles.rolePicker}
          dropdownIconColor="#2196f3"
        >
          <Picker.Item label="Batsman" value="Batsman" color="#333" />
          <Picker.Item label="Bowler" value="Bowler" color="#333" />
          <Picker.Item label="All-Rounder" value="All-Rounder" color="#333" />
          <Picker.Item label="Wicket-Keeper" value="Wicket-Keeper" color="#333" />
        </Picker>
      </View>
    </View>
  );

  const renderTeamSection = (title: string, teams: Team[]) => {
    if (teams.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={teams}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.team_name}
          scrollEnabled={false}
        />
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
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createTeamButton}
        onPress={() => navigation.navigate('CreateTeam')}
      >
        <Text style={styles.createTeamButtonText}>Create New Team</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollView}>
          {searchResults.length > 0 && renderTeamSection('Search Results', searchResults)}
          {renderTeamSection('Teams Led By Me', teamsLedByMe)}
          {renderTeamSection('My Teams', myTeams)}
          {selectedTeam && (
            <View style={styles.teamDetails}>
              <Text style={styles.detailsTitle}>Team Details</Text>
              <Text style={styles.teamName}>{selectedTeam.team_name}</Text>
              <Text style={styles.captainName}>Captain: {selectedTeam.captain}</Text>
              
              <Text style={styles.playersTitle}>Players:</Text>
              {teamPlayers?.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerRole}>{player.role}</Text>
                  </View>
                  {teamsLedByMe.some(t => t.team_id === selectedTeam.team_id) && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePlayer(selectedTeam.team_id, player.player_id)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={showPlayerModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Players to {selectedTeam?.team_name}</Text>
            
            <View style={[styles.searchContainer, { marginBottom: 20 }]}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search players..."
                value={playerSearchQuery}
                onChangeText={setPlayerSearchQuery}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={filteredPlayers}
              renderItem={renderPlayerItem}
              keyExtractor={(item) => item.player_id.toString()}
              style={styles.playerList}
            />

            {selectedPlayers.length > 0 && (
              <View style={styles.selectedPlayersContainer}>
                <Text style={styles.selectedPlayersTitle}>Selected Players</Text>
                {selectedPlayers.map(player => renderSelectedPlayer(player))}
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPlayerModal(false);
                  setSelectedPlayers([]);
                  setPlayerSearchQuery('');
                }}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddSelectedPlayers}
                disabled={selectedPlayers.length === 0}
              >
                <Text style={styles.buttonText}>Add Selected Players</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteConfirmationVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Team</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete {teamToDelete?.team_name}? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDeleteConfirmationVisible(false);
                  setTeamToDelete(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteTeam}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 8,
  },
  searchButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginRight: -12,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createTeamButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createTeamButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  teamInfo: {
    flex: 1,
  },
  teamActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  addPlayerButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addPlayerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  playerRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  playerList: {
    maxHeight: 400,
    marginVertical: 16,
  },
  selectedPlayerItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196f3',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#2196f3',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#666',
  },
  selectedPlayersContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPlayersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPlayerName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  rolePickerContainer: {
    width: 160,
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
    overflow: 'hidden',
  },
  rolePicker: {
    height: 50,
    color: '#2196f3',
    fontWeight: '500',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default TeamsScreen; 