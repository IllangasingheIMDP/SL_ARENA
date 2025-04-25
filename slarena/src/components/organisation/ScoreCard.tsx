import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Team } from '../../types/tournamentTypes';
import { tournamentService } from '../../services/tournamentService';

interface ScoreCardProps {
  matchId: number;
  team1: Team | null;
  team2: Team | null;
  battingTeam: number | null;
  selectedPlayers: {
    team1: number[];
    team2: number[];
  };
}

interface PlayerScore {
  player_id: number;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
}

interface BowlerStats {
  player_id: number;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface TeamScore {
  total: number;
  wickets: number;
  overs: number;
  run_rate: number;
  players: PlayerScore[];
  bowlers: BowlerStats[];
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  matchId,
  team1,
  team2,
  battingTeam,
  selectedPlayers
}) => {
  const [battingTeamScore, setBattingTeamScore] = useState<TeamScore | null>(null);
  const [bowlingTeamScore, setBowlingTeamScore] = useState<TeamScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, [matchId]);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const scores = await tournamentService.getMatchScores(matchId);
      if (battingTeam === team1?.team_id) {
        setBattingTeamScore(scores.team1);
        setBowlingTeamScore(scores.team2);
      } else {
        setBattingTeamScore(scores.team2);
        setBowlingTeamScore(scores.team1);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerScore = (player: PlayerScore) => (
    <View key={player.player_id} style={styles.playerRow}>
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerStats}>
        {player.runs} ({player.balls}) - {player.fours}x4, {player.sixes}x6
      </Text>
      <Text style={styles.strikeRate}>SR: {player.strike_rate}</Text>
    </View>
  );

  const renderBowlerStats = (bowler: BowlerStats) => (
    <View key={bowler.player_id} style={styles.bowlerRow}>
      <Text style={styles.bowlerName}>{bowler.name}</Text>
      <Text style={styles.bowlerStats}>
        {bowler.overs}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}
      </Text>
      <Text style={styles.economy}>Econ: {bowler.economy}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading scores...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.teamName}>
          {battingTeam === team1?.team_id ? team1.team_name : team2?.team_name}
        </Text>
        <Text style={styles.score}>
          {battingTeamScore?.total}/{battingTeamScore?.wickets} ({battingTeamScore?.overs} Ov)
        </Text>
        <Text style={styles.runRate}>CRR: {battingTeamScore?.run_rate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Batting</Text>
        {battingTeamScore?.players.map(renderPlayerScore)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bowling</Text>
        {bowlingTeamScore?.bowlers.map(renderBowlerStats)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scoreHeader: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  runRate: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerName: {
    flex: 2,
    fontSize: 14,
  },
  playerStats: {
    flex: 2,
    fontSize: 14,
  },
  strikeRate: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  bowlerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bowlerName: {
    flex: 2,
    fontSize: 14,
  },
  bowlerStats: {
    flex: 2,
    fontSize: 14,
  },
  economy: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
});

export default ScoreCard; 