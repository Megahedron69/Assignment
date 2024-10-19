import { type FC, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SheetManager } from "react-native-actions-sheet";
import { get } from "../Utils/networkreq";

const gradientColors = [
  { light: "#FFA500", dark: "#FF8C00" },
  { light: "#ADD8E6", dark: "#0000FF" },
  { light: "#DDA0DD", dark: "#800080" },
  { light: "#90EE90", dark: "#008000" },
  { light: "#FFB6C1", dark: "#FF1493" },
];

const getGradient = (index: number) => {
  const color = gradientColors[index % gradientColors.length];
  return color;
};

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

type PentagonBut = {
  index: number;
  quiz: any | undefined;
};
const PentagonButton: FC<PentagonBut> = ({ index, quiz }) => {
  const gradient = getGradient(index);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("Quiz", {
          quizId: quiz.quizID,
          quizName: quiz.quizName,
        });
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

      <AntDesign name="star" size={32} style={[styles.icon, styles.topLeft]} />
      <AntDesign name="star" size={32} style={[styles.icon, styles.top]} />
      <AntDesign name="star" size={32} style={[styles.icon, styles.topRight]} />

      <View style={styles.textContainer}>
        <Text style={styles.quizText}>Quiz</Text>
        <Text style={styles.quizNumber}>{`0${index + 1}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

type PentagonList = {
  numberOfPentagons: number | undefined;
  quizzes: any[] | null;
};
const PentagonList: FC<PentagonList> = ({ numberOfPentagons, quizzes }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {Array.from({ length: numberOfPentagons }, (_, index) => (
        <PentagonButton key={index} index={index} quiz={quizzes[index]} />
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

const Quizzes = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<any[] | null>(null);

  useEffect(() => {
    const fet = async () => {
      setLoading(true);
      try {
        const resp = await get("/quizzes");
        setQuizzes(resp);
        setErr(false);
      } catch (err) {
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
    fet();
  }, []);
  if (err) {
    Toast.show("Something went wrong", {
      type: "danger",
      placement: "bottom",
      duration: 4000,
      animationType: "zoom-in",
    });
  }
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
      {err ?? (
        <View style={styles.specialContainer}>
          <AntDesign name="warning" size={64} color="gray" />
        </View>
      )}
      {loading ? (
        <View style={styles.specialContainer}>
          <ActivityIndicator size="large" color="#37e9bb" />
        </View>
      ) : (
        <PentagonList numberOfPentagons={quizzes?.length} quizzes={quizzes} />
      )}
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
  specialContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 0 },
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
