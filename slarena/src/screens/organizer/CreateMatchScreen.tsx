import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Card, Chip, FAB, HelperText, Portal, Dialog } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Team {
  id: string;
  name: string;
  logo: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  image: string;
  availability: 'available' | 'booked' | 'maintenance';
}

const CreateMatchScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    time: new Date(),
    format: '',
    level: '',
    maxPlayers: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const fetchData = () => {
      // Simulate API call
      setTimeout(() => {
        const mockTeams: Team[] = [
          {
            id: '1',
            name: 'Colombo Kings',
            logo: 'https://via.placeholder.com/100',
          },
          {
            id: '2',
            name: 'Kandy Warriors',
            logo: 'https://via.placeholder.com/100',
          },
          {
            id: '3',
            name: 'Galle Gladiators',
            logo: 'https://via.placeholder.com/100',
          },
          {
            id: '4',
            name: 'Jaffna Stallions',
            logo: 'https://via.placeholder.com/100',
          },
        ];

        const mockVenues: Venue[] = [
          {
            id: '1',
            name: 'R. Premadasa Stadium',
            location: 'Colombo',
            capacity: 35000,
            image: 'https://via.placeholder.com/300',
            availability: 'available',
          },
          {
            id: '2',
            name: 'SSC Ground',
            location: 'Colombo',
            capacity: 10000,
            image: 'https://via.placeholder.com/300',
            availability: 'available',
          },
          {
            id: '3',
            name: 'P Sara Oval',
            location: 'Colombo',
            capacity: 6000,
            image: 'https://via.placeholder.com/300',
            availability: 'available',
          },
        ];

        setTeams(mockTeams);
        setVenues(mockVenues);
      }, 1000);
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (selectedTeams.length !== 2) {
      newErrors.teams = 'Please select exactly 2 teams';
    }

    if (!selectedVenue) {
      newErrors.venue = 'Please select a venue';
    }

    if (!formData.format.trim()) {
      newErrors.format = 'Format is required';
    }

    if (!formData.level.trim()) {
      newErrors.level = 'Level is required';
    }

    if (!formData.maxPlayers.trim()) {
      newErrors.maxPlayers = 'Maximum players is required';
    } else if (isNaN(Number(formData.maxPlayers)) || Number(formData.maxPlayers) < 2) {
      newErrors.maxPlayers = 'Please enter a valid number of players';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // In a real app, this would make an API call to create the match
      setTimeout(() => {
        setLoading(false);
        navigation.goBack();
      }, 1500);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, time: selectedTime }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Title title="Match Details" />
          <Card.Content>
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

            <View style={styles.dateTimeContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
              >
                {formatDate(formData.date)}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
              >
                {formatTime(formData.time)}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={formData.time}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <Text style={styles.sectionTitle}>Select Teams</Text>
            <View style={styles.teamsContainer}>
              {teams.map(team => (
                <Chip
                  key={team.id}
                  selected={selectedTeams.includes(team.id)}
                  onPress={() => {
                    if (selectedTeams.includes(team.id)) {
                      setSelectedTeams(prev => prev.filter(id => id !== team.id));
                    } else if (selectedTeams.length < 2) {
                      setSelectedTeams(prev => [...prev, team.id]);
                    }
                  }}
                  style={styles.teamChip}
                >
                  <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                  {team.name}
                </Chip>
              ))}
            </View>
            <HelperText type="error" visible={!!errors.teams}>
              {errors.teams}
            </HelperText>

            <Text style={styles.sectionTitle}>Select Venue</Text>
            <View style={styles.venuesContainer}>
              {venues.map(venue => (
                <Chip
                  key={venue.id}
                  selected={selectedVenue === venue.id}
                  onPress={() => setSelectedVenue(venue.id)}
                  style={styles.venueChip}
                >
                  <Image source={{ uri: venue.image }} style={styles.venueImage} />
                  {venue.name}
                </Chip>
              ))}
            </View>
            <HelperText type="error" visible={!!errors.venue}>
              {errors.venue}
            </HelperText>

            <TextInput
              label="Match Format"
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
              label="Maximum Players"
              value={formData.maxPlayers}
              onChangeText={text => setFormData(prev => ({ ...prev, maxPlayers: text }))}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.maxPlayers}
            />
            <HelperText type="error" visible={!!errors.maxPlayers}>
              {errors.maxPlayers}
            </HelperText>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={loading} dismissable={false}>
          <Dialog.Content>
            <Text>Creating match...</Text>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="check"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
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
  input: {
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  teamsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  teamChip: {
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  venuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  venueChip: {
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default CreateMatchScreen; 