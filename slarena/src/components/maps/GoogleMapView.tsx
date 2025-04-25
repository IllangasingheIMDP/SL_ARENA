import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Polyline } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GoogleMapViewProps {
  placeId: string;
  height?: number;
  width?: number;
  showUserLocation?: boolean;
  showDirections?: boolean;
  showSearch?: boolean;
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
}

interface DirectionResult {
  routes: Array<{
    legs: Array<{
      steps: Array<{
        polyline: {
          points: string;
        };
      }>;
    }>;
  }>;
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  placeId,
  height = 200,
  width = Dimensions.get('window').width - 32,
  showUserLocation = false,
  showDirections = false,
  showSearch = false,
}) => {
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [directions, setDirections] = useState<{ latitude: number; longitude: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceDetails[]>([]);
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

  // Get place details
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.result) {
          setPlaceDetails(data.result);
          setError(null);

          // Animate to the location with zoom
          const region: Region = {
            latitude: data.result.geometry.location.lat,
            longitude: data.result.geometry.location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          
          mapRef.current?.animateToRegion(region, 1000);

          // Get directions if enabled and user location is available
          if (showDirections && userLocation) {
            const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.coords.latitude},${userLocation.coords.longitude}&destination=${data.result.geometry.location.lat},${data.result.geometry.location.lng}&key=${apiKey}`;
            const directionsResponse = await fetch(directionsUrl);
            const directionsData: DirectionResult = await directionsResponse.json();

            if (directionsData.routes.length > 0) {
              const points = directionsData.routes[0].legs[0].steps.map(step => {
                const decodedPoints = decodePolyline(step.polyline.points);
                return decodedPoints;
              }).flat();
              setDirections(points);
            }
          }
        } else {
          setError('Failed to load location data');
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        setError('Failed to load map data');
      }
    };

    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId, showDirections, userLocation]);

  // Search places
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  // Decode polyline points
  const decodePolyline = (encoded: string) => {
    const poly: { latitude: number; longitude: number }[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5
      });
    }

    return poly;
  };

  if (error) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!placeDetails?.geometry) return null;

  return (
    <View style={[styles.container, { height, width }]}>
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={showUserLocation}
      >
        <Marker
          coordinate={{
            latitude: placeDetails.geometry.location.lat,
            longitude: placeDetails.geometry.location.lng,
          }}
          title={placeDetails.name}
          description={placeDetails.formatted_address}
          pinColor="red"
        />

        {showDirections && directions.length > 0 && (
          <Polyline
            coordinates={directions}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}

        {searchResults.map((result, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
            }}
            title={result.name}
            description={result.formatted_address}
            pinColor="blue"
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
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoogleMapView; 