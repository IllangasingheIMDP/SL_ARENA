//write the draw component for the tournament

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Team, Tournament } from '../../types/tournamentTypes';


interface DrawProps {
  tournament: Tournament;
  onClose: () => void;
}

interface MatchNode {
  id: string;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  round: number;
  matchNumber: number;
}

const Draw: React.FC<DrawProps> = ({ tournament, onClose }) => {
  const [matches, setMatches] = useState<MatchNode[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchNode | null>(null);

  // Generate initial draw structure when tournament teams are loaded
  React.useEffect(() => {
    if (tournament.teams) {
      generateDraw(tournament.teams);
    }
  }, [tournament.teams]);

  const generateDraw = (teams: Team[]) => {
    const numTeams = teams.length;
    const numRounds = Math.ceil(Math.log2(numTeams));
    const totalMatches = Math.pow(2, numRounds) - 1;
    
    // Shuffle teams randomly
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    
    const newMatches: MatchNode[] = [];
    
    // Create matches for first round
    const firstRoundMatches = Math.ceil(numTeams/2);
    for (let i = 0; i < firstRoundMatches; i++) {
      newMatches.push({
        id: `R1-M${i+1}`,
        team1: shuffledTeams[i*2],
        team2: shuffledTeams[i*2 + 1],
        round: 1,
        matchNumber: i + 1
      });
    }

    // Create placeholder matches for subsequent rounds
    let matchCounter = firstRoundMatches;
    for (let round = 2; round <= numRounds; round++) {
      const matchesInRound = Math.pow(2, numRounds - round);
      for (let match = 0; match < matchesInRound; match++) {
        newMatches.push({
          id: `R${round}-M${match+1}`,
          round: round,
          matchNumber: match + 1
        });
      }
      matchCounter += matchesInRound;
    }

    setMatches(newMatches);
  };

  const handleMatchPress = (match: MatchNode) => {
    setSelectedMatch(match);
  };

  const updateMatchWinner = (matchId: string, winner: Team) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, winner };
      }
      return match;
    });

    // Update next round match
    const currentMatch = matches.find(m => m.id === matchId);
    if (currentMatch) {
      const nextRound = currentMatch.round + 1;
      const nextMatchNumber = Math.ceil(currentMatch.matchNumber / 2);
      const nextMatchId = `R${nextRound}-M${nextMatchNumber}`;
      
      const nextMatchIndex = updatedMatches.findIndex(m => m.id === nextMatchId);
      if (nextMatchIndex !== -1) {
        if (currentMatch.matchNumber % 2 === 1) {
          updatedMatches[nextMatchIndex].team1 = winner;
        } else {
          updatedMatches[nextMatchIndex].team2 = winner;
        }
      }
    }

    setMatches(updatedMatches);
  };

  const renderMatch = (match: MatchNode) => (
    <TouchableOpacity
      key={match.id}
      style={[
        styles.matchContainer,
        selectedMatch?.id === match.id && styles.selectedMatch
      ]}
      onPress={() => handleMatchPress(match)}
    >
      <View style={styles.matchTeams}>
        <Text style={[
          styles.teamText,
          match.winner === match.team1 && styles.winnerText
        ]}>
          {match.team1?.team_name || 'TBD'}
        </Text>
        <Text style={styles.vsText}>vs</Text>
        <Text style={[
          styles.teamText,
          match.winner === match.team2 && styles.winnerText
        ]}>
          {match.team2?.team_name || 'TBD'}
        </Text>
      </View>
      <Text style={styles.matchInfo}>Round {match.round}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tournament Draw</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.drawContainer}>
        {Array.from({ length: Math.max(...matches.map(m => m.round)) }, (_, i) => (
          <View key={`round-${i+1}`} style={styles.roundColumn}>
            <Text style={styles.roundTitle}>Round {i+1}</Text>
            {matches
              .filter(match => match.round === i+1)
              .map(match => renderMatch(match))
            }
          </View>
        ))}
      </View>
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
    flexDirection: 'row',
    padding: 16,
  },
  roundColumn: {
    flex: 1,
    marginHorizontal: 8,
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
  selectedMatch: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 2,
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
  matchInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default Draw;