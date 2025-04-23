import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Searchbar, Chip, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  format: 'T20' | 'ODI' | 'Test' | 'Friendly';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  spotsAvailable: number;
  totalSpots: number;
  organizer: string;
  price: number;
  status: 'open' | 'full' | 'closed';
  description: string;
}

const PlayerMatchDiscoveryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const matches: Match[] = [
    {
      id: '1',
      title: 'Weekend Cricket League',
      date: '2024-04-20',
      time: '14:00',
      venue: 'R. Premadasa Stadium',
      format: 'T20',
      level: 'Intermediate',
      spotsAvailable: 3,
      totalSpots: 22,
      organizer: 'Colombo Cricket Club',
      price: 500,
      status: 'open',
      description: 'Join our weekend cricket league for a fun and competitive experience. All players welcome!',
    },
    {
      id: '2',
      title: 'Professional Practice Match',
      date: '2024-04-22',
      time: '10:00',
      venue: 'SSC Ground',
      format: 'ODI',
      level: 'Professional',
      spotsAvailable: 0,
      totalSpots: 22,
      organizer: 'Sri Lanka Cricket Board',
      price: 0,
      status: 'full',
      description: 'Professional practice match for registered players only. High-intensity competition.',
    },
    {
      id: '3',
      title: 'Beginner Friendly Match',
      date: '2024-04-25',
      time: '15:00',
      venue: 'Community Sports Center',
      format: 'Friendly',
      level: 'Beginner',
      spotsAvailable: 5,
      totalSpots: 22,
      organizer: 'Youth Cricket Academy',
      price: 200,
      status: 'open',
      description: 'Perfect for beginners! Learn the basics of cricket in a friendly environment.',
    },
    {
      id: '4',
      title: 'Advanced T20 Tournament',
      date: '2024-04-28',
      time: '09:00',
      venue: 'Pallekele International Cricket Stadium',
      format: 'T20',
      level: 'Advanced',
      spotsAvailable: 2,
      totalSpots: 22,
      organizer: 'Kandy Cricket Association',
      price: 1000,
      status: 'open',
      description: 'Advanced level T20 tournament. Only experienced players should apply.',
    },
  ];

  const filteredMatches = matches.filter(match => {
    // Filter by search query
    const matchesSearch = match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by format
    const matchesFormat = !selectedFormat || match.format === selectedFormat;
    
    // Filter by level
    const matchesLevel = !selectedLevel || match.level === selectedLevel;
    
    return matchesSearch && matchesFormat && matchesLevel;
  });

  const renderMatchCard = ({ item }: { item: Match }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.matchTitle}>{item.title}</Text>
          <Chip 
            mode="outlined" 
            style={[
              styles.statusChip, 
              item.status === 'open' && styles.openChip,
              item.status === 'full' && styles.fullChip,
              item.status === 'closed' && styles.closedChip,
            ]}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>
        
        <View style={styles.matchDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>{item.date} at {item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Venue:</Text>
            <Text style={styles.detailValue}>{item.venue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Format:</Text>
            <Text style={styles.detailValue}>{item.format}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Level:</Text>
            <Text style={styles.detailValue}>{item.level}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Organizer:</Text>
            <Text style={styles.detailValue}>{item.organizer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Spots:</Text>
            <Text style={styles.detailValue}>
              {item.spotsAvailable} of {item.totalSpots} available
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>
              {item.price === 0 ? 'Free' : `Rs. ${item.price}`}
            </Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.description}>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
          style={styles.actionButton}
        >
          View Details
        </Button>
        {item.status === 'open' && (
          <Button 
            mode="contained" 
            onPress={() => handleJoinMatch(item.id)}
            style={styles.actionButton}
          >
            Join Match
          </Button>
        )}
      </Card.Actions>
    </Card>
  );

  const handleJoinMatch = (matchId: string) => {
    // TODO: Implement join match logic
    console.log(`Joining match ${matchId}`);
    navigation.navigate('MatchDetails', { matchId });
  };

  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Format:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <Chip 
          selected={selectedFormat === null}
          onPress={() => setSelectedFormat(null)}
          style={styles.chip}
        >
          All
        </Chip>
        <Chip 
          selected={selectedFormat === 'T20'}
          onPress={() => setSelectedFormat('T20')}
          style={styles.chip}
        >
          T20
        </Chip>
        <Chip 
          selected={selectedFormat === 'ODI'}
          onPress={() => setSelectedFormat('ODI')}
          style={styles.chip}
        >
          ODI
        </Chip>
        <Chip 
          selected={selectedFormat === 'Test'}
          onPress={() => setSelectedFormat('Test')}
          style={styles.chip}
        >
          Test
        </Chip>
        <Chip 
          selected={selectedFormat === 'Friendly'}
          onPress={() => setSelectedFormat('Friendly')}
          style={styles.chip}
        >
          Friendly
        </Chip>
      </ScrollView>
      
      <Text style={styles.filterTitle}>Level:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <Chip 
          selected={selectedLevel === null}
          onPress={() => setSelectedLevel(null)}
          style={styles.chip}
        >
          All
        </Chip>
        <Chip 
          selected={selectedLevel === 'Beginner'}
          onPress={() => setSelectedLevel('Beginner')}
          style={styles.chip}
        >
          Beginner
        </Chip>
        <Chip 
          selected={selectedLevel === 'Intermediate'}
          onPress={() => setSelectedLevel('Intermediate')}
          style={styles.chip}
        >
          Intermediate
        </Chip>
        <Chip 
          selected={selectedLevel === 'Advanced'}
          onPress={() => setSelectedLevel('Advanced')}
          style={styles.chip}
        >
          Advanced
        </Chip>
        <Chip 
          selected={selectedLevel === 'Professional'}
          onPress={() => setSelectedLevel('Professional')}
          style={styles.chip}
        >
          Professional
        </Chip>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Matches</Text>
        <Searchbar
          placeholder="Search matches..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      {renderFilterChips()}
      
      <FlatList
        data={filteredMatches}
        renderItem={renderMatchCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  searchBar: {
    elevation: 4,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  chipScroll: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  openChip: {
    backgroundColor: theme.colors.success + '20',
    borderColor: theme.colors.success,
  },
  fullChip: {
    backgroundColor: theme.colors.warning + '20',
    borderColor: theme.colors.warning,
  },
  closedChip: {
    backgroundColor: theme.colors.error + '20',
    borderColor: theme.colors.error,
  },
  matchDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  description: {
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default PlayerMatchDiscoveryScreen; 