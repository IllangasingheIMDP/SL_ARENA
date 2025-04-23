import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ProgressBar, List, Divider, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface TrainingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'batting' | 'bowling' | 'fielding' | 'fitness';
  status: 'scheduled' | 'completed' | 'cancelled';
  coach?: string;
  location: string;
  notes?: string;
}

interface TrainingProgress {
  batting: number;
  bowling: number;
  fielding: number;
  fitness: number;
  overall: number;
}

const PlayerTrainingScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const trainingProgress: TrainingProgress = {
    batting: 0.75,
    bowling: 0.60,
    fielding: 0.85,
    fitness: 0.70,
    overall: 0.73,
  };

  const upcomingSessions: TrainingSession[] = [
    {
      id: '1',
      title: 'Batting Technique Workshop',
      date: '2024-04-15',
      time: '14:00',
      duration: '2 hours',
      type: 'batting',
      status: 'scheduled',
      coach: 'Coach Smith',
      location: 'National Cricket Academy',
    },
    {
      id: '2',
      title: 'Bowling Speed Training',
      date: '2024-04-17',
      time: '10:00',
      duration: '1.5 hours',
      type: 'bowling',
      status: 'scheduled',
      coach: 'Coach Johnson',
      location: 'Premier Cricket Ground',
    },
    {
      id: '3',
      title: 'Fielding Drills',
      date: '2024-04-19',
      time: '16:00',
      duration: '1 hour',
      type: 'fielding',
      status: 'scheduled',
      location: 'Community Sports Center',
    },
  ];

  const completedSessions: TrainingSession[] = [
    {
      id: '4',
      title: 'Fitness Assessment',
      date: '2024-04-10',
      time: '09:00',
      duration: '1 hour',
      type: 'fitness',
      status: 'completed',
      coach: 'Coach Williams',
      location: 'Sports Science Lab',
      notes: 'Improved endurance by 15% from last assessment',
    },
    {
      id: '5',
      title: 'Batting Practice',
      date: '2024-04-08',
      time: '15:00',
      duration: '2 hours',
      type: 'batting',
      status: 'completed',
      coach: 'Coach Smith',
      location: 'National Cricket Academy',
      notes: 'Focused on playing straight drives and cover drives',
    },
  ];

  const renderProgressCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>Training Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Batting</Text>
            <ProgressBar progress={trainingProgress.batting} color={theme.colors.primary} style={styles.progressBar} />
            <Text style={styles.progressValue}>{Math.round(trainingProgress.batting * 100)}%</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Bowling</Text>
            <ProgressBar progress={trainingProgress.bowling} color={theme.colors.primary} style={styles.progressBar} />
            <Text style={styles.progressValue}>{Math.round(trainingProgress.bowling * 100)}%</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Fielding</Text>
            <ProgressBar progress={trainingProgress.fielding} color={theme.colors.primary} style={styles.progressBar} />
            <Text style={styles.progressValue}>{Math.round(trainingProgress.fielding * 100)}%</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Fitness</Text>
            <ProgressBar progress={trainingProgress.fitness} color={theme.colors.primary} style={styles.progressBar} />
            <Text style={styles.progressValue}>{Math.round(trainingProgress.fitness * 100)}%</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.overallProgress}>
          <Text style={styles.overallLabel}>Overall Progress</Text>
          <ProgressBar progress={trainingProgress.overall} color={theme.colors.primary} style={styles.overallProgressBar} />
          <Text style={styles.overallValue}>{Math.round(trainingProgress.overall * 100)}%</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTrainingSession = (session: TrainingSession) => (
    <Card style={styles.card} key={session.id}>
      <Card.Content>
        <Text style={styles.sessionTitle}>{session.title}</Text>
        <List.Item
          title="Date & Time"
          description={`${session.date} at ${session.time} (${session.duration})`}
          left={props => <List.Icon {...props} icon="calendar" />}
        />
        <List.Item
          title="Type"
          description={session.type.charAt(0).toUpperCase() + session.type.slice(1)}
          left={props => <List.Icon {...props} icon={getTypeIcon(session.type)} />}
        />
        <List.Item
          title="Location"
          description={session.location}
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
        {session.coach && (
          <List.Item
            title="Coach"
            description={session.coach}
            left={props => <List.Icon {...props} icon="account" />}
          />
        )}
        {session.notes && (
          <List.Item
            title="Notes"
            description={session.notes}
            left={props => <List.Icon {...props} icon="note-text" />}
          />
        )}
      </Card.Content>
      <Card.Actions>
        {session.status === 'scheduled' && (
          <>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('TrainingDetails', { sessionId: session.id })}
            >
              View Details
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => handleCancelSession(session.id)}
              color={theme.colors.error}
            >
              Cancel
            </Button>
          </>
        )}
        {session.status === 'completed' && (
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('TrainingDetails', { sessionId: session.id })}
          >
            View Summary
          </Button>
        )}
      </Card.Actions>
    </Card>
  );

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'batting':
        return 'cricket';
      case 'bowling':
        return 'bow-arrow';
      case 'fielding':
        return 'hand-front';
      case 'fitness':
        return 'dumbbell';
      default:
        return 'help-circle';
    }
  };

  const handleCancelSession = (sessionId: string) => {
    // TODO: Implement cancel session logic
    console.log(`Cancelling session ${sessionId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Training</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} 
              onPress={() => setActiveTab('upcoming')}
            >
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                Upcoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'completed' && styles.activeTab]} 
              onPress={() => setActiveTab('completed')}
            >
              <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderProgressCard()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'upcoming' ? 'Upcoming Sessions' : 'Completed Sessions'}
          </Text>
          {activeTab === 'upcoming' 
            ? upcomingSessions.map(renderTrainingSession)
            : completedSessions.map(renderTrainingSession)
          }
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('ScheduleTraining')}
        color={theme.colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  activeTabText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  overallProgress: {
    marginTop: 8,
  },
  overallLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overallProgressBar: {
    height: 10,
    borderRadius: 5,
  },
  overallValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 4,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerTrainingScreen; 