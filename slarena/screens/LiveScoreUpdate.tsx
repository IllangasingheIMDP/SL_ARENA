// ScoreUpdateScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

type Ball = {
  id: number;
  over: string;
  description: string;
};

export default function ScoreUpdateScreen() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [ballCount, setBallCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBall: Ball = {
        id: ballCount,
        over: `${Math.floor(ballCount / 6)}.${ballCount % 6}`,
        description: `Ball ${ballCount}: ${Math.random() > 0.5 ? '4 runs' : 'Dot ball'}`,
      };

      setBalls(prev => [newBall, ...prev]);
      setBallCount(prev => prev + 1);
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [ballCount]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Live Score (Ball by Ball)</Text>
      <FlatList
        data={balls}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ballContainer}>
            <Text style={styles.over}>{item.over}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ballContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  over: {
    fontSize: 16,
    color: 'gray',
  },
  description: {
    fontSize: 18,
  },
});
