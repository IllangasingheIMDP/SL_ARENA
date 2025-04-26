import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Venue } from '../../types/tournamentTypes';

type UpcomingTournamentProps = {
  tournament_id?: number;
  tournament_name: string;
  start_date: string;
  end_date: string;
  tournament_type: string;
  onViewDetails: () => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const UpcomingTournamentComponent: React.FC<UpcomingTournamentProps> = ({
  tournament_id,
  tournament_name,
  start_date,
  end_date,
  tournament_type,
  onViewDetails,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.tournamentName}>{tournament_name}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Start:</Text>
          <Text style={styles.dateText}>{formatDate(start_date)}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>End:</Text>
          <Text style={styles.dateText}>{formatDate(end_date)}</Text>
        </View>
        <View style={styles.typeContainer}>
          <Text style={styles.typeLabel}>Type:</Text>
          <Text style={styles.typeText}>{tournament_type}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onViewDetails}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  content: {
    marginBottom: 15,
  },
  tournamentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f0f4f8',
    padding: 10,
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
    marginRight: 8,
    minWidth: 60,
  },
  dateText: {
    fontSize: 16,
    color: '#5f6368',
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 10,
    borderRadius: 8,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
    marginRight: 8,
    minWidth: 60,
  },
  typeText: {
    fontSize: 16,
    color: '#5f6368',
    fontStyle: 'italic',
    flex: 1,
  },
  button: {
    backgroundColor: '#000080',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default UpcomingTournamentComponent; 