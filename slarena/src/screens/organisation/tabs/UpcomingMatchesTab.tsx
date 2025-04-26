import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
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
    // Ensure we have all required data
    const tournamentWithToss = {
      ...tournament,
      toss: tournament.toss || null,
      venue: tournament.venue || null
    };
    navigation.navigate('TournamentDetails', { tournament: tournamentWithToss });
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upcoming Tournaments</Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading tournaments...</Text>
          </View>
        ) : (
          <FlatList
            data={tournaments}
            renderItem={renderTournamentItem}
            keyExtractor={item => item?.tournament_id?.toString() || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No upcoming tournaments found</Text>
              </View>
            }
          />
        )}
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('CreateTournament')}
        >
          <Icon name="add" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    padding: 25,
    backgroundColor: '#000080',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000080',
    fontWeight: '500',
  },
  emptyStateContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#000080',
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