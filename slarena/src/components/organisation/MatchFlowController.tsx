import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useMatch } from '../../context/MatchContext';
import MatchPhaseNavigator from './MatchPhaseNavigator';
import CaptainTossWrapper from './CaptainTossWrapper';
import TeamSelectionWrapper from './TeamSelectionWrapper';
import InningWrapper from './InningWrapper';
import MatchSummary from './MatchSummary'; // Your existing or to be created component

interface MatchFlowControllerProps {
  matchId: number;
  onBack?: () => void;
}

const MatchFlowController: React.FC<MatchFlowControllerProps> = ({
  matchId,
  onBack,
}) => {
  const { matchState } = useMatch();

  const renderCurrentPhase = () => {
    switch (matchState.currentPhase) {
      case 'toss':
        return <CaptainTossWrapper matchId={matchId} />;
        
      case 'team_selection':
        return <TeamSelectionWrapper matchId={matchId} />;
        
      case 'inning_one':
        return <InningWrapper matchId={matchId} inningNumber={1} />;
        
      case 'inning_two':
        return <InningWrapper matchId={matchId} inningNumber={2} />;
        
      case 'finished':
        return <MatchSummary
                 matchId={matchId}
                 team1Id={matchState.team1?.team_id}
                 team2Id={matchState.team2?.team_id}
                 team1Name={matchState.team1Name}
                 team2Name={matchState.team2Name}
                 inningOneScore={matchState.scores.inningOne}
                 inningTwoScore={matchState.scores.inningTwo}
                 winnerTeamId={matchState.winnerTeamId}
               />;
                 
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <MatchPhaseNavigator />
      
      <View style={styles.content}>
        {renderCurrentPhase()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  }
});

export default MatchFlowController;