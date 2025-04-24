import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import MatchCard from '../../../components/organisation/MatchCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UpcomingMatchesTab = () => {
  const navigation = useNavigation<NavigationProp>();

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

  const handleCreateTournament = () => {
    navigation.navigate('CreateTournament');
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
      <View style={styles.headerContainer}>
        <Text style={styles.tabTitle}>Upcoming Matches</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateTournament}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#f4511e',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default UpcomingMatchesTab; 