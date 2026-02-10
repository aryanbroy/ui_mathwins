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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppTheme, { ColorScheme } from "@/context/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import NativeAdCard from "../Ads/nativeAdCard";
import Entypo from "@expo/vector-icons/Entypo";
import { approveClaim, getAllClaims, rejectClaim } from "@/lib/api/rewards";

type userDataType = {
  id: string;
  userId: string; 
  status: string; 
  coinsLocked: number; 
  createdAt: string;
}

export default function AdminRewardScreen() {
  const [data, setData] = useState<userDataType[]>([]);
  const [links, setLinks] = useState<{[key: string]: string}>({});
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  
  function reloadRewardScreen(){
    getAllClaims().then((res)=>{
      console.log('getStreak ',res);
      setData(res.data);
    }).catch((err)=>{
      console.log('getStreak err ',err);
    });
  }
  
  React.useEffect(()=>{
    reloadRewardScreen();
  },[])
  
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const AD_FREQUENCY = 3;

  function handleApproveButton(itemId: string, link: string){
    if(!link || link.trim() === ''){
      Alert.alert('Error', 'Coupon code/link is required');
      return;
    }
    
    setLoadingStates(prev => ({...prev, [itemId]: true}));
    console.log("handleApproveButton", itemId, link); 
    
    approveClaim(itemId, link)
      .then((res) => {
        console.log('Claim approved successfully', res);
        Alert.alert('Success', res.message);
        setLinks(prev => ({...prev, [itemId]: ''}));
        reloadRewardScreen();
      })
      .catch((err) => {
        console.log('Error approving claim', err);
        Alert.alert('Error', 'Failed to approve reward. Please try again.');
      })
      .finally(() => {
        setLoadingStates(prev => ({...prev, [itemId]: false}));
      });
  }
  
  function handleRejectButton(itemId: string, note: string){
    if(!note || note.trim() === ''){
      Alert.alert('Error', 'Rejection note is required');
      return;
    }
    
    setLoadingStates(prev => ({...prev, [itemId]: true}));
    console.log("handleRejectButton", itemId, note);
    
    rejectClaim(itemId, note)
      .then((res) => {
        console.log('Claim rejected successfully', res);
        Alert.alert('Success', 'Reward request rejected!');
        setLinks(prev => ({...prev, [itemId]: ''}));
        reloadRewardScreen();
      })
      .catch((err) => {
        console.log('Error rejecting claim', err);
        Alert.alert('Error', 'Failed to reject reward. Please try again.');
      })
      .finally(() => {
        setLoadingStates(prev => ({...prev, [itemId]: false}));
      });
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
  
  const renderUserCard = ({ item }: any) => {
    const itemLink = links[item.id] || '';
    const isItemLoading = loadingStates[item.id] || false;
    
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <View style={styles.userInfo}>
              <Text style={styles.username}>id: {item.id}</Text>
              <Text style={styles.username}>userId: {item.userId}</Text>
              <Text style={styles.points}>Locked Points : {item.coinsLocked}</Text>
            </View>
          </View>
          <View style={styles.check}>
            <TouchableOpacity 
              style={styles.sendButtonWrong}
              disabled={isItemLoading}
              onPress={() => handleRejectButton(item.id, itemLink)}>
              <Entypo name="cross" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.sendButtonCorrect}
              disabled={isItemLoading}
              onPress={() => handleApproveButton(item.id, itemLink)}>
              <Entypo name="check" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="COUPON CODE | NOTE"
          placeholderTextColor={colors.textMuted}
          keyboardType="default"
          value={itemLink}
          onChangeText={(text) => {
            setLinks(prev => ({...prev, [item.id]: text}));
          }}
          editable={!isItemLoading}
        />
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reward Requests</Text>
      </View>
      <FlatList
        data={data}
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
      fontSize: 10,
      fontWeight: '400',
      color: '#000',
      marginBottom: 2,
    },
    points: {
      fontSize: 12,
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