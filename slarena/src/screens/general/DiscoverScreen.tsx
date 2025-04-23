import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { useTheme, Searchbar, Chip, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GeneralUserTabParamList } from '../../navigation/AppNavigator';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/theme';
import apiService from '../../services/apiService';

type DiscoverScreenNavigationProp = StackNavigationProp<GeneralUserTabParamList, 'Discover'>;

// Define types for our data
interface Match {
  id: string;
  title: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
  image: any; // Using any for require() images
}

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: number;
  image: any; // Using any for require() images
}

interface Team {
  id: string;
  name: string;
  location: string;
  members: number;
  image: any; // Using any for require() images
}

interface Player {
  id: string;
  name: string;
  role: string;
  team: string;
  image: any; // Using any for require() images
}

// Mock data for matches
const matches: Match[] = [
  {
    id: '1',
    title: 'Premier League Final',
    teams: 'Colombo Kings vs Kandy Warriors',
    date: '2023-05-15',
    time: '14:00',
    venue: 'R. Premadasa Stadium',
    image: require('../../assets/images/match1.jpg'),
  },
  {
    id: '2',
    title: 'T20 Challenge',
    teams: 'Galle Gladiators vs Jaffna Stallions',
    date: '2023-05-18',
    time: '19:30',
    venue: 'Galle International Stadium',
    image: require('../../assets/images/match2.jpg'),
  },
  {
    id: '3',
    title: 'Youth Championship',
    teams: 'U19 National Team vs U19 Provincial XI',
    date: '2023-05-20',
    time: '10:00',
    venue: 'SSC Ground',
    image: require('../../assets/images/match3.jpg'),
  },
  {
    id: '4',
    title: 'School Cricket Cup',
    teams: 'Royal College vs St. Thomas College',
    date: '2023-05-22',
    time: '09:30',
    venue: 'SSC Ground',
    image: require('../../assets/images/match4.jpg'),
  },
];

// Mock data for tournaments
const tournaments: Tournament[] = [
  {
    id: '1',
    name: 'Sri Lanka Premier League 2023',
    startDate: '2023-06-01',
    endDate: '2023-07-15',
    teams: 8,
    image: require('../../assets/images/tournament1.jpg'),
  },
  {
    id: '2',
    name: 'National School Cricket Championship',
    startDate: '2023-07-20',
    endDate: '2023-08-10',
    teams: 16,
    image: require('../../assets/images/tournament2.jpg'),
  },
  {
    id: '3',
    name: 'Provincial T20 Cup',
    startDate: '2023-08-15',
    endDate: '2023-09-05',
    teams: 9,
    image: require('../../assets/images/tournament3.jpg'),
  },
];

// Mock data for teams
const teams: Team[] = [
  {
    id: '1',
    name: 'Colombo Kings',
    location: 'Colombo',
    members: 25,
    image: require('../../assets/images/team1.jpg'),
  },
  {
    id: '2',
    name: 'Kandy Warriors',
    location: 'Kandy',
    members: 22,
    image: require('../../assets/images/team2.jpg'),
  },
  {
    id: '3',
    name: 'Galle Gladiators',
    location: 'Galle',
    members: 20,
    image: require('../../assets/images/team3.jpg'),
  },
  {
    id: '4',
    name: 'Jaffna Stallions',
    location: 'Jaffna',
    members: 23,
    image: require('../../assets/images/team4.jpg'),
  },
];

// Mock data for players
const players: Player[] = [
  {
    id: '1',
    name: 'Dimuth Karunaratne',
    role: 'Batsman',
    team: 'Colombo Kings',
    image: require('../../assets/images/player1.jpg'),
  },
  {
    id: '2',
    name: 'Angelo Mathews',
    role: 'All-rounder',
    team: 'Kandy Warriors',
    image: require('../../assets/images/player2.jpg'),
  },
  {
    id: '3',
    name: 'Wanindu Hasaranga',
    role: 'All-rounder',
    team: 'Galle Gladiators',
    image: require('../../assets/images/player3.jpg'),
  },
  {
    id: '4',
    name: 'Dhananjaya de Silva',
    role: 'All-rounder',
    team: 'Jaffna Stallions',
    image: require('../../assets/images/player4.jpg'),
  },
];

// Tab types
type TabType = 'matches' | 'tournaments' | 'teams' | 'players';

// Union type for all data types
type DataItem = Match | Tournament | Team | Player;

const DiscoverScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<DiscoverScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('matches');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch this data from your API
      // const matchesData = await apiService.get('/matches');
      // const tournamentsData = await apiService.get('/tournaments');
      // const teamsData = await apiService.get('/teams');
      // const playersData = await apiService.get('/players');
      
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Set initial filtered data based on active tab
      updateFilteredData(activeTab, searchQuery);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update filtered data when tab or search query changes
  useEffect(() => {
    updateFilteredData(activeTab, searchQuery);
  }, [activeTab, searchQuery]);

  const updateFilteredData = (tab: TabType, query: string) => {
    let data: DataItem[] = [];
    
    switch (tab) {
      case 'matches':
        data = matches;
        break;
      case 'tournaments':
        data = tournaments;
        break;
      case 'teams':
        data = teams;
        break;
      case 'players':
        data = players;
        break;
    }
    
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      data = data.filter(item => {
        if (tab === 'matches') {
          const matchItem = item as Match;
          return (
            matchItem.title.toLowerCase().includes(lowercasedQuery) ||
            matchItem.teams.toLowerCase().includes(lowercasedQuery) ||
            matchItem.venue.toLowerCase().includes(lowercasedQuery)
          );
        } else if (tab === 'tournaments') {
          const tournamentItem = item as Tournament;
          return tournamentItem.name.toLowerCase().includes(lowercasedQuery);
        } else if (tab === 'teams') {
          const teamItem = item as Team;
          return (
            teamItem.name.toLowerCase().includes(lowercasedQuery) ||
            teamItem.location.toLowerCase().includes(lowercasedQuery)
          );
        } else if (tab === 'players') {
          const playerItem = item as Player;
          return (
            playerItem.name.toLowerCase().includes(lowercasedQuery) ||
            playerItem.role.toLowerCase().includes(lowercasedQuery) ||
            playerItem.team.toLowerCase().includes(lowercasedQuery)
          );
        }
        return false;
      });
    }
    
    setFilteredData(data);
  };

  const renderMatch: ListRenderItem<DataItem> = ({ item }) => {
    const matchItem = item as Match;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Discover', { screen: 'MatchDetails', params: { matchId: matchItem.id } })}
      >
        <Image source={matchItem.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{matchItem.title}</Text>
          <Text style={styles.cardSubtitle}>{matchItem.teams}</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardDetail}>
              {matchItem.date} • {matchItem.time}
            </Text>
            <Text style={styles.cardDetail}>{matchItem.venue}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTournament: ListRenderItem<DataItem> = ({ item }) => {
    const tournamentItem = item as Tournament;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Discover', { screen: 'TournamentDetails', params: { tournamentId: tournamentItem.id } })}
      >
        <Image source={tournamentItem.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{tournamentItem.name}</Text>
          <Text style={styles.cardSubtitle}>
            {tournamentItem.startDate} - {tournamentItem.endDate}
          </Text>
          <Text style={styles.cardDetail}>{tournamentItem.teams} Teams</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTeam: ListRenderItem<DataItem> = ({ item }) => {
    const teamItem = item as Team;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Discover', { screen: 'TeamDetails', params: { teamId: teamItem.id } })}
      >
        <Image source={teamItem.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{teamItem.name}</Text>
          <Text style={styles.cardSubtitle}>{teamItem.location}</Text>
          <Text style={styles.cardDetail}>{teamItem.members} Members</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPlayer: ListRenderItem<DataItem> = ({ item }) => {
    const playerItem = item as Player;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Discover', { screen: 'PlayerDetails', params: { playerId: playerItem.id } })}
      >
        <Image source={playerItem.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{playerItem.name}</Text>
          <Text style={styles.cardSubtitle}>{playerItem.role}</Text>
          <Text style={styles.cardDetail}>{playerItem.team}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
    >
      <Chip
        selected={activeTab === 'matches'}
        onPress={() => setActiveTab('matches')}
        style={styles.tab}
        mode="outlined"
      >
        Matches
      </Chip>
      <Chip
        selected={activeTab === 'tournaments'}
        onPress={() => setActiveTab('tournaments')}
        style={styles.tab}
        mode="outlined"
      >
        Tournaments
      </Chip>
      <Chip
        selected={activeTab === 'teams'}
        onPress={() => setActiveTab('teams')}
        style={styles.tab}
        mode="outlined"
      >
        Teams
      </Chip>
      <Chip
        selected={activeTab === 'players'}
        onPress={() => setActiveTab('players')}
        style={styles.tab}
        mode="outlined"
      >
        Players
      </Chip>
    </ScrollView>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (filteredData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
          <Button
            mode="outlined"
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            Clear Search
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredData}
        renderItem={
          activeTab === 'matches'
            ? renderMatch
            : activeTab === 'tournaments'
            ? renderTournament
            : activeTab === 'teams'
            ? renderTeam
            : renderPlayer
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Searchbar
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {renderTabs()}

      <Divider style={styles.divider} />

      {renderContent()}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: spacing.md,
  },
  searchBar: {
    borderRadius: borderRadius.md,
    elevation: 2,
  },
  tabsContainer: {
    padding: spacing.md,
  },
  tab: {
    marginRight: spacing.sm,
  },
  divider: {
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text,
    marginBottom: spacing.md,
  },
  clearButton: {
    marginTop: spacing.md,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    ...shadows.small,
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginTop: spacing.xs,
  },
  cardDetails: {
    marginTop: spacing.sm,
  },
  cardDetail: {
    fontSize: typography.fontSize.xs,
    color: colors.disabled,
  },
});

export default DiscoverScreen; 