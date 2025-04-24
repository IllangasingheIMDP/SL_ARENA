import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

type RoleRequestFormNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoleRequestForm'
>;

type RoleRequestFormRouteProp = RouteProp<
  RootStackParamList,
  'RoleRequestForm'
>;

interface FormData {
  // Basic Information
  fullName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  whatsappNumber: string;
  currentAddress: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  schoolOrClub: string;
  biography: string;

  // Cricket-Specific Information (for Player)
  playerRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  playingExperience?: string;
  highestLevelPlayed?: string;
  preferredFormat?: string;
  previousTeams?: string;
  notableAchievements?: string;
  jerseyNumber?: string;

  // Organization Information (for Organizer)
  organizationName?: string;
  organizationType?: string;
  establishmentYear?: string;
  website?: string;
  socialMediaHandles?: string;
  primaryContactName?: string;
  primaryContactPosition?: string;
  primaryContactEmail?: string;
  primaryContactNumber?: string;
  typesOfTournaments?: string;
  ageGroups?: string;
  formats?: string;
  scale?: string;
  previousTournaments?: string;
  venueDetails?: string;
  venueFacilities?: string;
  scoringSystems?: string;
  matchOfficialsNetwork?: string;
  liveStreamingCapabilities?: string;
  sponsorshipHistory?: string;
  bankName?: string;
  accountNumber?: string;
  accountType?: string;
  tournamentBudgetRange?: string;
  sponsorshipTiers?: string;
  prizeMoneyStructure?: string;

  // Trainer Information
  specializationAreas?: string[];
  coachingExperience?: string;
  highestLevelCoached?: string;
  coachingQualifications?: string;
  playerExperience?: string;
  notableStudents?: string;
  coachingMethodology?: string;
  ageGroupsSpecialized?: string;
  hourlyRates?: string;
  availability?: string;

  // Documents
  documents: {
    nationalId?: string;
    ageProof?: string;
    passportPhoto?: string;
    addressProof?: string;
    playingCertificates?: string;
    previousScorecards?: string;
    businessRegistration?: string;
    taxId?: string;
    organizationCharter?: string;
    authorityLetter?: string;
    identityProof?: string;
    boardResolution?: string;
    tournamentBrochures?: string;
    pastEventsPhotos?: string;
    mediaCoverage?: string;
    testimonials?: string;
    awards?: string;
    venueOwnership?: string;
    venuePermission?: string;
    safetyCertificates?: string;
    insuranceCoverage?: string;
    bankStatement?: string;
    financialStatement?: string;
    sponsorshipAgreements?: string;
    prizeMoneyProof?: string;
    coachingCertificates?: string;
    educationQualifications?: string;
    professionalReferences?: string;
    policeClearance?: string;
    employmentProof?: string;
    professionalInsurance?: string;
  };
}

const RoleRequestForm = () => {
  const navigation = useNavigation<RoleRequestFormNavigationProp>();
  const route = useRoute<RoleRequestFormRouteProp>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    username: '',
    email: user?.email || '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    whatsappNumber: '',
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    schoolOrClub: '',
    biography: '',
    documents: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Basic Info, Role-Specific Info, Documents, Review
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Request permissions for document and image picker
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera roll permissions to upload documents');
        }
      }
    })();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation for all roles
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.currentAddress.trim()) newErrors.currentAddress = 'Address is required';
    
    // Role-specific validation
    if (route.params.role === 'player') {
      if (!formData.playerRole) newErrors.playerRole = 'Player role is required';
      if (!formData.playingExperience) newErrors.playingExperience = 'Playing experience is required';
    } else if (route.params.role === 'organisation') {
      if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
      if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    } else if (route.params.role === 'trainer') {
      if (!formData.coachingExperience) newErrors.coachingExperience = 'Coaching experience is required';
      if (!formData.coachingQualifications) newErrors.coachingQualifications = 'Coaching qualifications are required';
    }
    
    // Document validation
    if (!formData.documents.nationalId) newErrors.nationalId = 'National ID is required';
    if (!formData.documents.passportPhoto) newErrors.passportPhoto = 'Passport photo is required';
    if (!formData.documents.addressProof) newErrors.addressProof = 'Address proof is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }
      
      setLoading(true);
      
      // Prepare the data to be sent to the server
      const requestData = {
        userId: user?.id,
        role: route.params.role,
        formData: {
          ...formData,
          // Convert document paths to actual file data if needed
          // This would depend on your backend implementation
        }
      };
      
      // Submit the role request
      const response = await userService.submitRoleRequest(route.params.role, requestData);
      
      if (response.status === 'success') {
        Alert.alert(
          'Success', 
          'Your role request has been submitted successfully. You will be notified once it is reviewed.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to submit role request');
      }
    } catch (error) {
      console.error('Error submitting role request:', error);
      Alert.alert('Error', 'Failed to submit role request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (field: keyof FormData['documents']) => {
    try {
      if (field === 'passportPhoto') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.8,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [field]: result.assets[0].uri,
            },
          }));
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
          copyToCacheDirectory: true,
        });
        
        if (!result.canceled) {
          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [field]: result.assets[0].uri,
            },
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        dateOfBirth: selectedDate.toISOString().split('T')[0],
      }));
    }
  };

  const renderBasicInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors.fullName ? styles.inputError : null]}
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          placeholder="Enter your full name"
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter your email"
          keyboardType="email-address"
          editable={false}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {formData.dateOfBirth || 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      
      {route.params.role !== 'organisation' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value: string) => setFormData({ ...formData, gender: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
      )}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact Number *</Text>
        <TextInput
          style={[styles.input, errors.contactNumber ? styles.inputError : null]}
          value={formData.contactNumber}
          onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
        />
        {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>WhatsApp Number</Text>
        <TextInput
          style={styles.input}
          value={formData.whatsappNumber}
          onChangeText={(text) => setFormData({ ...formData, whatsappNumber: text })}
          placeholder="Enter your WhatsApp number"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Current Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.currentAddress ? styles.inputError : null]}
          value={formData.currentAddress}
          onChangeText={(text) => setFormData({ ...formData, currentAddress: text })}
          placeholder="Enter your current address"
          multiline
          numberOfLines={3}
        />
        {errors.currentAddress && <Text style={styles.errorText}>{errors.currentAddress}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Emergency Contact Name</Text>
        <TextInput
          style={styles.input}
          value={formData.emergencyContactName}
          onChangeText={(text) => setFormData({ ...formData, emergencyContactName: text })}
          placeholder="Enter emergency contact name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Emergency Contact Number</Text>
        <TextInput
          style={styles.input}
          value={formData.emergencyContactNumber}
          onChangeText={(text) => setFormData({ ...formData, emergencyContactNumber: text })}
          placeholder="Enter emergency contact number"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>School/College/Club</Text>
        <TextInput
          style={styles.input}
          value={formData.schoolOrClub}
          onChangeText={(text) => setFormData({ ...formData, schoolOrClub: text })}
          placeholder="Enter your school/college/club"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Biography</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.biography}
          onChangeText={(text) => setFormData({ ...formData, biography: text })}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  const renderPlayerInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cricket-Specific Information</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Player Role</Text>
        <TextInput
          style={styles.input}
          value={formData.playerRole}
          onChangeText={(text) => setFormData({ ...formData, playerRole: text })}
          placeholder="Batter/Bowler/All-rounder/Wicket-keeper"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Batting Style</Text>
        <TextInput
          style={styles.input}
          value={formData.battingStyle}
          onChangeText={(text) => setFormData({ ...formData, battingStyle: text })}
          placeholder="Right-handed/Left-handed"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Bowling Style</Text>
        <TextInput
          style={styles.input}
          value={formData.bowlingStyle}
          onChangeText={(text) => setFormData({ ...formData, bowlingStyle: text })}
          placeholder="Pace/Spin/Medium"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Playing Experience (years)</Text>
        <TextInput
          style={styles.input}
          value={formData.playingExperience}
          onChangeText={(text) => setFormData({ ...formData, playingExperience: text })}
          placeholder="Enter years of experience"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Highest Level Played</Text>
        <TextInput
          style={styles.input}
          value={formData.highestLevelPlayed}
          onChangeText={(text) => setFormData({ ...formData, highestLevelPlayed: text })}
          placeholder="School/Club/District/State/National"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Preferred Format</Text>
        <TextInput
          style={styles.input}
          value={formData.preferredFormat}
          onChangeText={(text) => setFormData({ ...formData, preferredFormat: text })}
          placeholder="T20/ODI/Test/All formats"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Previous Teams/Clubs</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.previousTeams}
          onChangeText={(text) => setFormData({ ...formData, previousTeams: text })}
          placeholder="List your previous teams/clubs"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notable Achievements</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notableAchievements}
          onChangeText={(text) => setFormData({ ...formData, notableAchievements: text })}
          placeholder="List your notable achievements"
          multiline
          numberOfLines={4}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Jersey Number Preference</Text>
        <TextInput
          style={styles.input}
          value={formData.jerseyNumber}
          onChangeText={(text) => setFormData({ ...formData, jerseyNumber: text })}
          placeholder="Enter preferred jersey number"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderOrganizerInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Organization Information</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Organization Name</Text>
        <TextInput
          style={styles.input}
          value={formData.organizationName}
          onChangeText={(text) => setFormData({ ...formData, organizationName: text })}
          placeholder="Enter organization name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Organization Type</Text>
        <TextInput
          style={styles.input}
          value={formData.organizationType}
          onChangeText={(text) => setFormData({ ...formData, organizationType: text })}
          placeholder="Cricket Association/Private Event Company/Club/School/Corporate"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Establishment Year</Text>
        <TextInput
          style={styles.input}
          value={formData.establishmentYear}
          onChangeText={(text) => setFormData({ ...formData, establishmentYear: text })}
          placeholder="Enter establishment year"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={formData.website}
          onChangeText={(text) => setFormData({ ...formData, website: text })}
          placeholder="Enter website URL"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Social Media Handles</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.socialMediaHandles}
          onChangeText={(text) => setFormData({ ...formData, socialMediaHandles: text })}
          placeholder="Enter social media handles"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Contact Person</Text>
        <TextInput
          style={styles.input}
          value={formData.primaryContactName}
          onChangeText={(text) => setFormData({ ...formData, primaryContactName: text })}
          placeholder="Enter primary contact name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Contact Position</Text>
        <TextInput
          style={styles.input}
          value={formData.primaryContactPosition}
          onChangeText={(text) => setFormData({ ...formData, primaryContactPosition: text })}
          placeholder="Enter primary contact position"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Contact Email</Text>
        <TextInput
          style={styles.input}
          value={formData.primaryContactEmail}
          onChangeText={(text) => setFormData({ ...formData, primaryContactEmail: text })}
          placeholder="Enter primary contact email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Contact Number</Text>
        <TextInput
          style={styles.input}
          value={formData.primaryContactNumber}
          onChangeText={(text) => setFormData({ ...formData, primaryContactNumber: text })}
          placeholder="Enter primary contact number"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Types of Tournaments</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.typesOfTournaments}
          onChangeText={(text) => setFormData({ ...formData, typesOfTournaments: text })}
          placeholder="List types of tournaments you organize"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age Groups</Text>
        <TextInput
          style={styles.input}
          value={formData.ageGroups}
          onChangeText={(text) => setFormData({ ...formData, ageGroups: text })}
          placeholder="U13/U15/U19/Open/Veterans"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Formats</Text>
        <TextInput
          style={styles.input}
          value={formData.formats}
          onChangeText={(text) => setFormData({ ...formData, formats: text })}
          placeholder="T20/ODI/Test/Other"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Scale</Text>
        <TextInput
          style={styles.input}
          value={formData.scale}
          onChangeText={(text) => setFormData({ ...formData, scale: text })}
          placeholder="Local/District/State/National/International"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Previous Tournaments</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.previousTournaments}
          onChangeText={(text) => setFormData({ ...formData, previousTournaments: text })}
          placeholder="List previous tournaments organized"
          multiline
          numberOfLines={4}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Venue Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.venueDetails}
          onChangeText={(text) => setFormData({ ...formData, venueDetails: text })}
          placeholder="Enter venue details"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Venue Facilities</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.venueFacilities}
          onChangeText={(text) => setFormData({ ...formData, venueFacilities: text })}
          placeholder="List venue facilities"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Scoring Systems</Text>
        <TextInput
          style={styles.input}
          value={formData.scoringSystems}
          onChangeText={(text) => setFormData({ ...formData, scoringSystems: text })}
          placeholder="Enter scoring systems used"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Match Officials Network</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.matchOfficialsNetwork}
          onChangeText={(text) => setFormData({ ...formData, matchOfficialsNetwork: text })}
          placeholder="Describe your match officials network"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Live Streaming Capabilities</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.liveStreamingCapabilities}
          onChangeText={(text) => setFormData({ ...formData, liveStreamingCapabilities: text })}
          placeholder="Describe your live streaming capabilities"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sponsorship History</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.sponsorshipHistory}
          onChangeText={(text) => setFormData({ ...formData, sponsorshipHistory: text })}
          placeholder="Describe your sponsorship history"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          style={styles.input}
          value={formData.bankName}
          onChangeText={(text) => setFormData({ ...formData, bankName: text })}
          placeholder="Enter bank name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          value={formData.accountNumber}
          onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
          placeholder="Enter account number"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Account Type</Text>
        <TextInput
          style={styles.input}
          value={formData.accountType}
          onChangeText={(text) => setFormData({ ...formData, accountType: text })}
          placeholder="Enter account type"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tournament Budget Range</Text>
        <TextInput
          style={styles.input}
          value={formData.tournamentBudgetRange}
          onChangeText={(text) => setFormData({ ...formData, tournamentBudgetRange: text })}
          placeholder="Enter tournament budget range"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sponsorship Tiers</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.sponsorshipTiers}
          onChangeText={(text) => setFormData({ ...formData, sponsorshipTiers: text })}
          placeholder="Describe sponsorship tiers"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Prize Money Structure</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.prizeMoneyStructure}
          onChangeText={(text) => setFormData({ ...formData, prizeMoneyStructure: text })}
          placeholder="Describe prize money structure"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderTrainerInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Training Information</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Specialization Areas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.specializationAreas?.join(', ')}
          onChangeText={(text) => setFormData({ ...formData, specializationAreas: text.split(', ') })}
          placeholder="Batting/Bowling/Wicket-keeping/Fielding/Mental Conditioning/Physical Fitness"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Coaching Experience (years)</Text>
        <TextInput
          style={styles.input}
          value={formData.coachingExperience}
          onChangeText={(text) => setFormData({ ...formData, coachingExperience: text })}
          placeholder="Enter years of coaching experience"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Highest Level Coached</Text>
        <TextInput
          style={styles.input}
          value={formData.highestLevelCoached}
          onChangeText={(text) => setFormData({ ...formData, highestLevelCoached: text })}
          placeholder="School/Club/District/State/National"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Coaching Qualifications</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.coachingQualifications}
          onChangeText={(text) => setFormData({ ...formData, coachingQualifications: text })}
          placeholder="List your coaching qualifications"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Playing Experience</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.playerExperience}
          onChangeText={(text) => setFormData({ ...formData, playerExperience: text })}
          placeholder="Describe your playing experience"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notable Students</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notableStudents}
          onChangeText={(text) => setFormData({ ...formData, notableStudents: text })}
          placeholder="List notable students you've coached"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Coaching Methodology</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.coachingMethodology}
          onChangeText={(text) => setFormData({ ...formData, coachingMethodology: text })}
          placeholder="Describe your coaching methodology"
          multiline
          numberOfLines={4}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age Groups Specialized In</Text>
        <TextInput
          style={styles.input}
          value={formData.ageGroupsSpecialized}
          onChangeText={(text) => setFormData({ ...formData, ageGroupsSpecialized: text })}
          placeholder="Junior/Senior/All"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Hourly Rates</Text>
        <TextInput
          style={styles.input}
          value={formData.hourlyRates}
          onChangeText={(text) => setFormData({ ...formData, hourlyRates: text })}
          placeholder="Enter your hourly rates"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Availability</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.availability}
          onChangeText={(text) => setFormData({ ...formData, availability: text })}
          placeholder="Describe your availability"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderDocumentUpload = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Required Documents</Text>
      <Text style={styles.sectionSubtitle}>Please upload the following documents to complete your application</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>National Identity Card *</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('nationalId')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.nationalId ? 'Change Document' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
        {errors.nationalId && <Text style={styles.errorText}>{errors.nationalId}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age Proof</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('ageProof')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.ageProof ? 'Change Document' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Recent Passport-sized Photo *</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('passportPhoto')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.passportPhoto ? 'Change Photo' : 'Upload Photo'}
          </Text>
        </TouchableOpacity>
        {errors.passportPhoto && <Text style={styles.errorText}>{errors.passportPhoto}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Address Proof *</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('addressProof')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.addressProof ? 'Change Document' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
        {errors.addressProof && <Text style={styles.errorText}>{errors.addressProof}</Text>}
      </View>
      
      {/* Role-specific document uploads */}
      {route.params.role === 'player' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Playing Certificates</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('playingCertificates')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.playingCertificates ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Previous Match Scorecards</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('previousScorecards')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.previousScorecards ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {route.params.role === 'organisation' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Business Registration Certificate</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('businessRegistration')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.businessRegistration ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tax Identification Number</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('taxId')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.taxId ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Add more organization-specific document uploads */}
        </>
      )}
      
      {route.params.role === 'trainer' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Coaching Certificates</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('coachingCertificates')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.coachingCertificates ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Education Qualifications</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('educationQualifications')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.educationQualifications ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Add more trainer-specific document uploads */}
        </>
      )}
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Review Your Application</Text>
      <Text style={styles.sectionSubtitle}>Please review your information before submitting</Text>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Basic Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Full Name:</Text>
          <Text style={styles.reviewValue}>{formData.fullName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Email:</Text>
          <Text style={styles.reviewValue}>{formData.email}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Contact Number:</Text>
          <Text style={styles.reviewValue}>{formData.contactNumber}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Address:</Text>
          <Text style={styles.reviewValue}>{formData.currentAddress}</Text>
        </View>
      </View>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Role: {route.params.role.charAt(0).toUpperCase() + route.params.role.slice(1)}</Text>
        {/* Display role-specific information based on the selected role */}
        {route.params.role === 'player' && (
          <>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Player Role:</Text>
              <Text style={styles.reviewValue}>{formData.playerRole || 'Not specified'}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Playing Experience:</Text>
              <Text style={styles.reviewValue}>{formData.playingExperience || 'Not specified'}</Text>
            </View>
          </>
        )}
        
        {route.params.role === 'organisation' && (
          <>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Organization Name:</Text>
              <Text style={styles.reviewValue}>{formData.organizationName || 'Not specified'}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Organization Type:</Text>
              <Text style={styles.reviewValue}>{formData.organizationType || 'Not specified'}</Text>
            </View>
          </>
        )}
        
        {route.params.role === 'trainer' && (
          <>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Coaching Experience:</Text>
              <Text style={styles.reviewValue}>{formData.coachingExperience || 'Not specified'}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Coaching Qualifications:</Text>
              <Text style={styles.reviewValue}>{formData.coachingQualifications || 'Not specified'}</Text>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Documents</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>National ID:</Text>
          <Text style={styles.reviewValue}>{formData.documents.nationalId ? 'Uploaded' : 'Not uploaded'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Passport Photo:</Text>
          <Text style={styles.reviewValue}>{formData.documents.passportPhoto ? 'Uploaded' : 'Not uploaded'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Address Proof:</Text>
          <Text style={styles.reviewValue}>{formData.documents.addressProof ? 'Uploaded' : 'Not uploaded'}</Text>
        </View>
      </View>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepDot,
            currentStep > index + 1 ? styles.stepCompleted : null,
            currentStep === index + 1 ? styles.stepActive : null
          ]} />
          <Text style={[
            styles.stepText,
            currentStep === index + 1 ? styles.stepTextActive : null
          ]}>
            {index === 0 ? 'Basic' : index === 1 ? 'Role' : index === 2 ? 'Documents' : 'Review'}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {route.params.role.charAt(0).toUpperCase() + route.params.role.slice(1)} Registration
          </Text>
        </View>
        
        {renderStepIndicator()}
        
        {currentStep === 1 && renderBasicInformation()}
        {currentStep === 2 && (
          route.params.role === 'player' ? renderPlayerInformation() :
          route.params.role === 'organisation' ? renderOrganizerInformation() :
          route.params.role === 'trainer' ? renderTrainerInformation() : null
        )}
        {currentStep === 3 && renderDocumentUpload()}
        {currentStep === 4 && renderReviewStep()}
        
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={prevStep}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < totalSteps ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={nextStep}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f4511e',
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: -20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  stepActive: {
    backgroundColor: '#f4511e',
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
  },
  stepTextActive: {
    color: '#f4511e',
    fontWeight: 'bold',
  },
  reviewSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#666',
    width: '40%',
  },
  reviewValue: {
    fontSize: 14,
    color: '#333',
    width: '60%',
  },
  datePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
});

export default RoleRequestForm; 