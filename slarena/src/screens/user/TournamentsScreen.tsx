import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { tournamentService } from '../../services/tournamentService';
import { Tournament } from '../../types/tournamentTypes';
import GoogleMapView from '../../components/maps/GoogleMapView';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TournamentsScreen = () => {
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUpcomingTournaments();
  }, []);

  const fetchUpcomingTournaments = async () => {
    try {
      const tournaments = await tournamentService.getUpcomingTournamentsForPlayer();
      setUpcomingTournaments(tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const handleTournamentPress = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setModalVisible(true);
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <TouchableOpacity
      key={tournament.tournament_id}
      style={styles.tournamentCard}
      onPress={() => handleTournamentPress(tournament)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Icon name="emoji-events" size={24} color="#4CAF50" style={styles.sectionIcon} />
          <Text style={styles.tournamentName}>{tournament.name}</Text>
        </View>
        <View style={styles.tournamentTypeContainer}>
          <Text style={styles.tournamentType}>{tournament.type}</Text>
        </View>
      </View>
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateText}>{formatDate(tournament.start_date)}</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateText}>{formatDate(tournament.end_date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tournaments</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {upcomingTournaments.length === 0 ? (
            <Text style={styles.noTournamentsText}>No upcoming tournaments</Text>
          ) : (
            upcomingTournaments.map((tournament) => renderTournamentCard(tournament))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTournament && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedTournament.name}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Organization</Text>
                  <Text style={styles.modalText}>{selectedTournament.organiser.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Tournament Type</Text>
                  <Text style={styles.modalText}>{selectedTournament.type}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Rules</Text>
                  <Text style={styles.modalText}>{selectedTournament.rules}</Text>
                </View>
                {selectedTournament.venue && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Venue Location</Text>
                    <View style={styles.mapContainer}>
                      <GoogleMapView
                        placeId={selectedTournament.venue.venue_id.toString()}
                        showUserLocation={true}
                        showSearch={false}
                        showDirections={true}
                        height={200}
                        width={300}
                      />
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#1a2151',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: 20,
  },
  tournamentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2151',
  },
  tournamentTypeContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tournamentType: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#1a2151',
    fontWeight: '500',
  },
  noTournamentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a2151',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  mapContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default TournamentsScreen; 