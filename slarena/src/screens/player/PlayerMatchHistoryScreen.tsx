import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider, Chip, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface MatchPerformance {
  id: string;
  date: string;
  opponent: string;
  opponentLogo: string;
  format: 'T20' | 'ODI' | 'Test';
  result: 'won' | 'lost' | 'drawn';
  role: 'batting' | 'bowling' | 'all-round';
  batting?: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    dismissal: string;
  };
  bowling?: {
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
  };
  fielding?: {
    catches: number;
    stumpings: number;
    runOuts: number;
  };
  playerOfTheMatch: boolean;
}

interface PerformanceStats {
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  matchesDrawn: number;
  playerOfTheMatch: number;
  batting: {
    totalRuns: number;
    average: number;
    strikeRate: number;
    fifties: number;
    hundreds: number;
  };
  bowling: {
    totalWickets: number;
    average: number;
    economy: number;
    fiveWickets: number;
  };
  fielding: {
    totalCatches: number;
    totalStumpings: number;
    totalRunOuts: number;
  };
}

const PlayerMatchHistoryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'summary' | 'matches'>('summary');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'T20' | 'ODI' | 'Test'>('all');
  const [matchHistory, setMatchHistory] = useState<MatchPerformance[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch match history from an API
    // For now, we'll use mock data
    const fetchMatchHistory = () => {
      // Simulate API call
      setTimeout(() => {
        const mockMatchHistory: MatchPerformance[] = [
          {
            id: '1',
            date: '2024-03-15',
            opponent: 'Kandy Warriors',
            opponentLogo: 'https://via.placeholder.com/100',
            format: 'T20',
            result: 'won',
            role: 'all-round',
            batting: {
              runs: 45,
              balls: 32,
              fours: 4,
              sixes: 2,
              strikeRate: 140.62,
              dismissal: 'Caught',
            },
            bowling: {
              overs: 4,
              maidens: 0,
              runs: 35,
              wickets: 2,
              economy: 8.75,
            },
            fielding: {
              catches: 1,
              stumpings: 0,
              runOuts: 0,
            },
            playerOfTheMatch: true,
          },
          {
            id: '2',
            date: '2024-03-10',
            opponent: 'Colombo Kings',
            opponentLogo: 'https://via.placeholder.com/100',
            format: 'ODI',
            result: 'lost',
            role: 'batting',
            batting: {
              runs: 82,
              balls: 95,
              fours: 8,
              sixes: 3,
              strikeRate: 86.31,
              dismissal: 'LBW',
            },
            bowling: {
              overs: 0,
              maidens: 0,
              runs: 0,
              wickets: 0,
              economy: 0,
            },
            fielding: {
              catches: 0,
              stumpings: 0,
              runOuts: 0,
            },
            playerOfTheMatch: false,
          },
          {
            id: '3',
            date: '2024-03-05',
            opponent: 'Galle Gladiators',
            opponentLogo: 'https://via.placeholder.com/100',
            format: 'T20',
            result: 'won',
            role: 'bowling',
            batting: {
              runs: 12,
              balls: 8,
              fours: 1,
              sixes: 1,
              strikeRate: 150.00,
              dismissal: 'Not Out',
            },
            bowling: {
              overs: 4,
              maidens: 1,
              runs: 28,
              wickets: 3,
              economy: 7.00,
            },
            fielding: {
              catches: 2,
              stumpings: 0,
              runOuts: 0,
            },
            playerOfTheMatch: false,
          },
        ];

        const mockPerformanceStats: PerformanceStats = {
          totalMatches: 3,
          matchesWon: 2,
          matchesLost: 1,
          matchesDrawn: 0,
          playerOfTheMatch: 1,
          batting: {
            totalRuns: 139,
            average: 46.33,
            strikeRate: 103.70,
            fifties: 1,
            hundreds: 0,
          },
          bowling: {
            totalWickets: 5,
            average: 12.60,
            economy: 7.88,
            fiveWickets: 0,
          },
          fielding: {
            totalCatches: 3,
            totalStumpings: 0,
            totalRunOuts: 0,
          },
        };

        setMatchHistory(mockMatchHistory);
        setPerformanceStats(mockPerformanceStats);
        setLoading(false);
      }, 1000);
    };

    fetchMatchHistory();
  }, []);

  const getResultColor = (result: MatchPerformance['result']) => {
    switch (result) {
      case 'won':
        return theme.colors.success;
      case 'lost':
        return theme.colors.error;
      case 'drawn':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  const renderSummary = () => {
    if (!performanceStats) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Match Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{performanceStats.totalMatches}</Text>
                <Text style={styles.summaryLabel}>Total Matches</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{performanceStats.matchesWon}</Text>
                <Text style={styles.summaryLabel}>Matches Won</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{performanceStats.matchesLost}</Text>
                <Text style={styles.summaryLabel}>Matches Lost</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{performanceStats.playerOfTheMatch}</Text>
                <Text style={styles.summaryLabel}>Player of the Match</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Batting Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.batting.totalRuns}</Text>
                <Text style={styles.statsLabel}>Total Runs</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.batting.average.toFixed(2)}</Text>
                <Text style={styles.statsLabel}>Average</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.batting.strikeRate.toFixed(2)}</Text>
                <Text style={styles.statsLabel}>Strike Rate</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.batting.fifties}</Text>
                <Text style={styles.statsLabel}>50s</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.batting.hundreds}</Text>
                <Text style={styles.statsLabel}>100s</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Bowling Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.bowling.totalWickets}</Text>
                <Text style={styles.statsLabel}>Total Wickets</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.bowling.average.toFixed(2)}</Text>
                <Text style={styles.statsLabel}>Average</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.bowling.economy.toFixed(2)}</Text>
                <Text style={styles.statsLabel}>Economy</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.bowling.fiveWickets}</Text>
                <Text style={styles.statsLabel}>5 Wickets</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Fielding Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.fielding.totalCatches}</Text>
                <Text style={styles.statsLabel}>Catches</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.fielding.totalStumpings}</Text>
                <Text style={styles.statsLabel}>Stumpings</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{performanceStats.fielding.totalRunOuts}</Text>
                <Text style={styles.statsLabel}>Run Outs</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderMatches = () => {
    const filteredMatches = selectedFormat === 'all'
      ? matchHistory
      : matchHistory.filter(match => match.format === selectedFormat);

    return (
      <View>
        <View style={styles.filterContainer}>
          <Chip
            selected={selectedFormat === 'all'}
            onPress={() => setSelectedFormat('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={selectedFormat === 'T20'}
            onPress={() => setSelectedFormat('T20')}
            style={styles.filterChip}
          >
            T20
          </Chip>
          <Chip
            selected={selectedFormat === 'ODI'}
            onPress={() => setSelectedFormat('ODI')}
            style={styles.filterChip}
          >
            ODI
          </Chip>
          <Chip
            selected={selectedFormat === 'Test'}
            onPress={() => setSelectedFormat('Test')}
            style={styles.filterChip}
          >
            Test
          </Chip>
        </View>

        {filteredMatches.map((match, index) => (
          <Card key={match.id} style={styles.card}>
            <Card.Content>
              <View style={styles.matchHeader}>
                <View style={styles.opponentContainer}>
                  <Avatar.Image size={40} source={{ uri: match.opponentLogo }} />
                  <Text style={styles.opponentName}>{match.opponent}</Text>
                </View>
                <Chip
                  mode="outlined"
                  style={[styles.resultChip, { borderColor: getResultColor(match.result) }]}
                >
                  {match.result.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.matchInfo}>
                <Text style={styles.matchDate}>{match.date}</Text>
                <Text style={styles.matchFormat}>{match.format}</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.performanceContainer}>
                {match.batting && (
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Batting</Text>
                    <Text style={styles.performanceValue}>
                      {match.batting.runs} ({match.batting.balls})
                    </Text>
                    <Text style={styles.performanceDetail}>
                      {match.batting.fours}x4, {match.batting.sixes}x6
                    </Text>
                    <Text style={styles.performanceDetail}>
                      SR: {match.batting.strikeRate.toFixed(2)}
                    </Text>
                  </View>
                )}

                {match.bowling && (
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Bowling</Text>
                    <Text style={styles.performanceValue}>
                      {match.bowling.wickets}/{match.bowling.runs}
                    </Text>
                    <Text style={styles.performanceDetail}>
                      {match.bowling.overs} overs, {match.bowling.maidens} maidens
                    </Text>
                    <Text style={styles.performanceDetail}>
                      Econ: {match.bowling.economy.toFixed(2)}
                    </Text>
                  </View>
                )}

                {match.fielding && (
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Fielding</Text>
                    <Text style={styles.performanceValue}>
                      {match.fielding.catches} ct, {match.fielding.stumpings} st
                    </Text>
                    {match.fielding.runOuts > 0 && (
                      <Text style={styles.performanceDetail}>
                        {match.fielding.runOuts} run out(s)
                      </Text>
                    )}
                  </View>
                )}
              </View>

              {match.playerOfTheMatch && (
                <View style={styles.potmContainer}>
                  <Text style={styles.potmText}>Player of the Match</Text>
                </View>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="text"
                onPress={() => navigation.navigate('MatchDetails', { matchId: match.id })}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading match history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match History</Text>
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'summary' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('summary')}
            style={styles.tabButton}
          >
            Summary
          </Button>
          <Button
            mode={activeTab === 'matches' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('matches')}
            style={styles.tabButton}
          >
            Matches
          </Button>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'matches' && renderMatches()}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="filter"
        onPress={() => navigation.navigate('MatchHistoryFilters')}
        color={theme.colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statsLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opponentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  resultChip: {
    marginLeft: 8,
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchDate: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  matchFormat: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  divider: {
    marginVertical: 12,
  },
  performanceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  performanceItem: {
    width: '33.33%',
    marginBottom: 12,
  },
  performanceLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  performanceDetail: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 2,
  },
  potmContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 4,
  },
  potmText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerMatchHistoryScreen; 