import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Options = {
  optionNumber: number;
};

const OptionCircle: FC<Options> = ({ optionNumber }) => {
  return (
    <View style={styles.circleContainer}>
      <LinearGradient
        colors={["rgba(126,95,252,1)", "#6949fd"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.circle}
      >
        <Text style={styles.optionText}>0{optionNumber}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default OptionCircle;
