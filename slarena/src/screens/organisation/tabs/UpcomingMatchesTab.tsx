import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MatchCard from '../../../components/organisation/MatchCard';

const UpcomingMatchesTab = () => {
  const matches = [
    { 
      id: '1', 
      team1: 'Lions', 
      team2: 'Eagles', 
      date: 'Apr 25, 2023', 
      time: '2:00 PM', 
      venue: 'Central Ground',
      tournament: 'Premier League'
    },
    { 
      id: '2', 
      team1: 'Tigers', 
      team2: 'Panthers', 
      date: 'Apr 27, 2023', 
      time: '3:30 PM', 
      venue: 'City Stadium',
      tournament: 'Premier League'
    },
    { 
      id: '3', 
      team1: 'Sharks', 
      team2: 'Dolphins', 
      date: 'Apr 30, 2023', 
      time: '1:00 PM', 
      venue: 'Marine Ground',
      tournament: 'Cup Championship'
    },
  ];

  const handleViewDetails = (matchId: string) => {
    console.log(`View details for match ${matchId}`);
    // Navigate to match details screen
  };

  const renderMatchItem = ({ item }: { item: any }) => (
    <MatchCard
      team1={item.team1}
      team2={item.team2}
      date={item.date}
      time={item.time}
      venue={item.venue}
      tournament={item.tournament}
      onViewDetails={() => handleViewDetails(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Upcoming Matches</Text>
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});

export default UpcomingMatchesTab; 