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
        <Text style={styles.dateText}>Start: {new Date(start_date).toLocaleDateString()}</Text>
        <Text style={styles.dateText}>End: {new Date(end_date).toLocaleDateString()}</Text>
        <Text style={styles.typeText}>Type: {tournament_type}</Text>
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
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    marginBottom: 12,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UpcomingTournamentComponent; 