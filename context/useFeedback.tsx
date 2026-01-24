import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { useAuth } from './authContext';

type FeedbackType = 'correct' | 'wrong' | 'submit';

export const useFeedback = () => {
    const [sounds, setSounds] = useState<{
        correct?: Audio.Sound;
        wrong?: Audio.Sound;
        submit?: Audio.Sound;
    }>({});
    const { soundEffect, haptics } = useAuth();
    
    useEffect(() => {
        loadSounds();
        return () => {
        // Cleanup sounds on unmountF
        Object.values(sounds).forEach(sound => sound?.unloadAsync());
        };
    }, []);

    const loadSounds = async () => {
        try {
        const { sound: correctSound } = await Audio.Sound.createAsync(
            require('../assets/sounds/great-success-384935.mp3')
        );
        const { sound: wrongSound } = await Audio.Sound.createAsync(
            require('../assets/sounds/sound-effect-system-error-sound-117733.mp3')
        );
        const { sound: submitSound } = await Audio.Sound.createAsync(
            require('../assets/sounds/demo.mp3')
        );

        setSounds({
            correct: correctSound,
            wrong: wrongSound,
            submit: submitSound,
        });
        } catch (error) {
        console.error('Error loading sounds:', error);
        }
    };

    const playFeedback = async (
        type: FeedbackType,
        options?: {
        sound?: boolean;
        haptic?: boolean;
        }
    ) => {
        const soundEnabled = soundEffect ?? true;
        const hapticsEnabled = haptics ?? true;
        
        // Play sound
        if (soundEnabled && sounds[type]) {
        try {
            await sounds[type]?.replayAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
        }

        // Trigger haptic feedback
        if (hapticsEnabled) {
        switch (type) {
            case 'correct':
            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );
            break;
            case 'wrong':
            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            );
            break;
            case 'submit':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
        }
        }
    };

    return { playFeedback };
};

