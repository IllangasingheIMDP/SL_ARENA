import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Team } from '../../types/tournamentTypes';
import { LinearGradient } from 'expo-linear-gradient';

interface CaptainTossComponentProps {
  team1: Team | null;
  team2: Team | null;
  team1Name: string;
  team2Name: string;
  onComplete: (winnerId: number) => void;
  onBattingChoice: (teamId: number) => void;
}

const { width } = Dimensions.get('window');

const CaptainTossComponent: React.FC<CaptainTossComponentProps> = ({
  team1,
  team2,
  team1Name,
  team2Name,
  onComplete,
  onBattingChoice
}) => {
  // States for tracking the flow
  const [currentStep, setCurrentStep] = useState<'chooseSide' | 'confirmChoice' | 'tossInProgress' | 'showResult' | 'chooseInnings'>('chooseSide');
  const [callingCaptain, setCallingCaptain] = useState<Team | null>(null); // Which captain is calling
  const [captainChoice, setCaptainChoice] = useState<'heads' | 'tails' | null>(null);
  const [tossResult, setTossResult] = useState<'heads' | 'tails' | null>(null);
  const [tossWinner, setTossWinner] = useState<Team | null>(null);
  const [callingTeamName, setCallingTeamName] = useState<string | null>(null);
  const [winnerTeamName, setWinnerTeamName] = useState<string | null>(null);
  let flag = 0;
  
  // Animation values
  const coinRotation = useRef(new Animated.Value(0)).current;
  const coinOpacity = useRef(new Animated.Value(1)).current;
  
  // Get team image source safely
  const getTeamImageSource = (team: Team | null) => {
    try {
        if(flag == 0){
            flag = 1;
            return require('../../../assets/images/default-team.png');
        }
        else{
            flag = 0;
            return require('../../../assets/images/default-team1.png');
        }
    } catch (error) {
      console.log('Error getting team image source:', error);
      return require('../../../assets/images/default-team.png');
    }
  };
  
  // Choose captain step
  const handleCaptainSelection = (team: Team) => {
    setCallingCaptain(team);
    if (!team1 || !team2) return;
    if(team.team_id === team1.team_id){
      setCallingTeamName(team1Name);
    }
    else{
      setCallingTeamName(team2Name);
    }
    setCurrentStep('chooseSide');
  };
  
  // Choose heads or tails
  const handleSideSelection = (choice: 'heads' | 'tails') => {
    setCaptainChoice(choice);
    setCurrentStep('confirmChoice');
  };
  
  // Confirm the choice and start toss
  const handleConfirmChoice = () => {
    setCurrentStep('tossInProgress');
    performCoinToss();
  };
  
  // Animate coin toss and determine result
  const performCoinToss = () => {
    // Reset animation values
    coinRotation.setValue(0);
    coinOpacity.setValue(1);
    
    // Start coin flip animation
    Animated.sequence([
      Animated.timing(coinRotation, {
        toValue: 10,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(coinOpacity, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Determine result randomly
      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      setTossResult(result);
      
      // Determine winner
      const winner = result === captainChoice ? callingCaptain : (callingCaptain === team1 ? team2 : team1);
      setTossWinner(winner);
      
      // Set winner team name
      if (winner === team1) {
        setWinnerTeamName(team1Name);
      } else {
        setWinnerTeamName(team2Name);
      }
      
      // Show result after a short delay
      setTimeout(() => {
        setCurrentStep('showResult');
      }, 500);
    });
  };
  
  // Handle batting/bowling choice
  const handleInningsChoice = (choice: 'bat' | 'bowl') => {
    if (!tossWinner || !team1 || !team2) return;
    
    const battingTeamId = choice === 'bat' ? tossWinner.team_id : (tossWinner.team_id === team1.team_id ? team2.team_id : team1.team_id);
    
    onBattingChoice(battingTeamId);
    onComplete(tossWinner.team_id);
  };
  
  // Loading state
  if (!team1 || !team2) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading teams...</Text>
      </View>
    );
  }
  
  // Interpolate rotation for coin flip animation
  const spin = coinRotation.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '3600deg'],
  });

  return (
    <LinearGradient
      colors={['#1a2151', '#2c3e7b', '#1a2151']}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Step 1: Choose Captain for Toss */}
        {currentStep === 'chooseSide' && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Match Toss</Text>
            
            {!callingCaptain ? (
              <>
                <Text style={styles.subtitle}>Choose which captain will call the toss:</Text>
                <View style={styles.teamSelectionContainer}>
                  <TouchableOpacity
                    style={styles.captainButton}
                    onPress={() => handleCaptainSelection(team1)}
                  >
                    <Image 
                      source={getTeamImageSource(team1)}
                      style={styles.teamLogo} 
                      defaultSource={require('../../../assets/images/default-team.png')}
                    />
                    <Text style={styles.teamName}>{team1Name}</Text>
                    <Text style={styles.captainName}>Captain</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.captainButton}
                    onPress={() => handleCaptainSelection(team2)}
                  >
                    <Image 
                      source={getTeamImageSource(team2)}
                      style={styles.teamLogo}
                      defaultSource={require('../../../assets/images/default-team.png')}
                    />
                    <Text style={styles.teamName}>{team2Name}</Text>
                    <Text style={styles.captainName}>Captain</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Captain of {callingTeamName}, call heads or tails:
                </Text>
                
                <View style={styles.coinChoiceContainer}>
                  <TouchableOpacity
                    style={[styles.coinChoiceButton, captainChoice === 'heads' ? styles.selectedChoice : null]}
                    onPress={() => handleSideSelection('heads')}
                  >
                    <Image 
                      source={require('../../../assets/images/coin-heads.png')}
                      style={styles.coinIcon}
                    />
                    <Text style={styles.coinChoiceText}>HEADS</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.coinChoiceButton, captainChoice === 'tails' ? styles.selectedChoice : null]}
                    onPress={() => handleSideSelection('tails')}
                  >
                    <Image 
                      source={require('../../../assets/images/coin-tails.png')}
                      style={styles.coinIcon}
                    />
                    <Text style={styles.coinChoiceText}>TAILS</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
        
        {/* Step 2: Confirm Choice */}
        {currentStep === 'confirmChoice' && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Confirm Toss Call</Text>
            
            <View style={styles.confirmationCard}>
              <Image
                source={getTeamImageSource(callingCaptain)}
                style={styles.confirmTeamLogo}
                defaultSource={require('../../../assets/images/default-team.png')}
              />
              
              <Text style={styles.confirmText}>
                Captain of {callingTeamName} calls
              </Text>
              
              <View style={styles.choiceDisplay}>
                <Image 
                  source={captainChoice === 'heads' 
                    ? require('../../../assets/images/coin-heads.png')
                    : require('../../../assets/images/coin-tails.png')
                  }
                  style={styles.choiceImage}
                />
                <Text style={styles.choiceConfirmText}>
                  {captainChoice?.toUpperCase()}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.flipButton}
                onPress={handleConfirmChoice}
              >
                <Text style={styles.flipButtonText}>FLIP THE COIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Step 3: Coin Toss Animation */}
        {currentStep === 'tossInProgress' && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Coin Toss</Text>
            
            <View style={styles.coinAnimationContainer}>
              <Animated.View
                style={[
                  styles.animatedCoin,
                  {
                    transform: [{ rotateY: spin }],
                    opacity: coinOpacity
                  }
                ]}
              >
                <Image 
                  source={require('../../../assets/images/coin-heads.png')}
                  style={styles.coinSide}
                />
              </Animated.View>
              
              <Text style={styles.tossInProgressText}>
                Flipping coin...
              </Text>
            </View>
          </View>
        )}
        
        {/* Step 4: Show Toss Result */}
        {currentStep === 'showResult' && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Toss Result</Text>
            
            <View style={styles.resultCard}>
              <Image 
                source={tossResult === 'heads' 
                  ? require('../../../assets/images/coin-heads.png')
                  : require('../../../assets/images/coin-tails.png')
                }
                style={styles.resultCoinImage}
              />
              
              <Text style={styles.resultText}>
                It's {tossResult?.toUpperCase()}!
              </Text>
              
              <View style={styles.winnerContainer}>
                <Image
                  source={getTeamImageSource(tossWinner)}
                  style={styles.winnerTeamLogo}
                  defaultSource={require('../../../assets/images/default-team.png')}
                />
                
                <Text style={styles.winnerText}>
                  {winnerTeamName} won the toss
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setCurrentStep('chooseInnings')}
              >
                <Text style={styles.nextButtonText}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Step 5: Choose Batting or Bowling */}
        {currentStep === 'chooseInnings' && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Choose Innings</Text>
            
            <Text style={styles.subtitle}>
              Captain of {winnerTeamName}, choose to:
            </Text>
            
            <View style={styles.inningsChoiceContainer}>
              <TouchableOpacity
                style={[styles.inningsButton, styles.batButton]}
                onPress={() => handleInningsChoice('bat')}
              >
                <Image
                  source={require('../../../assets/images/cricket-bat.png')}
                  style={styles.inningsIcon}
                />
                <Text style={styles.inningsText}>BAT FIRST</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.inningsButton, styles.bowlButton]}
                onPress={() => handleInningsChoice('bowl')}
              >
                <Image
                  source={require('../../../assets/images/cricket-ball.png')}
                  style={styles.inningsIcon}
                />
                <Text style={styles.inningsText}>BOWL FIRST</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    color: '#e0e0e0',
  },
  teamSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  captainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: 140,
    height: 160,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  },
  captainName: {
    fontSize: 14,
    color: '#ffd700',
    marginTop: 5,
  },
  coinChoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  coinChoiceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: 130,
    height: 130,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedChoice: {
    borderColor: '#ffd700',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  coinIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  coinChoiceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmationCard: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  confirmTeamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  confirmText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  choiceDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  choiceImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  choiceConfirmText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  flipButton: {
    backgroundColor: '#ffd700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  flipButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinAnimationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  animatedCoin: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  coinSide: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  tossInProgressText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
  },
  resultCard: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  resultCoinImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 20,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  winnerTeamLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  winnerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inningsChoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  inningsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    borderRadius: 12,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  batButton: {
    backgroundColor: '#4CAF50',
  },
  bowlButton: {
    backgroundColor: '#2196F3',
  },
  inningsIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  inningsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  }
});

export default CaptainTossComponent;