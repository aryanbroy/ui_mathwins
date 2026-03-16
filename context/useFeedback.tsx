import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useAuth } from './authContext';

type FeedbackType = 'correct' | 'wrong' | 'submit' | 'lobby';

type FeedbackContextType = {
    playFeedback: (type: FeedbackType, options?: { loop?: boolean }) => Promise<void>;
    stopFeedback: (type: FeedbackType) => Promise<void>;
    ready: boolean;
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
    const soundsRef = useRef<Partial<Record<FeedbackType, Audio.Sound>>>({});
    const { soundEffect, haptics } = useAuth();
    const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSounds();
    return () => {
      Object.values(soundsRef.current).forEach((sound) => sound?.unloadAsync());
    };
  }, []);

  const loadSounds = async () => {
    try {
      const { sound: correctSound } = await Audio.Sound.createAsync(require('../assets/sounds/correctAnswer.mp3'));
      const { sound: wrongSound }   = await Audio.Sound.createAsync(require('../assets/sounds/wrongAnswer.mp3'));
      const { sound: submitSound }  = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3'));
      const { sound: lobbySound }   = await Audio.Sound.createAsync(require('../assets/sounds/lobby.mp3'));

      soundsRef.current = {
        correct: correctSound,
        wrong: wrongSound,
        submit: submitSound,
        lobby: lobbySound,
      };
      setReady(true);
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  const playFeedback = async (type: FeedbackType, options?: { loop?: boolean }) => {
    const soundEnabled = soundEffect ?? true;
    const hapticsEnabled = haptics ?? true;
    const shouldLoop = options?.loop ?? false;

    if (soundEnabled) {
      try {
        const soundObject = soundsRef.current[type];
        if (soundObject) {
          await soundObject.setIsLoopingAsync(shouldLoop);
          shouldLoop ? await soundObject.playAsync() : await soundObject.replayAsync();
        }
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }

    if (hapticsEnabled) {
      switch (type) {
        case 'correct': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
        case 'wrong':   await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
        case 'submit':  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
      }
    }
  };

  const stopFeedback = async (type: FeedbackType) => {
    try {
      const soundObject = soundsRef.current[type];
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.setIsLoopingAsync(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  return (
    <FeedbackContext.Provider value={{ playFeedback, stopFeedback, ready }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used inside FeedbackProvider');
  return ctx;
};