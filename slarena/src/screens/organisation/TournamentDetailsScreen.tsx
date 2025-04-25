import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type TournamentDetailsRouteProp = RouteProp<RootStackParamList, 'TournamentDetails'>;

const TournamentDetailsScreen = () => {
  const route = useRoute<TournamentDetailsRouteProp>();
  const { tournament } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{tournament.tournament_name}</Text>
        <Text style={styles.subtitle}>Tournament Details</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderText}>Map will be displayed here</Text>
          <Text style={styles.coordinates}>
            Latitude: {tournament.latitude || 'Not available'}
            {'\n'}
            Longitude: {tournament.longitude || 'Not available'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rules</Text>
        <Text style={styles.content}>{tournament.rules || 'No rules specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Venue Capacity</Text>
        <Text style={styles.content}>{tournament.capacity || 'Not specified'} people</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TournamentDetailsScreen; 