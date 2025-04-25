import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMatch, MatchPhase } from '../../context/MatchContext';

const { width } = Dimensions.get('window');

interface MatchPhaseNavigatorProps {
  onPhaseChange?: (phase: MatchPhase) => void;
}

const MatchPhaseNavigator: React.FC<MatchPhaseNavigatorProps> = ({
  onPhaseChange,
}) => {
  const { matchState, navigateToPhase, isPhaseCompleted } = useMatch();
  
  const handlePhasePress = async (phase: MatchPhase) => {
    const success = await navigateToPhase(phase);
    if (success && onPhaseChange) {
      onPhaseChange(phase);
    }
  };
  
  const phases: Array<{
    phase: MatchPhase;
    icon: string;
    label: string;
  }> = [
    { phase: 'toss', icon: 'sports', label: 'Toss' },
    { phase: 'team_selection', icon: 'people', label: 'Teams' },
    { phase: 'inning_one', icon: 'looks-one', label: 'Inning 1' },
    { phase: 'inning_two', icon: 'looks-two', label: 'Inning 2' },
    { phase: 'finished', icon: 'emoji-events', label: 'Summary' },
  ];
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.phaseContainer}>
          {phases.map((item, index) => (
            <React.Fragment key={item.phase}>
              <TouchableOpacity
                style={[
                  styles.phaseButton,
                  matchState.currentPhase === item.phase && styles.activePhaseButton,
                  isPhaseCompleted(item.phase) && styles.completedPhaseButton
                ]}
                onPress={() => handlePhasePress(item.phase)}
              >
                <Icon
                  name={item.icon}
                  size={24}
                  color={
                    matchState.currentPhase === item.phase || isPhaseCompleted(item.phase)
                      ? '#fff'
                      : '#666'
                  }
                />
                <Text
                  style={[
                    styles.phaseText,
                    (matchState.currentPhase === item.phase || isPhaseCompleted(item.phase)) &&
                      styles.activePhaseText,
                  ]}
                >
                  {item.label}
                </Text>
                {isPhaseCompleted(item.phase) && (
                  <View style={styles.completedIconContainer}>
                    <Icon name="check-circle" size={14} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              
              {index < phases.length - 1 && (
                <View style={[
                  styles.connector,
                  isPhaseCompleted(item.phase) && styles.completedConnector
                ]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  phaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  phaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: width * 0.22,
  },
  activePhaseButton: {
    backgroundColor: '#4CAF50',
  },
  completedPhaseButton: {
    backgroundColor: '#8BC34A',
  },
  phaseText: {
    color: '#666',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  activePhaseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  connector: {
    width: 20,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
  },
  completedConnector: {
    backgroundColor: '#8BC34A',
  },
  completedIconContainer: {
    marginLeft: 4,
  },
});

export default MatchPhaseNavigator;