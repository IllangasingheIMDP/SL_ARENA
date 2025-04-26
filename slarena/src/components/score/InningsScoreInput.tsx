import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';

interface Player {
  id: string;
  name: string;
  runs: number;
  balls: number;
  isOut: boolean;
  onStrike: boolean;
}

interface Bowler {
  id: string;
  name: string;
  overs: number;
  runs: number;
  wickets: number;
  ballsInCurrentOver: number;
}

const CricketScoringApp = () => {
  // Basic state
  const [activeBatsmen, setActiveBatsmen] = useState<Player[]>([]);
  const [currentBowler, setCurrentBowler] = useState<Bowler | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalWickets, setTotalWickets] = useState<number>(0);
  const [currentOver, setCurrentOver] = useState<number>(0);
  const [currentBall, setCurrentBall] = useState<number>(0);

  // UI state
  const [showBatsmanSelection, setShowBatsmanSelection] = useState<boolean>(false);
  const [showBowlerSelection, setShowBowlerSelection] = useState<boolean>(false);
  const [showDeliveryInput, setShowDeliveryInput] = useState<boolean>(false);

  // Hardcoded teams
  const battingTeam = {
    name: 'Mumbai Indians',
    players: [
      { id: '1', name: 'Rohit Sharma', runs: 0, balls: 0, isOut: false, onStrike: false },
      { id: '2', name: 'Ishan Kishan', runs: 0, balls: 0, isOut: false, onStrike: false },
      { id: '3', name: 'Suryakumar Yadav', runs: 0, balls: 0, isOut: false, onStrike: false },
    ]
  };

  const bowlingTeam = {
    name: 'Chennai Super Kings',
    players: [
      { id: '4', name: 'Ravindra Jadeja', overs: 0, runs: 0, wickets: 0, ballsInCurrentOver: 0 },
      { id: '5', name: 'Deepak Chahar', overs: 0, runs: 0, wickets: 0, ballsInCurrentOver: 0 },
      { id: '6', name: 'Mitchell Santner', overs: 0, runs: 0, wickets: 0, ballsInCurrentOver: 0 },
    ]
  };

  // Basic handlers
  const handleBatsmanSelection = (player: Player) => {
    if (activeBatsmen.length < 2 && !player.isOut) {
      const newBatsman = {...player, onStrike: activeBatsmen.length === 0};
      setActiveBatsmen([...activeBatsmen, newBatsman]);
      setShowBatsmanSelection(false);
    }
  };

  const handleBowlerSelection = (bowler: Bowler) => {
    setCurrentBowler(bowler);
    setShowBowlerSelection(false);
  };

  const handleRuns = (runs: number) => {
    if (!currentBowler || activeBatsmen.length !== 2) return;

    // Update batsman stats
    const updatedBatsmen = activeBatsmen.map(batsman => {
      if (batsman.onStrike) {
        return {
          ...batsman,
          runs: batsman.runs + runs,
          balls: batsman.balls + 1
        };
      }
      return batsman;
    });

    // Update bowler stats
    const updatedBowler = {
      ...currentBowler,
      runs: currentBowler.runs + runs,
      ballsInCurrentOver: currentBowler.ballsInCurrentOver + 1
    };

    // Update ball count
    const nextBall = currentBall + 1;
    const nextOver = nextBall === 6 ? currentOver + 1 : currentOver;
    const actualNextBall = nextBall === 6 ? 0 : nextBall;

    // Rotate strike for odd runs or end of over
    if (runs % 2 === 1 || nextBall === 6) {
      updatedBatsmen.forEach(batsman => {
        batsman.onStrike = !batsman.onStrike;
      });
    }

    // Update all state
    setActiveBatsmen(updatedBatsmen);
    setCurrentBowler(updatedBowler);
    setTotalScore(totalScore + runs);
    setCurrentBall(actualNextBall);
    setCurrentOver(nextOver);
    setShowDeliveryInput(false);
  };

  const handleWicket = () => {
    if (!currentBowler || activeBatsmen.length !== 2) return;

    // Update batsman stats
    const updatedBatsmen = activeBatsmen.map(batsman => {
      if (batsman.onStrike) {
        return {
          ...batsman,
          isOut: true
        };
      }
      return batsman;
    });

    // Update bowler stats
    const updatedBowler = {
      ...currentBowler,
      wickets: currentBowler.wickets + 1,
      ballsInCurrentOver: currentBowler.ballsInCurrentOver + 1
    };

    // Update ball count
    const nextBall = currentBall + 1;
    const nextOver = nextBall === 6 ? currentOver + 1 : currentOver;
    const actualNextBall = nextBall === 6 ? 0 : nextBall;

    // Update all state
    setActiveBatsmen(updatedBatsmen);
    setCurrentBowler(updatedBowler);
    setTotalWickets(totalWickets + 1);
    setCurrentBall(actualNextBall);
    setCurrentOver(nextOver);
    setShowDeliveryInput(false);
    setShowBatsmanSelection(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Score Display */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreText}>{totalScore}/{totalWickets}</Text>
        <Text style={styles.overText}>Overs: {currentOver}.{currentBall}</Text>
      </View>

      {/* Current Batsmen */}
      <View style={styles.batsmenContainer}>
        {activeBatsmen.map(batsman => (
          <View key={batsman.id} style={styles.batsmanCard}>
            <Text style={styles.batsmanName}>
              {batsman.name} {batsman.onStrike ? '●' : ''}
            </Text>
            <Text style={styles.batsmanStats}>
              {batsman.runs}({batsman.balls})
            </Text>
          </View>
        ))}
      </View>

      {/* Current Bowler */}
      {currentBowler && (
        <View style={styles.bowlerCard}>
          <Text style={styles.bowlerName}>{currentBowler.name}</Text>
          <Text style={styles.bowlerStats}>
            {currentBowler.overs}.{currentBowler.ballsInCurrentOver} - {currentBowler.wickets} - {currentBowler.runs}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {activeBatsmen.length < 2 && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowBatsmanSelection(true)}
          >
            <Text style={styles.actionButtonText}>Select Batsman</Text>
          </TouchableOpacity>
        )}
        
        {!currentBowler && activeBatsmen.length === 2 && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowBowlerSelection(true)}
          >
            <Text style={styles.actionButtonText}>Select Bowler</Text>
          </TouchableOpacity>
        )}
        
        {currentBowler && activeBatsmen.length === 2 && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowDeliveryInput(true)}
          >
            <Text style={styles.actionButtonText}>Record Delivery</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Batsman Selection Modal */}
      <Modal visible={showBatsmanSelection} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Batsman</Text>
            <ScrollView>
              {battingTeam.players.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerOption}
                  onPress={() => handleBatsmanSelection(player)}
                  disabled={player.isOut}
                >
                  <Text style={styles.playerName}>{player.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bowler Selection Modal */}
      <Modal visible={showBowlerSelection} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Bowler</Text>
            <ScrollView>
              {bowlingTeam.players.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerOption}
                  onPress={() => handleBowlerSelection(player)}
                >
                  <Text style={styles.playerName}>{player.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Delivery Input Modal */}
      <Modal visible={showDeliveryInput} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record Delivery</Text>
            <View style={styles.runsButtonsContainer}>
              {[0, 1, 2, 3, 4, 6].map(runs => (
                <TouchableOpacity
                  key={runs}
                  style={styles.runButton}
                  onPress={() => handleRuns(runs)}
                >
                  <Text style={styles.runButtonText}>{runs}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.wicketButton}
              onPress={handleWicket}
            >
              <Text style={styles.wicketButtonText}>Wicket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scoreCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overText: {
    fontSize: 16,
  },
  batsmenContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  batsmanCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  batsmanName: {
    fontSize: 16,
    fontWeight: '500',
  },
  batsmanStats: {
    fontSize: 16,
  },
  bowlerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  bowlerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bowlerStats: {
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  playerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerName: {
    fontSize: 16,
  },
  runsButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  runButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '30%',
    marginBottom: 8,
  },
  runButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  wicketButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  wicketButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CricketScoringApp;