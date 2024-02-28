import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendToIA = async () => {
    const backendUrl = 'https://localhost:8000/chat/pdf';

    const formData = new FormData();
    formData.append('prompt', input);

    try {
      const backendResponse = await axios.post(backendUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Réponse du backend:', backendResponse.data);

      setConversation(prevConversation => [
        ...prevConversation,
        { type: 'question', content: input },
        { type: 'response', content: backendResponse.data }
      ]);

      // Effacer le champ de saisie après envoi
      setInput('');
    } catch (error) {
      console.error('Erreur lors de la requête vers le backend:', error);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Posez votre question"
        value={input}
        onChangeText={(text) => setInput(text)}
      />
      <Button title="Envoyer" onPress={sendToIA} />

      {conversation.length > 0 && (
        <ScrollView style={styles.responseContainer}>
          {conversation.map((item, index) => (
            <View key={index} style={styles.messageContainer}>
              {item.type === 'question' && (
                <View style={[styles.message, styles.questionMessage]}>
                  <Text style={styles.questionText}>{item.content}</Text>
                </View>
              )}
              {item.type === 'response' && (
                <View style={[styles.message, styles.responseMessage]}>
                  <Text style={styles.roleText}>{item.content.role}</Text>
                  <Text style={styles.contentText}>{item.content.content}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  responseContainer: {
    marginTop: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // aligner à droite
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  questionMessage: {
    backgroundColor: '#e6e6e6', // couleur de fond pour les questions
    alignSelf: 'flex-end', // aligner le texte à droite
  },
  responseMessage: {
    backgroundColor: '#4da6ff', // couleur de fond pour les réponses
    alignSelf: 'flex-start', // aligner le texte à gauche
  },
  questionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ChatComponent;
