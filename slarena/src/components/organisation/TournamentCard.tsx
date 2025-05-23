import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Tournament, TournamentStatus } from '../../types/tournamentTypes';

type TournamentCardProps = {
  tournament: Tournament;
  onStartPress?: () => void;
  onDrawPress?: () => void;
  onViewTeamsPress?: () => void;
  onDetailsPress?: () => void;
  showFullDetails?: boolean;
};

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onStartPress,
  onDrawPress,
  onViewTeamsPress,
  onDetailsPress,
  showFullDetails = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: TournamentStatus) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50'; // Green
      case 'start':
        return '#FF9800'; // Orange
      case 'matches':
        return '#2196F3'; // Blue
      case 'finished':
        return '#9E9E9E'; // Grey
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: TournamentStatus) => {
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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tournament.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.status) }]}>
            <Text style={styles.statusText}>{getStatusText(tournament.status)}</Text>
          </View>
        </View>
        <Text style={styles.type}>{tournament.type}</Text>
      </View>

      <View style={styles.venueContainer}>
        <Icon name="location-on" size={16} color="#666" />
        <Text style={styles.venue}>{tournament.venue.venue_name}</Text>
      </View>

      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start:</Text>
          <Text style={styles.dateValue}>{formatDate(tournament.start_date)}</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End:</Text>
          <Text style={styles.dateValue}>{formatDate(tournament.end_date)}</Text>
        </View>
      </View>

      {showFullDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Tournament Details</Text>
          <Text style={styles.detailsText}>{tournament.rules}</Text>
          
          <Text style={styles.teamsTitle}>Teams ({tournament.teams.length})</Text>
          {tournament.teams.map((team) => (
            <View key={team.team_id} style={styles.teamItem}>
              <Text style={styles.teamName}>{team.team_name}</Text>
            </View>
          ))}
        </View>
      )}

      {!showFullDetails && (
        <View style={styles.buttonContainer}>
          {tournament.status === 'start' && (
            <TouchableOpacity style={styles.button} onPress={onStartPress}>
              <Icon name="play-arrow" size={20} color="#fff" />
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          
          {tournament.status === 'matches' && (
            <TouchableOpacity style={styles.button} onPress={onDrawPress}>
              <Icon name="format-list-bulleted" size={20} color="#fff" />
              <Text style={styles.buttonText}>View Draw</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.button} onPress={onViewTeamsPress}>
            <Icon name="group" size={20} color="#fff" />
            <Text style={styles.buttonText}>View Teams</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={onDetailsPress}>
            <Icon name="info" size={20} color="#fff" />
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000080',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000080',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#000080',
  },
  statusText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 14,
    color: '#000080',
    fontStyle: 'italic',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f0f4f8',
    padding: 8,
    borderRadius: 4,
  },
  venue: {
    fontSize: 14,
    color: '#000080',
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#000080',
    marginRight: 4,
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000080',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    width: '100%',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  buttonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#000080',
    paddingTop: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000080',
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  teamsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000080',
  },
  teamItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  teamName: {
    fontSize: 14,
    color: '#000080',
  },
});

export default TournamentCard; 