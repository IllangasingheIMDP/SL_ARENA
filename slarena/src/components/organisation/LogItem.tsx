import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LogItemProps {
  title: string;
  description: string;
  date: string;
  type: string;
}

const LogItem: React.FC<LogItemProps> = ({ title, description, date, type }) => {
  const getIconName = (type: string) => {
    switch (type) {
      case 'registration': return 'person-add';
      case 'update': return 'update';
      case 'result': return 'emoji-events';
      case 'transfer': return 'swap-horiz';
      case 'payment': return 'payment';
      default: return 'info';
    }
  };

  return (
    <View style={styles.logItem}>
      <View style={styles.logIconContainer}>
        <Icon name={getIconName(type)} size={24} color="#4CAF50" />
      </View>
      <View style={styles.logContent}>
        <Text style={styles.logTitle}>{title}</Text>
        <Text style={styles.logDescription}>{description}</Text>
        <Text style={styles.logDate}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  logDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  logDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default LogItem; 