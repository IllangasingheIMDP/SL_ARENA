//write the draw component for the tournament

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Team, Tournament, Match } from '../../types/tournamentTypes';
import { tournamentService } from '../../services/tournamentService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DrawProps {
  tournament: Tournament;
  onClose: () => void;
}

const Draw: React.FC<DrawProps> = ({ tournament, onClose }) => {
  const navigation = useNavigation<NavigationProp>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [tournament.tournament_id]);

  const fetchMatches = async () => {
    if (!tournament.tournament_id) {
      setError('Invalid tournament ID');
      return;
    }
    try {
      setLoading(true);
      const data = await tournamentService.getKnockoutBracket(tournament.tournament_id);
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchPress = (match: Match) => {
    if (!match.team1_id || !match.team2_id || !tournament.tournament_id) return;
  
    navigation.navigate('MatchManagement', { 
      matchId: match.match_id,
      team1Id: match.team1_id,
      team2Id: match.team2_id,
      team1Name: match.team1_name || 'TBD',
      team2Name: match.team2_name || 'TBD'
    });
  };

  const renderMatch = (match: Match) => (
    <TouchableOpacity 
      key={match.match_id} 
      style={styles.matchContainer}
      onPress={() => handleMatchPress(match)}
    >
      <View style={styles.matchTeams}>
        <Text style={[
          styles.teamText,
          match.winner_name === match.team1_name && styles.winnerText
        ]}>
          {match.team1_name || 'TBD'}
        </Text>
        <Text style={styles.vsText}>vs</Text>
        <Text style={[
          styles.teamText,
          match.winner_name === match.team2_name && styles.winnerText
        ]}>
          {match.team2_name || 'TBD'}
        </Text>
      </View>
      <View style={styles.matchInfoContainer}>
        <Text style={styles.matchInfo}>Round {match.round} - Match {match.match_number}</Text>
        <Text style={styles.matchStatus}>
          {match.winner_name ? `Winner: ${match.winner_name}` : 'Not Started'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tournament Draw</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading matches...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tournament Draw</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tournament Draw</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.drawContainer}>
        {matches && matches.length > 0 ? (
          Array.from({ length: Math.max(...matches.map(m => m.round)) }, (_, i) => (
            <View key={`round-${i+1}`} style={styles.roundColumn}>
              <Text style={styles.roundTitle}>Round {i+1}</Text>
              {matches
                .filter(match => match.round === i+1)
                .map(match => renderMatch(match))
              }
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text>No matches available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  drawContainer: {
    flex: 1,
    padding: 16,
  },
  roundColumn: {
    marginBottom: 20,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  matchContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  matchTeams: {
    marginBottom: 8,
  },
  teamText: {
    fontSize: 14,
    marginVertical: 2,
  },
  winnerText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  vsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 2,
  },
  matchInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  matchInfo: {
    fontSize: 12,
    color: '#666',
  },
  matchStatus: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Draw;