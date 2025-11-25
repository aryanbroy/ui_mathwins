import { View, Text, StyleSheet, Dimensions  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, G } from "react-native-svg";

export default function BackgroundTextTexture() {
    const { width } = Dimensions.get("window");
    const d = `
    M 0 170
    C 90 260, 260 330, 400 260
    C 540 180, 660 20, 820 0
  `;

    return (
        <View style={styles.page}>
            <View style={styles.box}>
                <View style = {styles.outerCircle2}>
                    <View style = {styles.outerCircle1}>
                        <View style = {styles.centerCircle}>
                            
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.svgContainer}>
                <Svg
                width={width}
                height={420}
                viewBox="0 0 820 400"
                preserveAspectRatio="xMidYMid slice"
                >
                {/* top/outer wavy line */}
                <Path d={d} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" />

                {/* second line drawn slightly shifted down to create parallel band */}
                <G transform="translate(0, 48)">
                    <Path d={d} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" />
                </G>
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex:1,
        position: "absolute",
        opacity: 0.5,
    },
    box: {
        width: 400,
        height: 400,
        left: -180,
        top: 40,
    },
    centerCircle: {
        width: 150,
        height: 150,
        backgroundColor: "#FFF",
        borderRadius: "100%",
        opacity: 0.5,
        margin: 0,
    },
    outerCircle1: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FFF",
        borderRadius: "100%",
        margin: 50,
    },
    outerCircle2: {
        flex:1,
        borderWidth: 1,
        borderColor: "#FFF",
        borderRadius: "100%",
    },
    svgContainer: {
    position: "absolute",
    right: -40,
    bottom: -20,
    // keep container large enough to fit the wave
    width: "120%",
    height: 420,
    overflow: "visible",
  },
});