import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { useAuth } from '@/context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from "expo-document-picker";

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const { colors, isDarkMode } = useAppTheme();
  // const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const styles = React.useMemo(() => makeStyles(colors), [colors, isDarkMode]);
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

    if (!ALLOWED_TYPES.includes(file.mimeType!)) {
      Alert.alert("Invalid format", "Only JPG and PNG allowed");
      return;
    }

    const sizeInMB = file.size! / (1024 * 1024);
    if (sizeInMB > MAX_SIZE_MB) {
      Alert.alert("File too large", `Max ${MAX_SIZE_MB}MB allowed`);
      return;
    }

    setImageUri(file.uri);
  };

  const avatars = [
    { id: 1, uri: 'https://static.vecteezy.com/system/resources/thumbnails/008/297/351/small/man-face-with-beard-and-eyeglasses-in-doodle-style-colorful-avatar-of-smiling-man-vector.jpg' },
    { id: 2, uri: 'https://thumbs.dreamstime.com/b/male-portrait-curly-hair-doodle-style-male-portrait-curly-hair-doodle-style-man-head-front-view-272920935.jpg' },
    { id: 3, uri: 'https://static.vecteezy.com/system/resources/thumbnails/008/297/351/small/man-face-with-beard-and-eyeglasses-in-doodle-style-colorful-avatar-of-smiling-man-vector.jpg' },
    { id: 4, uri: 'https://thumbs.dreamstime.com/b/happy-nerd-boy-doodle-face-child-smiling-411317659.jpg' },
    { id: 5, uri: 'https://static.vecteezy.com/system/resources/thumbnails/008/297/351/small/man-face-with-beard-and-eyeglasses-in-doodle-style-colorful-avatar-of-smiling-man-vector.jpg' },
    { id: 6, uri: 'https://thumbs.dreamstime.com/b/male-portrait-curly-hair-doodle-style-male-portrait-curly-hair-doodle-style-man-head-front-view-272920935.jpg' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={colors.gradients.background} style={styles.header}>
        <SafeAreaView style={styles.safe}>
          <Text style={styles.title}>Select Your Avatar</Text>

          <View style={styles.card}>
            <ScrollView 
            showsVerticalScrollIndicator={false}>
              <View style={styles.avatarContainer}>

                <View style={styles.sideColumn}>
                  {avatars.slice(0, 3).map((avatar) => (
                    <TouchableOpacity
                      key={avatar.id}
                      style={[
                        styles.sideAvatar,
                        selectedAvatar === avatar.id && styles.selectedAvatar,
                      ]}
                      onPress={() => setSelectedAvatar(avatar.id)}
                    >
                      <Image source={{ uri: avatar.uri }} style={styles.avatarImage} />
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.centerAvatarContainer}>
                  <View style={styles.centerAvatar}>
                    <Image
                      source={{ uri: imageUri || user?.picture }}
                      style={styles.avatarImage}
                    />
                  </View>

                  <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh" size={28} color="#FFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.sideColumn}>
                  {avatars.slice(3, 6).map((avatar) => (
                    <TouchableOpacity
                      key={avatar.id}
                      style={[
                        styles.sideAvatar,
                        selectedAvatar === avatar.id && styles.selectedAvatar,
                      ]}
                      onPress={() => setSelectedAvatar(avatar.id)}
                    >
                      <Image source={{ uri: avatar.uri }} style={styles.avatarImage} />
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
              
              <View style={{
                marginTop: height * 0.04,
              }}>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Text style={styles.uploadText}>Upload</Text>
                  <Ionicons name="add" size={16} color={colors.textSecondary} style={styles.icon}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: { flex: 1 },
    safe: { flex: 1, alignItems: 'center', marginBottom: -30, },

    title: {
      fontSize: width * 0.08,
      color: '#FFF',
      fontWeight: 700,
      fontFamily: 'Rubic-Bold',
      marginVertical: 40,
      textAlign: 'center',
    },

    card: {
        flex :1,
        backgroundColor: colors.card,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    avatarContainer: {
      flex : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },

    sideColumn: {
      justifyContent: 'space-between',
      height: width * 0.6,
      gap: 10,
    },

    sideAvatar: {
      width: width * 0.2,
      aspectRatio: 1,
      borderRadius: 999,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },

    selectedAvatar: {
      borderColor: colors.primary,
    },

    centerAvatarContainer: {
      alignItems: 'center',
    },
    
    centerAvatar: {
      width: width * 0.35,
      aspectRatio: 1,
      borderRadius: 999,
      overflow: 'hidden',
      borderWidth: 5,
      borderColor: colors.divider,
    },
    
    avatarImage: {
      width: '100%',
      height: '100%',
    },

    refreshButton: {
      marginTop: 15,
    },

    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 30,
        alignSelf: 'center'
    },

    uploadText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Rubic-Medium'
    },
    icon :{
        borderRadius: 100,
        padding: 2,
        borderWidth: 2,
        borderColor: colors.textSecondary,
    },
    
    submitButton: {
      marginTop: 20,
      backgroundColor: colors.primary,
      width: '100%',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    
    submitText: {
        color: colors.textSecondary,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Rubic-Medium'
    },
  });