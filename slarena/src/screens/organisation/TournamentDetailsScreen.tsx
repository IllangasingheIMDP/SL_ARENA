import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GoogleMapView from '../../components/maps/GoogleMapView';
import Navbar from '../../components/common/Navbar';
import { tournamentService } from '../../services/tournamentService';

type TournamentDetailsRouteProp = RouteProp<RootStackParamList, 'TournamentDetails'>;

interface AppliedRequest {
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

  useEffect(() => {
    fetchAppliedRequests();
  }, []);

  const fetchAppliedRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentService.getAppliedRequests(tournament.tournament_id);
      console.log(response);
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
              <View key={index} style={styles.requestRow}>
                <Text style={styles.requestText}>Team: {request.team_name}</Text>
                <Text style={styles.requestText}>Applied on: {new Date(request.created_at).toLocaleDateString()}</Text>
                {request.payment_slip && (
                  <Text style={styles.requestText}>Payment Slip: {request.payment_slip}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noRequestsText}>No applied requests yet</Text>
          )}
        </View>
      </ScrollView>
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
});

export default TournamentDetailsScreen; 