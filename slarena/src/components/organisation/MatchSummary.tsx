import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface MatchSummaryProps {
  matchId: number;
  team1Id?: number | null;
  team2Id?: number | null;
  team1Name: string;
  team2Name: string;
  inningOneScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  inningTwoScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  winnerTeamId: number | null;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({
  matchId,
  team1Id,
  team2Id,
  team1Name,
  team2Name,
  inningOneScore,
  inningTwoScore,
  winnerTeamId
}) => {
  const navigation = useNavigation();
  
  const getTeamImage = (teamId: number | null | undefined, isWinner: boolean) => {
    try {
      // Placeholder for team image loading logic
      return isWinner 
        ? require('../../../assets/images/default-team.png')
        : require('../../../assets/images/default-team1.png');
    } catch (error) {
      return require('../../../assets/images/default-team.png');
    }
  };
  
  const winningTeamName = winnerTeamId === team1Id ? team1Name : team2Name;
  const isTeam1Winner = winnerTeamId === team1Id;
  const isTeam2Winner = winnerTeamId === team2Id;
  const isTie = !winnerTeamId;
  
  return (
    <LinearGradient
      colors={['#1a2151', '#2c3e7b', '#1a2151']}
      style={styles.container}
    >
      <View style={styles.summaryCard}>
        <Text style={styles.matchCompleteText}>Match Complete</Text>
        
        {/* Result */}
        {isTie ? (
          <View style={styles.resultBanner}>
            <Text style={styles.resultText}>Match Tied!</Text>
          </View>
        ) : (
          <View style={[styles.resultBanner, styles.winnerBanner]}>
            <Text style={styles.resultText}>{winningTeamName} Won!</Text>
          </View>
        )}
        
        {/* Teams */}
        <View style={styles.teamsContainer}>
          <View style={[styles.teamContainer, isTeam1Winner && styles.winningTeamContainer]}>
            <Image
              source={getTeamImage(team1Id, isTeam1Winner)}
              style={[styles.teamLogo, isTeam1Winner && styles.winningTeamLogo]}
            />
            <Text style={[styles.teamName, isTeam1Winner && styles.winningTeamName]}>
              {team1Name}
            </Text>
            {isTeam1Winner && (
              <Icon name="emoji-events" size={20} color="#FFD700" style={styles.trophyIcon} />
            )}
          </View>
          
          <Text style={styles.vsText}>VS</Text>
          
          <View style={[styles.teamContainer, isTeam2Winner && styles.winningTeamContainer]}>
            <Image
              source={getTeamImage(team2Id, isTeam2Winner)}
              style={[styles.teamLogo, isTeam2Winner && styles.winningTeamLogo]}
            />
            <Text style={[styles.teamName, isTeam2Winner && styles.winningTeamName]}>
              {team2Name}
            </Text>
            {isTeam2Winner && (
              <Icon name="emoji-events" size={20} color="#FFD700" style={styles.trophyIcon} />
            )}
          </View>
        </View>
        
        {/* Scores */}
        <View style={styles.scoresContainer}>
          <View style={styles.inningScoreCard}>
            <Text style={styles.inningTitle}>1st Inning</Text>
            <Text style={styles.scoreText}>
              {inningOneScore.runs}/{inningOneScore.wickets}
            </Text>
            <Text style={styles.oversText}>
              ({inningOneScore.overs} overs)
            </Text>
          </View>
          
          <View style={styles.inningScoreCard}>
            <Text style={styles.inningTitle}>2nd Inning</Text>
            <Text style={styles.scoreText}>
              {inningTwoScore.runs}/{inningTwoScore.wickets}
            </Text>
            <Text style={styles.oversText}>
              ({inningTwoScore.overs} overs)
            </Text>
          </View>
        </View>
        
        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.scorecardButton]}
            onPress={() => navigation.navigate('Scorecard', { matchId })}
          >
            <Icon name="assessment" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Full Scorecard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.backButton]}
            onPress={() => navigation.navigate('OngoingTournaments')}
          >
            <Icon name="event" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Back to Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  matchCompleteText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultBanner: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  winnerBanner: {
    backgroundColor: '#FFD700',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  winningTeamContainer: {
    transform: [{ scale: 1.05 }],
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  winningTeamLogo: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  winningTeamName: {
    color: '#000',
  },
  vsText: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  trophyIcon: {
    marginTop: 5,
  },
  scoresContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  inningScoreCard: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '45%',
  },
  inningTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  oversText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    minWidth: 140,
  },
  scorecardButton: {
    backgroundColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default MatchSummary;