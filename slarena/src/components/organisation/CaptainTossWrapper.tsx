import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useMatch } from '../../context/MatchContext';
import CaptainToss from './CaptainToss';
import { matchService } from '../../services/matchService';
import { useRoute } from '@react-navigation/native';

interface CaptainTossWrapperProps {
  matchId: number;
}

const CaptainTossWrapper: React.FC<CaptainTossWrapperProps> = ({ matchId }) => {
  const route = useRoute();
  const { 
    matchState, 
    setMatchPhase, 
    setTossResult, 
    setBattingTeam,
    setInningOneId 
  } = useMatch();

  const [localTeam1, setLocalTeam1] = useState<any>(null);
  const [localTeam2, setLocalTeam2] = useState<any>(null);
  const [localTeam1Name, setLocalTeam1Name] = useState<string>('Team 1');
  const [localTeam2Name, setLocalTeam2Name] = useState<string>('Team 2');
  const [isLoading, setIsLoading] = useState(true);

  // Get team IDs from route params if available
  const team1Id = route.params?.team1Id;
  const team2Id = route.params?.team2Id;

  useEffect(() => {
    const loadTeams = async () => {
      console.log("CaptainTossWrapper mounted");
      console.log("matchState:", matchState);
      
      try {
        // Get team names from context
        const team1Name = matchState.team1Name || 'Team 1';
        const team2Name = matchState.team2Name || 'Team 2';
        
        // First check if we have team objects in context
        if (matchState.team1 && matchState.team2) {
          setLocalTeam1(matchState.team1);
          setLocalTeam2(matchState.team2);
          setLocalTeam1Name(team1Name);
          setLocalTeam2Name(team2Name);
        }
        // Then check if we have team IDs from route params
        else if (team1Id && team2Id) {
          console.log("Using team IDs from route params:", team1Id, team2Id);
          
          // Try to fetch real team data from API
          try {
            const [team1Data, team2Data] = await Promise.all([
              matchService.getTeam(team1Id),
              matchService.getTeam(team2Id)
            ]);
            
            setLocalTeam1(team1Data);
            setLocalTeam2(team2Data);
          } catch (error) {
            console.error("Error fetching teams:", error);
            // Fallback to using IDs with names from context
            setLocalTeam1({ team_id: team1Id, team_name: team1Name });
            setLocalTeam2({ team_id: team2Id, team_name: team2Name });
          }
          
          setLocalTeam1Name(team1Name);
          setLocalTeam2Name(team2Name);
        }
        // Last resort: Get teams from match details
        else {
          console.log("Fetching match details to get team IDs");
          
          try {
            const matchDetails = await matchService.getMatchDetails(matchId);
            console.log("Match details:", matchDetails);
            
            if (matchDetails && matchDetails.team1_id && matchDetails.team2_id) {
              const [team1Data, team2Data] = await Promise.all([
                matchService.getTeam(matchDetails.team1_id),
                matchService.getTeam(matchDetails.team2_id)
              ]);
              
              setLocalTeam1(team1Data);
              setLocalTeam2(team2Data);
              setLocalTeam1Name(matchDetails.team1_name || team1Name);
              setLocalTeam2Name(matchDetails.team2_name || team2Name);
            } else {
              console.warn("No team IDs in match details, using fallback IDs");
              // Last resort - use generated IDs with real names
              setLocalTeam1({ team_id: 1, team_name: team1Name });
              setLocalTeam2({ team_id: 2, team_name: team2Name });
              setLocalTeam1Name(team1Name);
              setLocalTeam2Name(team2Name);
            }
          } catch (error) {
            console.error("Error fetching match details:", error);
            // Final fallback - use generated IDs with real names
            setLocalTeam1({ team_id: 1, team_name: team1Name });
            setLocalTeam2({ team_id: 2, team_name: team2Name });
            setLocalTeam1Name(team1Name);
            setLocalTeam2Name(team2Name);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeams();
  }, [matchState, matchId, team1Id, team2Id]);

  // When toss is completed
  const handleTossComplete = async (winnerId: number) => {
    try {
      console.log("Toss completed, winner ID:", winnerId);
      
      // Save the toss result in context
      setTossResult(winnerId, 'bat'); // Default to 'bat'
      
      // Move to next phase
      await setMatchPhase('team_selection');
    } catch (error) {
      console.error('Error completing toss:', error);
    }
  };

  // When batting choice is made
  const handleBattingChoice = async (battingTeamId: number) => {
    try {
      console.log("Batting choice made:", battingTeamId);
      
      // Determine the bowling team
      const bowlingTeamId = battingTeamId === localTeam1?.team_id 
        ? localTeam2?.team_id 
        : localTeam1?.team_id;
        
      // Set batting and bowling teams
      setBattingTeam(battingTeamId, bowlingTeamId);
      
      // Create the first inning in backend using matchService
      try {
        const inningData = await matchService.createInning(
          matchId,
          battingTeamId,
          bowlingTeamId,
          1
        );
        
        console.log("Inning created:", inningData);
        
        // Check for different response structures
        if (inningData && inningData.inning_id) {
          setInningOneId(inningData.inning_id);
        } else if (inningData && inningData.id) {
          setInningOneId(inningData.id);
        } else if (inningData && inningData.insertId) {
          setInningOneId(inningData.insertId);
        }
      } catch (apiError) {
        console.error('API error creating inning:', apiError);
        // Continue with phase transition anyway
      }
    } catch (error) {
      console.error('Error setting batting choice:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading toss...</Text>
      </View>
    );
  }

  console.log("Rendering CaptainToss with teams:", localTeam1, localTeam2);

  return (
    <CaptainToss
      team1={localTeam1}
      team2={localTeam2}
      team1Name={localTeam1Name}
      team2Name={localTeam2Name}
      onComplete={handleTossComplete}
      onBattingChoice={handleBattingChoice}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  }
});

export default CaptainTossWrapper;