import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MatchCardProps {
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  tournament: string;
  onViewDetails: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  team1,
  team2,
  date,
  time,
  venue,
  tournament,
  onViewDetails,
}) => {
  return (
    <View style={styles.matchCard}>
      <Text style={styles.tournamentName}>{tournament}</Text>
      <View style={styles.matchTeams}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{team1}</Text>
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{team2}</Text>
        </View>
      </View>
      <View style={styles.matchDetails}>
        <View style={styles.matchDetailItem}>
          <Icon name="event" size={16} color="#666" />
          <Text style={styles.matchDetailText}>{date}</Text>
        </View>
        <View style={styles.matchDetailItem}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.matchDetailText}>{time}</Text>
        </View>
        <View style={styles.matchDetailItem}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.matchDetailText}>{venue}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.matchActionButton} onPress={onViewDetails}>
        <Text style={styles.matchActionButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  matchCard: {
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
  tournamentName: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vsContainer: {
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  matchActionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  matchActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MatchCard; 