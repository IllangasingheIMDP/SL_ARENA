import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { tournamentService } from '../../services/tournamentService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreateTournamentScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = ['tournament_name', 'start_date', 'end_date', 'tournament_type', 'venue_name', 'city', 'country', 'capacity'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Convert capacity to number
      const capacity = parseInt(formData.capacity);
      if (isNaN(capacity)) {
        Alert.alert('Error', 'Capacity must be a valid number');
        return;
      }

      await tournamentService.createTournament({
        ...formData,
        capacity,
      });

      Alert.alert(
        'Success',
        'Tournament created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OrganisationDashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create tournament. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Tournament</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tournament Name *"
          value={formData.tournament_name}
          onChangeText={(value) => handleInputChange('tournament_name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD) *"
          value={formData.start_date}
          onChangeText={(value) => handleInputChange('start_date', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD) *"
          value={formData.end_date}
          onChangeText={(value) => handleInputChange('end_date', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tournament Type *"
          value={formData.tournament_type}
          onChangeText={(value) => handleInputChange('tournament_type', value)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Rules"
          value={formData.rules}
          onChangeText={(value) => handleInputChange('rules', value)}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Venue Name *"
          value={formData.venue_name}
          onChangeText={(value) => handleInputChange('venue_name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="City *"
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Country *"
          value={formData.country}
          onChangeText={(value) => handleInputChange('country', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity *"
          value={formData.capacity}
          onChangeText={(value) => handleInputChange('capacity', value)}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Tournament</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTournamentScreen; 