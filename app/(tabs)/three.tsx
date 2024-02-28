import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const fetchPreviousMessages = async () => {
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDkxMjI1NDAsImV4cCI6MTcwOTEyOTc0MCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdCJ9.ol_SQYqq7kMAK-Hl0Y8AXYxUp2HMWiQQSheGVEw2d9KMBY7swx2sXixQFk0htE2w9I2vrjAOX6JC0Jr4RBLuQJWikvMiHPj33YUcXnPxr9MCwBPSIYrUeTK54LdNLB7d5fukVPkrbXfeO5P2-s_O2BGTF7ZKQ5I7_y3FNGUdWOYlUkig8emfWjkpoeawLGzhpFIMEQQe6hvGwwzMsK0CRfoDbOrNz691sI6mBInHbAs_LXBP4cCLbCrNWBqR6BIVdFabyCPfi6fnQLtPyiJ7Nf_rPRaKVFV8DdEfE1VBG8OvKJoWpv8EzD5vIof851__Vs-VjL_R6JMD8720pWl8fg';

      const response = await axios.get('https://localhost:8000/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const previousMessages = response.data;

      if (Array.isArray(previousMessages)) {
        console.log('Messages précédents récupérés avec succès :', previousMessages);
        setConversation(previousMessages);
      } else {
        console.error('Les messages précédents ne sont pas un tableau valide :', previousMessages);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages précédents :', error);
    }
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, []);

  const sendToIA = async () => {
    const backendUrl = 'https://localhost:8000/api/chat/ask/pdf';

    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDkxMjI1NDAsImV4cCI6MTcwOTEyOTc0MCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdCJ9.ol_SQYqq7kMAK-Hl0Y8AXYxUp2HMWiQQSheGVEw2d9KMBY7swx2sXixQFk0htE2w9I2vrjAOX6JC0Jr4RBLuQJWikvMiHPj33YUcXnPxr9MCwBPSIYrUeTK54LdNLB7d5fukVPkrbXfeO5P2-s_O2BGTF7ZKQ5I7_y3FNGUdWOYlUkig8emfWjkpoeawLGzhpFIMEQQe6hvGwwzMsK0CRfoDbOrNz691sI6mBInHbAs_LXBP4cCLbCrNWBqR6BIVdFabyCPfi6fnQLtPyiJ7Nf_rPRaKVFV8DdEfE1VBG8OvKJoWpv8EzD5vIof851__Vs-VjL_R6JMD8720pWl8fg';
      console.log('try')
      const backendResponse = await axios.post(
        backendUrl,
        { messages: [{ content: input }] },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Réponse du backend:', backendResponse.data);

      // @ts-ignore
      setConversation(prevConversation => [
        ...prevConversation,
        { type: 'question', content: input },
        { type: 'response', content: backendResponse.data }
      ]);

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
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  questionMessage: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-end',
  },
  responseMessage: {
    backgroundColor: '#4da6ff',
    alignSelf: 'flex-start',
  },
  questionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ChatComponent;
