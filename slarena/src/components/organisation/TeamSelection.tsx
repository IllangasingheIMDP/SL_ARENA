import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Team } from "../../types/tournamentTypes";
import { Checkbox } from 'react-native-paper';
import { matchService } from "../../services/matchService";

interface TeamSelectionProps {
  team1: Team | null;
  team2: Team | null;
  team1Name: string;
  team2Name: string;
  matchId: number;
  inningId?: number; // Add this new prop
  onComplete: (team1Players: number[], team2Players: number[]) => void;
}

interface Player {
  player_id: number;
  name: string;
  role: string | null;
  batting_average: string | null;
  bowling_economy: string | null;
  total_matches: number;
  total_runs: string | null;
  total_wickets: string | null;
}

const TeamSelection: React.FC<TeamSelectionProps> = ({
  team1,
  team2,
  team1Name,
  team2Name,
  matchId,
  inningId,
  onComplete,
}) => {
  const [selectedTeam1Players, setSelectedTeam1Players] = useState<Player[]>([]);
  const [selectedTeam2Players, setSelectedTeam2Players] = useState<Player[]>([]);
  const [currentTeam, setCurrentTeam] = useState<"team1" | "team2">("team1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [team1Players, setTeam1Players] = useState<Player[]>([]);
  const [team2Players, setTeam2Players] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  
  // New state for phases and player count
  const [currentPhase, setCurrentPhase] = useState<"confirm_teams" | "set_player_count" | "select_players">("confirm_teams");
  const [playerCount, setPlayerCount] = useState<number>(11);
  const [tempPlayerCount, setTempPlayerCount] = useState<string>("11");

  useEffect(() => {
    const savePhase = async () => {
      try {
        await matchService.saveMatchPhase(matchId, "team_selection");
      } catch (error) {
        console.error("Error saving match phase:", error);
      }
    };
    savePhase();
  }, [matchId]);

  // Fetch players for both teams
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        if (team1?.team_id) {
          const team1PlayersData = await matchService.getTeamPlayers(team1.team_id);
         // console.log("Team 1 players:", team1PlayersData);
          setTeam1Players(team1PlayersData);
        }
        if (team2?.team_id) {
          const team2PlayersData = await matchService.getTeamPlayers(team2.team_id);
          //console.log("Team 2 players:", team2PlayersData);
          setTeam2Players(team2PlayersData);
        }
      } catch (error) {
        console.error("Error fetching team players:", error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [team1?.team_id, team2?.team_id]);

  const handlePlayerSelection = (playerId: number, isSelected: boolean) => {
    if (currentTeam === "team1") {
      setSelectedTeam1Players((prev) =>
        isSelected ? [...prev, team1Players.find(p => p.player_id === playerId)!] : prev.filter((p) => p.player_id !== playerId)
      );
    } else {
      setSelectedTeam2Players((prev) =>
        isSelected ? [...prev, team2Players.find(p => p.player_id === playerId)!] : prev.filter((p) => p.player_id !== playerId)
      );
    }
  };

  const handleNext = async () => {
    if (currentTeam === "team1") {
      if (selectedTeam1Players.length !== playerCount) {
        Alert.alert("Selection Error", `Please select exactly ${playerCount} players.`);
        return;
      }

      try {
        setIsSubmitting(true);
        const playerIds = selectedTeam1Players.map(player => player.player_id);
        await matchService.saveMatchPlayers(matchId, playerIds);
        setCurrentTeam("team2");
      } catch (error) {
        console.error("Save error:", error);
        Alert.alert(
          "Error",
          "Failed to save team 1 players. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (selectedTeam2Players.length !== playerCount) {
        Alert.alert("Selection Error", `Please select exactly ${playerCount} players.`);
        return;
      }

      try {
        setIsSubmitting(true);
        const playerIds = selectedTeam2Players.map(player => player.player_id);
        await matchService.saveMatchPlayers(matchId, playerIds);
        // Pass just the player IDs to onComplete
        onComplete(
          selectedTeam1Players.map(p => p.player_id),
          selectedTeam2Players.map(p => p.player_id)
        );
      } catch (error) {
        console.error("Save error:", error);
        Alert.alert(
          "Error",
          "Failed to save team 2 players. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderPlayerRow = (player: Player, selectedPlayers: Player[]) => {
    const isSelected = selectedPlayers.includes(player);
    
    return (
      <View key={player.player_id} style={styles.playerRow}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => handlePlayerSelection(player.player_id, !isSelected)}
            color="#4CAF50"
          />
        </View>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerRole}>{player.role || "Not Assigned"}</Text>
      </View>
    );
  };

  const getPlayersArray = (team: any): Player[] => {
    if (!team) return [];

    // If we have the team ID, return the corresponding players array
    if (team.team_id === team1?.team_id) {
      return team1Players;
    }
    if (team.team_id === team2?.team_id) {
      return team2Players;
    }

    // If we're passed a team object directly, return its players
    if (team.players) {
      return team.players;
    }

    console.log("Team structure:", team);
    console.log("No valid player structure found");
    return [];
  };

  const renderTeamSelection = (
    team: any,
    selectedPlayers: Player[],
    teamName: string
  ) => {
    const players = getPlayersArray(team);

    if (loadingPlayers) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading team data...</Text>
        </View>
      );
    }

    if (players.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>
            No players available for this team.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.teamContainer}>
        <Text style={styles.teamTitle}>{teamName}</Text>
        <View style={styles.selectionInfoContainer}>
          <Text style={styles.selectionInfo}>Select {playerCount} players</Text>
          <Text
            style={[
              styles.selectionCounter,
              selectedPlayers.length === playerCount
                ? styles.selectionCounterValid
                : selectedPlayers.length > playerCount
                ? styles.selectionCounterError
                : styles.selectionCounterPending,
            ]}
          >
            {selectedPlayers.length}/{playerCount}
          </Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 0.5 }]}>Select</Text>
          <Text
            style={[
              styles.headerText,
              { flex: 2, textAlign: "left", paddingLeft: 10 },
            ]}
          >
            Name
          </Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Role</Text>
        </View>

        <ScrollView style={styles.playersList}>
          {players.map((player) => renderPlayerRow(player, selectedPlayers))}
        </ScrollView>
      </View>
    );
  };
  
  // Function to render team confirmation step
  const renderTeamConfirmation = () => {
    const team1Players = getPlayersArray(team1);
    const team2Players = getPlayersArray(team2);
    
    return (
      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationTitle}>Confirm Teams for Match</Text>
        
        <View style={styles.teamsContainer}>
          {/* Team 1 Card */}
          <View style={styles.teamCard}>
            <Text style={styles.teamCardTitle}>{team1Name}</Text>
            <View style={styles.teamMembersCount}>
              <Text style={styles.teamMembersText}>
                {team1Players.length} Players Available
              </Text>
            </View>
            
            <ScrollView style={styles.teamMembersList}>
              {team1Players.map(player => (
                <View key={player.player_id} style={styles.teamMemberRow}>
                  <Text style={styles.teamMemberName}>{player.name}</Text>
                  <Text style={styles.teamMemberRole}>{player.role || "Not Assigned"}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          
          {/* VS Divider */}
          <View style={styles.vsDivider}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          {/* Team 2 Card */}
          <View style={styles.teamCard}>
            <Text style={styles.teamCardTitle}>{team2Name}</Text>
            <View style={styles.teamMembersCount}>
              <Text style={styles.teamMembersText}>
                {team2Players.length} Players Available
              </Text>
            </View>
            
            <ScrollView style={styles.teamMembersList}>
              {team2Players.map(player => (
                <View key={player.player_id} style={styles.teamMemberRow}>
                  <Text style={styles.teamMemberName}>{player.name}</Text>
                  <Text style={styles.teamMemberRole}>{player.role || "Not Assigned"}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setCurrentPhase("set_player_count")}
        >
          <Text style={styles.confirmButtonText}>Confirm Teams & Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // New function to render player count selection
  const renderPlayerCountSelection = () => {
    const handleSetPlayerCount = () => {
      const count = parseInt(tempPlayerCount);
      if (isNaN(count) || count < 1) {
        Alert.alert("Invalid Input", "Please enter a valid number of players (minimum 1).");
        return;
      }
      
      // Get players from both teams
      const team1Players = getPlayersArray(team1);
      const team2Players = getPlayersArray(team2);
      
      // Check if both teams have enough players
      if (team1Players.length < count) {
        Alert.alert("Not Enough Players", `${team1Name} only has ${team1Players.length} players available, but you need ${count}.`);
        return;
      }
      
      if (team2Players.length < count) {
        Alert.alert("Not Enough Players", `${team2Name} only has ${team2Players.length} players available, but you need ${count}.`);
        return;
      }
      
      setPlayerCount(count);
      setCurrentPhase("select_players");
    };
    
    return (
      <View style={styles.playerCountContainer}>
        <Text style={styles.playerCountTitle}>How many players will play in this match?</Text>
        
        <View style={styles.playerCountInputContainer}>
          <Text style={styles.playerCountLabel}>Number of players per team:</Text>
          <TextInput
            style={styles.playerCountInput}
            value={tempPlayerCount}
            onChangeText={setTempPlayerCount}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        
        <View style={styles.playerCountInfo}>
          <Text style={styles.playerCountInfoText}>
            • Standard cricket match: 11 players per team
          </Text>
          <Text style={styles.playerCountInfoText}>
            • T10/T20 formats: 11 players per team
          </Text>
          <Text style={styles.playerCountInfoText}>
            • Indoor cricket: 8 players per team
          </Text>
          <Text style={styles.playerCountInfoText}>
            • Casual/practice matches: Variable player count
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleSetPlayerCount}
        >
          <Text style={styles.confirmButtonText}>Confirm & Start Player Selection</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentPhase === "confirm_teams" ? (
        // Step 1: Confirm teams
        renderTeamConfirmation()
      ) : currentPhase === "set_player_count" ? (
        // Step 2: Set player count
        renderPlayerCountSelection()
      ) : (
        // Step 3: Select players
        <>
          <Text style={styles.title}>
            Select Playing {playerCount} - {currentTeam === "team1" ? team1Name : team2Name}
          </Text>

          {currentTeam === "team1"
            ? renderTeamSelection(team1, selectedTeam1Players, team1Name)
            : renderTeamSelection(team2, selectedTeam2Players, team2Name)}

          <TouchableOpacity
            style={[
              styles.nextButton,
              (currentTeam === "team1" && selectedTeam1Players.length !== playerCount) ||
              (currentTeam === "team2" && selectedTeam2Players.length !== playerCount)
                ? styles.disabledButton
                : null,
            ]}
            onPress={handleNext}
            disabled={
              isSubmitting ||
              (currentTeam === "team1" && selectedTeam1Players.length !== playerCount) ||
              (currentTeam === "team2" && selectedTeam2Players.length !== playerCount)
            }
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting
                ? "Saving..."
                : currentTeam === "team1"
                ? "Next Team"
                : "Complete Selection"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2E3E5C",
  },
  teamContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E3E5C",
  },
  selectionInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectionInfo: {
    fontSize: 16,
    color: "#666",
  },
  selectionCounter: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  selectionCounterValid: {
    backgroundColor: "#e6f7e6",
    color: "#4CAF50",
  },
  selectionCounterPending: {
    backgroundColor: "#fff9e6",
    color: "#FF9800",
  },
  selectionCounterError: {
    backgroundColor: "#ffebee",
    color: "#F44336",
  },
  tableHeader: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3E5C",
  },
  playersList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  playerRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  checkboxContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  checkbox: {
    borderRadius: 4,
  },
  playerName: {
    flex: 2,
    fontSize: 14,
    paddingLeft: 10,
  },
  playerRole: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
    elevation: 0,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
  },
  
  // Team confirmation styles
  confirmationContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2E3E5C",
  },
  teamsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  teamCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  teamCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3E5C",
    textAlign: "center",
    marginBottom: 10,
  },
  teamMembersCount: {
    backgroundColor: "#e3f2fd",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
    marginBottom: 15,
  },
  teamMembersText: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "600",
  },
  teamMembersList: {
    flex: 1,
  },
  teamMemberRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  teamMemberName: {
    fontSize: 14,
    color: "#333",
    flex: 2,
  },
  teamMemberRole: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    textAlign: "right",
  },
  vsDivider: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5722",
  },
  confirmButton: {
    backgroundColor: "#1976D2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  // Player count selection styles
  playerCountContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerCountTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#2E3E5C",
  },
  playerCountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  playerCountLabel: {
    fontSize: 18,
    color: "#333",
    marginRight: 10,
  },
  playerCountInput: {
    width: 80,
    height: 50,
    borderWidth: 2,
    borderColor: "#1976D2",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
  },
  playerCountInfo: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  playerCountInfoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
});

export default TeamSelection;