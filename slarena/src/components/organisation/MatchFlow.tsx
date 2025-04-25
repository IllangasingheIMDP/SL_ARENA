import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import CaptainTossComponent from './CaptainTossComponent';
import TeamSelection from './TeamSelection';
import { Team } from '../../types/tournamentTypes';
import { matchService } from '../../services/matchService';

interface MatchFlowProps {
  matchId: number;
  team1: Team;
  team2: Team;
  onComplete: (inningId: number, team1Players: number[], team2Players: number[]) => void;
}

const MatchFlow: React.FC<MatchFlowProps> = ({
  matchId,
  team1,
  team2,
  onComplete
}) => {
  // Track the current step in the match flow
  const [currentStep, setCurrentStep] = useState<'toss' | 'team_selection' | 'loading'>('toss');
  
  // Store the batting and bowling team IDs after toss
  const [battingTeamId, setBattingTeamId] = useState<number | null>(null);
  const [bowlingTeamId, setBowlingTeamId] = useState<number | null>(null);
  
  // Store the inning ID after creation
  const [inningId, setInningId] = useState<number | null>(null);

  // Handle the completion of toss and batting choice
  const handleTossComplete = (winnerId: number) => {
    // This is just for tracking purposes - not used for inning creation
    console.log(`Team ${winnerId} won the toss`);
  };

  // Handle the batting team choice
  const handleBattingChoice = async (battingId: number) => {
    // Determine bowling team ID based on batting team ID
    const bowlingId = battingId === team1.team_id ? team2.team_id : team1.team_id;
    
    // Set the batting and bowling team IDs
    setBattingTeamId(battingId);
    setBowlingTeamId(bowlingId);
    
    // Show loading while creating inning
    setCurrentStep('loading');
    
    try {
      // Call API to create inning
      const response = await matchService.createInning(matchId, battingId, bowlingId);
      
      // Store the inning ID returned from API
      setInningId(response.inning_id);
      
      // Proceed to team selection
      setCurrentStep('team_selection');
    } catch (error) {
      console.error('Error creating inning:', error);
      Alert.alert(
        'Error',
        'Failed to create inning. Please try again.',
        [{ text: 'OK', onPress: () => setCurrentStep('toss') }]
      );
    }
  };

  // Handle completion of team selection
  const handleTeamSelectionComplete = (team1Players: number[], team2Players: number[]) => {
    // Pass inning ID along with selected players to parent component
    if (inningId) {
      onComplete(inningId, team1Players, team2Players);
    } else {
      Alert.alert('Error', 'No inning ID available. Please restart the process.');
    }
  };

  // Render the appropriate component based on current step
  return (
    <View style={styles.container}>
      {currentStep === 'toss' && (
        <CaptainTossComponent
          team1={team1}
          team2={team2}
          team1Name={team1.team_name}
          team2Name={team2.team_name}
          onComplete={handleTossComplete}
          onBattingChoice={handleBattingChoice}
        />
      )}
      
      {currentStep === 'loading' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
      
      {currentStep === 'team_selection' && battingTeamId && bowlingTeamId && (
        <TeamSelection
          team1={battingTeamId === team1.team_id ? team1 : team2}
          team2={bowlingTeamId === team2.team_id ? team2 : team1}
          team1Name={battingTeamId === team1.team_id ? `${team1.team_name} (Batting)` : `${team2.team_name} (Batting)`}
          team2Name={bowlingTeamId === team2.team_id ? `${team2.team_name} (Bowling)` : `${team1.team_name} (Bowling)`}
          matchId={matchId}
          inningId={inningId || 0}
          onComplete={handleTeamSelectionComplete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MatchFlow;