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
    margin: 10, // Optional margin
  },
  circle: {
    width: 40, // Set the width of the circle
    height: 40, // Set the height of the circle
    borderRadius: 20, // Half of width/height to create a circle
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    color: "#FFFFFF", // White color for the text
    fontWeight: "bold", // Heavy bold font
    fontSize: 18, // Set the font size as needed
  },
});

export default OptionCircle;
