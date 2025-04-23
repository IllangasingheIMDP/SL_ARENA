import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, List, Divider, Button, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface PerformanceStats {
  batting: {
    matches: number;
    runs: number;
    average: number;
    strikeRate: number;
    hundreds: number;
    fifties: number;
  };
  bowling: {
    matches: number;
    wickets: number;
    economy: number;
    average: number;
    bestFigures: string;
  };
  fielding: {
    catches: number;
    stumpings: number;
    runOuts: number;
  };
}

interface MatchPerformance {
  id: string;
  date: string;
  opponent: string;
  result: string;
  batting: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
  };
  bowling?: {
    overs: number;
    runs: number;
    wickets: number;
    economy: number;
  };
}

const PlayerPerformanceScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [selectedFormat, setSelectedFormat] = useState('all');

  const performanceStats: PerformanceStats = {
    batting: {
      matches: 25,
      runs: 1250,
      average: 52.08,
      strikeRate: 135.5,
      hundreds: 3,
      fifties: 8,
    },
    bowling: {
      matches: 25,
      wickets: 15,
      economy: 7.8,
      average: 28.5,
      bestFigures: '3/25',
    },
    fielding: {
      catches: 12,
      stumpings: 0,
      runOuts: 3,
    },
  };

  const recentPerformances: MatchPerformance[] = [
    {
      id: '1',
      date: '2024-04-10',
      opponent: 'Colombo Kings',
      result: 'Won by 5 wickets',
      batting: {
        runs: 85,
        balls: 54,
        fours: 8,
        sixes: 3,
      },
      bowling: {
        overs: 4,
        runs: 32,
        wickets: 2,
        economy: 8.0,
      },
    },
    {
      id: '2',
      date: '2024-04-05',
      opponent: 'Kandy Warriors',
      result: 'Lost by 3 runs',
      batting: {
        runs: 92,
        balls: 48,
        fours: 10,
        sixes: 4,
      },
    },
  ];

  const renderStatsCard = (title: string, stats: Record<string, number | string>) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>{title}</Text>
        {Object.entries(stats).map(([key, value]) => (
          <List.Item
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            description={value.toString()}
            left={props => <List.Icon {...props} icon="chart-bar" />}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderMatchPerformance = (performance: MatchPerformance) => (
    <Card style={styles.card} key={performance.id}>
      <Card.Content>
        <Text style={styles.matchTitle}>
          vs {performance.opponent}
        </Text>
        <Text style={styles.matchDate}>{performance.date}</Text>
        <Text style={styles.matchResult}>{performance.result}</Text>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Batting</Text>
        <List.Item
          title="Runs"
          description={`${performance.batting.runs} (${performance.batting.balls}b)`}
          left={props => <List.Icon {...props} icon="cricket" />}
        />
        <List.Item
          title="Boundaries"
          description={`${performance.batting.fours} fours, ${performance.batting.sixes} sixes`}
          left={props => <List.Icon {...props} icon="border-all" />}
        />

        {performance.bowling && (
          <>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Bowling</Text>
            <List.Item
              title="Figures"
              description={`${performance.bowling.wickets}/${performance.bowling.runs} (${performance.bowling.overs} ov)`}
              left={props => <List.Icon {...props} icon="bow-arrow" />}
            />
            <List.Item
              title="Economy"
              description={performance.bowling.economy.toString()}
              left={props => <List.Icon {...props} icon="speedometer" />}
            />
          </>
        )}
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('MatchDetails', { matchId: performance.id })}
        >
          View Full Scorecard
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Performance Statistics</Text>
          <SegmentedButtons
            value={selectedFormat}
            onValueChange={setSelectedFormat}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 't20', label: 'T20' },
              { value: 'odi', label: 'ODI' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          {renderStatsCard('Batting', performanceStats.batting)}
          {renderStatsCard('Bowling', performanceStats.bowling)}
          {renderStatsCard('Fielding', performanceStats.fielding)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Performances</Text>
          {recentPerformances.map(renderMatchPerformance)}
        </View>
      </ScrollView>
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
  segmentedButtons: {
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchDate: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  matchResult: {
    fontSize: 16,
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
  },
});

export default PlayerPerformanceScreen; 