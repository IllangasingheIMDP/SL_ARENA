import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { MatchProvider } from '../../context/MatchContext';
import MatchFlowController from '../../components/organisation/MatchFlowController';
import { matchService } from '../../services/matchService';

type MatchManagementScreenProps = {
  route: RouteProp<RootStackParamList, 'MatchManagement'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const MatchManagementScreen: React.FC<MatchManagementScreenProps> = ({
  route,
  navigation,
}) => {
  const { matchId, team1Id, team2Id, team1Name, team2Name } = route.params;
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [teams, setTeams] = useState<{ team1: any; team2: any }>({ team1: null, team2: null });
  const [initialPhase, setInitialPhase] = useState<'toss' | 'team_selection' | 'inning_one' | 'inning_two' | 'finished'>('toss');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch match details
        const details = await matchService.getMatchDetails(matchId);
        setMatchDetails(details);
        
        // Determine the initial phase based on match details
        if (details && details.phase) {
          setInitialPhase(details.phase);
        }
        
        // Fetch team details if needed
        if (team1Id && team2Id) {
          const [team1Data, team2Data] = await Promise.all([
            matchService.getTeam(team1Id),
            matchService.getTeam(team2Id)
          ]);
          
          setTeams({
            team1: team1Data,
            team2: team2Data
          });
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
        Alert.alert('Error', 'Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId, team1Id, team2Id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {matchDetails?.match_name || `${team1Name || 'Team 1'} vs ${team2Name || 'Team 2'}`}
        </Text>
        
        <View style={styles.placeholder} />
      </View>
    
      <MatchProvider 
        matchId={matchId}
        team1={teams.team1}
        team2={teams.team2}
        team1Name={team1Name || ''}
        team2Name={team2Name || ''}
        initialPhase={initialPhase}
      >
        <View style={styles.container}>
          <MatchFlowController
            matchId={matchId}
            onBack={() => navigation.goBack()}
          />
        </View>
      </MatchProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default MatchManagementScreen;