import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, List, Avatar, Chip, FAB, Divider, TextInput, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface PlayerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  profileImage: string;
  jerseyNumber: number;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  teams: {
    id: string;
    name: string;
    logo: string;
    role: string;
    joinedDate: string;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    catches: number;
    stumpings: number;
    average: number;
    strikeRate: number;
    economyRate: number;
  };
  socialMedia: {
    platform: string;
    username: string;
    url: string;
  }[];
}

const PlayerProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    // In a real app, this would fetch profile data from an API
    // For now, we'll use mock data
    const fetchProfileData = () => {
      // Simulate API call
      setTimeout(() => {
        const mockProfile: PlayerProfile = {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+94 77 123 4567',
          dateOfBirth: '1995-06-15',
          gender: 'male',
          nationality: 'Sri Lankan',
          profileImage: 'https://via.placeholder.com/200',
          jerseyNumber: 7,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-spin',
          teams: [
            {
              id: '1',
              name: 'Kandy Warriors',
              logo: 'https://via.placeholder.com/100',
              role: 'Captain',
              joinedDate: '2020-01-15',
            },
            {
              id: '2',
              name: 'Colombo Kings',
              logo: 'https://via.placeholder.com/100',
              role: 'Player',
              joinedDate: '2018-03-10',
            },
          ],
          achievements: [
            {
              id: '1',
              title: 'Man of the Match',
              description: 'Scored 120 runs and took 3 wickets',
              date: '2023-12-05',
            },
            {
              id: '2',
              title: 'Best Batsman Award',
              description: 'Highest run scorer in the tournament',
              date: '2023-10-20',
            },
            {
              id: '3',
              title: 'Century Milestone',
              description: 'Scored 100 runs in a single match',
              date: '2023-08-15',
            },
          ],
          stats: {
            matches: 45,
            runs: 1250,
            wickets: 15,
            catches: 25,
            stumpings: 0,
            average: 35.7,
            strikeRate: 125.5,
            economyRate: 7.2,
          },
          socialMedia: [
            {
              platform: 'Instagram',
              username: 'johnsmith',
              url: 'https://instagram.com/johnsmith',
            },
            {
              platform: 'Twitter',
              username: 'johnsmith',
              url: 'https://twitter.com/johnsmith',
            },
            {
              platform: 'Facebook',
              username: 'johnsmith',
              url: 'https://facebook.com/johnsmith',
            },
          ],
        };
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
        setLoading(false);
      }, 1000);
    };

    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, this would save the profile data to an API
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof PlayerProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const renderPersonalInfo = () => {
    if (!profile) return null;

    if (isEditing && editedProfile) {
      return (
        <Card style={styles.card}>
          <Card.Title title="Personal Information" />
          <Card.Content>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Name</Text>
              <TextInput
                value={editedProfile.name}
                onChangeText={(text) => handleChange('name', text)}
                style={styles.input}
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Email</Text>
              <TextInput
                value={editedProfile.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.input}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Phone</Text>
              <TextInput
                value={editedProfile.phone}
                onChangeText={(text) => handleChange('phone', text)}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Date of Birth</Text>
              <TextInput
                value={editedProfile.dateOfBirth}
                onChangeText={(text) => handleChange('dateOfBirth', text)}
                style={styles.input}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Gender</Text>
              <View style={styles.chipContainer}>
                {['male', 'female', 'other'].map((gender) => (
                  <Chip
                    key={gender}
                    selected={editedProfile.gender === gender}
                    onPress={() => handleChange('gender', gender)}
                    style={styles.genderChip}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Chip>
                ))}
              </View>
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Nationality</Text>
              <TextInput
                value={editedProfile.nationality}
                onChangeText={(text) => handleChange('nationality', text)}
                style={styles.input}
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Jersey Number</Text>
              <TextInput
                value={editedProfile.jerseyNumber.toString()}
                onChangeText={(text) => handleChange('jerseyNumber', parseInt(text) || 0)}
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Role</Text>
              <TextInput
                value={editedProfile.role}
                onChangeText={(text) => handleChange('role', text)}
                style={styles.input}
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Batting Style</Text>
              <TextInput
                value={editedProfile.battingStyle}
                onChangeText={(text) => handleChange('battingStyle', text)}
                style={styles.input}
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Bowling Style</Text>
              <TextInput
                value={editedProfile.bowlingStyle}
                onChangeText={(text) => handleChange('bowlingStyle', text)}
                style={styles.input}
              />
            </View>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Image size={100} source={{ uri: profile.profileImage }} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileRole}>{profile.role}</Text>
              <Text style={styles.profileNumber}>#{profile.jerseyNumber}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Title title="Personal Information" />
        <Card.Content>
          <List.Item
            title="Email"
            description={profile.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Phone"
            description={profile.phone}
            left={props => <List.Icon {...props} icon="phone" />}
          />
          <Divider />
          <List.Item
            title="Date of Birth"
            description={formatDate(profile.dateOfBirth)}
            left={props => <List.Icon {...props} icon="calendar" />}
          />
          <Divider />
          <List.Item
            title="Gender"
            description={profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
            left={props => <List.Icon {...props} icon="account" />}
          />
          <Divider />
          <List.Item
            title="Nationality"
            description={profile.nationality}
            left={props => <List.Icon {...props} icon="earth" />}
          />
          <Divider />
          <List.Item
            title="Batting Style"
            description={profile.battingStyle}
            left={props => <List.Icon {...props} icon="bat" />}
          />
          <Divider />
          <List.Item
            title="Bowling Style"
            description={profile.bowlingStyle}
            left={props => <List.Icon {...props} icon="bowling" />}
          />
        </Card.Content>
      </Card>
    );
  };

  const renderTeams = () => {
    if (!profile) return null;

    return (
      <Card style={styles.card}>
        <Card.Title title="Teams" />
        <Card.Content>
          {profile.teams.map(team => (
            <View key={team.id} style={styles.teamItem}>
              <View style={styles.teamInfo}>
                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                <View style={styles.teamDetails}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamRole}>{team.role}</Text>
                  <Text style={styles.teamDate}>Joined: {formatDate(team.joinedDate)}</Text>
                </View>
              </View>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('TeamDetails', { teamId: team.id })}
              >
                View
              </Button>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderAchievements = () => {
    if (!profile) return null;

    return (
      <Card style={styles.card}>
        <Card.Title title="Achievements" />
        <Card.Content>
          {profile.achievements.map(achievement => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Avatar.Icon size={40} icon="trophy" color={theme.colors.surface} style={{ backgroundColor: theme.colors.primary }} />
              </View>
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <Text style={styles.achievementDate}>{formatDate(achievement.date)}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderStats = () => {
    if (!profile) return null;

    return (
      <Card style={styles.card}>
        <Card.Title title="Statistics" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.matches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.runs}</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.wickets}</Text>
              <Text style={styles.statLabel}>Wickets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.catches}</Text>
              <Text style={styles.statLabel}>Catches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.stumpings}</Text>
              <Text style={styles.statLabel}>Stumpings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.average.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.strikeRate.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Strike Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.economyRate.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Economy Rate</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderSocialMedia = () => {
    if (!profile) return null;

    return (
      <Card style={styles.card}>
        <Card.Title title="Social Media" />
        <Card.Content>
          {profile.socialMedia.map(social => (
            <View key={social.platform} style={styles.socialItem}>
              <View style={styles.socialInfo}>
                <IconButton
                  icon={getSocialIcon(social.platform)}
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.socialPlatform}>{social.platform}</Text>
              </View>
              <TouchableOpacity onPress={() => handleSocialLink(social.url)}>
                <Text style={styles.socialUsername}>@{social.username}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'instagram';
      case 'twitter':
        return 'twitter';
      case 'facebook':
        return 'facebook';
      default:
        return 'web';
    }
  };

  const handleSocialLink = (url: string) => {
    // In a real app, this would open the URL in a browser
    console.log(`Opening URL: ${url}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderPersonalInfo()}
        {renderTeams()}
        {renderAchievements()}
        {renderStats()}
        {renderSocialMedia()}
      </ScrollView>

      {isEditing ? (
        <View style={styles.editActions}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      ) : (
        <FAB
          style={styles.fab}
          icon="pencil"
          onPress={handleEdit}
          color={theme.colors.surface}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  profileNumber: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  teamDate: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: theme.colors.background + '20',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  socialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialPlatform: {
    fontSize: 16,
    marginLeft: 8,
  },
  socialUsername: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  editField: {
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.secondary,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genderChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 8,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerProfileScreen; 