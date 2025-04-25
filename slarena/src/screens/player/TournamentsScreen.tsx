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
} from 'react-native';
import { tournamentService } from '../../services/tournamentService';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { Tournament } from '../../types/tournamentTypes';
import { useAuth } from '../../context/AuthContext';

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
    try {
      const tournaments = await tournamentService.getTeamTournaments(selectedTeam.team_id);
      setTeamTournaments(tournaments);
    } catch (error) {
      console.error('Error fetching team tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTournament = async (tournamentId: number) => {
    if (!selectedTeam) return;
    try {
      await tournamentService.applyForTournament(selectedTeam.team_id, tournamentId);
      Alert.alert('Success', 'Application submitted successfully');
      fetchTeamTournaments(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to apply for tournament');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <Text style={styles.tournamentName}>{tournament.name}</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Start: {formatDate(tournament.start_date)}</Text>
        <Text style={styles.dateText}>End: {formatDate(tournament.end_date)}</Text>
      </View>
      {showApplyButton && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApplyTournament(tournament.tournament_id)}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
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
                <Text style={styles.modalTitle}>{selectedTournament.name}</Text>
                <Text style={styles.modalText}>
                  Organization: {selectedTournament.organiser.name}
                </Text>
                <Text style={styles.modalText}>
                  Type: {selectedTournament.type}
                </Text>
                <Text style={styles.modalText}>
                  Rules: {selectedTournament.rules}
                </Text>
                {selectedTournament.venue && (
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
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
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
    backgroundColor: '#2196F3',
  },
  tabText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  teamSelector: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  teamSelectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  teamButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  selectedTeamButton: {
    backgroundColor: '#2196F3',
  },
  teamButtonText: {
    color: '#2196F3',
  },
  selectedTeamButtonText: {
    color: '#fff',
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
    color: '#2196F3',
  },
  tournamentCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
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
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  mapContainer: {
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TournamentsScreen; 