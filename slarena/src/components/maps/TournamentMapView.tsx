import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Tournament } from '../../types/tournamentTypes';

interface TournamentMapViewProps {
  tournaments: Tournament[];
  height?: number;
  width?: number;
  showUserLocation?: boolean;
}

interface PlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  formatted_address: string;
  tournamentName: string;
  tournamentType: string;
}

const TournamentMapView: React.FC<TournamentMapViewProps> = ({
  tournaments,
  height = 300,
  width = Dimensions.get('window').width - 70,
  showUserLocation = false,
}) => {
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  // Get user location
  useEffect(() => {
    if (showUserLocation) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      })();
    }
  }, [showUserLocation]);

  // Get place details for all tournaments
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
        const details = await Promise.all(
          tournaments.map(async (tournament) => {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${tournament.venue.venue_id}&fields=geometry,name,formatted_address&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.result) {
              return {
                ...data.result,
                tournamentName: tournament.name,
                tournamentType: tournament.type
              };
            }
            return null;
          })
        );

        const validDetails = details.filter(detail => detail !== null);
        setPlaceDetails(validDetails);
        setError(null);

        // Animate to the first location with zoom
        if (validDetails.length > 0) {
          const region: Region = {
            latitude: validDetails[0].geometry.location.lat,
            longitude: validDetails[0].geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          mapRef.current?.animateToRegion(region, 1000);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        setError('Failed to load map data');
      }
    };

    if (tournaments.length > 0) {
      fetchPlaceDetails();
    }
  }, [tournaments]);

  if (error) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (placeDetails.length === 0) return null;

  return (
    <View style={[styles.container, { height, width }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: placeDetails[0].geometry.location.lat,
          longitude: placeDetails[0].geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={showUserLocation}
      >
        {placeDetails.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.tournamentName}
            description={`${place.tournamentType} - ${place.name}`}
            pinColor="#4CAF50"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
});

export default TournamentMapView;