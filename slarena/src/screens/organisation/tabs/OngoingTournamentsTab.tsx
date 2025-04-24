import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tournament } from '../../../types/tournamentTypes';
import { tournamentService } from '../../../services/tournamentService';
import TournamentCard from '../../../components/organisation/TournamentCard';
import TeamAttendanceForm from '../../../components/organisation/TeamAttendanceForm';
import TournamentDetails from '../../../components/organisation/TournamentDetails';
import VenueMap from '../../../components/organisation/VenueMap';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OngoingTournamentsTab = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getOngoingTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      Alert.alert('Error', 'Failed to load tournaments. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTournaments();
  };

  const handleStartPress = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setShowAttendanceForm(true);
  };

  const handleViewTeamsPress = (tournament: Tournament) => {
    // Navigate to teams view
    navigation.navigate('TournamentTeams', { tournamentId: tournament.tournament_id });
  };

  const handleDetailsPress = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setShowDetails(true);
  };

  const handleViewMap = (venue: any) => {
    setShowMap(true);
  };

  const handleAttendanceComplete = () => {
    setShowAttendanceForm(false);
    fetchTournaments(); // Refresh to get updated status
  };

  const renderTournamentItem = ({ item }: { item: Tournament }) => (
    <TournamentCard
      tournament={item}
      onStartPress={() => handleStartPress(item)}
      onViewTeamsPress={() => handleViewTeamsPress(item)}
      onDetailsPress={() => handleDetailsPress(item)}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Ongoing Tournaments</Text>
      
      {tournaments.length > 0 ? (
        <FlatList
          data={tournaments}
          renderItem={renderTournamentItem}
          keyExtractor={item => item.tournament_id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Icon name="sports-cricket" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No ongoing tournaments at the moment</Text>
        </View>
      )}

      {/* Attendance Form Modal */}
      <Modal
        visible={showAttendanceForm}
        animationType="slide"
        onRequestClose={() => setShowAttendanceForm(false)}
      >
        {selectedTournament && (
          <TeamAttendanceForm
            tournamentId={selectedTournament.tournament_id}
            teams={selectedTournament.teams}
            onComplete={handleAttendanceComplete}
          />
        )}
      </Modal>

      {/* Tournament Details Modal */}
      <Modal
        visible={showDetails}
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        {selectedTournament && (
          <TournamentDetails
            tournament={selectedTournament}
            onClose={() => setShowDetails(false)}
            onViewMap={handleViewMap}
          />
        )}
      </Modal>

      {/* Venue Map Modal */}
      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        {selectedTournament && (
          <VenueMap
            venue={selectedTournament.venue}
            onClose={() => setShowMap(false)}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
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

export default OngoingTournamentsTab; 