import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'in-progress';
}

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'registration' | 'in-progress' | 'completed';
}

interface Stats {
  matches: number;
  runs: number;
  wickets: number;
  average: number;
}

const PlayerHomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [refreshing, setRefreshing] = useState(false);
  const [playerStats, setPlayerStats] = useState<Stats>({
    matches: 25,
    runs: 1250,
    wickets: 15,
    average: 45.5,
  });

  const upcomingMatches: Match[] = [
    {
      id: '1',
      title: 'Premier League vs Colombo Kings',
      date: '2024-04-15',
      time: '14:00',
      venue: 'R. Premadasa Stadium',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'T20 Cup vs Kandy Warriors',
      date: '2024-04-18',
      time: '19:00',
      venue: 'Pallekele International Cricket Stadium',
      status: 'upcoming',
    },
  ];

  const registeredTournaments: Tournament[] = [
    {
      id: '1',
      name: 'Premier League 2024',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      status: 'in-progress',
    },
    {
      id: '2',
      name: 'T20 Cup 2024',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      status: 'registration',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderMatch = (item: Match) => (
    <Card style={styles.card} key={item.id}>
      <Card.Content>
        <Text style={styles.matchTitle}>{item.title}</Text>
        <List.Item
          title="Date & Time"
          description={`${item.date} at ${item.time}`}
          left={props => <List.Icon {...props} icon="calendar" />}
        />
        <List.Item
          title="Venue"
          description={item.venue}
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
        <List.Item
          title="Status"
          description={item.status}
          left={props => <List.Icon {...props} icon="information" />}
        />
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderTournament = (item: Tournament) => (
    <Card style={styles.card} key={item.id}>
      <Card.Content>
        <Text style={styles.tournamentTitle}>{item.name}</Text>
        <List.Item
          title="Duration"
          description={`${item.startDate} to ${item.endDate}`}
          left={props => <List.Icon {...props} icon="calendar-range" />}
        />
        <List.Item
          title="Status"
          description={item.status}
          left={props => <List.Icon {...props} icon="trophy" />}
        />
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate('TournamentDetails', { tournamentId: item.id })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{ uri: 'https://via.placeholder.com/80' }}
        />
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.playerName}>John Doe</Text>
        </View>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.matches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.runs}</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.wickets}</Text>
              <Text style={styles.statLabel}>Wickets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.average}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        {upcomingMatches.map(renderMatch)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Tournaments</Text>
        {registeredTournaments.map(renderTournament)}
      </View>

      <View style={styles.quickActions}>
        <Button
          mode="contained"
          icon="calendar-plus"
          onPress={() => navigation.navigate('Schedule')}
          style={styles.actionButton}
        >
          Schedule
        </Button>
        <Button
          mode="contained"
          icon="chart-line"
          onPress={() => navigation.navigate('Performance')}
          style={styles.actionButton}
        >
          Performance
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  headerText: {
    marginLeft: 16,
  },
  welcomeText: {
    color: theme.colors.surface,
    fontSize: 16,
  },
  playerName: {
    color: theme.colors.surface,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsCard: {
    margin: 16,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default PlayerHomeScreen; 