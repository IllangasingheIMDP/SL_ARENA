import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, List, Avatar, Chip, FAB, Divider, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface TournamentMatch {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  result?: string;
  playerPerformance?: {
    runs?: number;
    wickets?: number;
    catches?: number;
    stumpings?: number;
  };
}

interface Tournament {
  id: string;
  name: string;
  logo: string;
  startDate: string;
  endDate: string;
  format: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  teamName: string;
  position: number;
  totalTeams: number;
  matches: TournamentMatch[];
  stats: {
    matches: number;
    wins: number;
    losses: number;
    noResult: number;
    points: number;
    netRunRate: number;
  };
}

const PlayerTournamentScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'stats'>('overview');
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch tournament data from an API
    // For now, we'll use mock data
    const fetchTournamentData = () => {
      // Simulate API call
      setTimeout(() => {
        const mockTournament: Tournament = {
          id: '1',
          name: 'Premier League T20 2024',
          logo: 'https://via.placeholder.com/100',
          startDate: '2024-04-01',
          endDate: '2024-05-15',
          format: 'T20',
          status: 'ongoing',
          teamName: 'Kandy Warriors',
          position: 3,
          totalTeams: 8,
          matches: [
            {
              id: '1',
              opponent: 'Colombo Kings',
              date: '2024-04-05',
              time: '14:00',
              venue: 'R. Premadasa Stadium, Colombo',
              status: 'completed',
              result: 'Kandy Warriors won by 5 wickets',
              playerPerformance: {
                runs: 45,
                wickets: 2,
                catches: 1,
              },
            },
            {
              id: '2',
              opponent: 'Galle Gladiators',
              date: '2024-04-10',
              time: '14:00',
              venue: 'Galle International Stadium',
              status: 'completed',
              result: 'Galle Gladiators won by 3 wickets',
              playerPerformance: {
                runs: 12,
                wickets: 0,
                catches: 2,
              },
            },
            {
              id: '3',
              opponent: 'Jaffna Stallions',
              date: '2024-04-15',
              time: '14:00',
              venue: 'Jaffna International Cricket Stadium',
              status: 'completed',
              result: 'Kandy Warriors won by 8 wickets',
              playerPerformance: {
                runs: 78,
                wickets: 1,
                catches: 0,
              },
            },
            {
              id: '4',
              opponent: 'Dambulla Hawks',
              date: '2024-04-20',
              time: '14:00',
              venue: 'Dambulla International Stadium',
              status: 'upcoming',
            },
            {
              id: '5',
              opponent: 'Kurunegala Eagles',
              date: '2024-04-25',
              time: '14:00',
              venue: 'Pallekele International Cricket Stadium',
              status: 'upcoming',
            },
            {
              id: '6',
              opponent: 'Hambantota Sharks',
              date: '2024-04-30',
              time: '14:00',
              venue: 'Mahinda Rajapaksa International Cricket Stadium',
              status: 'upcoming',
            },
            {
              id: '7',
              opponent: 'Anuradhapura Lions',
              date: '2024-05-05',
              time: '14:00',
              venue: 'Anuradhapura Cricket Ground',
              status: 'upcoming',
            },
          ],
          stats: {
            matches: 3,
            wins: 2,
            losses: 1,
            noResult: 0,
            points: 4,
            netRunRate: 0.85,
          },
        };
        setTournament(mockTournament);
        setLoading(false);
      }, 1000);
    };

    fetchTournamentData();
  }, []);

  const getStatusColor = (status: Tournament['status'] | TournamentMatch['status']) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.info;
      case 'ongoing':
        return theme.colors.success;
      case 'completed':
        return theme.colors.secondary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderOverview = () => {
    if (!tournament) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.tournamentHeader}>
              <Image source={{ uri: tournament.logo }} style={styles.tournamentLogo} />
              <Text style={styles.tournamentName}>{tournament.name}</Text>
              <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(tournament.status) }]}>
                {tournament.status.toUpperCase()}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Tournament Details" />
          <Card.Content>
            <List.Item
              title="Format"
              description={tournament.format}
              left={props => <List.Icon {...props} icon="cricket" />}
            />
            <Divider />
            <List.Item
              title="Duration"
              description={`${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}`}
              left={props => <List.Icon {...props} icon="calendar-range" />}
            />
            <Divider />
            <List.Item
              title="Team"
              description={tournament.teamName}
              left={props => <List.Icon {...props} icon="account-group" />}
            />
            <Divider />
            <List.Item
              title="Position"
              description={`${tournament.position} out of ${tournament.totalTeams}`}
              left={props => <List.Icon {...props} icon="trophy" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Tournament Progress" />
          <Card.Content>
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Matches Played</Text>
              <ProgressBar
                progress={tournament.stats.matches / tournament.matches.length}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
              <Text style={styles.progressValue}>
                {tournament.stats.matches} / {tournament.matches.length}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Win Rate</Text>
              <ProgressBar
                progress={tournament.stats.wins / tournament.stats.matches}
                color={theme.colors.success}
                style={styles.progressBar}
              />
              <Text style={styles.progressValue}>
                {((tournament.stats.wins / tournament.stats.matches) * 100).toFixed(1)}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Upcoming Matches" />
          <Card.Content>
            {tournament.matches
              .filter(match => match.status === 'upcoming')
              .slice(0, 3)
              .map(match => (
                <View key={match.id} style={styles.upcomingMatch}>
                  <View style={styles.matchInfo}>
                    <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
                    <Text style={styles.matchDate}>{formatDate(match.date)} at {match.time}</Text>
                    <Text style={styles.matchVenue}>{match.venue}</Text>
                  </View>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('MatchDetails', { matchId: match.id })}
                  >
                    View
                  </Button>
                </View>
              ))}
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderMatches = () => {
    if (!tournament) return null;

    return (
      <View>
        {tournament.matches.map(match => (
          <Card key={match.id} style={styles.card}>
            <Card.Content>
              <View style={styles.matchHeader}>
                <View style={styles.matchTeams}>
                  <Text style={styles.teamName}>{tournament.teamName}</Text>
                  <Text style={styles.vsText}>vs</Text>
                  <Text style={styles.teamName}>{match.opponent}</Text>
                </View>
                <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(match.status) }]}>
                  {match.status.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.matchDetails}>
                <Text style={styles.matchDate}>{formatDate(match.date)} at {match.time}</Text>
                <Text style={styles.matchVenue}>{match.venue}</Text>
                {match.result && <Text style={styles.matchResult}>{match.result}</Text>}
              </View>

              {match.playerPerformance && (
                <View style={styles.performanceContainer}>
                  <Text style={styles.performanceTitle}>Your Performance</Text>
                  <View style={styles.performanceStats}>
                    {match.playerPerformance.runs !== undefined && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{match.playerPerformance.runs}</Text>
                        <Text style={styles.statLabel}>Runs</Text>
                      </View>
                    )}
                    {match.playerPerformance.wickets !== undefined && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{match.playerPerformance.wickets}</Text>
                        <Text style={styles.statLabel}>Wickets</Text>
                      </View>
                    )}
                    {match.playerPerformance.catches !== undefined && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{match.playerPerformance.catches}</Text>
                        <Text style={styles.statLabel}>Catches</Text>
                      </View>
                    )}
                    {match.playerPerformance.stumpings !== undefined && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{match.playerPerformance.stumpings}</Text>
                        <Text style={styles.statLabel}>Stumpings</Text>
                      </View>
                    )}
                  </View>
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

  const renderStats = () => {
    if (!tournament) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Title title="Tournament Statistics" />
          <Card.Content>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.stats.matches}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.stats.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.stats.losses}</Text>
                <Text style={styles.statLabel}>Losses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.stats.noResult}</Text>
                <Text style={styles.statLabel}>No Result</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.stats.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.stats.netRunRate.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Net Run Rate</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Points Table" />
          <Card.Content>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>Pos</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Team</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>P</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>W</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>L</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>NR</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>Pts</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>NRR</Text>
            </View>
            <View style={[styles.tableRow, styles.highlightedRow]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>3</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Kandy Warriors</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{tournament.stats.matches}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{tournament.stats.wins}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{tournament.stats.losses}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{tournament.stats.noResult}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{tournament.stats.points}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{tournament.stats.netRunRate.toFixed(2)}</Text>
            </View>
            {/* Other teams would be listed here */}
          </Card.Content>
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading tournament data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tournament</Text>
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'overview' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('overview')}
            style={styles.tabButton}
          >
            Overview
          </Button>
          <Button
            mode={activeTab === 'matches' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('matches')}
            style={styles.tabButton}
          >
            Matches
          </Button>
          <Button
            mode={activeTab === 'stats' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('stats')}
            style={styles.tabButton}
          >
            Stats
          </Button>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'matches' && renderMatches()}
        {activeTab === 'stats' && renderStats()}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="trophy"
        onPress={() => navigation.navigate('TournamentLeaderboard', { tournamentId: tournament?.id })}
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
  tournamentHeader: {
    alignItems: 'center',
  },
  tournamentLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusChip: {
    paddingHorizontal: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 12,
    color: theme.colors.secondary,
    textAlign: 'right',
  },
  upcomingMatch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchOpponent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchDate: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  matchVenue: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTeams: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginVertical: 4,
  },
  matchDetails: {
    marginBottom: 12,
  },
  matchResult: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 4,
  },
  performanceContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: theme.colors.background + '20',
    borderRadius: 8,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  performanceStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    margin: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  divider: {
    marginVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary + '30',
  },
  highlightedRow: {
    backgroundColor: theme.colors.primary + '10',
  },
  tableCell: {
    fontSize: 12,
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

export default PlayerTournamentScreen; 