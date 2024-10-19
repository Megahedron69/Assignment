import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { type FC, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { post } from "../Utils/networkreq";

const ResultComp: FC = ({ route }) => {
  const { score, totalQues, quizId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fn = async () => {
      try {
        setLoading(true);
        const userName = await AsyncStorage.getItem("userName");
        const resp = await post(`/quizzes/${quizId}/submit`, {
          userName,
          score,
        });
        setFinalScore(resp?.score);
      } catch {
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
    fn();
  }, [quizId, score]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#37e9bb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.errorContainer}>
        <AntDesign name="exclamationcircleo" size={64} color="red" />
        <Text style={styles.errorText}>
          Something went wrong. Please try again later.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            navigation.navigate("Quizzes");
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.centered}>
        <AntDesign name="warning" size={64} color="red" />
        <Text style={styles.errorText}>
          Error fetching quiz data. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate("Leaderboard", { quizID: quizId });
          }}
        >
          <AntDesign name="Trophy" size={32} color="gold" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Results</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>Total correct answers</Text>
        <Text style={styles.text2}>
          {score} out of {totalQues}
        </Text>
      </View>
      <View style={styles.scoreBox}>
        <View style={styles.gradientBox}>
          <Text style={styles.head}>Your final score is</Text>
          <View style={styles.circleContainer}>
            <ConfettiCannon
              count={200}
              origin={{ x: 10, y: 0 }}
              explosionSpeed={450}
              autoStartDelay={1}
              fallSpeed={5000}
              fadeOut={true}
            />
            <View style={styles.circle}>
              <Text style={styles.optionText}>
                {finalScore ? finalScore : score * 10}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.playNowButton}
        onPress={() => {
          navigation.navigate("Quizzes");
        }}
      >
        <Text style={styles.playNowText}>Play More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1147",
  },
  loadingText: {
    marginTop: 10,
    color: "#37e9bb",
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1147",
  },
  errorText: {
    marginTop: 10,
    color: "red",
    fontSize: 18,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#37e9bb",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  textContainer: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 30,
  },
  text1: {
    fontWeight: "500",
    color: "white",
    textAlign: "left",
    fontSize: 22,
  },
  text2: {
    fontWeight: "500",
    color: "#37e9bb",
    textAlign: "left",
    fontSize: 22,
  },
  scoreBox: {
    padding: 20,
    width: "80%",
    height: "50%",
    borderRadius: 25,
    shadowColor: "rgba(126,95,252,0.8)",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8.65,
    elevation: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 40,
    marginBottom: 40,
    backgroundColor: "#6949fd", // In case gradient fails, fallback background
  },
  gradientBox: {
    flex: 1,
    width: "100%", // Make the gradient fill the scoreBox
    borderRadius: 25,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -10,
  },
  head: {
    fontWeight: "700",
    fontSize: 28,
    color: "#FFFFFF", // White color for the text
    textAlign: "center",
    marginBottom: 20, // Adjust spacing between title and circle
    zIndex: 10,
  },
  circleContainer: {
    zIndex: 10,
  },
  circle: {
    width: 200, // Adjust size of the circle
    height: 200,
    borderRadius: 100,
    backgroundColor: "gold",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 10,
  },
  optionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    zIndex: 10,
    fontSize: 64, // Bigger font for the score
  },
  playNowButton: {
    backgroundColor: "#6949FD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    width: "80%",
    marginLeft: 40,
  },
  playNowText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ResultComp;
