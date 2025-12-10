import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type continueParams = {
  userId: string;
  soloSessionId: string;
};

export default function adscreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [disableSkip, setDisableSkip] = useState(false);
  const route = useRoute<any>();
  const sessionDetails = route.params.sessionDetails as continueParams;
  console.log("ad : ",sessionDetails);
  
  
  function handleSkip(){
    navigation.navigate('roundOverview',{sessionDetails})
  }

  return (
    <LinearGradient 
    colors={colors.gradients.background}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.container}>
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <>
          <View>
            <Text style={styles.message}>
              Google Ad Here
            </Text>
          </View>

          <TouchableOpacity
          disabled={disableSkip}
          // onPress={() => navigation.navigate('SoloQuestion')}
          onPress={handleSkip}
          style={styles.startBtn}
          >
            <Text style={styles.startBtnText}>Skip</Text>
          </TouchableOpacity>
        </>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
    StyleSheet.create({
    container: {
      flex:1,
      padding: 16,
    },
    safe: {
      padding: 10,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    box: {
      width: "100%",
      borderRadius: 10,
      paddingVertical: 40,
      paddingHorizontal: 20,
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.bg,
    },
    message: {
      color:colors.text,
    },
    startBtn: {
      marginTop: 20,
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      alignSelf: 'center',
    },
    startBtnText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 700,
    }
    });
