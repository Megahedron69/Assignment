import { type FC } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SheetManager } from "react-native-actions-sheet";
const gradientColors = [
  { light: "#FFA500", dark: "#FF8C00" }, // Orange
  { light: "#ADD8E6", dark: "#0000FF" }, // Blue
  { light: "#DDA0DD", dark: "#800080" }, // Purple
  { light: "#90EE90", dark: "#008000" }, // Green
  { light: "#FFB6C1", dark: "#FF1493" }, // Pink
];

// Function to get the linear gradient colors based on the index
const getGradient = (index: number) => {
  const color = gradientColors[index % gradientColors.length];
  return color;
};

// Pentagon Path Generator
const roundedPentagonPath = (size: number, cornerRadius = 5) => {
  const angle = (2 * Math.PI) / 5;
  const path = [];
  for (let i = 0; i < 5; i++) {
    const startAngle = i * angle;
    const endAngle = (i + 1) * angle;
    const x1 = size / 2 + (size / 2 - cornerRadius) * Math.sin(startAngle);
    const y1 = size / 2 - (size / 2 - cornerRadius) * Math.cos(startAngle);
    const x2 = size / 2 + (size / 2 - cornerRadius) * Math.sin(endAngle);
    const y2 = size / 2 - (size / 2 - cornerRadius) * Math.cos(endAngle);
    const mx = size / 2 + (size / 2) * Math.sin(startAngle + angle / 2);
    const my = size / 2 - (size / 2) * Math.cos(startAngle + angle / 2);
    if (i === 0) {
      path.push(`M ${x1},${y1}`);
    }
    path.push(`Q ${mx},${my} ${x2},${y2}`);
  }
  path.push("Z");
  return path.join(" ");
};

// Pentagon Button Component
type PentagonBut = {
  index: number;
};
const PentagonButton: FC<PentagonBut> = ({ index }) => {
  const gradient = getGradient(index);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("Quiz", { quizId: `0${index + 1}` });
      }}
    >
      <Svg height="160" width="160">
        <Defs>
          <LinearGradient
            id={`grad${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={gradient.light} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradient.dark} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={roundedPentagonPath(160, 1)}
          fill={`url(#grad${index})`}
          stroke="#32167c"
          strokeWidth="1"
        />
      </Svg>

      {/* Stars positioned at the top points of the pentagon */}
      <AntDesign name="star" size={32} style={[styles.icon, styles.topLeft]} />
      <AntDesign name="star" size={32} style={[styles.icon, styles.top]} />
      <AntDesign name="star" size={32} style={[styles.icon, styles.topRight]} />

      {/* Text inside the pentagon */}
      <View style={styles.textContainer}>
        <Text style={styles.quizText}>Quiz</Text>
        <Text style={styles.quizNumber}>{`0${index + 1}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Pentagon List Component
type PentagonList = {
  numberOfPentagons: number;
};
const PentagonList: FC<PentagonList> = ({ numberOfPentagons }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {Array.from({ length: numberOfPentagons }, (_, index) => (
        <PentagonButton key={index} index={index} />
      ))}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => {
          SheetManager.show("example-sheet");
        }}
      >
        <AntDesign name="plus" size={40} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

// Main Quizzes Component
const Quizzes = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.push("Home");
          }}
        >
          <AntDesign name="arrowleft" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Quizzes</Text>
        </View>
      </View>
      <PentagonList numberOfPentagons={5} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1f1147",
    paddingTop: 50,
  },
  header: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#1f1147",
  },
  backButton: {
    backgroundColor: "#32167c",
    padding: 10,
    borderRadius: 50,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#37e9bb",
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingTop: 20,
  },
  container: {
    margin: 10,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 160,
  },
  icon: {
    position: "absolute",
    color: "#FFD700",
    textShadowColor: "black", // Gold shadow color
    textShadowOffset: { width: 0, height: 0 }, // No offset, directly behind the icon
    textShadowRadius: 4,
  },
  topLeft: {
    left: 5,
    top: 20,
  },
  top: {
    top: -15,
  },
  topRight: {
    right: 5,
    top: 20,
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  quizText: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#FFFFFF",
  },
  quizNumber: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#FFFFFF",
  },
  plusButton: {
    margin: 10,
    width: 160,
    height: 160,
    backgroundColor: "#32167c",
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});

export default Quizzes;
