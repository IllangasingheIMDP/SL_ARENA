import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UpcomingTournamentComponent from '../../../components/organisation/UpcomingTournamentComponent';
import { tournamentService } from '../../../services/tournamentService';
import { Tournament, Venue } from '../../../types/tournamentTypes';

const UpcomingMatchesTab = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingTournaments();
  }, []);

  const fetchUpcomingTournaments = async () => {
    try {
      const response = await tournamentService.getUpcomingTournaments();
      setTournaments(response);
    } catch (error) {
      console.error('Error fetching upcoming tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (tournament: Tournament) => {
    navigation.navigate('TournamentDetails', { tournament });
  };

  const renderTournamentItem = ({ item }: { item: Tournament }) => (
    <UpcomingTournamentComponent
      tournament_id={item.tournament_id}
      tournament_name={item.name}
      start_date={item.start_date}
      end_date={item.end_date}
      tournament_type={item.type}
      onViewDetails={() => handleViewDetails(item)}
    />

  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.tabTitle}>Upcoming Tournaments</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading tournaments...</Text>
          </View>
        ) : (
          <FlatList
            data={tournaments}
            renderItem={renderTournamentItem}
            keyExtractor={item => item?.tournament_id?.toString() || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
    paddingBottom: 80,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 1000,
  },
});

export default UpcomingMatchesTab; 