import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { tournamentService } from '../../services/tournamentService';

const CreateTournamentScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    tournament_name: '',
    start_date: '',
    end_date: '',
    tournament_type: '',
    rules: '',
    venue_name: '',
    city: '',
    country: '',
    capacity: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = ['tournament_name', 'start_date', 'end_date', 'tournament_type', 'venue_name', 'city', 'country', 'capacity'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Convert capacity to number
      const tournamentData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10)
      };

      await tournamentService.createTournament(tournamentData);
      
      Alert.alert(
        'Success',
        'Tournament created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create tournament. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Tournament</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tournament Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.tournament_name}
          onChangeText={(value) => handleInputChange('tournament_name', value)}
          placeholder="Enter tournament name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Date *</Text>
        <TextInput
          style={styles.input}
          value={formData.start_date}
          onChangeText={(value) => handleInputChange('start_date', value)}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>End Date *</Text>
        <TextInput
          style={styles.input}
          value={formData.end_date}
          onChangeText={(value) => handleInputChange('end_date', value)}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tournament Type *</Text>
        <TextInput
          style={styles.input}
          value={formData.tournament_type}
          onChangeText={(value) => handleInputChange('tournament_type', value)}
          placeholder="e.g., T20, ODI, Test"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Rules</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.rules}
          onChangeText={(value) => handleInputChange('rules', value)}
          placeholder="Enter tournament rules"
          multiline
          numberOfLines={4}
        />
      </View>

      <Text style={styles.sectionTitle}>Venue Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Venue Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.venue_name}
          onChangeText={(value) => handleInputChange('venue_name', value)}
          placeholder="Enter venue name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
          placeholder="Enter city"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Country *</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(value) => handleInputChange('country', value)}
          placeholder="Enter country"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Capacity *</Text>
        <TextInput
          style={styles.input}
          value={formData.capacity}
          onChangeText={(value) => handleInputChange('capacity', value)}
          placeholder="Enter venue capacity"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Tournament</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateTournamentScreen; 