import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider, Chip, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'match' | 'training' | 'meeting' | 'other';
  date: string;
  time: string;
  location: string;
  description: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  participants?: string[];
  team?: string;
  coach?: string;
}

const PlayerScheduleScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'match' | 'training' | 'meeting' | 'other'>('all');
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch schedule data from an API
    // For now, we'll use mock data
    const fetchSchedule = () => {
      // Simulate API call
      setTimeout(() => {
        const mockSchedule: ScheduleEvent[] = [
          {
            id: '1',
            title: 'T20 Match vs Colombo Kings',
            type: 'match',
            date: '2024-04-25',
            time: '14:00',
            location: 'R. Premadasa Stadium, Colombo',
            description: 'Premier League T20 match against Colombo Kings',
            status: 'upcoming',
            team: 'Kandy Warriors',
          },
          {
            id: '2',
            title: 'Batting Practice',
            type: 'training',
            date: '2024-04-23',
            time: '09:00',
            location: 'Kandy Cricket Ground',
            description: 'Focus on power hitting and running between wickets',
            status: 'upcoming',
            coach: 'John Smith',
          },
          {
            id: '3',
            title: 'Team Meeting',
            type: 'meeting',
            date: '2024-04-22',
            time: '18:00',
            location: 'Team Headquarters',
            description: 'Strategy meeting for upcoming matches',
            status: 'upcoming',
            participants: ['Team Captain', 'Coach', 'All Players'],
          },
          {
            id: '4',
            title: 'Fitness Training',
            type: 'training',
            date: '2024-04-20',
            time: '07:00',
            location: 'Fitness Center',
            description: 'Strength and conditioning session',
            status: 'completed',
            coach: 'Mike Johnson',
          },
          {
            id: '5',
            title: 'ODI Match vs Galle Gladiators',
            type: 'match',
            date: '2024-04-18',
            time: '10:00',
            location: 'Galle International Stadium',
            description: 'Premier League ODI match against Galle Gladiators',
            status: 'completed',
            team: 'Kandy Warriors',
          },
          {
            id: '6',
            title: 'Bowling Practice',
            type: 'training',
            date: '2024-04-17',
            time: '15:00',
            location: 'Kandy Cricket Ground',
            description: 'Focus on yorkers and slower balls',
            status: 'completed',
            coach: 'David Wilson',
          },
          {
            id: '7',
            title: 'Media Interview',
            type: 'other',
            date: '2024-04-16',
            time: '11:00',
            location: 'Press Room, Kandy Cricket Ground',
            description: 'Pre-match press conference',
            status: 'completed',
          },
        ];
        setSchedule(mockSchedule);
        setLoading(false);
      }, 1000);
    };

    fetchSchedule();
  }, []);

  const getEventTypeColor = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'match':
        return theme.colors.primary;
      case 'training':
        return theme.colors.secondary;
      case 'meeting':
        return theme.colors.warning;
      case 'other':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

  const getEventTypeIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'match':
        return 'cricket';
      case 'training':
        return 'dumbbell';
      case 'meeting':
        return 'account-group';
      case 'other':
        return 'calendar';
      default:
        return 'calendar';
    }
  };

  const getStatusColor = (status: ScheduleEvent['status']) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.success;
      case 'completed':
        return theme.colors.secondary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderScheduleItem = (event: ScheduleEvent) => {
    return (
      <Card key={event.id} style={styles.card}>
        <Card.Content>
          <View style={styles.eventHeader}>
            <View style={styles.eventTypeContainer}>
              <Avatar.Icon
                size={40}
                icon={getEventTypeIcon(event.type)}
                style={{ backgroundColor: getEventTypeColor(event.type) }}
              />
              <View style={styles.eventTitleContainer}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Chip
                  mode="outlined"
                  style={[styles.statusChip, { borderColor: getStatusColor(event.status) }]}
                >
                  {event.status.toUpperCase()}
                </Chip>
              </View>
            </View>
          </View>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{event.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{event.location}</Text>
            </View>
            {event.team && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Team:</Text>
                <Text style={styles.detailValue}>{event.team}</Text>
              </View>
            )}
            {event.coach && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Coach:</Text>
                <Text style={styles.detailValue}>{event.coach}</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{event.description}</Text>

          {event.participants && (
            <View style={styles.participantsContainer}>
              <Text style={styles.participantsTitle}>Participants:</Text>
              <View style={styles.participantsList}>
                {event.participants.map((participant, index) => (
                  <Chip key={index} style={styles.participantChip}>
                    {participant}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
        <Card.Actions>
          {event.status === 'upcoming' && (
            <>
              <Button
                mode="text"
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              >
                View Details
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.navigate('EditEvent', { eventId: event.id })}
              >
                Edit
              </Button>
            </>
          )}
          {event.status === 'completed' && (
            <Button
              mode="text"
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              View Details
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  const renderSchedule = () => {
    const filteredEvents = schedule.filter(event => {
      const statusMatch = activeTab === 'upcoming' ? event.status === 'upcoming' : event.status === 'completed';
      const typeMatch = selectedFilter === 'all' || event.type === selectedFilter;
      return statusMatch && typeMatch;
    });

    if (filteredEvents.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No {activeTab} {selectedFilter !== 'all' ? selectedFilter : ''} events found
          </Text>
        </View>
      );
    }

    return (
      <View>
        {filteredEvents.map(event => renderScheduleItem(event))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'upcoming' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('upcoming')}
            style={styles.tabButton}
          >
            Upcoming
          </Button>
          <Button
            mode={activeTab === 'completed' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('completed')}
            style={styles.tabButton}
          >
            Completed
          </Button>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={selectedFilter === 'match'}
            onPress={() => setSelectedFilter('match')}
            style={styles.filterChip}
          >
            Matches
          </Chip>
          <Chip
            selected={selectedFilter === 'training'}
            onPress={() => setSelectedFilter('training')}
            style={styles.filterChip}
          >
            Training
          </Chip>
          <Chip
            selected={selectedFilter === 'meeting'}
            onPress={() => setSelectedFilter('meeting')}
            style={styles.filterChip}
          >
            Meetings
          </Chip>
          <Chip
            selected={selectedFilter === 'other'}
            onPress={() => setSelectedFilter('other')}
            style={styles.filterChip}
          >
            Other
          </Chip>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {renderSchedule()}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEvent')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.primary,
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
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: theme.colors.secondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  participantsContainer: {
    marginTop: 8,
  },
  participantsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participantChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerScheduleScreen; 