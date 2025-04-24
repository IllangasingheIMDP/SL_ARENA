import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Team } from '../../types/tournamentTypes';
import { tournamentService } from '../../services/tournamentService';

type TeamAttendanceFormProps = {
  tournamentId: number;
  teams: Team[];
  onComplete: () => void;
};

type TeamAttendance = {
  teamId: number;
  teamName: string;
  isPresent: boolean;
};

const TeamAttendanceForm: React.FC<TeamAttendanceFormProps> = ({
  tournamentId,
  teams,
  onComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [teamAttendance, setTeamAttendance] = useState<TeamAttendance[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!teams || teams.length === 0) {
      Alert.alert('Error', 'No teams found for this tournament');
      onComplete();
      return;
    }
    
    // Initialize attendance state
    const initialAttendance = teams.map(team => ({
      teamId: team.team_id,
      teamName: team.team_name,
      isPresent: true, // Default to present
    }));
    setTeamAttendance(initialAttendance);
  }, [teams]);

  const toggleAttendance = (teamId: number) => {
    setTeamAttendance(prev => 
      prev.map(team => 
        team.teamId === teamId 
          ? { ...team, isPresent: !team.isPresent } 
          : team
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Update attendance for each team
      for (const team of teamAttendance) {
        await tournamentService.updateTeamAttendance(
          tournamentId,
          team.teamId,
          team.isPresent
        );
      }
      
      // Update tournament status to 'matches'
      await tournamentService.updateTournamentStatus(tournamentId, 'matches');
      
      Alert.alert(
        'Success',
        'Team attendance has been recorded and tournament status updated.',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      console.error('Error submitting attendance:', error);
      Alert.alert('Error', 'Failed to submit attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTeamItem = ({ item }: { item: TeamAttendance }) => (
    <View style={styles.teamItem}>
      <Text style={styles.teamName}>{item.teamName}</Text>
      <TouchableOpacity 
        style={[
          styles.attendanceButton, 
          { backgroundColor: item.isPresent ? '#4CAF50' : '#F44336' }
        ]}
        onPress={() => toggleAttendance(item.teamId)}
      >
        <Text style={styles.attendanceText}>
          {item.isPresent ? 'Present' : 'Absent'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Attendance</Text>
      <Text style={styles.subtitle}>
        Please mark teams that are present for the tournament
      </Text>
      
      <FlatList
        data={teamAttendance}
        renderItem={renderTeamItem}
        keyExtractor={item => item.teamId.toString()}
        style={styles.list}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Attendance</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  attendanceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  attendanceText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    borderRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TeamAttendanceForm; 