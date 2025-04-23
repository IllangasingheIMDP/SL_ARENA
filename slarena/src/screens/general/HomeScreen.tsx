import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { useTheme, Card, Button, ActivityIndicator, Divider, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { GeneralUserTabParamList, RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/theme';
import apiService from '../../services/apiService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Define types for our data
interface Match {
  id: string;
  title: string;
  date: string;
  venue: string;
  teams: string[];
}

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  location: string;
  registrationDeadline: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
}

// Mock data for featured matches
const featuredMatches: Match[] = [
  {
    id: '1',
    title: 'T20 Finals',
    date: '2024-05-01',
    venue: 'R. Premadasa Stadium',
    teams: ['Team A', 'Team B'],
  },
  {
    id: '2',
    title: 'T20 Challenge',
    date: '2023-05-18',
    venue: 'Galle International Stadium',
    teams: ['Galle Gladiators', 'Jaffna Stallions'],
  },
  {
    id: '3',
    title: 'Youth Championship',
    date: '2023-05-20',
    venue: 'SSC Ground',
    teams: ['U19 National Team', 'U19 Provincial XI'],
  },
];

// Mock data for upcoming tournaments
const upcomingTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Summer Cricket Championship',
    startDate: '2024-06-15',
    location: 'Galle International Stadium',
    registrationDeadline: '2024-05-30',
  },
  {
    id: '2',
    name: 'National School Cricket Championship',
    startDate: '2023-07-20',
    location: 'SSC Ground',
    registrationDeadline: '2023-08-10',
  },
];

// Mock data for news
const cricketNews: NewsItem[] = [
  {
    id: '1',
    title: 'New Cricket Academy Opens',
    summary: 'State-of-the-art facility opens in Colombo',
    date: '2024-04-20',
  },
  {
    id: '2',
    title: 'Sri Lanka Cricket announces new selection committee',
    summary: 'New committee formed to lead Sri Lanka Cricket',
    date: '2023-05-10',
  },
];

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { width } = Dimensions.get('window');

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch this data from your API
      // const featuredMatchesData = await apiService.get('/matches/featured');
      // const tournamentsData = await apiService.get('/tournaments/upcoming');
      // const newsData = await apiService.get('/news/latest');
      
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderFeaturedMatch: ListRenderItem<Match> = ({ item }) => (
    <Card key={item.id} style={[styles.card, { width: width * 0.8 }]}>
      <Card.Title title={item.title} />
      <Card.Content>
        <Text>{`Date: ${item.date}`}</Text>
        <Text>{`Venue: ${item.venue}`}</Text>
        <Text>{`${item.teams[0]} vs ${item.teams[1]}`}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderTournament: ListRenderItem<Tournament> = ({ item }) => (
    <Card key={item.id} style={[styles.card, { width: width * 0.7 }]}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text>{`Starts: ${item.startDate}`}</Text>
        <Text>{`Location: ${item.location}`}</Text>
        <Text>{`Registration Deadline: ${item.registrationDeadline}`}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('TournamentDetails', { tournamentId: item.id })}>
          Learn More
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderNewsItem: ListRenderItem<NewsItem> = ({ item }) => (
    <Card key={item.id} style={styles.card}>
      <Card.Title title={item.title} />
      <Card.Content>
        <Text>{item.summary}</Text>
        <Text>{`Published: ${item.date}`}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('NewsDetails', { newsId: item.id })}>
          Read More
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('Discover')}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
          <Text style={styles.quickActionIconText}>🔍</Text>
        </View>
        <Text style={styles.quickActionText}>Find Matches</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('Discover', { screen: 'Tournaments' })}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
          <Text style={styles.quickActionIconText}>🏆</Text>
        </View>
        <Text style={styles.quickActionText}>Tournaments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('Discover', { screen: 'Teams' })}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: colors.accent }]}>
          <Text style={styles.quickActionIconText}>👥</Text>
        </View>
        <Text style={styles.quickActionText}>Teams</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('Discover', { screen: 'Players' })}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: colors.cricketGreen }]}>
          <Text style={styles.quickActionIconText}>🏏</Text>
        </View>
        <Text style={styles.quickActionText}>Players</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to SL Arena</Text>
        <Text style={styles.subtitleText}>Your Cricket Talent Platform</Text>
      </View>

      {renderQuickActions()}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Matches</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover', { screen: 'Matches' })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredMatches}
          renderItem={renderFeaturedMatch}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.matchesList}
        />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover', { screen: 'Tournaments' })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={upcomingTournaments}
          renderItem={renderTournament}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tournamentsList}
        />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover', { screen: 'News' })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {cricketNews.map((item) => renderNewsItem({ item }))}
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Discover')}
          style={styles.exploreButton}
        >
          Explore More
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  welcomeText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.background,
  },
  subtitleText: {
    fontSize: typography.fontSize.md,
    color: colors.background,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.background,
    marginTop: -spacing.xl,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - spacing.md * 6) / 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionIconText: {
    fontSize: typography.fontSize.xl,
  },
  quickActionText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    color: colors.text,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  matchesList: {
    paddingRight: spacing.lg,
  },
  card: {
    width: width * 0.8,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    ...shadows.small,
  },
  tournamentsList: {
    paddingRight: spacing.lg,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  exploreButton: {
    width: '100%',
    paddingVertical: spacing.sm,
  },
});

export default HomeScreen; 