import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Dialog, Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: string;
  status: 'active' | 'injured' | 'suspended';
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  founded: string;
  level: string;
  status: 'active' | 'inactive';
  members: TeamMember[];
  achievements: string[];
  description: string;
}

const OrganizerTeamsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    founded: '',
    level: '',
    status: 'active',
    members: '',
    achievements: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const fetchTeams = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockTeams: Team[] = [
          {
            id: '1',
            name: 'Colombo Kings',
            logo: 'https://via.placeholder.com/100',
            founded: '2020-01-01',
            level: 'Professional',
            status: 'active',
            members: [
              {
                id: '1',
                name: 'John Doe',
                role: 'Captain',
                position: 'Batsman',
                status: 'active',
                avatar: 'https://via.placeholder.com/50',
              },
              {
                id: '2',
                name: 'Jane Smith',
                role: 'Vice Captain',
                position: 'Bowler',
                status: 'active',
                avatar: 'https://via.placeholder.com/50',
              },
            ],
            achievements: [
              'Premier League Champions 2023',
              'Super Cup Winners 2022',
            ],
            description: 'One of the top professional cricket teams in Colombo',
          },
          {
            id: '2',
            name: 'Kandy Warriors',
            logo: 'https://via.placeholder.com/100',
            founded: '2021-01-01',
            level: 'Semi-Professional',
            status: 'active',
            members: [
              {
                id: '3',
                name: 'Mike Johnson',
                role: 'Captain',
                position: 'All-rounder',
                status: 'active',
                avatar: 'https://via.placeholder.com/50',
              },
              {
                id: '4',
                name: 'Sarah Wilson',
                role: 'Player',
                position: 'Wicket-keeper',
                status: 'injured',
                avatar: 'https://via.placeholder.com/50',
              },
            ],
            achievements: [
              'Regional League Champions 2023',
              'Cup Runners-up 2022',
            ],
            description: 'Emerging cricket team from Kandy region',
          },
        ];
        setTeams(mockTeams);
        setLoading(false);
      }, 1000);
    };

    fetchTeams();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.founded.trim()) {
      newErrors.founded = 'Founded date is required';
    }

    if (!formData.level.trim()) {
      newErrors.level = 'Level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // In a real app, this would make an API call to create/update the team
      setTimeout(() => {
        const newTeam: Team = {
          id: selectedTeam?.id || String(teams.length + 1),
          name: formData.name,
          logo: formData.logo || 'https://via.placeholder.com/100',
          founded: formData.founded,
          level: formData.level,
          status: formData.status as 'active' | 'inactive',
          members: formData.members.split(',').map(member => ({
            id: String(Math.random()),
            name: member.trim(),
            role: 'Player',
            position: 'TBD',
            status: 'active',
            avatar: 'https://via.placeholder.com/50',
          })),
          achievements: formData.achievements.split(',').map(a => a.trim()),
          description: formData.description,
        };

        if (selectedTeam) {
          setTeams(prev => prev.map(t => (t.id === selectedTeam.id ? newTeam : t)));
        } else {
          setTeams(prev => [...prev, newTeam]);
        }

        setLoading(false);
        setShowAddDialog(false);
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      founded: '',
      level: '',
      status: 'active',
      members: '',
      achievements: '',
      description: '',
    });
    setErrors({});
    setSelectedTeam(null);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      logo: team.logo,
      founded: team.founded,
      level: team.level,
      status: team.status,
      members: team.members.map(m => m.name).join(', '),
      achievements: team.achievements.join(', '),
      description: team.description,
    });
    setShowAddDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'injured':
        return theme.colors.warning;
      case 'suspended':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const renderTeamCard = (team: Team) => (
    <Card key={team.id} style={styles.card}>
      <Card.Cover source={{ uri: team.logo }} />
      <Card.Content>
        <View style={styles.headerContainer}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(team.status) }]}
            textStyle={{ color: getStatusColor(team.status) }}
          >
            {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
          </Chip>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.founded}>Founded: {new Date(team.founded).toLocaleDateString()}</Text>
          <Text style={styles.level}>Level: {team.level}</Text>
          <Text style={styles.description}>{team.description}</Text>
        </View>

        <View style={styles.membersContainer}>
          <Text style={styles.sectionTitle}>Team Members</Text>
          {team.members.map(member => (
            <View key={member.id} style={styles.memberItem}>
              <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role} - {member.position}</Text>
              </View>
              <Chip
                mode="outlined"
                style={[styles.memberStatusChip, { borderColor: getMemberStatusColor(member.status) }]}
                textStyle={{ color: getMemberStatusColor(member.status) }}
              >
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </Chip>
            </View>
          ))}
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {team.achievements.map((achievement, index) => (
            <Text key={index} style={styles.achievement}>• {achievement}</Text>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEdit(team)}>Edit</Button>
        <Button onPress={() => navigation.navigate('TeamDetails', { team })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {teams.map(renderTeamCard)}
      </ScrollView>

      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>{selectedTeam ? 'Edit Team' : 'Add New Team'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Team Name"
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              style={styles.input}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Logo URL"
              value={formData.logo}
              onChangeText={text => setFormData(prev => ({ ...prev, logo: text }))}
              style={styles.input}
            />

            <TextInput
              label="Founded Date (YYYY-MM-DD)"
              value={formData.founded}
              onChangeText={text => setFormData(prev => ({ ...prev, founded: text }))}
              style={styles.input}
              error={!!errors.founded}
            />
            <HelperText type="error" visible={!!errors.founded}>
              {errors.founded}
            </HelperText>

            <TextInput
              label="Level"
              value={formData.level}
              onChangeText={text => setFormData(prev => ({ ...prev, level: text }))}
              style={styles.input}
              error={!!errors.level}
            />
            <HelperText type="error" visible={!!errors.level}>
              {errors.level}
            </HelperText>

            <TextInput
              label="Members (comma-separated)"
              value={formData.members}
              onChangeText={text => setFormData(prev => ({ ...prev, members: text }))}
              style={styles.input}
            />

            <TextInput
              label="Achievements (comma-separated)"
              value={formData.achievements}
              onChangeText={text => setFormData(prev => ({ ...prev, achievements: text }))}
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onPress={handleSubmit} loading={loading}>
              {selectedTeam ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          resetForm();
          setShowAddDialog(true);
        }}
        color={theme.colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  detailsContainer: {
    marginTop: 16,
  },
  founded: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  level: {
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    marginTop: 8,
  },
  membersContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberRole: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  memberStatusChip: {
    marginLeft: 8,
  },
  achievementsContainer: {
    marginTop: 16,
  },
  achievement: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default OrganizerTeamsScreen; 