import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, List, Avatar, Chip, FAB, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Player {
  id: string;
  name: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  jerseyNumber: number;
  image?: string;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  players: Player[];
}

interface MatchStats {
  overs: number;
  runs: number;
  wickets: number;
  extras: number;
  runRate: number;
}

interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  format: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  toss: {
    winner: string;
    decision: string;
  };
  teams: {
    team1: Team;
    team2: Team;
  };
  officials: {
    umpires: string[];
    matchReferee: string;
  };
  team1Stats?: MatchStats;
  team2Stats?: MatchStats;
  result?: string;
  manOfTheMatch?: string;
}

const PlayerMatchDetailsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const matchId = route.params?.matchId;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'stats'>('overview');
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch match data from an API
    // For now, we'll use mock data
    const fetchMatchDetails = () => {
      // Simulate API call
      setTimeout(() => {
        const mockMatch: Match = {
          id: matchId || '1',
          title: 'Kandy Warriors vs Colombo Kings',
          date: '2024-04-25',
          time: '14:00',
          venue: 'R. Premadasa Stadium, Colombo',
          format: 'T20',
          status: 'upcoming',
          toss: {
            winner: 'Kandy Warriors',
            decision: 'Batting first',
          },
          teams: {
            team1: {
              id: '1',
              name: 'Kandy Warriors',
              logo: 'https://via.placeholder.com/100',
              players: [
                { id: '1', name: 'John Smith', role: 'Batsman', battingStyle: 'Right-handed', jerseyNumber: 7, image: 'https://via.placeholder.com/50' },
                { id: '2', name: 'David Wilson', role: 'All-rounder', battingStyle: 'Left-handed', bowlingStyle: 'Right-arm fast', jerseyNumber: 10, image: 'https://via.placeholder.com/50' },
                { id: '3', name: 'Michael Brown', role: 'Batsman', battingStyle: 'Right-handed', jerseyNumber: 18, image: 'https://via.placeholder.com/50' },
                { id: '4', name: 'James Taylor', role: 'Wicket-keeper', battingStyle: 'Right-handed', jerseyNumber: 22, image: 'https://via.placeholder.com/50' },
                { id: '5', name: 'Robert Johnson', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Left-arm spin', jerseyNumber: 33, image: 'https://via.placeholder.com/50' },
                { id: '6', name: 'William Davis', role: 'All-rounder', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm medium', jerseyNumber: 45, image: 'https://via.placeholder.com/50' },
                { id: '7', name: 'Thomas Miller', role: 'Batsman', battingStyle: 'Left-handed', jerseyNumber: 12, image: 'https://via.placeholder.com/50' },
                { id: '8', name: 'Christopher White', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm fast', jerseyNumber: 77, image: 'https://via.placeholder.com/50' },
                { id: '9', name: 'Daniel Anderson', role: 'Batsman', battingStyle: 'Right-handed', jerseyNumber: 3, image: 'https://via.placeholder.com/50' },
                { id: '10', name: 'Joseph Thompson', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm medium', jerseyNumber: 15, image: 'https://via.placeholder.com/50' },
                { id: '11', name: 'Andrew Garcia', role: 'All-rounder', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm off-spin', jerseyNumber: 99, image: 'https://via.placeholder.com/50' },
              ],
            },
            team2: {
              id: '2',
              name: 'Colombo Kings',
              logo: 'https://via.placeholder.com/100',
              players: [
                { id: '12', name: 'Richard Martinez', role: 'Batsman', battingStyle: 'Right-handed', jerseyNumber: 1, image: 'https://via.placeholder.com/50' },
                { id: '13', name: 'Charles Robinson', role: 'All-rounder', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm fast', jerseyNumber: 5, image: 'https://via.placeholder.com/50' },
                { id: '14', name: 'Edward Clark', role: 'Batsman', battingStyle: 'Left-handed', jerseyNumber: 8, image: 'https://via.placeholder.com/50' },
                { id: '15', name: 'George Hall', role: 'Wicket-keeper', battingStyle: 'Right-handed', jerseyNumber: 11, image: 'https://via.placeholder.com/50' },
                { id: '16', name: 'Kevin Young', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Left-arm fast', jerseyNumber: 14, image: 'https://via.placeholder.com/50' },
                { id: '17', name: 'Steven King', role: 'All-rounder', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm medium', jerseyNumber: 17, image: 'https://via.placeholder.com/50' },
                { id: '18', name: 'Anthony Wright', role: 'Batsman', battingStyle: 'Right-handed', jerseyNumber: 21, image: 'https://via.placeholder.com/50' },
                { id: '19', name: 'Mark Lee', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm leg-spin', jerseyNumber: 25, image: 'https://via.placeholder.com/50' },
                { id: '20', name: 'Donald Scott', role: 'Batsman', battingStyle: 'Left-handed', jerseyNumber: 30, image: 'https://via.placeholder.com/50' },
                { id: '21', name: 'Paul Green', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm off-spin', jerseyNumber: 42, image: 'https://via.placeholder.com/50' },
                { id: '22', name: 'Timothy Adams', role: 'All-rounder', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm medium', jerseyNumber: 88, image: 'https://via.placeholder.com/50' },
              ],
            },
          },
          officials: {
            umpires: ['Alan Smith', 'John Davis'],
            matchReferee: 'Michael Johnson',
          },
        };
        setMatch(mockMatch);
        setLoading(false);
      }, 1000);
    };

    fetchMatchDetails();
  }, [matchId]);

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.info;
      case 'live':
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
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const renderOverview = () => {
    if (!match) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.matchHeader}>
              <View style={styles.teamContainer}>
                <Image source={{ uri: match.teams.team1.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{match.teams.team1.name}</Text>
              </View>
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(match.status) }]}>
                  {match.status.toUpperCase()}
                </Chip>
              </View>
              <View style={styles.teamContainer}>
                <Image source={{ uri: match.teams.team2.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{match.teams.team2.name}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Match Details" />
          <Card.Content>
            <List.Item
              title="Date"
              description={formatDate(match.date)}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Time"
              description={match.time}
              left={props => <List.Icon {...props} icon="clock" />}
            />
            <Divider />
            <List.Item
              title="Venue"
              description={match.venue}
              left={props => <List.Icon {...props} icon="map-marker" />}
            />
            <Divider />
            <List.Item
              title="Format"
              description={match.format}
              left={props => <List.Icon {...props} icon="cricket" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Toss Information" />
          <Card.Content>
            <List.Item
              title="Winner"
              description={match.toss.winner}
              left={props => <List.Icon {...props} icon="trophy" />}
            />
            <Divider />
            <List.Item
              title="Decision"
              description={match.toss.decision}
              left={props => <List.Icon {...props} icon="hand-point-right" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Match Officials" />
          <Card.Content>
            <List.Item
              title="Umpires"
              description={match.officials.umpires.join(', ')}
              left={props => <List.Icon {...props} icon="account-tie" />}
            />
            <Divider />
            <List.Item
              title="Match Referee"
              description={match.officials.matchReferee}
              left={props => <List.Icon {...props} icon="gavel" />}
            />
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderLineups = () => {
    if (!match) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Title title={`${match.teams.team1.name} Lineup`} />
          <Card.Content>
            <List.Section>
              {match.teams.team1.players.map((player, index) => (
                <List.Item
                  key={player.id}
                  title={player.name}
                  description={`${player.role} • #${player.jerseyNumber}`}
                  left={props => (
                    <Avatar.Image
                      {...props}
                      size={40}
                      source={{ uri: player.image }}
                    />
                  )}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title={`${match.teams.team2.name} Lineup`} />
          <Card.Content>
            <List.Section>
              {match.teams.team2.players.map((player, index) => (
                <List.Item
                  key={player.id}
                  title={player.name}
                  description={`${player.role} • #${player.jerseyNumber}`}
                  left={props => (
                    <Avatar.Image
                      {...props}
                      size={40}
                      source={{ uri: player.image }}
                    />
                  )}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderStats = () => {
    if (!match) return null;

    // For upcoming matches, we don't have stats yet
    if (match.status === 'upcoming') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Statistics will be available once the match begins</Text>
        </View>
      );
    }

    // For live or completed matches, we would show the stats
    // For this example, we'll just show a placeholder
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Match statistics will be displayed here</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading match details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Details</Text>
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'overview' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('overview')}
            style={styles.tabButton}
          >
            Overview
          </Button>
          <Button
            mode={activeTab === 'lineups' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('lineups')}
            style={styles.tabButton}
          >
            Lineups
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
        {activeTab === 'lineups' && renderLineups()}
        {activeTab === 'stats' && renderStats()}
      </ScrollView>

      {match?.status === 'upcoming' && (
        <FAB
          style={styles.fab}
          icon="cricket"
          onPress={() => navigation.navigate('JoinMatch', { matchId: match.id })}
          color={theme.colors.surface}
        />
      )}
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusChip: {
    paddingHorizontal: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
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

export default PlayerMatchDetailsScreen; 