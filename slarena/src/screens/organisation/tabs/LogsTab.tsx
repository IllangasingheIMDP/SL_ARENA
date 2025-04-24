import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import LogItem from '../../../components/organisation/LogItem';

const LogsTab = () => {
  const logs = [
    { id: '1', title: 'Team Registration', description: 'New team "Lions" registered', date: 'Today, 10:30 AM', type: 'registration' },
    { id: '2', title: 'Tournament Update', description: 'Tournament schedule updated for Premier League', date: 'Yesterday, 3:45 PM', type: 'update' },
    { id: '3', title: 'Match Result', description: 'Match #123 completed: Lions vs Eagles', date: 'Apr 22, 5:20 PM', type: 'result' },
    { id: '4', title: 'Player Transfer', description: 'Player John Doe transferred to Lions team', date: 'Apr 21, 11:15 AM', type: 'transfer' },
    { id: '5', title: 'Payment Received', description: 'Payment received for tournament registration', date: 'Apr 20, 2:30 PM', type: 'payment' },
  ];

  const renderLogItem = ({ item }: { item: any }) => (
    <LogItem
      title={item.title}
      description={item.description}
      date={item.date}
      type={item.type}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Activity Logs</Text>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});

export default LogsTab; 