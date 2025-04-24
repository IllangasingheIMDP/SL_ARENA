import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface OngoingMatchCardProps {
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  overs1: string;
  overs2: string;
  status: string;
  venue: string;
  onLiveStream: () => void;
  onScorecard: () => void;
}

const OngoingMatchCard: React.FC<OngoingMatchCardProps> = ({
  team1,
  team2,
  score1,
  score2,
  overs1,
  overs2,
  status,
  venue,
  onLiveStream,
  onScorecard,
}) => {
  return (
    <View style={styles.ongoingMatchCard}>
      <View style={styles.ongoingMatchHeader}>
        <Text style={styles.ongoingMatchStatus}>{status}</Text>
        <Text style={styles.ongoingMatchVenue}>{venue}</Text>
      </View>
      
      <View style={styles.ongoingMatchTeams}>
        <View style={styles.ongoingTeamContainer}>
          <Text style={styles.ongoingTeamName}>{team1}</Text>
          <Text style={styles.ongoingTeamScore}>{score1}</Text>
          <Text style={styles.ongoingTeamOvers}>({overs1} overs)</Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        
        <View style={styles.ongoingTeamContainer}>
          <Text style={styles.ongoingTeamName}>{team2}</Text>
          <Text style={styles.ongoingTeamScore}>{score2}</Text>
          <Text style={styles.ongoingTeamOvers}>({overs2} overs)</Text>
        </View>
      </View>
      
      <View style={styles.ongoingMatchActions}>
        <TouchableOpacity style={styles.ongoingMatchActionButton} onPress={onLiveStream}>
          <Icon name="live-tv" size={16} color="#fff" />
          <Text style={styles.ongoingMatchActionButtonText}>Live Stream</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ongoingMatchActionButton} onPress={onScorecard}>
          <Icon name="scoreboard" size={16} color="#fff" />
          <Text style={styles.ongoingMatchActionButtonText}>Scorecard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ongoingMatchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ongoingMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ongoingMatchStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  ongoingMatchVenue: {
    fontSize: 14,
    color: '#666',
  },
  ongoingMatchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ongoingTeamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  ongoingTeamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ongoingTeamScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  ongoingTeamOvers: {
    fontSize: 14,
    color: '#666',
  },
  vsContainer: {
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  ongoingMatchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ongoingMatchActionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  ongoingMatchActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OngoingMatchCard; 