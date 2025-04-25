import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { tournamentService } from '../../services/tournamentService';
import { Team } from '../../types/tournamentTypes';
import TeamSelection from '../../components/organisation/TeamSelection';
import ScoreCard from '../../components/organisation/ScoreCard';
import CaptainTossComponent from '../../components/organisation/CaptainTossComponent';

type MatchDetailsRouteProp = RouteProp<RootStackParamList, 'MatchDetails'>;

const MatchDetails = () => {
  const route = useRoute<MatchDetailsRouteProp>();
  const { matchId, tournamentId, team1Id, team2Id, team1Name, team2Name } = route.params;

  const [currentStep, setCurrentStep] = useState<'toss' | 'teamSelection' | 'scoreCard'>('toss');
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [tossWinner, setTossWinner] = useState<number | null>(null);
  const [battingTeam, setBattingTeam] = useState<number | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<{
    team1: number[];
    team2: number[];
  }>({ team1: [], team2: [] });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      if (team1Id) {
        const team1Data = await tournamentService.getTeamPlayerStats(team1Id);
        setTeam1(team1Data);
      }
      if (team2Id) {
        const team2Data = await tournamentService.getTeamPlayerStats(team2Id);
        setTeam2(team2Data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleTossComplete = (winnerId: number) => {
    setTossWinner(winnerId);
    setCurrentStep('teamSelection');
  };

  const handleBattingChoice = (teamId: number) => {
    setBattingTeam(teamId);
  };

  const handleTeamSelectionComplete = (team1Players: number[], team2Players: number[]) => {
    setSelectedPlayers({
      team1: team1Players,
      team2: team2Players
    });
    setCurrentStep('scoreCard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'toss':
        return (
          <CaptainTossComponent
            team1={team1}
            team2={team2}
            team1Name={team1Name}
            team2Name={team2Name}
            onComplete={handleTossComplete}
            onBattingChoice={handleBattingChoice}
          />
        );
      case 'teamSelection':
        return (
          <TeamSelection
            team1={team1}
            team2={team2}
            team1Name={team1Name}
            team2Name={team2Name}
            matchId={matchId}
            onComplete={handleTeamSelectionComplete}
          />
        );
      case 'scoreCard':
        return (
          <ScoreCard
            matchId={matchId}
            team1={team1}
            team2={team2}
            battingTeam={battingTeam}
            selectedPlayers={selectedPlayers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderCurrentStep()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default MatchDetails; 