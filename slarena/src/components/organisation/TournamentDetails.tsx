import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Tournament, Venue } from '../../types/tournamentTypes';

type TournamentDetailsProps = {
  tournament: Tournament;
  onClose: () => void;
  onViewMap?: (venue: Venue) => void;
};

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  tournament,
  onClose,
  onViewMap,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'start':
        return 'Registration';
      case 'matches':
        return 'In Progress';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tournament Details</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{tournament.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{tournament.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{getStatusText(tournament.status)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{formatDate(tournament.start_date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{formatDate(tournament.end_date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Organiser:</Text>
            <Text style={styles.value}>{tournament.organiser.name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{tournament.venue.venue_name}</Text>
          </View>
          {tournament.venue.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{tournament.venue.address}</Text>
            </View>
          )}
          {tournament.venue.city && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>City:</Text>
              <Text style={styles.value}>{tournament.venue.city}</Text>
            </View>
          )}
          {tournament.venue.state && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>State:</Text>
              <Text style={styles.value}>{tournament.venue.state}</Text>
            </View>
          )}
          {tournament.venue.country && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Country:</Text>
              <Text style={styles.value}>{tournament.venue.country}</Text>
            </View>
          )}
          {tournament.venue.capacity && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Capacity:</Text>
              <Text style={styles.value}>{tournament.venue.capacity}</Text>
            </View>
          )}
          
          {onViewMap && tournament.venue.latitude && tournament.venue.longitude && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => onViewMap(tournament.venue)}
            >
              <Icon name="map" size={20} color="#fff" />
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          <Text style={styles.rulesText}>{tournament.rules}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teams ({tournament.teams.length})</Text>
          {tournament.teams.map((team) => (
            <View key={team.team_id} style={styles.teamItem}>
              <Text style={styles.teamName}>{team.team_name}</Text>
              {team.captain_id && (
                <Text style={styles.captainText}>Captain ID: {team.captain_id}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 100,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  rulesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  teamItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  captainText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4511e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 12,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TournamentDetails; 