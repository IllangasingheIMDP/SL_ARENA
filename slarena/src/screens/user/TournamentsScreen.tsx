import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TournamentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tournaments Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default TournamentsScreen; 