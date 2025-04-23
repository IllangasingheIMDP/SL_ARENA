import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Dialog, Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Tournament {
  id: string;
  name: string;
  logo: string;
  startDate: string;
  endDate: string;
  format: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  teams: number;
  matches: number;
  prizePool: string;
  description: string;
}

const OrganizerTournamentsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    format: '',
    prizePool: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const fetchTournaments = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockTournaments: Tournament[] = [
          {
            id: '1',
            name: 'Premier League 2024',
            logo: 'https://via.placeholder.com/100',
            startDate: '2024-03-01',
            endDate: '2024-04-30',
            format: 'T20',
            status: 'upcoming',
            teams: 8,
            matches: 32,
            prizePool: 'LKR 1,000,000',
            description: 'Annual premier league tournament featuring top teams',
          },
          {
            id: '2',
            name: 'Super 4 Cup',
            logo: 'https://via.placeholder.com/100',
            startDate: '2024-05-01',
            endDate: '2024-05-15',
            format: 'ODI',
            status: 'upcoming',
            teams: 4,
            matches: 6,
            prizePool: 'LKR 500,000',
            description: 'Four-team tournament with round-robin format',
          },
          {
            id: '3',
            name: 'Champions Trophy',
            logo: 'https://via.placeholder.com/100',
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            format: 'T20',
            status: 'upcoming',
            teams: 12,
            matches: 24,
            prizePool: 'LKR 2,000,000',
            description: 'Prestigious tournament for champion teams',
          },
        ];
        setTournaments(mockTournaments);
        setLoading(false);
      }, 1000);
    };

    fetchTournaments();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.format.trim()) {
      newErrors.format = 'Format is required';
    }

    if (!formData.prizePool.trim()) {
      newErrors.prizePool = 'Prize pool is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // In a real app, this would make an API call to create/update the tournament
      setTimeout(() => {
        const newTournament: Tournament = {
          id: selectedTournament?.id || String(tournaments.length + 1),
          name: formData.name,
          logo: 'https://via.placeholder.com/100',
          startDate: formData.startDate,
          endDate: formData.endDate,
          format: formData.format,
          status: 'upcoming',
          teams: 0,
          matches: 0,
          prizePool: formData.prizePool,
          description: formData.description,
        };

        if (selectedTournament) {
          setTournaments(prev => prev.map(t => (t.id === selectedTournament.id ? newTournament : t)));
        } else {
          setTournaments(prev => [...prev, newTournament]);
        }

        setLoading(false);
        setShowAddDialog(false);
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      format: '',
      prizePool: '',
      description: '',
    });
    setErrors({});
    setSelectedTournament(null);
  };

  const handleEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setFormData({
      name: tournament.name,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      format: tournament.format,
      prizePool: tournament.prizePool,
      description: tournament.description,
    });
    setShowAddDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.primary;
      case 'ongoing':
        return theme.colors.success;
      case 'completed':
        return theme.colors.disabled;
      default:
        return theme.colors.disabled;
    }
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <Card key={tournament.id} style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Image source={{ uri: tournament.logo }} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <Chip
              mode="outlined"
              style={[styles.statusChip, { borderColor: getStatusColor(tournament.status) }]}
              textStyle={{ color: getStatusColor(tournament.status) }}
            >
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </Chip>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.date}>
            {new Date(tournament.startDate).toLocaleDateString()} -{' '}
            {new Date(tournament.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.format}>{tournament.format}</Text>
          <Text style={styles.teams}>Teams: {tournament.teams}</Text>
          <Text style={styles.matches}>Matches: {tournament.matches}</Text>
          <Text style={styles.prizePool}>Prize Pool: {tournament.prizePool}</Text>
          <Text style={styles.description}>{tournament.description}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEdit(tournament)}>Edit</Button>
        <Button onPress={() => navigation.navigate('TournamentDetails', { tournament })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {tournaments.map(renderTournamentCard)}
      </ScrollView>

      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>{selectedTournament ? 'Edit Tournament' : 'Add New Tournament'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tournament Name"
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              style={styles.input}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Start Date"
              value={formData.startDate}
              onChangeText={text => setFormData(prev => ({ ...prev, startDate: text }))}
              style={styles.input}
              error={!!errors.startDate}
            />
            <HelperText type="error" visible={!!errors.startDate}>
              {errors.startDate}
            </HelperText>

            <TextInput
              label="End Date"
              value={formData.endDate}
              onChangeText={text => setFormData(prev => ({ ...prev, endDate: text }))}
              style={styles.input}
              error={!!errors.endDate}
            />
            <HelperText type="error" visible={!!errors.endDate}>
              {errors.endDate}
            </HelperText>

            <TextInput
              label="Format"
              value={formData.format}
              onChangeText={text => setFormData(prev => ({ ...prev, format: text }))}
              style={styles.input}
              error={!!errors.format}
            />
            <HelperText type="error" visible={!!errors.format}>
              {errors.format}
            </HelperText>

            <TextInput
              label="Prize Pool"
              value={formData.prizePool}
              onChangeText={text => setFormData(prev => ({ ...prev, prizePool: text }))}
              style={styles.input}
              error={!!errors.prizePool}
            />
            <HelperText type="error" visible={!!errors.prizePool}>
              {errors.prizePool}
            </HelperText>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onPress={handleSubmit} loading={loading}>
              {selectedTournament ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          resetForm();
          setShowAddDialog(true);
        }}
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
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusChip: {
    marginTop: 4,
  },
  detailsContainer: {
    marginTop: 16,
  },
  date: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  format: {
    fontSize: 14,
    marginTop: 4,
  },
  teams: {
    fontSize: 14,
    marginTop: 4,
  },
  matches: {
    fontSize: 14,
    marginTop: 4,
  },
  prizePool: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
  },
  input: {
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

export default OrganizerTournamentsScreen; 