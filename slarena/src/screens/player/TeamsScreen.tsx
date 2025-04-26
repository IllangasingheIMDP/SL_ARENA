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
          role: player.role,
          team_name: selectedTeam.team_name
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
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000080',
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#000080',
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginRight: -16,
  },
  searchButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  createTeamButton: {
    backgroundColor: '#000080',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 4,
  },
  createTeamButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  teamInfo: {
    flex: 1,
  },
  teamActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080',
    letterSpacing: 0.5,
  },
  captainName: {
    fontSize: 15,
    color: '#5f6368',
    marginTop: 6,
    fontWeight: '500',
  },
  addPlayerButton: {
    backgroundColor: '#000080',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  addPlayerButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  teamDetails: {
    marginTop: 24,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000080',
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    color: '#000080',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  playerRole: {
    fontSize: 15,
    color: '#5f6368',
    marginTop: 4,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '92%',
    maxHeight: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000080',
    letterSpacing: 0.5,
  },
  playerList: {
    maxHeight: 400,
    marginVertical: 20,
  },
  selectedPlayerItem: {
    backgroundColor: '#f0f4f8',
    borderColor: '#000080',
    borderWidth: 1,
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000080',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#000080',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    gap: 16,
  },
  modalButton: {
    flex: 1,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#f0f4f8',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  addButton: {
    backgroundColor: '#000080',
  },
  buttonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  cancelButtonText: {
    color: '#5f6368',
  },
  selectedPlayersContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f4f8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  selectedPlayersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000080',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  selectedPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedPlayerName: {
    fontSize: 17,
    color: '#000080',
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  rolePickerContainer: {
    width: 180,
    height: 56,
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000080',
    overflow: 'hidden',
  },
  rolePicker: {
    height: 56,
    color: '#000080',
    fontWeight: '600',
    fontSize: 16,
  },
  modalText: {
    fontSize: 17,
    color: '#000080',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default TeamsScreen; 