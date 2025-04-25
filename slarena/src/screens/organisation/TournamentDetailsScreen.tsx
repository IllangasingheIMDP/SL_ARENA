import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GoogleMapView from '../../components/maps/GoogleMapView';

type TournamentDetailsRouteProp = RouteProp<RootStackParamList, 'TournamentDetails'>;

const TournamentDetailsScreen = () => {
  const route = useRoute<TournamentDetailsRouteProp>();
  const { tournament } = route.params;

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text>Tournament data not available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.subtitle}>{tournament.type}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tournament Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(tournament.start_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>End Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(tournament.end_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{tournament.status}</Text>
        </View>
      </View>

      {tournament.venue && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue</Text>
          <Text style={styles.venueName}>{tournament.venue.venue_name}</Text>
          <Text style={styles.venueAddress}>{tournament.venue.address}</Text>
          <View style={styles.mapContainer}>
            <GoogleMapView
              placeId={tournament.venue.venue_id.toString()}
              height={300}
              showUserLocation
              showDirections
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rules</Text>
        <Text style={styles.content}>{tournament.rules || 'No rules specified'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#444',
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  mapContainer: {
    height: 300,
    marginTop: 16,
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default TournamentDetailsScreen; 