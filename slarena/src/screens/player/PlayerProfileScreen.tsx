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
import { Picker } from '@react-native-picker/picker';

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
  const [isEditingBattingStyle, setIsEditingBattingStyle] = useState(false);
  const [battingStyleText, setBattingStyleText] = useState('');
  const [isEditingBowlingStyle, setIsEditingBowlingStyle] = useState(false);
  const [bowlingStyleText, setBowlingStyleText] = useState('');
  const [isEditingFieldingPosition, setIsEditingFieldingPosition] = useState(false);
  const [fieldingPositionText, setFieldingPositionText] = useState('');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [roleText, setRoleText] = useState('');
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

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
      setBattingStyleText(profileData.batting_style || '');
      setBowlingStyleText(profileData.bowling_style || '');
      setFieldingPositionText(profileData.fielding_position || '');
      setRoleText(profileData.role || '');

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

  const handleUpdateBattingStyle = async () => {
    try {
      await playerService.updatePlayerBattingStyle(battingStyleText);
      setProfile(prev => prev ? { ...prev, batting_style: battingStyleText } : null);
      setIsEditingBattingStyle(false);
      Alert.alert('Success', 'Batting style updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update batting style');
    }
  };

  const handleUpdateBowlingStyle = async () => {
    try {
      await playerService.updatePlayerBowlingStyle(bowlingStyleText);
      setProfile(prev => prev ? { ...prev, bowling_style: bowlingStyleText } : null);
      setIsEditingBowlingStyle(false);
      Alert.alert('Success', 'Bowling style updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update bowling style');
    }
  };

  const handleUpdateFieldingPosition = async () => {
    try {
      await playerService.updatePlayerFieldingPosition(fieldingPositionText);
      setProfile(prev => prev ? { ...prev, fielding_position: fieldingPositionText } : null);
      setIsEditingFieldingPosition(false);
      Alert.alert('Success', 'Fielding position updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update fielding position');
    }
  };

  const handleUpdateRole = async () => {
    try {
      await playerService.updatePlayerRole(roleText as 'batting' | 'bowling' | 'allrounder');
      setProfile(prev => prev ? { ...prev, role: roleText } : null);
      setIsEditingRole(false);
      Alert.alert('Success', 'Role updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update role');
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

  const isValidYouTubeUrl = (url: string): boolean => {
    // Remove any leading @ symbol
    const cleanUrl = url.replace(/^@/, '');
    
    // Match various YouTube URL formats
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(\S*)?$/,  // Standard watch URL with optional parameters
      /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/,    // Embed URL with optional parameters
      /^(https?:\/\/)?(www\.)?(youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/              // Short URL with optional parameters
    ];
    
    return patterns.some(pattern => pattern.test(cleanUrl));
  };

  const handlePhotoUpload = async () => {
    try {
      setIsUploadingPhoto(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const formData = new FormData();
        const imageUri = result.assets[0].uri;
        const fileExtension = imageUri.split('.').pop()?.toLowerCase();
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
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleVideoUpload = async () => {
    try {
      setIsUploadingVideo(true);
      if (!videoUrl) {
        Alert.alert('Error', 'Please enter a video URL');
        return;
      }

      // Clean the URL before validation
      const cleanUrl = videoUrl.replace(/^@/, '');
      if (!isValidYouTubeUrl(cleanUrl)) {
        Alert.alert('Error', 'Please enter a valid YouTube URL');
        return;
      }

      if (videoMatchId) {
        await playerService.uploadVideoForMatch({
          match_id: videoMatchId,
          title: videoTitle,
          description: videoDescription,
          videoUrl: cleanUrl,
        });
      } else {
        await playerService.uploadVideo({
          title: videoTitle,
          description: videoDescription,
          videoUrl: cleanUrl,
        });
      }
      Alert.alert('Success', 'Video uploaded successfully');
      setShowVideoForm(false);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload video');
    } finally {
      setIsUploadingVideo(false);
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
      </View>

      {/* Player Attributes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Attributes</Text>
        
        {/* Batting Style */}
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>Batting Style</Text>
          {isEditingBattingStyle ? (
            <View>
              <TextInput
                style={styles.attributeInput}
                value={battingStyleText}
                onChangeText={setBattingStyleText}
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateBattingStyle}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingBattingStyle(false);
                    setBattingStyleText(profile?.batting_style || '');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.attributeValueContainer}>
              <Text style={styles.attributeValue}>{profile?.batting_style || 'Not specified'}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingBattingStyle(true)}
              >
                <Ionicons name="pencil" size={20} color="#f4511e" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bowling Style */}
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>Bowling Style</Text>
          {isEditingBowlingStyle ? (
            <View>
              <TextInput
                style={styles.attributeInput}
                value={bowlingStyleText}
                onChangeText={setBowlingStyleText}
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateBowlingStyle}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingBowlingStyle(false);
                    setBowlingStyleText(profile?.bowling_style || '');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.attributeValueContainer}>
              <Text style={styles.attributeValue}>{profile?.bowling_style || 'Not specified'}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingBowlingStyle(true)}
              >
                <Ionicons name="pencil" size={20} color="#f4511e" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Fielding Position */}
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>Fielding Position</Text>
          {isEditingFieldingPosition ? (
            <View>
              <TextInput
                style={styles.attributeInput}
                value={fieldingPositionText}
                onChangeText={setFieldingPositionText}
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateFieldingPosition}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingFieldingPosition(false);
                    setFieldingPositionText(profile?.fielding_position || '');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.attributeValueContainer}>
              <Text style={styles.attributeValue}>{profile?.fielding_position || 'Not specified'}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingFieldingPosition(true)}
              >
                <Ionicons name="pencil" size={20} color="#f4511e" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Role */}
        <View style={styles.attributeItem}>
          <Text style={styles.attributeLabel}>Role</Text>
          {isEditingRole ? (
            <View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={roleText}
                  onValueChange={(itemValue) => setRoleText(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Batting" value="batting" />
                  <Picker.Item label="Bowling" value="bowling" />
                  <Picker.Item label="Allrounder" value="allrounder" />
                </Picker>
              </View>
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateRole}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingRole(false);
                    setRoleText(profile?.role || '');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.attributeValueContainer}>
              <Text style={styles.attributeValue}>
                {(profile?.role || 'Not specified').charAt(0).toUpperCase() + (profile?.role || 'Not specified').slice(1).toLowerCase()}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingRole(true)}
              >
                <Ionicons name="pencil" size={20} color="#f4511e" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{stats?.matches_played || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{stats?.total_runs || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Runs</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{stats?.total_wickets || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Wickets</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{profile?.batting_points || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Batting Points</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{profile?.bowling_points || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Bowling Points</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{profile?.allrounder_points || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Allrounder Points</Text>
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

        <View style={styles.contentArea}>
          {activeTab === 0 ? (
            // Photos Tab
            <View>
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => setShowPhotoForm(!showPhotoForm)}
                disabled={isUploadingPhoto}
              >
                <Text style={styles.simpleButtonText}>
                  {isUploadingPhoto ? 'Uploading...' : 'Add Photo'}
                </Text>
                {isUploadingPhoto && (
                  <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                )}
              </TouchableOpacity>

              {showPhotoForm && (
                <View style={styles.simpleForm}>
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Title"
                    value={photoTitle}
                    onChangeText={setPhotoTitle}
                    editable={!isUploadingPhoto}
                  />
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Description"
                    value={photoDescription}
                    onChangeText={setPhotoDescription}
                    multiline
                    editable={!isUploadingPhoto}
                  />
                  <TouchableOpacity 
                    style={[styles.simpleButton, isUploadingPhoto && styles.disabledButton]} 
                    onPress={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                  >
                    <Text style={styles.simpleButtonText}>
                      {isUploadingPhoto ? 'Uploading...' : 'Upload'}
                    </Text>
                    {isUploadingPhoto && (
                      <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                    )}
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
                disabled={isUploadingVideo}
              >
                <Text style={styles.simpleButtonText}>
                  {isUploadingVideo ? 'Uploading...' : 'Add Video'}
                </Text>
                {isUploadingVideo && (
                  <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                )}
              </TouchableOpacity>

              {showVideoForm && (
                <View style={styles.simpleForm}>
                  <TextInput
                    style={styles.simpleInput}
                    placeholder="Title"
                    value={videoTitle}
                    onChangeText={setVideoTitle}
                    editable={!isUploadingVideo}
                  />
                  <TextInput
                    style={[
                      styles.simpleInput,
                      videoUrl && !isValidYouTubeUrl(videoUrl) && styles.invalidInput
                    ]}
                    placeholder="YouTube Video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                    editable={!isUploadingVideo}
                  />
                  {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                    <Text style={styles.errorText}>
                      Please enter a valid YouTube URL
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={[
                      styles.simpleButton, 
                      isUploadingVideo && styles.disabledButton,
                      (!videoUrl || !isValidYouTubeUrl(videoUrl)) && styles.disabledButton
                    ]} 
                    onPress={handleVideoUpload}
                    disabled={isUploadingVideo || !videoUrl || !isValidYouTubeUrl(videoUrl)}
                  >
                    <Text style={styles.simpleButtonText}>
                      {isUploadingVideo ? 'Uploading...' : 'Upload'}
                    </Text>
                    {isUploadingVideo && (
                      <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                    )}
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    width: '30%',
    marginBottom: 20,
    alignItems: 'center',
  },
  roleStatItem: {
    width: 'auto',
    minWidth: '30%',
    paddingHorizontal: 15,
  },
  statValueContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f4511e',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
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
  attributeItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  attributeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  attributeValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attributeValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  attributeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonLoader: {
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  invalidInput: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
});

export default PlayerProfileScreen; 