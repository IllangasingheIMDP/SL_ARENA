import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Modal, TouchableOpacity, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GoogleMapView from '../../components/maps/GoogleMapView';
import Navbar from '../../components/common/Navbar';
import { tournamentService } from '../../services/tournamentService';

type TournamentDetailsRouteProp = RouteProp<RootStackParamList, 'TournamentDetails'>;

interface AppliedRequest {
  team_id: number;
  team_name: string;
  payment_slip: string;
  created_at: string;
}

const TournamentDetailsScreen = () => {
  const route = useRoute<TournamentDetailsRouteProp>();
  const { tournament } = route.params;
  const [appliedRequests, setAppliedRequests] = useState<AppliedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AppliedRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAppliedRequests();
  }, []);

  const fetchAppliedRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentService.getAppliedRequests(tournament.tournament_id);
      if (response && Array.isArray(response)) {
        setAppliedRequests(response);
      } else {
        setAppliedRequests([]);
      }
    } catch (error) {
      console.error('Error fetching applied requests:', error);
      setError('Failed to fetch applied requests');
      setAppliedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (action: 'accept' | 'reject') => {
    if (!selectedRequest) return;
    console.log("selectedRequest", selectedRequest);
    console.log("tournament.tournament_id", tournament.tournament_id);

    try {
      setActionLoading(true);
      if (action === 'accept') {
        await tournamentService.acceptRequest(tournament.tournament_id, selectedRequest.team_id);
      } else {
        await tournamentService.rejectRequest(tournament.tournament_id, selectedRequest.team_id);
      }
      // Refresh the requests list
      await fetchAppliedRequests();
      setModalVisible(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setError(`Failed to ${action} request`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Navbar showBackButton={true} showNotification={true} />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>{tournament.name}</Text>
          <Text style={styles.subtitle}>Tournament Details</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <GoogleMapView
              placeId={tournament.venue.venue_id.toString()}
              height={200}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          <Text style={styles.content}>{tournament.rules || 'No rules specified'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applied Requests</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f4511e" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : appliedRequests && appliedRequests.length > 0 ? (
            appliedRequests.map((request, index) => (
              <TouchableOpacity
                key={index}
                style={styles.requestRow}
                onPress={() => {
                  setSelectedRequest(request);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.requestText}>Team: {request.team_name}</Text>
                <Text style={styles.requestText}>Applied on: {new Date(request.created_at).toLocaleDateString()}</Text>
                {request.payment_slip && (
                  <Text style={styles.requestText}>Payment Slip: Available</Text>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRequestsText}>No applied requests yet</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedRequest(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Slip</Text>
            {selectedRequest?.payment_slip ? (
              <Image
                source={{ uri: selectedRequest.payment_slip }}
                style={styles.paymentSlipImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.noSlipText}>No payment slip available</Text>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleRequestAction('accept')}
                disabled={actionLoading}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleRequestAction('reject')}
                disabled={actionLoading}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedRequest(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestRow: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  requestText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  noRequestsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  paymentSlipImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  noSlipText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#666',
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TournamentDetailsScreen; 