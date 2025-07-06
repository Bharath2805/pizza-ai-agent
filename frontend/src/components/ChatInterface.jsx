// components/ChatInterface.jsx - FIXED SESSION CONTINUITY FOR VOICE
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

const ChatInterface = ({ onOrderUpdate, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const messagesEndRef = useRef(null);
  
  // Speech states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voiceAutoSubmit, setVoiceAutoSubmit] = useState(true);

  // Update current session ID when prop changes
  useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      setCurrentSessionId(sessionId);
      console.log('📱 Session ID updated:', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
        setTranscript('');
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim();
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update transcript display
        setTranscript(interimTranscript || finalTranscript);
        
        // Auto-submit when final result is received
        if (finalTranscript && voiceAutoSubmit) {
          console.log('🎤 Auto-submitting voice message:', finalTranscript);
          console.log('🎤 Using session ID:', currentSessionId);
          setInputMessage(finalTranscript);
          
          // Submit the message automatically after a short delay
          setTimeout(() => {
            handleVoiceSubmit(finalTranscript);
          }, 500);
        } else if (finalTranscript) {
          // Just populate the input field if auto-submit is off
          setInputMessage(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.log('🎤 Speech recognition not supported');
    }
  }, [voiceAutoSubmit]);

  // Add initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("Hello! I'd like to order a pizza.", true);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!speechEnabled || !window.speechSynthesis) {
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Clean text for better speech
    const cleanText = text.replace(/[🍕👤]/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.9;
    
    // Find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [speechEnabled]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const handleVoiceSubmit = useCallback(async (voiceText) => {
    if (!voiceText || voiceText.trim().length === 0) return;
    
    console.log('🎤 Voice submit - using session:', currentSessionId);
    
    // Clear transcript and stop listening
    setTranscript('');
    setIsListening(false);
    
    // Send the voice message with the CURRENT session ID
    await sendMessage(voiceText, false, currentSessionId);
  }, [currentSessionId]);

  const sendMessage = async (messageOverride = null, isInitial = false, forceSessionId = null) => {
    const messageToSend = messageOverride || inputMessage.trim();
    if (!messageToSend && !isInitial) return;

    // Use the forced session ID if provided, otherwise use current session
    const sessionToUse = forceSessionId || currentSessionId;
    
    console.log("📤 Sending message:", messageToSend);
    console.log("📤 Using session ID:", sessionToUse);
    
    // Clear input and set loading
    if (!isInitial) {
      setInputMessage('');
      // Add user message to UI immediately
      setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionToUse  // Use the correct session ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📤 Response session ID:", data.session_id);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      
      // Update session ID - IMPORTANT: Update both local state and parent
      if (data.session_id) {
        setCurrentSessionId(data.session_id);
        if (data.order) {
          onOrderUpdate(data.order, data.session_id);
        }
      }

      // Speak the response if speech is enabled
      if (speechEnabled && data.message) {
        setTimeout(() => {
          speak(data.message);
        }, 500);
      }

    } catch (error) {
      console.error('📤 Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      stopSpeaking();
      setTranscript('');
      recognition.start();
    }
  };

  const toggleSpeech = () => {
    const newState = !speechEnabled;
    setSpeechEnabled(newState);
    
    if (!newState && isSpeaking) {
      stopSpeaking();
    }
  };

  const toggleVoiceAutoSubmit = () => {
    setVoiceAutoSubmit(!voiceAutoSubmit);
  };

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }, []);

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Chat with Tony</h2>
        <div className="speech-controls">
          <button 
            className={`speech-btn ${speechEnabled ? 'active' : ''}`}
            onClick={toggleSpeech}
            title={speechEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
          >
            {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          <button 
            className={`speech-btn ${voiceAutoSubmit ? 'active' : ''}`}
            onClick={toggleVoiceAutoSubmit}
            title={voiceAutoSubmit ? 'Disable voice auto-submit' : 'Enable voice auto-submit'}
          >
            {voiceAutoSubmit ? '🚀' : '✋'}
          </button>
          
          {isSpeaking && (
            <button 
              className="speech-btn stop-speaking"
              onClick={stopSpeaking}
              title="Stop speaking"
            >
              Stop
            </button>
          )}
          
          {speechEnabled && <span className="speech-status">🔊</span>}
          {voiceAutoSubmit && <span className="speech-status">Auto</span>}
          
          {/* Debug info - remove in production */}
          <span className="speech-status" style={{fontSize: '0.6em', color: '#666'}}>
            Session: {currentSessionId?.slice(-4) || 'None'}
          </span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🍕'}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🍕</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-group">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Type your message or use voice..."}
            className="message-input"
            rows="1"
            disabled={isListening}
          />
          
          <div className="input-buttons">
            {isSupported && (
              <button 
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                disabled={isSpeaking}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            
            <button 
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading || isListening}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        {isListening && (
          <div className="voice-feedback">
            <span className="pulse-dot"></span>
            Listening... 
            {transcript && <span className="transcript-preview">"{transcript}"</span>}
            {voiceAutoSubmit && <span className="auto-submit-hint">Will auto-submit</span>}
          </div>
        )}
        
        {isSpeaking && (
          <div className="voice-feedback speaking">
            <span className="pulse-dot"></span>
            Tony is speaking... 
            <button className="stop-speaking-mini" onClick={stopSpeaking}>Stop</button>
          </div>
        )}
        
        {!isSupported && (
          <div className="voice-not-supported">
            🎤 Voice input not supported. Try Chrome, Edge, or Safari.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;