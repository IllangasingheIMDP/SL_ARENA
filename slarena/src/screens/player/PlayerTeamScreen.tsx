import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: string;
  image: string;
  status: 'active' | 'injured' | 'unavailable';
}

interface TeamStats {
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  founded: string;
  location: string;
  coach: string;
  captain: string;
  stats: TeamStats;
  members: TeamMember[];
  upcomingMatches: {
    id: string;
    opponent: string;
    date: string;
    venue: string;
  }[];
}

const PlayerTeamScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'matches'>('overview');

  const team: Team = {
    id: '1',
    name: 'Colombo Kings',
    logo: 'https://via.placeholder.com/150',
    founded: '2015',
    location: 'Colombo, Sri Lanka',
    coach: 'Coach Smith',
    captain: 'John Doe',
    stats: {
      matches: 42,
      wins: 28,
      losses: 10,
      draws: 4,
      winRate: 66.7,
    },
    members: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Captain',
        position: 'All-rounder',
        image: 'https://via.placeholder.com/100',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Vice Captain',
        position: 'Batsman',
        image: 'https://via.placeholder.com/100',
        status: 'active',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Player',
        position: 'Bowler',
        image: 'https://via.placeholder.com/100',
        status: 'injured',
      },
      {
        id: '4',
        name: 'Sarah Williams',
        role: 'Player',
        position: 'Wicket Keeper',
        image: 'https://via.placeholder.com/100',
        status: 'active',
      },
      {
        id: '5',
        name: 'David Brown',
        role: 'Player',
        position: 'Batsman',
        image: 'https://via.placeholder.com/100',
        status: 'unavailable',
      },
    ],
    upcomingMatches: [
      {
        id: '1',
        opponent: 'Kandy Warriors',
        date: '2024-04-20',
        venue: 'R. Premadasa Stadium',
      },
      {
        id: '2',
        opponent: 'Galle Gladiators',
        date: '2024-04-25',
        venue: 'SSC Ground',
      },
      {
        id: '3',
        opponent: 'Jaffna Stallions',
        date: '2024-05-01',
        venue: 'Pallekele International Cricket Stadium',
      },
    ],
  };

  const renderTeamOverview = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.teamHeader}>
            <Image source={{ uri: team.logo }} style={styles.teamLogo} />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamLocation}>{team.location}</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Founded:</Text>
            <Text style={styles.infoValue}>{team.founded}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coach:</Text>
            <Text style={styles.infoValue}>{team.coach}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Captain:</Text>
            <Text style={styles.infoValue}>{team.captain}</Text>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Team Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{team.stats.matches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{team.stats.wins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{team.stats.losses}</Text>
              <Text style={styles.statLabel}>Losses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{team.stats.draws}</Text>
              <Text style={styles.statLabel}>Draws</Text>
            </View>
          </View>
          <View style={styles.winRateContainer}>
            <Text style={styles.winRateLabel}>Win Rate</Text>
            <Text style={styles.winRateValue}>{team.stats.winRate}%</Text>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Upcoming Matches</Text>
          {team.upcomingMatches.map(match => (
            <View key={match.id} style={styles.matchItem}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
                <Text style={styles.matchDetails}>{match.date} at {match.venue}</Text>
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

  const renderTeamMembers = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Team Members</Text>
          {team.members.map(member => (
            <View key={member.id} style={styles.memberItem}>
              <Avatar.Image size={50} source={{ uri: member.image }} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role} • {member.position}</Text>
              </View>
              <View style={[
                styles.statusIndicator, 
                member.status === 'active' && styles.activeStatus,
                member.status === 'injured' && styles.injuredStatus,
                member.status === 'unavailable' && styles.unavailableStatus,
              ]}>
                <Text style={styles.statusText}>{member.status}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderUpcomingMatches = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Upcoming Matches</Text>
          {team.upcomingMatches.map(match => (
            <Card style={styles.matchCard} key={match.id}>
              <Card.Content>
                <Text style={styles.matchTitle}>vs {match.opponent}</Text>
                <List.Item
                  title="Date"
                  description={match.date}
                  left={props => <List.Icon {...props} icon="calendar" />}
                />
                <List.Item
                  title="Venue"
                  description={match.venue}
                  left={props => <List.Icon {...props} icon="map-marker" />}
                />
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('MatchDetails', { matchId: match.id })}
                >
                  View Details
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{team.name}</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'members' && styles.activeTab]} 
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'matches' && styles.activeTab]} 
            onPress={() => setActiveTab('matches')}
          >
            <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
              Matches
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderTeamOverview()}
        {activeTab === 'members' && renderTeamMembers()}
        {activeTab === 'matches' && renderUpcomingMatches()}
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTeamMember')}
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
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  activeTabText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  teamInfo: {
    marginLeft: 16,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamLocation: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  infoValue: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  winRateContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  winRateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  winRateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchOpponent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchDetails: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberRole: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: theme.colors.success + '20',
  },
  injuredStatus: {
    backgroundColor: theme.colors.error + '20',
  },
  unavailableStatus: {
    backgroundColor: theme.colors.warning + '20',
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  matchCard: {
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerTeamScreen; 