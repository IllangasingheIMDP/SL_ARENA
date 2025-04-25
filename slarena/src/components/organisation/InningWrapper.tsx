// import React from 'react';
// import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
// import { useMatch } from '../../context/MatchContext';
// import { matchService } from '../../services/matchService';
// import InningScoring from './InningScoring'; // Your existing InningScoring component

// interface InningWrapperProps {
//   matchId: number;
//   inningNumber: 1 | 2;
// }

// const InningWrapper: React.FC<InningWrapperProps> = ({ 
//   matchId, 
//   inningNumber 
// }) => {
//   const { 
//     matchState, 
//     setMatchPhase,
//     updateScore,
//     setInningTwoId,
//     setWinner
//   } = useMatch();
  
//   const inningId = inningNumber === 1 
//     ? matchState.inningOneId 
//     : matchState.inningTwoId;
  
//   const battingTeamId = inningNumber === 1
//     ? matchState.battingTeamId
//     : matchState.bowlingTeamId; // Teams switch for second innings
  
//   const bowlingTeamId = inningNumber === 1
//     ? matchState.bowlingTeamId
//     : matchState.battingTeamId; // Teams switch for second innings
  
//   if (!inningId) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }
  
//   const handleInningComplete = async (
//     runs: number, 
//     wickets: number, 
//     overs: number
//   ) => {
//     try {
//       // Update scores in context
//       updateScore(inningNumber, runs, wickets, overs);
      
//       // Save inning result to backend
//       await matchService.saveInningResult(
//         inningId,
//         runs,
//         wickets,
//         overs
//       );
      
//       if (inningNumber === 1) {
//         // Create the second inning
//         const inningData = await matchService.createInning(
//           matchId,
//           matchState.bowlingTeamId || 0, // Switch teams
//           matchState.battingTeamId || 0, // Switch teams
//           2
//         );
        
//         // Save second inning ID
//         if (inningData && inningData.id) {
//           setInningTwoId(inningData.id);
//         }
        
//         // Move to inning two
//         await setMatchPhase('inning_two');
//       } else {
//         // This was the second inning, determine winner
//         const winner = determineWinner(
//           matchState.scores.inningOne.runs,
//           matchState.scores.inningTwo.runs
//         );
        
//         if (winner) {
//           setWinner(winner);
          
//           // Save match result to backend
//           await matchService.saveMatchResult(
//             matchId,
//             winner
//           );
//         }
        
//         // Move to finished phase
//         await setMatchPhase('finished');
//       }
//     } catch (error) {
//       console.error(`Error completing inning ${inningNumber}:`, error);
//       Alert.alert('Error', `Failed to save inning ${inningNumber} results`);
//     }
//   };
  
//   const determineWinner = (inningOneRuns: number, inningTwoRuns: number): number | null => {
//     if (inningOneRuns > inningTwoRuns) {
//       return matchState.battingTeamId;
//     } else if (inningTwoRuns > inningOneRuns) {
//       return matchState.bowlingTeamId;
//     } else {
//       // It's a tie, you might want to handle this differently
//       return null;
//     }
//   };
  
//   return (
//     <InningScoring
//       matchId={matchId}
//       inningId={inningId}
//       inningNumber={inningNumber}
//       battingTeamId={battingTeamId || 0}
//       bowlingTeamId={bowlingTeamId || 0}
//       battingTeamName={battingTeamId === matchState.team1?.team_id 
//         ? matchState.team1Name 
//         : matchState.team2Name}
//       bowlingTeamName={bowlingTeamId === matchState.team1?.team_id
//         ? matchState.team1Name
//         : matchState.team2Name}
//       selectedPlayers={battingTeamId === matchState.team1?.team_id
//         ? matchState.selectedPlayers.team1
//         : matchState.selectedPlayers.team2}
//       onComplete={handleInningComplete}
//       initialScore={inningNumber === 1 
//         ? matchState.scores.inningOne 
//         : matchState.scores.inningTwo}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

// export default InningWrapper;