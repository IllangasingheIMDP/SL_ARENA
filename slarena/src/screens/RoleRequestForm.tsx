import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to submit role request
      await userService.submitRoleRequest(route.params.role, formData);
      Alert.alert('Success', 'Role request submitted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit role request');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (field: keyof FormData['documents']) => {
    // For now, just allow manual input of document paths
    Alert.prompt(
      'Enter Document Path',
      'Please enter the path to your document',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (path) => {
            if (path) {
              setFormData(prev => ({
                ...prev,
                documents: {
                  ...prev.documents,
                  [field]: path,
                },
              }));
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderBasicInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          placeholder="Enter your full name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          placeholder="Choose a username"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={formData.dateOfBirth}
          onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
          placeholder="DD/MM/YYYY"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          value={formData.gender}
          onChangeText={(text) => setFormData({ ...formData, gender: text })}
          placeholder="Enter your gender"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={formData.contactNumber}
          onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
        />
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
        <Text style={styles.label}>Current Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.currentAddress}
          onChangeText={(text) => setFormData({ ...formData, currentAddress: text })}
          placeholder="Enter your current address"
          multiline
          numberOfLines={3}
        />
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
      <View style={styles.formGroup}>
        <Text style={styles.label}>National Identity Card</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('nationalId')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.nationalId ? 'Change Document' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.label}>Recent Passport-sized Photo</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('passportPhoto')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.passportPhoto ? 'Change Photo' : 'Upload Photo'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Address Proof</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleDocumentUpload('addressProof')}
        >
          <Text style={styles.uploadButtonText}>
            {formData.documents.addressProof ? 'Change Document' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
      </View>
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
      {route.params.role === 'organizer' && (
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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Organization Charter</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('organizationCharter')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.organizationCharter ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Authority Letter</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('authorityLetter')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.authorityLetter ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Identity Proof of Key Management</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('identityProof')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.identityProof ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Board Resolution</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('boardResolution')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.boardResolution ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Previous Tournament Brochures</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('tournamentBrochures')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.tournamentBrochures ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Photos/Videos of Past Events</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('pastEventsPhotos')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.pastEventsPhotos ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Media Coverage</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('mediaCoverage')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.mediaCoverage ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Testimonials</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('testimonials')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.testimonials ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Awards/Recognition</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('awards')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.awards ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Venue Ownership Documents</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('venueOwnership')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.venueOwnership ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Venue Permission Letters</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('venuePermission')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.venuePermission ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ground/Facility Safety Certificates</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('safetyCertificates')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.safetyCertificates ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Insurance Coverage</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('insuranceCoverage')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.insuranceCoverage ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Bank Statement</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('bankStatement')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.bankStatement ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Financial Statement</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('financialStatement')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.financialStatement ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Sponsorship Agreements</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('sponsorshipAgreements')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.sponsorshipAgreements ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Prize Money Distribution Proof</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('prizeMoneyProof')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.prizeMoneyProof ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Professional References</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('professionalReferences')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.professionalReferences ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Police Clearance Certificate</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('policeClearance')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.policeClearance ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Previous Employment Proof</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('employmentProof')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.employmentProof ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Professional Insurance</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleDocumentUpload('professionalInsurance')}
            >
              <Text style={styles.uploadButtonText}>
                {formData.documents.professionalInsurance ? 'Change Document' : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {route.params.role.charAt(0).toUpperCase() + route.params.role.slice(1)} Registration
        </Text>
      </View>

      {renderBasicInformation()}
      {route.params.role === 'player' && renderPlayerInformation()}
      {route.params.role === 'organizer' && renderOrganizerInformation()}
      {route.params.role === 'trainer' && renderTrainerInformation()}
      {renderDocumentUpload()}

      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  submitContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoleRequestForm; 