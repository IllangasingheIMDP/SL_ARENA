import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { teamService } from '../../services/teamService';
import { playerService } from '../../services/playerService';
import { Team, TeamPlayer } from '../../types/team';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface Player {
  player_id: number;
  name: string;
  user_id: number;
}

type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';

interface SelectedPlayer extends Player {
  role: PlayerRole;
}

const CreateTeamScreen = () => {
  const navigation = useNavigation();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const allPlayers = await playerService.getAllPlayers();
      setPlayers(allPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    try {
      setLoading(true);
      const teamId = await teamService.createTeam({ team_name: teamName });
      
      // Add selected players to the team
      for (const player of selectedPlayers) {
        await teamService.addPlayerToTeam({
          team_id: teamId,
          player_id: player.player_id,
          role: player.role
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
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

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Team Name</Text>
          <TextInput
            style={styles.input}
            value={teamName}
            onChangeText={setTeamName}
            placeholder="Enter team name"
          />

          <TouchableOpacity
            style={styles.addPlayersButton}
            onPress={() => {
              loadPlayers();
              setShowPlayerModal(true);
            }}
          >
            <Text style={styles.buttonText}>Add Players</Text>
          </TouchableOpacity>

          {selectedPlayers.length > 0 && (
            <View style={styles.selectedPlayersContainer}>
              <Text style={styles.selectedPlayersTitle}>Selected Players</Text>
              {selectedPlayers.map(player => renderSelectedPlayer(player))}
            </View>
          )}

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTeam}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Create Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showPlayerModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Players</Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Search players..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredPlayers}
              renderItem={renderPlayerItem}
              keyExtractor={(item) => item.player_id.toString()}
              style={styles.playerList}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPlayerModal(false);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000080',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000080',
  },
  addPlayersButton: {
    backgroundColor: '#000080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#000080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
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
    color: '#000080',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000080',
  },
  playerList: {
    maxHeight: 400,
    marginVertical: 16,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
    backgroundColor: '#fff',
  },
  selectedPlayerItem: {
    backgroundColor: '#f0f4f8',
    borderColor: '#000080',
    borderWidth: 1,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000080',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#000080',
  },
  playerName: {
    fontSize: 16,
    color: '#000080',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#000080',
  },
  selectedPlayersContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  selectedPlayersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000080',
    textAlign: 'center',
  },
  selectedPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
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
    color: '#000080',
    flex: 1,
    fontWeight: '500',
  },
  rolePickerContainer: {
    width: 160,
    height: 50,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000080',
    overflow: 'hidden',
  },
  rolePicker: {
    height: 50,
    color: '#000080',
    fontWeight: '500',
  },
});

export default CreateTeamScreen; 