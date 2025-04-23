import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, List, Avatar, Chip, FAB, Divider, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  format: string;
  level: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  teams: {
    id: string;
    name: string;
    logo: string;
  }[];
  registeredPlayers: number;
  maxPlayers: number;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  image: string;
  availability: 'available' | 'booked' | 'maintenance';
}

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  teams: number;
  matches: number;
  progress: number;
}

const OrganizerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'venues' | 'tournaments'>('overview');
  const [matches, setMatches] = useState<Match[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const fetchDashboardData = () => {
      // Simulate API call
      setTimeout(() => {
        const mockMatches: Match[] = [
          {
            id: '1',
            title: 'Weekend Cricket League',
            date: '2023-05-15',
            time: '14:00',
            venue: 'R. Premadasa Stadium',
            format: 'T20',
            level: 'Amateur',
            status: 'upcoming',
            teams: [
              {
                id: '1',
                name: 'Colombo Kings',
                logo: 'https://via.placeholder.com/100',
              },
              {
                id: '2',
                name: 'Kandy Warriors',
                logo: 'https://via.placeholder.com/100',
              },
            ],
            registeredPlayers: 18,
            maxPlayers: 22,
          },
          {
            id: '2',
            title: 'Corporate Cricket Challenge',
            date: '2023-05-20',
            time: '10:00',
            venue: 'SSC Ground',
            format: 'ODI',
            level: 'Professional',
            status: 'upcoming',
            teams: [
              {
                id: '3',
                name: 'Galle Gladiators',
                logo: 'https://via.placeholder.com/100',
              },
              {
                id: '4',
                name: 'Jaffna Stallions',
                logo: 'https://via.placeholder.com/100',
              },
            ],
            registeredPlayers: 22,
            maxPlayers: 22,
          },
          {
            id: '3',
            title: 'School Cricket Tournament',
            date: '2023-05-10',
            time: '09:00',
            venue: 'P Sara Oval',
            format: 'T20',
            level: 'School',
            status: 'completed',
            teams: [
              {
                id: '5',
                name: 'Royal College',
                logo: 'https://via.placeholder.com/100',
              },
              {
                id: '6',
                name: 'S. Thomas\' College',
                logo: 'https://via.placeholder.com/100',
              },
            ],
            registeredPlayers: 20,
            maxPlayers: 22,
          },
        ];

        const mockVenues: Venue[] = [
          {
            id: '1',
            name: 'R. Premadasa Stadium',
            location: 'Colombo',
            capacity: 35000,
            image: 'https://via.placeholder.com/300',
            availability: 'available',
          },
          {
            id: '2',
            name: 'SSC Ground',
            location: 'Colombo',
            capacity: 10000,
            image: 'https://via.placeholder.com/300',
            availability: 'booked',
          },
          {
            id: '3',
            name: 'P Sara Oval',
            location: 'Colombo',
            capacity: 6000,
            image: 'https://via.placeholder.com/300',
            availability: 'maintenance',
          },
        ];

        const mockTournaments: Tournament[] = [
          {
            id: '1',
            name: 'Premier League T20 2023',
            startDate: '2023-06-01',
            endDate: '2023-07-15',
            status: 'upcoming',
            teams: 8,
            matches: 32,
            progress: 0,
          },
          {
            id: '2',
            name: 'Corporate Cricket Cup',
            startDate: '2023-05-01',
            endDate: '2023-05-30',
            status: 'ongoing',
            teams: 12,
            matches: 24,
            progress: 60,
          },
          {
            id: '3',
            name: 'School Cricket Championship',
            startDate: '2023-04-01',
            endDate: '2023-04-30',
            status: 'completed',
            teams: 16,
            matches: 30,
            progress: 100,
          },
        ];

        setMatches(mockMatches);
        setVenues(mockVenues);
        setTournaments(mockTournaments);
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return theme.colors.success;
      case 'booked':
        return theme.colors.error;
      case 'maintenance':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderOverview = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Title title="Quick Stats" />
          <Card.Content>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{matches.length}</Text>
                <Text style={styles.statLabel}>Total Matches</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {matches.filter(match => match.status === 'upcoming').length}
                </Text>
                <Text style={styles.statLabel}>Upcoming</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {matches.filter(match => match.status === 'ongoing').length}
                </Text>
                <Text style={styles.statLabel}>Ongoing</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {matches.filter(match => match.status === 'completed').length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Upcoming Matches" />
          <Card.Content>
            {matches
              .filter(match => match.status === 'upcoming')
              .slice(0, 2)
              .map(match => (
                <View key={match.id} style={styles.matchItem}>
                  <View style={styles.matchTeams}>
                    <View style={styles.teamContainer}>
                      <Image source={{ uri: match.teams[0].logo }} style={styles.teamLogo} />
                      <Text style={styles.teamName}>{match.teams[0].name}</Text>
                    </View>
                    <Text style={styles.vsText}>VS</Text>
                    <View style={styles.teamContainer}>
                      <Image source={{ uri: match.teams[1].logo }} style={styles.teamLogo} />
                      <Text style={styles.teamName}>{match.teams[1].name}</Text>
                    </View>
                  </View>
                  <View style={styles.matchDetails}>
                    <Text style={styles.matchDate}>{formatDate(match.date)} at {match.time}</Text>
                    <Text style={styles.matchVenue}>{match.venue}</Text>
                    <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(match.status) }]}>
                      {match.status.toUpperCase()}
                    </Chip>
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

        <Card style={styles.card}>
          <Card.Title title="Venue Availability" />
          <Card.Content>
            {venues.map(venue => (
              <View key={venue.id} style={styles.venueItem}>
                <Image source={{ uri: venue.image }} style={styles.venueImage} />
                <View style={styles.venueDetails}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <Text style={styles.venueLocation}>{venue.location}</Text>
                  <Text style={styles.venueCapacity}>Capacity: {venue.capacity}</Text>
                  <Chip style={[styles.availabilityChip, { backgroundColor: getAvailabilityColor(venue.availability) }]}>
                    {venue.availability.toUpperCase()}
                  </Chip>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Tournaments" />
          <Card.Content>
            {tournaments.map(tournament => (
              <View key={tournament.id} style={styles.tournamentItem}>
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <Text style={styles.tournamentDate}>
                    {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                  </Text>
                  <Text style={styles.tournamentTeams}>{tournament.teams} Teams, {tournament.matches} Matches</Text>
                </View>
                <View style={styles.tournamentProgress}>
                  <ProgressBar
                    progress={tournament.progress / 100}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text style={styles.progressText}>{tournament.progress}%</Text>
                </View>
                <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(tournament.status) }]}>
                  {tournament.status.toUpperCase()}
                </Chip>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderMatches = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Title title="All Matches" />
          <Card.Content>
            {matches.map(match => (
              <View key={match.id} style={styles.matchItem}>
                <View style={styles.matchTeams}>
                  <View style={styles.teamContainer}>
                    <Image source={{ uri: match.teams[0].logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.teams[0].name}</Text>
                  </View>
                  <Text style={styles.vsText}>VS</Text>
                  <View style={styles.teamContainer}>
                    <Image source={{ uri: match.teams[1].logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.teams[1].name}</Text>
                  </View>
                </View>
                <View style={styles.matchDetails}>
                  <Text style={styles.matchDate}>{formatDate(match.date)} at {match.time}</Text>
                  <Text style={styles.matchVenue}>{match.venue}</Text>
                  <Text style={styles.matchFormat}>{match.format} - {match.level}</Text>
                  <Text style={styles.playerCount}>
                    Players: {match.registeredPlayers}/{match.maxPlayers}
                  </Text>
                  <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(match.status) }]}>
                    {match.status.toUpperCase()}
                  </Chip>
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

  const renderVenues = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Title title="All Venues" />
          <Card.Content>
            {venues.map(venue => (
              <View key={venue.id} style={styles.venueItem}>
                <Image source={{ uri: venue.image }} style={styles.venueImage} />
                <View style={styles.venueDetails}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <Text style={styles.venueLocation}>{venue.location}</Text>
                  <Text style={styles.venueCapacity}>Capacity: {venue.capacity}</Text>
                  <Chip style={[styles.availabilityChip, { backgroundColor: getAvailabilityColor(venue.availability) }]}>
                    {venue.availability.toUpperCase()}
                  </Chip>
                </View>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('VenueDetails', { venueId: venue.id })}
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

  const renderTournaments = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Title title="All Tournaments" />
          <Card.Content>
            {tournaments.map(tournament => (
              <View key={tournament.id} style={styles.tournamentItem}>
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <Text style={styles.tournamentDate}>
                    {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                  </Text>
                  <Text style={styles.tournamentTeams}>{tournament.teams} Teams, {tournament.matches} Matches</Text>
                </View>
                <View style={styles.tournamentProgress}>
                  <ProgressBar
                    progress={tournament.progress / 100}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text style={styles.progressText}>{tournament.progress}%</Text>
                </View>
                <Chip style={[styles.statusChip, { backgroundColor: getStatusColor(tournament.status) }]}>
                  {tournament.status.toUpperCase()}
                </Chip>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('TournamentDetails', { tournamentId: tournament.id })}
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organizer Dashboard</Text>
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
            mode={activeTab === 'venues' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('venues')}
            style={styles.tabButton}
          >
            Venues
          </Button>
          <Button
            mode={activeTab === 'tournaments' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('tournaments')}
            style={styles.tabButton}
          >
            Tournaments
          </Button>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'matches' && renderMatches()}
        {activeTab === 'venues' && renderVenues()}
        {activeTab === 'tournaments' && renderTournaments()}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateMatch')}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: theme.colors.background + '20',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  matchItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.background + '10',
    borderRadius: 8,
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamContainer: {
    alignItems: 'center',
    width: '40%',
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  matchDetails: {
    marginBottom: 8,
  },
  matchDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  matchVenue: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  matchFormat: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  playerCount: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  venueItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 8,
    backgroundColor: theme.colors.background + '10',
    borderRadius: 8,
  },
  venueImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  venueCapacity: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  availabilityChip: {
    alignSelf: 'flex-start',
  },
  tournamentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.background + '10',
    borderRadius: 8,
  },
  tournamentInfo: {
    marginBottom: 8,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tournamentDate: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  tournamentTeams: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  tournamentProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default OrganizerDashboardScreen; 