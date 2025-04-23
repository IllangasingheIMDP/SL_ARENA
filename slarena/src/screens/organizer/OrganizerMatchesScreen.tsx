import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Dialog, Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Team {
  id: string;
  name: string;
  logo: string;
}

interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  format: string;
  level: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  team1: Team;
  team2: Team;
  price: number;
  spots: number;
  description: string;
}

const OrganizerMatchesScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    format: '',
    level: '',
    status: 'upcoming',
    team1: '',
    team2: '',
    price: '',
    spots: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const fetchMatches = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockMatches: Match[] = [
          {
            id: '1',
            title: 'Colombo Kings vs Kandy Warriors',
            date: '2024-04-15',
            time: '14:00',
            venue: 'R. Premadasa Stadium',
            format: 'T20',
            level: 'Professional',
            status: 'upcoming',
            team1: {
              id: '1',
              name: 'Colombo Kings',
              logo: 'https://via.placeholder.com/100',
            },
            team2: {
              id: '2',
              name: 'Kandy Warriors',
              logo: 'https://via.placeholder.com/100',
            },
            price: 1000,
            spots: 100,
            description: 'Exciting T20 match between two top teams',
          },
          {
            id: '2',
            title: 'Galle Gladiators vs Jaffna Stallions',
            date: '2024-04-20',
            time: '15:30',
            venue: 'Galle International Stadium',
            format: 'ODI',
            level: 'Professional',
            status: 'upcoming',
            team1: {
              id: '3',
              name: 'Galle Gladiators',
              logo: 'https://via.placeholder.com/100',
            },
            team2: {
              id: '4',
              name: 'Jaffna Stallions',
              logo: 'https://via.placeholder.com/100',
            },
            price: 1500,
            spots: 150,
            description: 'One Day International match with international players',
          },
        ];
        setMatches(mockMatches);
        setLoading(false);
      }, 1000);
    };

    fetchMatches();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.format.trim()) {
      newErrors.format = 'Format is required';
    }

    if (!formData.level.trim()) {
      newErrors.level = 'Level is required';
    }

    if (!formData.team1.trim()) {
      newErrors.team1 = 'Team 1 is required';
    }

    if (!formData.team2.trim()) {
      newErrors.team2 = 'Team 2 is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // In a real app, this would make an API call to create/update the match
      setTimeout(() => {
        const newMatch: Match = {
          id: selectedMatch?.id || String(matches.length + 1),
          title: formData.title,
          date: formData.date,
          time: formData.time,
          venue: formData.venue,
          format: formData.format,
          level: formData.level,
          status: formData.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
          team1: {
            id: String(Math.random()),
            name: formData.team1,
            logo: 'https://via.placeholder.com/100',
          },
          team2: {
            id: String(Math.random()),
            name: formData.team2,
            logo: 'https://via.placeholder.com/100',
          },
          price: Number(formData.price),
          spots: Number(formData.spots),
          description: formData.description,
        };

        if (selectedMatch) {
          setMatches(prev => prev.map(m => (m.id === selectedMatch.id ? newMatch : m)));
        } else {
          setMatches(prev => [...prev, newMatch]);
        }

        setLoading(false);
        setShowAddDialog(false);
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      venue: '',
      format: '',
      level: '',
      status: 'upcoming',
      team1: '',
      team2: '',
      price: '',
      spots: '',
      description: '',
    });
    setErrors({});
    setSelectedMatch(null);
  };

  const handleEdit = (match: Match) => {
    setSelectedMatch(match);
    setFormData({
      title: match.title,
      date: match.date,
      time: match.time,
      venue: match.venue,
      format: match.format,
      level: match.level,
      status: match.status,
      team1: match.team1.name,
      team2: match.team2.name,
      price: String(match.price),
      spots: String(match.spots),
      description: match.description,
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
        return theme.colors.secondary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const renderMatchCard = (match: Match) => (
    <Card key={match.id} style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Text style={styles.matchTitle}>{match.title}</Text>
          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(match.status) }]}
            textStyle={{ color: getStatusColor(match.status) }}
          >
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </Chip>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamContainer}>
            <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{match.team1.name}</Text>
          </View>
          <Text style={styles.vs}>VS</Text>
          <View style={styles.teamContainer}>
            <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{match.team2.name}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>Date: {new Date(match.date).toLocaleDateString()}</Text>
          <Text style={styles.detail}>Time: {match.time}</Text>
          <Text style={styles.detail}>Venue: {match.venue}</Text>
          <Text style={styles.detail}>Format: {match.format}</Text>
          <Text style={styles.detail}>Level: {match.level}</Text>
          <Text style={styles.detail}>Price: LKR {match.price}</Text>
          <Text style={styles.detail}>Available Spots: {match.spots}</Text>
          <Text style={styles.description}>{match.description}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEdit(match)}>Edit</Button>
        <Button onPress={() => navigation.navigate('MatchDetails', { match })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {matches.map(renderMatchCard)}
      </ScrollView>

      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>{selectedMatch ? 'Edit Match' : 'Add New Match'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Match Title"
              value={formData.title}
              onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
              style={styles.input}
              error={!!errors.title}
            />
            <HelperText type="error" visible={!!errors.title}>
              {errors.title}
            </HelperText>

            <TextInput
              label="Date (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={text => setFormData(prev => ({ ...prev, date: text }))}
              style={styles.input}
              error={!!errors.date}
            />
            <HelperText type="error" visible={!!errors.date}>
              {errors.date}
            </HelperText>

            <TextInput
              label="Time (HH:MM)"
              value={formData.time}
              onChangeText={text => setFormData(prev => ({ ...prev, time: text }))}
              style={styles.input}
              error={!!errors.time}
            />
            <HelperText type="error" visible={!!errors.time}>
              {errors.time}
            </HelperText>

            <TextInput
              label="Venue"
              value={formData.venue}
              onChangeText={text => setFormData(prev => ({ ...prev, venue: text }))}
              style={styles.input}
              error={!!errors.venue}
            />
            <HelperText type="error" visible={!!errors.venue}>
              {errors.venue}
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
              label="Level"
              value={formData.level}
              onChangeText={text => setFormData(prev => ({ ...prev, level: text }))}
              style={styles.input}
              error={!!errors.level}
            />
            <HelperText type="error" visible={!!errors.level}>
              {errors.level}
            </HelperText>

            <TextInput
              label="Team 1"
              value={formData.team1}
              onChangeText={text => setFormData(prev => ({ ...prev, team1: text }))}
              style={styles.input}
              error={!!errors.team1}
            />
            <HelperText type="error" visible={!!errors.team1}>
              {errors.team1}
            </HelperText>

            <TextInput
              label="Team 2"
              value={formData.team2}
              onChangeText={text => setFormData(prev => ({ ...prev, team2: text }))}
              style={styles.input}
              error={!!errors.team2}
            />
            <HelperText type="error" visible={!!errors.team2}>
              {errors.team2}
            </HelperText>

            <TextInput
              label="Price (LKR)"
              value={formData.price}
              onChangeText={text => setFormData(prev => ({ ...prev, price: text }))}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Available Spots"
              value={formData.spots}
              onChangeText={text => setFormData(prev => ({ ...prev, spots: text }))}
              keyboardType="numeric"
              style={styles.input}
            />

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
              {selectedMatch ? 'Update' : 'Add'}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  detailsContainer: {
    marginTop: 16,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    marginTop: 8,
    fontStyle: 'italic',
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

export default OrganizerMatchesScreen; 