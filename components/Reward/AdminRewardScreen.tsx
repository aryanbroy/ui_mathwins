import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppTheme, { ColorScheme } from "@/context/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import NativeAdCard from "../Ads/nativeAdCard";
import Entypo from "@expo/vector-icons/Entypo";

type userDataType = {
  id: string; 
  name: string; 
  points: number; 
}
const length = 51;
const DATA:userDataType[] = Array.from({ length }).map((_, i) => ({
  id: String(i),
  name: "AbhilashXMathwins",
  points: Math.floor(Math.random()*10000),
}));

export default function AdminRewardScreen() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [link, setLink] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const AD_FREQUENCY = 3;

  function handleApproveButton(){
     setIsLoading(true);
     console.log("handleApproveButton"); 
  }
  function handleRejecctButton(){
    setIsLoading(true);
    console.log("handleRejecctButton");
  }

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        {index !== 0 && index % AD_FREQUENCY === 0 && (
          <NativeAdCard />
        )}

        {renderUserCard({ item })}
      </>
    );
  };
  const renderUserCard  = ({ item }:any) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>👾</Text>
              </View>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.points}>{item.points}</Text>
          </View>
        </View>
        <View style={styles.check}>
          <TouchableOpacity 
          style={styles.sendButtonWrong}
          disabled={isLoading}
          onPress={handleRejecctButton}>
            <Entypo name="cross" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.sendButtonCorrect}
          disabled={isLoading}
          onPress={handleApproveButton}>
            <Entypo name="check" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="COUPON CODE | NOTE"
        placeholderTextColor={colors.textMuted}
        keyboardType="default"
        value={link}
        onChangeText={()=>{console.log(link);
        }}
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reward Requests</Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.primary
    },
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: "#FFF",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#000',
    },
    listContainer: {
      padding: 16,
      paddingTop: 8,
      backgroundColor: "#FFF",
    },
    cardContainer: {
      marginBottom: 16,
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: '#FFC3CE',
    },
    card: {
      borderRadius: 16,
      paddingBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInner: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      borderColor: "#000",
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 24,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 14,
      fontWeight: '400',
      color: '#000',
      marginBottom: 2,
    },
    points: {
      fontSize: 14,
      fontWeight: '900',
      color: '#000',
    },
    check: {
      flexDirection: "row",
      gap: 10,
    },
    sendButtonWrong: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    sendButtonCorrect: {
      backgroundColor: colors.success,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    sendButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    input: {
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 5,
      paddingHorizontal: 14,
      backgroundColor: colors.textSecondary
    },
    pasteLinkText: {
      fontSize: 13,
    },
  });
