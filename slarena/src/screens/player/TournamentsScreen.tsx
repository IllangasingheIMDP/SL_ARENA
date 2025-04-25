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
  Alert,
  Image,
} from 'react-native';
import { tournamentService } from '../../services/tournamentService';
import { playerService } from '../../services/playerService';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { Tournament } from '../../types/tournamentTypes';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

type TournamentTab = 'all' | 'team';
type TeamTournamentStatus = 'registered' | 'applied' | 'notApplied';

interface Team {
  team_id: number;
  team_name: string;
}

const TournamentsScreen = () => {
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamTournamentsLoading, setTeamTournamentsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TournamentTab>('all');
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamCaptain, setIsTeamCaptain] = useState(false);
  const [teamTournaments, setTeamTournaments] = useState<{
    registered: Tournament[];
    applied: Tournament[];
    notApplied: Tournament[];
  }>({
    registered: [],
    applied: [],
    notApplied: []
  });
  const [selectedTournamentForApplication, setSelectedTournamentForApplication] = useState<Tournament | null>(null);
  const [paymentPhoto, setPaymentPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchUpcomingTournaments();
    } else {
      fetchTeams();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTeam) {
      checkTeamCaptain();
      fetchTeamTournaments();
    }
  }, [selectedTeam]);

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

  const fetchTeams = async () => {
    try {
      const teams = await tournamentService.getPlayerTeams();
      setTeams(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const checkTeamCaptain = async () => {
    if (!selectedTeam) return;
    try {
      const isCaptain = await tournamentService.isTeamCaptain(selectedTeam.team_id);
      setIsTeamCaptain(isCaptain);
    } catch (error) {
      console.error('Error checking team captain status:', error);
    }
  };

  const fetchTeamTournaments = async () => {
    if (!selectedTeam) return;
    setTeamTournamentsLoading(true);
    try {
      const tournaments = await tournamentService.getTeamTournaments(selectedTeam.team_id);
      setTeamTournaments(tournaments);
    } catch (error) {
      console.error('Error fetching team tournaments:', error);
    } finally {
      setTeamTournamentsLoading(false);
      setLoading(false);
    }
  };

  const handleApplyTournament = async (tournamentId: number, organizerId: number, tournamentName: string) => {
    if (!selectedTeam || !paymentPhoto) {
      Alert.alert('Error', 'Please select a team and upload payment slip');
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for the photo
      const formData = new FormData();
      formData.append('photo', {
        uri: paymentPhoto,
        type: 'image/jpeg',
        name: 'payment_slip.jpg'
      } as any);

      // Apply for tournament with payment photo
      await tournamentService.applyForTournament(
        selectedTeam.team_id,
        tournamentId,
        organizerId,
        tournamentName,
        selectedTeam.team_name,
        formData
      );

      Alert.alert('Success', 'Application submitted successfully');
      setPaymentPhoto(null);
      setSelectedTournamentForApplication(null);
      fetchTeamTournaments(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to apply for tournament');
    } finally {
      setIsUploading(false);
    }
  };

  const pickPaymentPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPaymentPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
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

  const renderTournamentCard = (tournament: Tournament, showApplyButton = false) => (
    <TouchableOpacity
      key={tournament.tournament_id}
      style={styles.tournamentCard}
      onPress={() => handleTournamentPress(tournament)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.tournamentName}>{tournament.name}</Text>
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
      {showApplyButton && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            setSelectedTournamentForApplication(tournament);
            pickPaymentPhoto();
          }}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tournaments</Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Tournaments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'team' && styles.activeTab]}
            onPress={() => setActiveTab('team')}
          >
            <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
              Team Tournaments
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'team' && (
        <View style={styles.teamSelector}>
          <Text style={styles.teamSelectorLabel}>Select Team:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.team_id}
                style={[
                  styles.teamButton,
                  selectedTeam?.team_id === team.team_id && styles.selectedTeamButton,
                ]}
                onPress={() => setSelectedTeam(team)}
              >
                <Text
                  style={[
                    styles.teamButtonText,
                    selectedTeam?.team_id === team.team_id && styles.selectedTeamButtonText,
                  ]}
                >
                  {team.team_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.container}>
        {activeTab === 'all' ? (
          <View style={styles.content}>
            {upcomingTournaments.length === 0 ? (
              <Text style={styles.noTournamentsText}>No upcoming tournaments</Text>
            ) : (
              upcomingTournaments.map((tournament) => renderTournamentCard(tournament))
            )}
          </View>
        ) : (
          <View style={styles.content}>
            {!selectedTeam ? (
              <Text style={styles.noTournamentsText}>Please select a team</Text>
            ) : teamTournamentsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading team tournaments...</Text>
              </View>
            ) : (
              <>
                {teamTournaments.registered.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Registered Tournaments</Text>
                    {teamTournaments.registered.map((tournament) =>
                      renderTournamentCard(tournament)
                    )}
                  </View>
                )}
                {teamTournaments.applied.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Applied Tournaments</Text>
                    {teamTournaments.applied.map((tournament) =>
                      renderTournamentCard(tournament)
                    )}
                  </View>
                )}
                {teamTournaments.notApplied.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Tournaments</Text>
                    {teamTournaments.notApplied.map((tournament) =>
                      renderTournamentCard(tournament, isTeamCaptain)
                    )}
                  </View>
                )}
                {teamTournaments.registered.length === 0 &&
                  teamTournaments.applied.length === 0 &&
                  teamTournaments.notApplied.length === 0 && (
                    <Text style={styles.noTournamentsText}>
                      No tournaments available for this team
                    </Text>
                  )}
              </>
            )}
          </View>
        )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedTournamentForApplication}
        onRequestClose={() => setSelectedTournamentForApplication(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Payment Slip</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setSelectedTournamentForApplication(null);
                  setPaymentPhoto(null);
                }}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            {paymentPhoto ? (
              <>
                <Image
                  source={{ uri: paymentPhoto }}
                  style={styles.paymentPhoto}
                  resizeMode="contain"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.retakeButton]}
                    onPress={pickPaymentPhoto}
                  >
                    <Text style={styles.modalButtonText}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={() => {
                      if (selectedTournamentForApplication) {
                        handleApplyTournament(
                          selectedTournamentForApplication.tournament_id,
                          selectedTournamentForApplication.organiser.organiser_id,
                          selectedTournamentForApplication.name
                        );
                      }
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalButtonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickPaymentPhoto}
              >
                <Text style={styles.uploadButtonText}>Select Payment Slip</Text>
              </TouchableOpacity>
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
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#000080',
  },
  tabText: {
    color: '#000080',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFD700',
  },
  teamSelector: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  teamSelectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#000080',
  },
  teamButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000080',
  },
  selectedTeamButton: {
    backgroundColor: '#000080',
  },
  teamButtonText: {
    color: '#000080',
  },
  selectedTeamButtonText: {
    color: '#FFD700',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000080',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    paddingBottom: 8,
  },
  tournamentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#000080',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000080',
    flex: 1,
  },
  tournamentTypeContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tournamentType: {
    fontSize: 12,
    color: '#000080',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
    color: '#333',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000080',
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
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
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
  applyButton: {
    backgroundColor: '#000080',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-end',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  applyButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentPhoto: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retakeButton: {
    backgroundColor: '#666',
  },
  submitButton: {
    backgroundColor: '#000080',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#000080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TournamentsScreen; 