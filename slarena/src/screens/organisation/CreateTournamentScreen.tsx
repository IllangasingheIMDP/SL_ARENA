import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { tournamentService } from "../../services/tournamentService";
import { googleServices } from "../../services/googleServices";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Place } from "../../types/placeTypes";
import debounce from "lodash/debounce";
import authService from "../../services/authService";
import GoogleMapView from "../../components/maps/GoogleMapView";
import * as Location from 'expo-location';

const CreateTournamentScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState({
    tournament_name: "",
    start_date: "",
    end_date: "",
    tournament_type: "",
    rules: "",
    venue_id: "",
    organizer_id: "",
  });

  const [showVenueSearch, setShowVenueSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Place | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const results = await googleServices.searchPlaces(
          query,
          { lat: 6.9271, lng: 79.8612 }, // Default to Colombo coordinates
          50000 // 50km radius
        );
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching venues:", error);
        Alert.alert("Error", "Failed to search venues. Please try again.");
      } finally {
        setSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleVenueSelect = async (place: Place) => {
    try {
      const details = await googleServices.getPlaceDetails(place.place_id);
      setSelectedVenue(details);

      setFormData((prev) => ({
        ...prev,
        venue_id: details.place_id,
      }));

      setShowVenueSearch(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error getting venue details:", error);
      Alert.alert("Error", "Failed to get venue details. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        "tournament_name",
        "start_date",
        "end_date",
        "tournament_type",
        "venue_id",
      ] as const;
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        Alert.alert(
          "Error",
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      // Get the organizer_id from the user context or auth service
      const user = await authService.getUser();
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      setIsSubmitting(true);

      const tournamentData = {
        ...formData,
        organizer_id: user.id,
      };

      const response = await tournamentService.createTournament(tournamentData);

      Alert.alert(
        "Success",
        "Tournament created successfully!",
        [
          {
            text: "View Tournament",
            onPress: () => navigation.navigate("OrganisationDashboard"),
            style: "default",
          },
          {
            text: "Create Another",
            onPress: () => {
              // Reset form
              setFormData({
                tournament_name: "",
                start_date: "",
                end_date: "",
                tournament_type: "",
                rules: "",
                venue_id: "",
                organizer_id: "",
              });
              setSelectedVenue(null);
            },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error creating tournament:", error);
      Alert.alert(
        "Error",
        error instanceof Error 
          ? error.message 
          : "Failed to create tournament. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVenueItem = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.venueItem}
      onPress={() => handleVenueSelect(item)}
    >
      <Text style={styles.venueName}>{item.name}</Text>
      <Text style={styles.venueAddress}>{item.formatted_address}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show nearby venues');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Tournament</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tournament Name *"
          placeholderTextColor="#000000"
          value={formData.tournament_name}
          onChangeText={(value) => handleInputChange("tournament_name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD) *"
          placeholderTextColor="#000000"
          value={formData.start_date}
          onChangeText={(value) => handleInputChange("start_date", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD) *"
          placeholderTextColor="#000000"
          value={formData.end_date}
          onChangeText={(value) => handleInputChange("end_date", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tournament Type *"
          placeholderTextColor="#000000"
          value={formData.tournament_type}
          onChangeText={(value) => handleInputChange("tournament_type", value)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Rules"
          placeholderTextColor="#000000"
          value={formData.rules}
          onChangeText={(value) => handleInputChange("rules", value)}
          multiline
          numberOfLines={4}
        />

        {/* Venue Search Section */}
        <TouchableOpacity
          style={styles.venueSearchButton}
          onPress={() => setShowVenueSearch(true)}
        >
          <Icon name="search" size={20} color="#fff" />
          <Text style={styles.venueSearchButtonText}>
            {selectedVenue ? selectedVenue.name : "Search Venue *"}
          </Text>
        </TouchableOpacity>

        {/* Show Map if venue is selected */}
        {selectedVenue && (
          <GoogleMapView
            placeId={selectedVenue.place_id}
            height={200}
          />
        )}

        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Tournament</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Venue Search Modal */}
      <Modal
        visible={showVenueSearch}
        animationType="slide"
        onRequestClose={() => setShowVenueSearch(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowVenueSearch(false)}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Search Venue</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter venue name"
              placeholderTextColor="#000000"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            {searching && (
              <ActivityIndicator
                size="small"
                color="#4CAF50"
                style={styles.searchLoading}
              />
            )}
          </View>

          <FlatList
            data={searchResults}
            renderItem={renderVenueItem}
            keyExtractor={(item) => item.place_id}
            style={styles.searchResults}
            ListEmptyComponent={
              <Text style={styles.noResults}>
                {searchQuery ? "No venues found" : "Search for a venue"}
              </Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E3A8A", // Darker navy blue
    backgroundColor: "#FFFFFF", // White background
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37", // Gold color
  },
  formContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1E3A8A", // Darker navy blue
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF", // White background
    color: "#0A192F", // Navy blue text
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#D4AF37", // Gold color
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: "#D4AF3780",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#0A192F", // Navy blue text
    fontSize: 16,
    fontWeight: "bold",
  },
  venueSearchButton: {
    backgroundColor: "#1E3A8A", // Darker navy blue
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  venueSearchButtonText: {
    color: "#D4AF37", // Gold color
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E3A8A", // Darker navy blue
    backgroundColor: "#FFFFFF", // White background
  },
  modalCloseButton: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37", // Gold color
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E3A8A", // Darker navy blue
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1E3A8A", // Darker navy blue
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF", // White background
    color: "#0A192F", // Navy blue text
  },
  searchLoading: {
    marginLeft: 8,
  },
  searchResults: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
  },
  venueItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E3A8A", // Darker navy blue
    backgroundColor: "#FFFFFF", // White background
  },
  venueName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D4AF37", // Gold color
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: "#0A192F", // Navy blue text
  },
  noResults: {
    textAlign: "center",
    padding: 16,
    color: "#D4AF37", // Gold color
  },
});

export default CreateTournamentScreen;
