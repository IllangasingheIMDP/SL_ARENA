import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { playerService } from '../../services/playerService';
import {
  PlayerStats,
  PlayerProfile,
  PlayerAchievement,
  TrainingSession,
} from '../../types/playerTypes';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const PlayerProfileScreen = () => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [achievements, setAchievements] = useState<PlayerAchievement[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      //console.log('Fetching stats...');
      const statsData = await playerService.getPlayerStats();
      //console.log(statsData,'statsData');
      setStats(statsData);

      // Fetch profile
      const profileData = await playerService.getPlayerProfile();
      setProfile(profileData);
      setBioText(profileData.bio);

      // Fetch achievements
      const achievementsData = await playerService.getPlayerAchievements();
      setAchievements(achievementsData);

      // Fetch media
      const mediaData = await playerService.getPlayerMedia();
      setMedia(mediaData);

      // Fetch training sessions
      const trainingData = await playerService.getTrainingSessions();
      setTrainingSessions(trainingData);

    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    try {
      await playerService.updateProfileBio(bioText);
      setProfile(prev => prev ? { ...prev, bio: bioText } : null);
      setIsEditingBio(false);
      Alert.alert('Success', 'Bio updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update bio');
    }
  };

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Here you would typically upload the media to your server
        // For now, we'll just show an alert
        Alert.alert('Success', 'Media selected. Upload functionality to be implemented.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile?.name || 'Player Name'}</Text>
        <Text style={styles.role}>{profile?.batting_style || 'Batting Style'}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.matches_played || 0}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.total_runs || 0}</Text>
            <Text style={styles.statLabel}>Runs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.total_wickets || 0}</Text>
            <Text style={styles.statLabel}>Wickets</Text>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>
        {isEditingBio ? (
          <View>
            <TextInput
              style={styles.bioInput}
              multiline
              value={bioText}
              onChangeText={setBioText}
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateBio}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditingBio(false);
                  setBioText(profile?.bio || '');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.bioText}>{profile?.bio || 'No bio available'}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingBio(true)}
            >
              <Ionicons name="pencil" size={20} color="#f4511e" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements?.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <Text style={styles.achievementType}>{achievement.achievement_type}</Text>
            <Text style={styles.achievementDate}>
              {new Date(achievement.date_achieved).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Media Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media Gallery</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickMedia}>
          <Ionicons name="cloud-upload" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload Media</Text>
        </TouchableOpacity>
        <View style={styles.mediaGrid}>
          {media?.map((url, index) => (
            <View key={index} style={styles.mediaItem}>
              {url.endsWith('.mp4') ? (
                <Video
                  source={{ uri: url }}
                  style={styles.mediaContent}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                />
              ) : (
                <Image source={{ uri: url }} style={styles.mediaContent} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Training Sessions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Training Sessions</Text>
        {trainingSessions?.map((session, index) => (
          <View key={index} style={styles.trainingItem}>
            <Text style={styles.trainingDate}>
              {new Date(session.session_date).toLocaleDateString()}
            </Text>
            <Text style={styles.trainingFocus}>{session.focus_area}</Text>
            <Text style={styles.trainingNotes}>{session.notes}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#f4511e',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 5,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#f4511e',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  achievementItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  achievementType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDate: {
    fontSize: 14,
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaContent: {
    width: '100%',
    height: '100%',
  },
  trainingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trainingDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainingFocus: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  trainingNotes: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default PlayerProfileScreen; 