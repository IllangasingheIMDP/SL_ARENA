import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OngoingMatchCard from '../../../components/organisation/OngoingMatchCard';

const OngoingTournementsTab = () => {
  const matches = [
    { 
      id: '1', 
      team1: 'Lions', 
      team2: 'Eagles', 
      score1: '125/4', 
      score2: '98/7', 
      overs1: '15.2', 
      overs2: '12.0',
      status: 'In Progress',
      venue: 'Central Ground'
    },
    { 
      id: '2', 
      team1: 'Tigers', 
      team2: 'Panthers', 
      score1: '187/6', 
      score2: '156/3', 
      overs1: '20.0', 
      overs2: '15.4',
      status: 'In Progress',
      venue: 'City Stadium'
    },
  ];

  const handleLiveStream = (matchId: string) => {
    console.log(`Open live stream for match ${matchId}`);
    // Navigate to live stream screen
  };

  const handleScorecard = (matchId: string) => {
    console.log(`Open scorecard for match ${matchId}`);
    // Navigate to scorecard screen
  };

  const renderOngoingMatchItem = ({ item }: { item: any }) => (
    <OngoingMatchCard
      team1={item.team1}
      team2={item.team2}
      score1={item.score1}
      score2={item.score2}
      overs1={item.overs1}
      overs2={item.overs2}
      status={item.status}
      venue={item.venue}
      onLiveStream={() => handleLiveStream(item.id)}
      onScorecard={() => handleScorecard(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Ongoing Matches</Text>
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderOngoingMatchItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Icon name="sports-cricket" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No ongoing matches at the moment</Text>
        </View>
      )}
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default OngoingTournementsTab; 