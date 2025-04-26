import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useMatch } from '../../context/MatchContext';
import { matchService } from '../../services/matchService';
import TeamSelection from './TeamSelection'; // Your existing TeamSelection component

interface TeamSelectionWrapperProps {
  matchId: number;
}

const TeamSelectionWrapper: React.FC<TeamSelectionWrapperProps> = ({ matchId }) => {
  const { 
    matchState, 
    setMatchPhase,
    setSelectedPlayers,
  } = useMatch();
  
  const [loading, setLoading] = useState(true);
  const [team1Players, setTeam1Players] = useState<any[]>([]);
  const [team2Players, setTeam2Players] = useState<any[]>([]);
  
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        
        if (!matchState.team1?.team_id || !matchState.team2?.team_id) {
          throw new Error('Team IDs not available');
        }
        
        const [team1Data, team2Data] = await Promise.all([
          matchService.getTeamPlayers(matchState.team1.team_id),
          matchService.getTeamPlayers(matchState.team2.team_id)
        ]);
        
        setTeam1Players(team1Data);
        setTeam2Players(team2Data);
      } catch (error) {
        console.error('Error loading team players:', error);
        Alert.alert('Error', 'Failed to load team players');
      } finally {
        setLoading(false);
      }
    };
    
    loadPlayers();
  }, [matchState.team1?.team_id, matchState.team2?.team_id]);
  
  const handleTeamSelectionComplete = async (
    team1SelectedIds: number[], 
    team2SelectedIds: number[]
  ) => {
    try {
      // Save selected players to context
      setSelectedPlayers(team1SelectedIds, team2SelectedIds);
      
      // Save player selections to backend
      await matchService.saveSelectedPlayers(
        matchId, 
        matchState.team1?.team_id || 0,
        matchState.team2?.team_id || 0,
        team1SelectedIds,
        team2SelectedIds
      );
      
      // Move to next phase
      await setMatchPhase('inning_one');
    } catch (error) {
      console.error('Error completing team selection:', error);
      Alert.alert('Error', 'Failed to save team selection');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  
  return (
    <TeamSelection
      matchId={matchId}
      team1={matchState.team1}
      team2={matchState.team2}
      team1Name={matchState.team1Name}
      team2Name={matchState.team2Name}
      team1Players={team1Players}
      team2Players={team2Players}
      selectedTeam1Players={matchState.selectedPlayers.team1}
      selectedTeam2Players={matchState.selectedPlayers.team2}
      onComplete={handleTeamSelectionComplete}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TeamSelectionWrapper;