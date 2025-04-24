import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Venue } from '../../types/tournamentTypes';
import MapView, { Marker } from 'react-native-maps';

type VenueMapProps = {
  venue: Venue;
  onClose: () => void;
};

const VenueMap: React.FC<VenueMapProps> = ({ venue, onClose }) => {
  const { latitude, longitude, venue_name } = venue;
  
  // Default to a fallback location if coordinates are not available
  const initialRegion = {
    latitude: latitude || 6.9271, // Default to Colombo, Sri Lanka
    longitude: longitude || 79.8612,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Venue Location</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          <Marker
            coordinate={{
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude,
            }}
            title={venue_name}
            description={`${venue.address || ''} ${venue.city || ''} ${venue.country || ''}`}
          />
        </MapView>
      </View>

      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{venue_name}</Text>
        {venue.address && <Text style={styles.venueAddress}>{venue.address}</Text>}
        {venue.city && <Text style={styles.venueAddress}>{venue.city}</Text>}
        {venue.state && <Text style={styles.venueAddress}>{venue.state}</Text>}
        {venue.country && <Text style={styles.venueAddress}>{venue.country}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.6,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  venueInfo: {
    padding: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  venueAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default VenueMap; 