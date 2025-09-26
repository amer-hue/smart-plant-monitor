import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        I'm a new user.{' '}
        <Text
          style={styles.footerLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
  },
  footerLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
