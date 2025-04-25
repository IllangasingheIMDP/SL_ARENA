import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MatchCard from '../../../components/organisation/MatchCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UpcomingMatchesTab = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.tabTitle}>Upcoming Matches</Text>
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('CreateTournament')}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  listContainer: {
    paddingBottom: 80, // Add padding to prevent FAB from covering content
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#f4511e',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000, // Ensure FAB is above other elements
  },
});

export default UpcomingMatchesTab; 