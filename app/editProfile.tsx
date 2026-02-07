import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { useAuth } from '@/context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from "expo-document-picker";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const {toggleDarkMode, isDarkMode, colors } = useAppTheme(); 
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const MAX_SIZE_MB = 2;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.mimeType!)) {
      Alert.alert("Invalid format", "Only JPG and PNG allowed");
      return;
    }

    // Validate size
    const sizeInMB = (file.size!) / (1024 * 1024);
    if (sizeInMB > MAX_SIZE_MB) {
      Alert.alert("File too large", `Max ${MAX_SIZE_MB}MB allowed`);
      return;
    }
    console.log("UPLOADED : ",file.uri);
    
    setImageUri(file.uri);
  };

  const avatars = [
    { id: 1, emoji: 'https://lh3.googleusercontent.com/gg/AMW1TPqw-iuew4Iah88V0jnJa0XrdNwncdzGC6OE8X_XVx4i2vzZCDDuqnnspm9coUMlXmb7p_rfwh4zyZ5ehRNLZLNlIujFUZBOh1FfVtPiGhpb0wPyLhT_1WKEteTraeZjb1nB5wvl9nv0NgiQPQ2m3EDTwZCTcymltLJykoUXqAf3nA80jbHN=s1024-rj-mp2', bg: '#C4B5FD' },
    { id: 2, emoji: 'https://thumbs.dreamstime.com/b/male-portrait-curly-hair-doodle-style-male-portrait-curly-hair-doodle-style-man-head-front-view-272920935.jpg', bg: '#FDB777' },
    { id: 3, emoji: 'https://static.vecteezy.com/system/resources/thumbnails/008/297/351/small/man-face-with-beard-and-eyeglasses-in-doodle-style-colorful-avatar-of-smiling-man-vector.jpg', bg: '#FCA5A5' },
    { id: 4, emoji: 'https://thumbs.dreamstime.com/b/male-portrait-curly-hair-doodle-style-male-portrait-curly-hair-doodle-style-man-head-front-view-272920935.jpg', bg: '#C084FC' },
    { id: 5, emoji: 'https://static.vecteezy.com/system/resources/thumbnails/008/297/351/small/man-face-with-beard-and-eyeglasses-in-doodle-style-colorful-avatar-of-smiling-man-vector.jpg', bg: '#FDB777' },
    { id: 6, emoji: 'https://thumbs.dreamstime.com/b/happy-nerd-boy-doodle-face-child-smiling-411317659.jpg', bg: '#E9D5FF' },
  ];

  return (
    <View style={styles.container}>
        
        {/* Purple Gradient Background */}
        <LinearGradient
            colors={colors.gradients.background}
            style={styles.header}
        >
            <SafeAreaView style={styles.safe}>

            {/* Title */}
            <Text style={styles.title}>Select Your Avatar</Text>

            {/* White Content Area */}
            <ScrollView
                bounces={false}
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
            >
            <LinearGradient
                colors={colors.gradients.surface}
                style={styles.header1}
            >
            <View style={styles.content}>
                {/* Avatar Selection Circle */}
                <View style={styles.avatarContainer}>
                {/* Left Avatars */}
                <View style={styles.leftAvatars}>
                    {avatars.slice(0, 3).map((avatar) => (
                    <TouchableOpacity
                        key={avatar.id}
                        style={[
                        styles.avatarCircle,
                        { backgroundColor: avatar.bg },
                        selectedAvatar === avatar.id && styles.selectedAvatar,
                        ]}
                        onPress={() => setSelectedAvatar(avatar.id)}
                    >
                        <Image source={{ uri: avatar.emoji }} style={styles.avatarImage} />
                    </TouchableOpacity>
                    ))}
                </View>

                {/* Center Avatar */}
                <View style={styles.centerAvatarContainer}>
                    <View style={styles.centerAvatar}>
                    <Image source={{ uri: imageUri ? imageUri : user?.picture }} style={styles.avatarImage} />
                    </View>
                    <TouchableOpacity style={styles.refreshButton}>
                        <Ionicons name="refresh" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Right Avatars */}
                <View style={styles.rightAvatars}>
                    {avatars.slice(3, 6).map((avatar) => (
                    <TouchableOpacity
                        key={avatar.id}
                        style={[
                        styles.avatarCircle,
                        { backgroundColor: avatar.bg },
                        selectedAvatar === avatar.id && styles.selectedAvatar,
                        ]}
                        onPress={() => setSelectedAvatar(avatar.id)}
                    >
                        <Image source={{ uri: avatar.emoji }} style={styles.avatarImage} />
                        {/* <Text style={styles.avatarEmoji}>{avatar.emoji}</Text> */}
                    </TouchableOpacity>
                    ))}
                </View>
                </View>

                {/* Upload Button */}
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Upload</Text>
                <View style={styles.plusIcon}>
                    <Ionicons name="add" size={20} color={colors.text}/>
                </View>
                </TouchableOpacity>

                {/* Username Input */}
                {/* <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter your preferred username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Eg: UjwalXMathwins"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                />
                </View> */}

                {/* Confirm Checkbox */}
                {/* <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsConfirmed(!isConfirmed)}
                >
                <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
                    {isConfirmed && <Ionicons name="checkmark" size={20} color="#FFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Confirm Submission</Text>
                </TouchableOpacity> */}

                {/* Let's Play Button */}
                <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
            </LinearGradient>
            </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flex: 1,
        },
        header1: {
            flex: 1,
            width: "100%",
            borderRadius: 30,
        },
        safe: {
            flex: 1,
            // position: "relative",
            // display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 0,
        },
        themeToggleContainer: {
            width: "100%",
            alignItems: "flex-end",
            top: 20,
            right: 24,
        },
        themeToggleLight: {
            width: 64,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "flex-end",
            paddingHorizontal: 5,
        },
        themeToggleDark: {
            width: 64,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 5,
        },
        themeIcon: {
            fontSize: 20,
            shadowColor: colors.shadow,
            marginBottom: 2,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginTop: 50,
            marginBottom: 20,
            lineHeight: 56,
        },
        content: {
            flex: 1,
            // top: 250,
            width: "100%",
            overflow: "hidden",
            paddingHorizontal: 20,
            paddingVertical: 20,
            alignItems: 'center',
        },
        avatarContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
            width: '100%',
        },
        leftAvatars: {
            alignItems: 'center',
            gap: 20,
        },
        rightAvatars: {
            alignItems: 'center',
            gap: 20,
        },
        avatarCircle: {
            width: 80,
            height: 80,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 5,
            opacity: 0.8,
            borderColor: 'transparent',
        },
        selectedAvatar: {
            borderWidth: 5,
            borderColor: colors.primary,
            opacity: 1,
        },
        avatarEmoji: {
            fontSize: 40,
        },
        centerAvatarContainer: {
            alignItems: 'center',
            marginHorizontal: 30,
        },
        centerAvatar: {
            width: 130,
            height: 130,
            padding: 5,
            borderRadius: 100,
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#1F2937',
            overflow: "hidden",
        },
        avatarImage: {
            width: "100%",
            height: "100%",
            borderRadius: 100,
        },
        refreshButton: {
            marginTop: 15,
            padding: 10,
            borderRadius: 100,
            backgroundColor: colors.textMuted,
        },
        uploadButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            backgroundColor: colors.textMuted,
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 30,
        },
        uploadText: {
            color: colors.text,
            fontSize: 20,
            fontWeight: '600',
        },
        plusIcon: {
            // backgroundColor: 'rgba(255,255,255,0.3)',
            borderWidth: 2,
            borderColor: colors.text,
            borderRadius: 100,
            padding: 2,
        },
        inputContainer: {
            width: '100%',
            marginBottom: 25,
        },
        inputLabel: {
            color: colors.text,
            fontSize: 14,
            marginBottom: 8,
        },
        input: {
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: '#1F2937',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 20,
            fontSize: 16,
            color: '#1F2937',
        },
        checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        checkbox: {
            width: 24,
            height: 24,
            borderWidth: 2,
            borderColor: '#1F2937',
            borderRadius: 4,
            marginRight: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
        },
        checkboxChecked: {
            backgroundColor: colors.primary,
        },
        checkboxLabel: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '500',
        },
        playButton: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
        },
        playButtonText: {
            color: '#FFF',
            fontSize: 20,
            fontWeight: '800',
        },
    });