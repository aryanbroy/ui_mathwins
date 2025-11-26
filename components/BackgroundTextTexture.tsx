import { View, Text, StyleSheet, Dimensions  } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function BackgroundTextTexture() {
    const { width } = Dimensions.get("window");
    const d = `
    M 0 170
    C 90 260, 260 330, 400 260
    C 540 180, 660 20, 820 0
  `;

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="math-compass" size={70} color="black" style={styles.compass} />
                <AntDesign name="code-sandbox" size={60} color="black" style={styles.sandbox}/>
                <View style={styles.holoCicrcle1}></View>
                <View style={styles.holoCicrcle2}></View>
                <View style={styles.holoCicrcle3}></View>
                <View style={styles.holoCicrcle4}></View>
                <View style={styles.holoCicrcle5}></View>
                <MaterialCommunityIcons name="brain" size={60} color="black" style={styles.brain}/>
                <MaterialCommunityIcons name="vector-triangle" size={60} color="black" style={styles.triangle}/>
            </View>
            <View style={styles.textBg}>
                <Text style={styles.mainText}>MATHEMATICS</Text>
            </View>
            <View></View>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex:1,
        width: "100%",
        position: "absolute",
        paddingHorizontal: 10,
        opacity: 0.1,
    },
    header: {
        marginBottom: 2,
        height: 200,
        position: "relative",
    },
    compass: {
        position: "absolute",
        left: 150,
        top: 15,
    },
    sandbox: {
        position: "absolute",
        top: 50,
        left: 0,
    },
    holoCicrcle1: {
        position: "absolute",
        borderWidth: 2,
        borderRadius: 100,
        width: 30,
        height: 30,
        left: 95,
        top: 10,
    },
    holoCicrcle2: {
        position: "absolute",
        borderWidth: 2,
        borderRadius: 100,
        width: 30,
        height: 30,
        left: 270,
        top: 150,
    },
    holoCicrcle3: {
        position: "absolute",
        borderWidth: 2,
        borderRadius: 100,
        width: 15,
        height: 15,
        left: 250,
        top: 50,
    },
    holoCicrcle4: {
        position: "absolute",
        borderWidth: 2,
        borderRadius: 100,
        width: 15,
        height: 15,
        left: 20,
        top: 160,
    },
    holoCicrcle5: {
        position: "absolute",
        borderWidth: 2,
        borderRadius: 100,
        width: 15,
        height: 15,
        left: 370,
        top: 20,
    },
    brain: {
        position: "absolute",
        left: 310,
        top: 60,
    },
    triangle: {
        position: "absolute",
        left: 100,
        top: 120,
    },
    textBg: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10,
        backgroundColor: "#000"
    },
    mainText: {
        fontSize: 50,
        fontWeight: 900,
        color: "#FFF",
        position: "relative",
    },
});