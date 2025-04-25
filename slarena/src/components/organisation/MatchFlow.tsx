import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import CaptainTossComponent from './CaptainTossComponent';
import TeamSelection from './TeamSelection';
import ScoreCard from './ScoreCard';
import { Team } from '../../types/tournamentTypes';
import { matchService } from '../../services/matchService';
import { useMatch, MatchProvider } from '../../context/MatchContext';

interface MatchFlowProps {
  matchId: number;
  team1: Team;
  team2: Team;
  onComplete: (inningId: number, team1Players: number[], team2Players: number[]) => void;
}

const MatchFlowContent: React.FC<MatchFlowProps> = ({
  matchId,
  team1,
  team2,
  onComplete
}) => {
  const { 
    matchState, 
    setMatchPhase, 
    setInningId, 
    setBattingTeam, 
    setSelectedPlayers 
  } = useMatch();

  useEffect(() => {
    // Check current phase when component mounts
    const checkCurrentPhase = async () => {
      try {
        const response = await matchService.getMatchPhase(matchId);
        if (response.phase) {
          setMatchPhase(response.phase as any);
        }
      } catch (error) {
        console.error('Error checking match phase:', error);
      }
    };
    checkCurrentPhase();
  }, [matchId]);

  const handleTossComplete = (winnerId: number) => {
    console.log(`Team ${winnerId} won the toss`);
  };

  const handleBattingChoice = async (battingId: number) => {
    const bowlingId = battingId === team1.team_id ? team2.team_id : team1.team_id;
    
    try {
      // Create inning in background
      const response = await matchService.createInning(matchId, battingId, bowlingId);
      setInningId(response.inning_id);
      setBattingTeam(battingId, bowlingId);
      
      // Move to team selection
      await setMatchPhase('team_selection');
    } catch (error) {
      console.error('Error creating inning:', error);
      Alert.alert(
        'Error',
        'Failed to create inning. Please try again.',
        [{ text: 'OK', onPress: () => setMatchPhase('toss') }]
      );
    }
  };

  const handleTeamSelectionComplete = async (team1Players: number[], team2Players: number[]) => {
    try {
      setSelectedPlayers(team1Players, team2Players);
      await setMatchPhase('inning_one');
      onComplete(matchState.inningId!, team1Players, team2Players);
    } catch (error) {
      console.error('Error completing team selection:', error);
      Alert.alert('Error', 'Failed to complete team selection. Please try again.');
    }
  };

  const renderCurrentPhase = () => {
    switch (matchState.currentPhase) {
      case 'toss':
        return (
          <CaptainTossComponent
            team1={team1}
            team2={team2}
            team1Name={team1.team_name}
            team2Name={team2.team_name}
            onComplete={handleTossComplete}
            onBattingChoice={handleBattingChoice}
          />
        );
      
      case 'team_selection':
        return (
          <TeamSelection
            team1={matchState.battingTeamId === team1.team_id ? team1 : team2}
            team2={matchState.bowlingTeamId === team2.team_id ? team2 : team1}
            team1Name={matchState.battingTeamId === team1.team_id ? `${team1.team_name} (Batting)` : `${team2.team_name} (Batting)`}
            team2Name={matchState.bowlingTeamId === team2.team_id ? `${team2.team_name} (Bowling)` : `${team1.team_name} (Bowling)`}
            matchId={matchId}
            inningId={matchState.inningId || 0}
            onComplete={handleTeamSelectionComplete}
          />
        );
      
      case 'inning_one':
      case 'inning_two':
        return (
          <ScoreCard
            matchId={matchId}
            team1={team1}
            team2={team2}
            battingTeam={matchState.battingTeamId}
            selectedPlayers={matchState.selectedPlayers}
            onInningComplete={async () => {
              if (matchState.currentPhase === 'inning_one') {
                await setMatchPhase('inning_two');
              } else {
                await setMatchPhase('finished');
              }
            }}
          />
        );
      
      case 'finished':
        return (
          <View style={styles.container}>
            <Text style={styles.finishedText}>Match Completed</Text>
          </View>
        );
      
      default:
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentPhase()}
    </View>
  );
};

const MatchFlow: React.FC<MatchFlowProps> = (props) => {
  return (
    <MatchProvider matchId={props.matchId}>
      <MatchFlowContent {...props} />
    </MatchProvider>
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
  },
  finishedText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
  }
});

export default MatchFlow;