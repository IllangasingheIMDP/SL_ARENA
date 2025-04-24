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
  Linking,
  Dimensions,
  Modal,
} from 'react-native';
import { playerService } from '../../services/playerService';
import {
  PlayerStats,
  PlayerProfile,
  PlayerAchievement,
  TrainingSession,
  Photo,
  Video,
} from '../../types/playerTypes';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useAuth } from '../../context/AuthContext';
import { Tab, TabView } from '@rneui/themed';

const PlayerProfileScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [achievements, setAchievements] = useState<PlayerAchievement[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoMatchId, setPhotoMatchId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMatchId, setVideoMatchId] = useState('');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchPhotos();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsData = await playerService.getPlayerStats();
      setStats(statsData);

      // Fetch profile
      const profileData = await playerService.getPlayerProfile();
      setProfile(profileData);
      setBioText(profileData.bio);

      // Fetch achievements
      const achievementsData = await playerService.getPlayerAchievements();
      setAchievements(achievementsData);

      // Fetch media
      const videoData = await playerService.getPlayerVideos(user?.id || '');
      //console.log('Video Data:', videoData);
      // Transform video URLs into video objects
      const transformedVideos = videoData.length > 0 
        ? videoData.map((video: any) => ({
            video_id: video.video_id,
            video_url: video.video_url,
            title: video.title,
            description: video.description || 'Uploaded video',
            match_id: video.match_id,
            user_id: video.user_id,
            created_at: video.upload_date
          }))
        : [];
      setVideos(transformedVideos);

      // Fetch training sessions
      const trainingData = await playerService.getTrainingSessions();
      setTrainingSessions(trainingData);

    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const photosData = await playerService.getPlayerPhotos(user?.id || '');
      setPhotos(photosData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch photos');
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

  const extractVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handlePhotoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const formData = new FormData();
        const imageUri = result.assets[0].uri;
        // Get the file extension from the URI
        const fileExtension = imageUri.split('.').pop()?.toLowerCase();
        // Get the mime type from the URI
        const mimeType = result.assets[0].mimeType || `image/${fileExtension}`;
        
        formData.append('photo', {
          uri: imageUri,
          type: mimeType,
          name: `photo.${fileExtension}`,
        } as any);
        formData.append('title', photoTitle);
        formData.append('description', photoDescription);
        if (photoMatchId) {
          formData.append('match_id', photoMatchId);
          await playerService.uploadPhotoForMatch(formData);
        } else {
          await playerService.uploadPhoto(formData);
        }
        Alert.alert('Success', 'Photo uploaded successfully');
        setShowPhotoForm(false);
        fetchPhotos();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  const handleVideoUpload = async () => {
    try {
      if (!videoUrl) {
        Alert.alert('Error', 'Please enter a video URL');
        return;
      }
      if (videoMatchId) {
        await playerService.uploadVideoForMatch({
          match_id: videoMatchId,
          title: videoTitle,
          description: videoDescription,
          videoUrl,
        });
      } else {
        await playerService.uploadVideo({
          title: videoTitle,
          description: videoDescription,
          videoUrl,
        });
      }
      Alert.alert('Success', 'Video uploaded successfully');
      setShowVideoForm(false);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload video');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await playerService.deletePhoto(photoId);
      Alert.alert('Success', 'Photo deleted successfully');
      fetchPhotos();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      console.log(videoId,'videoId');
      await playerService.deleteVideo(videoId);
      Alert.alert('Success', 'Video deleted successfully');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete video');
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

      {/* Media Gallery Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media Gallery</Text>
        
        {/* Simple Tab Buttons */}
        <View style={styles.simpleTabContainer}>
          <TouchableOpacity 
            style={[styles.simpleTab, activeTab === 0 && styles.activeTab]} 
            onPress={() => setActiveTab(0)}
          >
            <Text style={[styles.simpleTabText, activeTab === 0 && styles.activeTabText]}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.simpleTab, activeTab === 1 && styles.activeTab]} 
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.simpleTabText, activeTab === 1 && styles.activeTabText]}>Videos</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 0 ? (
            // Photos Tab
            <View>
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => setShowPhotoForm(!showPhotoForm)}
              >
                <Text style={styles.simpleButtonText}>Add Photo</Text>
              </TouchableOpacity>

              {showPhotoForm && (
                <View style={styles.simpleForm}>
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Title"
                    value={photoTitle}
                    onChangeText={setPhotoTitle}
                  />
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Description"
                    value={photoDescription}
                    onChangeText={setPhotoDescription}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.simpleButton} 
                    onPress={handlePhotoUpload}
                  >
                    <Text style={styles.simpleButtonText}>Upload</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.simpleGrid}>
                {photos && photos.length > 0 ? (
                  photos.map((photo) => (
                    <View key={photo.photo_id} style={styles.simpleMediaItem}>
                      <TouchableOpacity 
                        onPress={() => {
                          setSelectedPhoto(photo.photo_url);
                          setShowPhotoModal(true);
                        }}
                      >
                        <Image 
                          source={{ uri: photo.photo_url }} 
                          style={styles.simpleMediaContent} 
                        />
                      </TouchableOpacity>
                      <Text style={styles.simpleMediaTitle}>{photo.title}</Text>
                      <TouchableOpacity 
                        style={styles.simpleDeleteButton}
                        onPress={() => handleDeletePhoto(photo.photo_id)}
                      >
                        <Text style={styles.simpleDeleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>No photos uploaded yet</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            // Videos Tab
            <View>
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => setShowVideoForm(!showVideoForm)}
              >
                <Text style={styles.simpleButtonText}>Add Video</Text>
              </TouchableOpacity>

              {showVideoForm && (
                <View style={styles.simpleForm}>
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Title"
                    value={videoTitle}
                    onChangeText={setVideoTitle}
                  />
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Video URL"
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                  />
                  <TouchableOpacity 
                    style={styles.simpleButton} 
                    onPress={handleVideoUpload}
                  >
                    <Text style={styles.simpleButtonText}>Upload</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.simpleGrid}>
                {videos && videos.length > 0 ? (
                  videos.map((video) => {
                    const videoId = extractVideoId(video.video_url);
                    if (videoId) {
                      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      return (
                        <View key={video.video_id} style={styles.simpleMediaItem}>
                          <TouchableOpacity 
                            onPress={() => {
                              setSelectedVideo(videoId);
                              setIsPlaying(true);
                              setShowVideoPlayer(true);
                            }}
                          >
                            <Image 
                              source={{ uri: thumbnailUrl }} 
                              style={styles.simpleMediaContent} 
                            />
                            <View style={styles.simplePlayOverlay}>
                              <Text style={styles.simplePlayText}>▶</Text>
                            </View>
                          </TouchableOpacity>
                          <Text style={styles.simpleMediaTitle}>{video.title}</Text>
                          <TouchableOpacity 
                            style={styles.simpleDeleteButton}
                            onPress={() => handleDeleteVideo(video.video_id)}
                          >
                            <Text style={styles.simpleDeleteText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    return null;
                  })
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>No videos uploaded yet</Text>
                  </View>
                )}
              </View>
            </View>
          )}
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

      {/* Video Player Modal */}
      <Modal
        visible={showVideoPlayer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVideoPlayer(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.videoPlayerContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowVideoPlayer(false);
                setIsPlaying(false);
              }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {selectedVideo && (
              <YoutubePlayer
                height={300}
                play={isPlaying}
                videoId={selectedVideo}
                onChangeState={(state) => {
                  if (state === 'ended') {
                    setIsPlaying(false);
                    setShowVideoPlayer(false);
                  }
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.photoModalContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowPhotoModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {selectedPhoto && (
              <Image 
                source={{ uri: selectedPhoto }} 
                style={styles.modalPhoto} 
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
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
  simpleTabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  simpleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f4511e',
  },
  simpleTabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#f4511e',
    fontWeight: 'bold',
  },
  contentArea: {
    padding: 10,
  },
  simpleButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  simpleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  simpleForm: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  simpleInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  simpleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  simpleMediaItem: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  simpleMediaContent: {
    width: '100%',
    height: 150,
  },
  simpleMediaTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  simpleDeleteButton: {
    padding: 10,
    backgroundColor: '#ffebee',
    alignItems: 'center',
  },
  simpleDeleteText: {
    color: '#f4511e',
    fontWeight: 'bold',
  },
  simplePlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  simplePlayText: {
    color: '#fff',
    fontSize: 40,
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
  emptyStateContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerContainer: {
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  photoModalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  modalPhoto: {
    width: '100%',
    height: '100%',
  },
});

export default PlayerProfileScreen; 