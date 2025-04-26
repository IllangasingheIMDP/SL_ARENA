import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import LogItem from '../../../components/organisation/LogItem';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const LogsTab = () => {
  const logs = [
    { id: '1', title: 'Team Registration', description: 'New team "Lions" registered', date: 'Today, 10:30 AM', type: 'registration' },
    { id: '2', title: 'Tournament Update', description: 'Tournament schedule updated for Premier League', date: 'Yesterday, 3:45 PM', type: 'update' },
    { id: '3', title: 'Match Result', description: 'Match #123 completed: Lions vs Eagles', date: 'Apr 22, 5:20 PM', type: 'result' },
    { id: '4', title: 'Player Transfer', description: 'Player John Doe transferred to Lions team', date: 'Apr 21, 11:15 AM', type: 'transfer' },
    { id: '5', title: 'Payment Received', description: 'Payment received for tournament registration', date: 'Apr 20, 2:30 PM', type: 'payment' },
  ];

  const renderLogItem = ({ item }: { item: any }) => (
    <View style={styles.logItemContainer}>
      <LogItem
        title={item.title}
        description={item.description}
        date={item.date}
        type={item.type}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.gradient}
        >
          <BlurView intensity={20} style={styles.blurContainer}>
            <Text style={styles.tabTitle}>Activity Logs</Text>
            <Text style={styles.subtitle}>Track all your organization's activities</Text>
          </BlurView>
        </LinearGradient>
      </View>

      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  listContainer: {
    paddingTop: 220,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logItemContainer: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LogsTab; 