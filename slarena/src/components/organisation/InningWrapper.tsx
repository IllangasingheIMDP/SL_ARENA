import React from 'react';
import { View, StyleSheet } from 'react-native';
import InningsScoreInput from '../score/InningsScoreInput';

interface InningWrapperProps {
  matchId: number;
  inningNumber: number;
}

const InningWrapper: React.FC<InningWrapperProps> = ({
  matchId,
  inningNumber,
}) => {
  return (
    <View style={styles.container}>
      <InningsScoreInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default InningWrapper;