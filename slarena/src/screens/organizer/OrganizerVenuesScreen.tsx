import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Dialog, Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  facilities: string[];
  images: string[];
  description: string;
  status: 'available' | 'maintenance' | 'booked';
}

const OrganizerVenuesScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
    facilities: '',
    images: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const fetchVenues = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockVenues: Venue[] = [
          {
            id: '1',
            name: 'R. Premadasa Stadium',
            address: 'Kettarama Road, Colombo',
            city: 'Colombo',
            capacity: 35000,
            facilities: ['Floodlights', 'Practice Nets', 'Media Center', 'VIP Boxes'],
            images: ['https://via.placeholder.com/300x200'],
            description: 'International cricket stadium with modern facilities',
            status: 'available',
          },
          {
            id: '2',
            name: 'SSC Ground',
            address: 'SSC Grounds, Colombo',
            city: 'Colombo',
            capacity: 10000,
            facilities: ['Practice Nets', 'Media Center', 'Pavilion'],
            images: ['https://via.placeholder.com/300x200'],
            description: 'Historic cricket ground with traditional charm',
            status: 'available',
          },
        ];
        setVenues(mockVenues);
        setLoading(false);
      }, 1000);
    };

    fetchVenues();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // In a real app, this would make an API call to create/update the venue
      setTimeout(() => {
        const newVenue: Venue = {
          id: selectedVenue?.id || String(venues.length + 1),
          name: formData.name,
          address: formData.address,
          city: formData.city,
          capacity: parseInt(formData.capacity),
          facilities: formData.facilities.split(',').map(f => f.trim()),
          images: formData.images.split(',').map(i => i.trim()),
          description: formData.description,
          status: 'available',
        };

        if (selectedVenue) {
          setVenues(prev => prev.map(v => (v.id === selectedVenue.id ? newVenue : v)));
        } else {
          setVenues(prev => [...prev, newVenue]);
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
      address: '',
      city: '',
      capacity: '',
      facilities: '',
      images: '',
      description: '',
    });
    setErrors({});
    setSelectedVenue(null);
  };

  const handleEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      city: venue.city,
      capacity: venue.capacity.toString(),
      facilities: venue.facilities.join(', '),
      images: venue.images.join(', '),
      description: venue.description,
    });
    setShowAddDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return theme.colors.success;
      case 'maintenance':
        return theme.colors.warning;
      case 'booked':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const renderVenueCard = (venue: Venue) => (
    <Card key={venue.id} style={styles.card}>
      <Card.Cover source={{ uri: venue.images[0] }} />
      <Card.Content>
        <View style={styles.headerContainer}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(venue.status) }]}
            textStyle={{ color: getStatusColor(venue.status) }}
          >
            {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
          </Chip>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.address}>{venue.address}</Text>
          <Text style={styles.city}>{venue.city}</Text>
          <Text style={styles.capacity}>Capacity: {venue.capacity.toLocaleString()}</Text>
          <Text style={styles.description}>{venue.description}</Text>
        </View>

        <View style={styles.facilitiesContainer}>
          {venue.facilities.map((facility, index) => (
            <Chip key={index} style={styles.facilityChip}>
              {facility}
            </Chip>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEdit(venue)}>Edit</Button>
        <Button onPress={() => navigation.navigate('VenueDetails', { venue })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {venues.map(renderVenueCard)}
      </ScrollView>

      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>{selectedVenue ? 'Edit Venue' : 'Add New Venue'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Venue Name"
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              style={styles.input}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Address"
              value={formData.address}
              onChangeText={text => setFormData(prev => ({ ...prev, address: text }))}
              style={styles.input}
              error={!!errors.address}
            />
            <HelperText type="error" visible={!!errors.address}>
              {errors.address}
            </HelperText>

            <TextInput
              label="City"
              value={formData.city}
              onChangeText={text => setFormData(prev => ({ ...prev, city: text }))}
              style={styles.input}
              error={!!errors.city}
            />
            <HelperText type="error" visible={!!errors.city}>
              {errors.city}
            </HelperText>

            <TextInput
              label="Capacity"
              value={formData.capacity}
              onChangeText={text => setFormData(prev => ({ ...prev, capacity: text }))}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.capacity}
            />
            <HelperText type="error" visible={!!errors.capacity}>
              {errors.capacity}
            </HelperText>

            <TextInput
              label="Facilities (comma-separated)"
              value={formData.facilities}
              onChangeText={text => setFormData(prev => ({ ...prev, facilities: text }))}
              style={styles.input}
            />

            <TextInput
              label="Image URLs (comma-separated)"
              value={formData.images}
              onChangeText={text => setFormData(prev => ({ ...prev, images: text }))}
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
              {selectedVenue ? 'Update' : 'Add'}
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
    marginTop: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  detailsContainer: {
    marginTop: 16,
  },
  address: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  city: {
    fontSize: 14,
    marginTop: 4,
  },
  capacity: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  facilityChip: {
    margin: 4,
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

export default OrganizerVenuesScreen; 