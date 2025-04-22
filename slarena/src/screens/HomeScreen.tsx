import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet   } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
  };

  type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
  const HomeScreen: React.FC<Props> = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Home Screen</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
});

export default HomeScreen;
