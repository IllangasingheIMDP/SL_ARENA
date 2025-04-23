import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, List, Divider, Chip, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceComparison {
  metric: string;
  playerValue: number;
  averageValue: number;
  percentile: number;
}

interface PerformanceTrend {
  date: string;
  value: number;
}

const PlayerPerformanceAnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'overview' | 'batting' | 'bowling' | 'fielding'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // Mock performance metrics data
  const performanceMetrics: PerformanceMetric[] = [
    {
      id: '1',
      name: 'Batting Average',
      value: 42.5,
      previousValue: 38.2,
      unit: '',
      trend: 'up',
    },
    {
      id: '2',
      name: 'Strike Rate',
      value: 135.8,
      previousValue: 128.4,
      unit: '',
      trend: 'up',
    },
    {
      id: '3',
      name: 'Economy Rate',
      value: 7.2,
      previousValue: 7.8,
      unit: '',
      trend: 'down',
    },
    {
      id: '4',
      name: 'Wicket Rate',
      value: 1.8,
      previousValue: 1.5,
      unit: '',
      trend: 'up',
    },
    {
      id: '5',
      name: 'Catch Rate',
      value: 0.85,
      previousValue: 0.78,
      unit: '',
      trend: 'up',
    },
    {
      id: '6',
      name: 'Run Out Rate',
      value: 0.12,
      previousValue: 0.08,
      unit: '',
      trend: 'up',
    },
  ];

  // Mock performance comparison data
  const performanceComparisons: PerformanceComparison[] = [
    {
      metric: 'Batting Average',
      playerValue: 42.5,
      averageValue: 35.2,
      percentile: 85,
    },
    {
      metric: 'Strike Rate',
      playerValue: 135.8,
      averageValue: 125.4,
      percentile: 78,
    },
    {
      metric: 'Economy Rate',
      playerValue: 7.2,
      averageValue: 8.1,
      percentile: 82,
    },
    {
      metric: 'Wicket Rate',
      playerValue: 1.8,
      averageValue: 1.4,
      percentile: 75,
    },
    {
      metric: 'Catch Rate',
      playerValue: 0.85,
      averageValue: 0.72,
      percentile: 88,
    },
  ];

  // Mock performance trend data
  const battingTrends: PerformanceTrend[] = [
    { date: '2024-01', value: 35 },
    { date: '2024-02', value: 38 },
    { date: '2024-03', value: 42 },
    { date: '2024-04', value: 45 },
  ];

  const bowlingTrends: PerformanceTrend[] = [
    { date: '2024-01', value: 8.2 },
    { date: '2024-02', value: 7.9 },
    { date: '2024-03', value: 7.5 },
    { date: '2024-04', value: 7.2 },
  ];

  const fieldingTrends: PerformanceTrend[] = [
    { date: '2024-01', value: 0.75 },
    { date: '2024-02', value: 0.78 },
    { date: '2024-03', value: 0.82 },
    { date: '2024-04', value: 0.85 },
  ];

  const getTrendColor = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up':
        return theme.colors.success;
      case 'down':
        return theme.colors.error;
      case 'stable':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
        return 'trending-neutral';
      default:
        return 'trending-neutral';
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return theme.colors.success;
    if (percentile >= 75) return theme.colors.primary;
    if (percentile >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderOverview = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              {performanceMetrics.map(metric => (
                <View key={metric.id} style={styles.metricItem}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <View style={styles.metricValueContainer}>
                    <Text style={styles.metricValue}>
                      {metric.value}{metric.unit}
                    </Text>
                    <View style={[styles.trendIndicator, { backgroundColor: getTrendColor(metric.trend) }]}>
                      <Text style={styles.trendText}>
                        {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                        {(Math.abs(metric.value - metric.previousValue)).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Performance Comparison</Text>
            <View style={styles.comparisonList}>
              {performanceComparisons.map((comparison, index) => (
                <React.Fragment key={index}>
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonMetric}>{comparison.metric}</Text>
                    <View style={styles.comparisonValues}>
                      <Text style={styles.playerValue}>{comparison.playerValue}</Text>
                      <Text style={styles.averageValue}>Avg: {comparison.averageValue}</Text>
                    </View>
                    <View style={[styles.percentileBadge, { backgroundColor: getPercentileColor(comparison.percentile) }]}>
                      <Text style={styles.percentileText}>{comparison.percentile}%</Text>
                    </View>
                  </View>
                  {index < performanceComparisons.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderBattingAnalytics = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Batting Performance</Text>
            <View style={styles.trendChart}>
              {/* In a real app, this would be a chart component */}
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Batting Average Trend</Text>
                <View style={styles.chartBars}>
                  {battingTrends.map((trend, index) => (
                    <View key={index} style={styles.chartBarContainer}>
                      <View 
                        style={[
                          styles.chartBar, 
                          { 
                            height: (trend.value / 50) * 150,
                            backgroundColor: theme.colors.primary
                          }
                        ]} 
                      />
                      <Text style={styles.chartLabel}>{trend.date}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Batting Insights</Text>
            <List.Section>
              <List.Item
                title="Strong Against Spin"
                description="Your strike rate against spin bowling is 15% higher than average"
                left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
              />
              <Divider />
              <List.Item
                title="Improvement Area: Pace Bowling"
                description="Your average against pace bowling has decreased by 8% this month"
                left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.warning} />}
              />
              <Divider />
              <List.Item
                title="Consistency"
                description="Your batting consistency has improved by 12% over the last 3 months"
                left={props => <List.Icon {...props} icon="trending-up" color={theme.colors.primary} />}
              />
            </List.Section>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderBowlingAnalytics = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Bowling Performance</Text>
            <View style={styles.trendChart}>
              {/* In a real app, this would be a chart component */}
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Economy Rate Trend</Text>
                <View style={styles.chartBars}>
                  {bowlingTrends.map((trend, index) => (
                    <View key={index} style={styles.chartBarContainer}>
                      <View 
                        style={[
                          styles.chartBar, 
                          { 
                            height: (trend.value / 10) * 150,
                            backgroundColor: theme.colors.secondary
                          }
                        ]} 
                      />
                      <Text style={styles.chartLabel}>{trend.date}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Bowling Insights</Text>
            <List.Section>
              <List.Item
                title="Death Overs Specialist"
                description="Your economy rate in death overs is 20% better than average"
                left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
              />
              <Divider />
              <List.Item
                title="Improvement Area: Powerplay"
                description="Your wicket-taking ability in powerplay has decreased by 5% this month"
                left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.warning} />}
              />
              <Divider />
              <List.Item
                title="Consistency"
                description="Your bowling consistency has improved by 8% over the last 3 months"
                left={props => <List.Icon {...props} icon="trending-up" color={theme.colors.primary} />}
              />
            </List.Section>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderFieldingAnalytics = () => {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Fielding Performance</Text>
            <View style={styles.trendChart}>
              {/* In a real app, this would be a chart component */}
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Catch Rate Trend</Text>
                <View style={styles.chartBars}>
                  {fieldingTrends.map((trend, index) => (
                    <View key={index} style={styles.chartBarContainer}>
                      <View 
                        style={[
                          styles.chartBar, 
                          { 
                            height: (trend.value / 1) * 150,
                            backgroundColor: theme.colors.info
                          }
                        ]} 
                      />
                      <Text style={styles.chartLabel}>{trend.date}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Fielding Insights</Text>
            <List.Section>
              <List.Item
                title="Outfield Specialist"
                description="Your catch rate in the outfield is 25% higher than average"
                left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
              />
              <Divider />
              <List.Item
                title="Improvement Area: Close-in Fielding"
                description="Your reaction time for close-in catches has increased by 0.2 seconds this month"
                left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.warning} />}
              />
              <Divider />
              <List.Item
                title="Consistency"
                description="Your fielding consistency has improved by 15% over the last 3 months"
                left={props => <List.Icon {...props} icon="trending-up" color={theme.colors.primary} />}
              />
            </List.Section>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance Analytics</Text>
        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === 'overview' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('overview')}
            style={styles.tabButton}
          >
            Overview
          </Button>
          <Button
            mode={activeTab === 'batting' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('batting')}
            style={styles.tabButton}
          >
            Batting
          </Button>
          <Button
            mode={activeTab === 'bowling' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('bowling')}
            style={styles.tabButton}
          >
            Bowling
          </Button>
          <Button
            mode={activeTab === 'fielding' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('fielding')}
            style={styles.tabButton}
          >
            Fielding
          </Button>
        </View>
        <View style={styles.filterContainer}>
          <Chip
            selected={timeRange === 'week'}
            onPress={() => setTimeRange('week')}
            style={styles.filterChip}
          >
            Week
          </Chip>
          <Chip
            selected={timeRange === 'month'}
            onPress={() => setTimeRange('month')}
            style={styles.filterChip}
          >
            Month
          </Chip>
          <Chip
            selected={timeRange === 'year'}
            onPress={() => setTimeRange('year')}
            style={styles.filterChip}
          >
            Year
          </Chip>
          <Chip
            selected={timeRange === 'all'}
            onPress={() => setTimeRange('all')}
            style={styles.filterChip}
          >
            All Time
          </Chip>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'batting' && renderBattingAnalytics()}
        {activeTab === 'bowling' && renderBowlingAnalytics()}
        {activeTab === 'fielding' && renderFieldingAnalytics()}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="download"
        onPress={() => navigation.navigate('ExportAnalytics')}
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
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    margin: 4,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    marginBottom: 16,
    padding: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    elevation: 2,
  },
  metricName: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  trendIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendText: {
    fontSize: 12,
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  comparisonList: {
    marginTop: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  comparisonMetric: {
    flex: 1,
    fontSize: 14,
  },
  comparisonValues: {
    flex: 1,
    alignItems: 'flex-end',
  },
  playerValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  averageValue: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  percentileBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  percentileText: {
    fontSize: 12,
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  trendChart: {
    height: 200,
    marginVertical: 16,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  chartBarContainer: {
    alignItems: 'center',
    width: '20%',
  },
  chartBar: {
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default PlayerPerformanceAnalyticsScreen; 