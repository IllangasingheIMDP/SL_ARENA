import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';

type Stats = {
  matches_played: number;
  total_runs: number;
  total_wickets: number;
};

export default function PlayerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://192.168.8.127:5000/api/v1/players/stat') // use your LAN IP if testing on a real device
      .then(res => {
        console.log(res.data)
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Player Dashboard</Text>
      {stats ? (
        <View style={styles.card}>
          <Text style={styles.label}>Matches Played</Text>
          <Text style={styles.value}>{stats.matches_played}</Text>

          <Text style={styles.label}>Total Runs</Text>
          <Text style={styles.value}>{stats.total_runs}</Text>

          <Text style={styles.label}>Total Wickets</Text>
          <Text style={styles.value}>{stats.total_wickets}</Text>
        </View>
      ) : (
        <Text style={{ color: 'red' }}>Failed to load stats</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginTop: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
});
