import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider, Chip, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'batting' | 'bowling' | 'fielding' | 'team' | 'personal';
  type: 'milestone' | 'record' | 'award';
  icon: string;
  value?: string;
  format?: 'T20' | 'ODI' | 'Test' | 'All';
}

interface AchievementStats {
  totalAchievements: number;
  milestones: number;
  records: number;
  awards: number;
  byCategory: {
    batting: number;
    bowling: number;
    fielding: number;
    team: number;
    personal: number;
  };
  byFormat: {
    T20: number;
    ODI: number;
    Test: number;
    All: number;
  };
}

const PlayerAchievementsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');
  const [selectedType, setSelectedType] = useState<Achievement['type'] | 'all'>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch achievements from an API
    // For now, we'll use mock data
    const fetchAchievements = () => {
      // Simulate API call
      setTimeout(() => {
        const mockAchievements: Achievement[] = [
          {
            id: '1',
            title: 'First Century',
            description: 'Scored first century in T20 cricket',
            date: '2024-03-15',
            category: 'batting',
            type: 'milestone',
            icon: '🏏',
            value: '100 runs',
            format: 'T20',
          },
          {
            id: '2',
            title: 'Fastest Fifty',
            description: 'Scored fastest fifty in tournament history',
            date: '2024-03-10',
            category: 'batting',
            type: 'record',
            icon: '⚡',
            value: '18 balls',
            format: 'T20',
          },
          {
            id: '3',
            title: 'Hat-trick',
            description: 'Took a hat-trick in ODI match',
            date: '2024-03-05',
            category: 'bowling',
            type: 'milestone',
            icon: '🎯',
            value: '3 wickets',
            format: 'ODI',
          },
          {
            id: '4',
            title: 'Player of the Tournament',
            description: 'Awarded player of the tournament in T20 league',
            date: '2024-02-28',
            category: 'personal',
            type: 'award',
            icon: '🏆',
            format: 'T20',
          },
          {
            id: '5',
            title: 'Most Catches in Series',
            description: 'Took most catches in a Test series',
            date: '2024-02-20',
            category: 'fielding',
            type: 'record',
            icon: '👐',
            value: '12 catches',
            format: 'Test',
          },
        ];

        const mockStats: AchievementStats = {
          totalAchievements: 5,
          milestones: 2,
          records: 2,
          awards: 1,
          byCategory: {
            batting: 2,
            bowling: 1,
            fielding: 1,
            team: 0,
            personal: 1,
          },
          byFormat: {
            T20: 3,
            ODI: 1,
            Test: 1,
            All: 0,
          },
        };

        setAchievements(mockAchievements);
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchAchievements();
  }, []);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'batting':
        return theme.colors.primary;
      case 'bowling':
        return theme.colors.secondary;
      case 'fielding':
        return theme.colors.success;
      case 'team':
        return theme.colors.warning;
      case 'personal':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getTypeIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'milestone':
        return '🎯';
      case 'record':
        return '⚡';
      case 'award':
        return '🏆';
      default:
        return '🏅';
    }
  };

  const renderOverview = () => {
    if (!stats) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Achievement Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.totalAchievements}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.milestones}</Text>
                <Text style={styles.summaryLabel}>Milestones</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.records}</Text>
                <Text style={styles.summaryLabel}>Records</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.awards}</Text>
                <Text style={styles.summaryLabel}>Awards</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>By Category</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: getCategoryColor('batting') }]}>
                  {stats.byCategory.batting}
                </Text>
                <Text style={styles.statsLabel}>Batting</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: getCategoryColor('bowling') }]}>
                  {stats.byCategory.bowling}
                </Text>
                <Text style={styles.statsLabel}>Bowling</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: getCategoryColor('fielding') }]}>
                  {stats.byCategory.fielding}
                </Text>
                <Text style={styles.statsLabel}>Fielding</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: getCategoryColor('team') }]}>
                  {stats.byCategory.team}
                </Text>
                <Text style={styles.statsLabel}>Team</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: getCategoryColor('personal') }]}>
                  {stats.byCategory.personal}
                </Text>
                <Text style={styles.statsLabel}>Personal</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>By Format</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{stats.byFormat.T20}</Text>
                <Text style={styles.statsLabel}>T20</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{stats.byFormat.ODI}</Text>
                <Text style={styles.statsLabel}>ODI</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{stats.byFormat.Test}</Text>
                <Text style={styles.statsLabel}>Test</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsValue}>{stats.byFormat.All}</Text>
                <Text style={styles.statsLabel}>All</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderAchievements = () => {
    const filteredAchievements = achievements.filter(achievement => {
      const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
      const typeMatch = selectedType === 'all' || achievement.type === selectedType;
      return categoryMatch && typeMatch;
    });

    return (
      <View>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={selectedCategory === 'all'}
              onPress={() => setSelectedCategory('all')}
              style={styles.filterChip}
            >
              All Categories
            </Chip>
            <Chip
              selected={selectedCategory === 'batting'}
              onPress={() => setSelectedCategory('batting')}
              style={styles.filterChip}
            >
              Batting
            </Chip>
            <Chip
              selected={selectedCategory === 'bowling'}
              onPress={() => setSelectedCategory('bowling')}
              style={styles.filterChip}
            >
              Bowling
            </Chip>
            <Chip
              selected={selectedCategory === 'fielding'}
              onPress={() => setSelectedCategory('fielding')}
              style={styles.filterChip}
            >
              Fielding
            </Chip>
            <Chip
              selected={selectedCategory === 'team'}
              onPress={() => setSelectedCategory('team')}
              style={styles.filterChip}
            >
              Team
            </Chip>
            <Chip
              selected={selectedCategory === 'personal'}
              onPress={() => setSelectedCategory('personal')}
              style={styles.filterChip}
            >
              Personal
            </Chip>
          </ScrollView>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={selectedType === 'all'}
              onPress={() => setSelectedType('all')}
              style={styles.filterChip}
            >
              All Types
            </Chip>
            <Chip
              selected={selectedType === 'milestone'}
              onPress={() => setSelectedType('milestone')}
              style={styles.filterChip}
            >
              Milestones
            </Chip>
            <Chip
              selected={selectedType === 'record'}
              onPress={() => setSelectedType('record')}
              style={styles.filterChip}
            >
              Records
            </Chip>
            <Chip
              selected={selectedType === 'award'}
              onPress={() => setSelectedType('award')}
              style={styles.filterChip}
            >
              Awards
            </Chip>
          </ScrollView>
        </View>

        {filteredAchievements.map(achievement => (
          <Card key={achievement.id} style={styles.card}>
            <Card.Content>
              <View style={styles.achievementHeader}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.iconText}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
                <Chip
                  mode="outlined"
                  style={[styles.categoryChip, { borderColor: getCategoryColor(achievement.category) }]}
                >
                  {achievement.category}
                </Chip>
              </View>

              <Text style={styles.achievementDescription}>{achievement.description}</Text>

              {achievement.value && (
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{achievement.value}</Text>
                </View>
              )}

              <View style={styles.achievementFooter}>
                <Chip mode="outlined" style={styles.formatChip}>
                  {achievement.format}
                </Chip>
                <Chip mode="outlined" style={styles.typeChip}>
                  {getTypeIcon(achievement.type)} {achievement.type}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'overview' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('overview')}
            style={styles.tabButton}
          >
            Overview
          </Button>
          <Button
            mode={activeTab === 'achievements' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('achievements')}
            style={styles.tabButton}
          >
            Achievements
          </Button>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="trophy"
        onPress={() => navigation.navigate('AddAchievement')}
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
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDate: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 2,
  },
  categoryChip: {
    marginLeft: 8,
  },
  achievementDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  valueContainer: {
    backgroundColor: theme.colors.primary + '10',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  formatChip: {
    marginRight: 8,
  },
  typeChip: {
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

export default PlayerAchievementsScreen; 