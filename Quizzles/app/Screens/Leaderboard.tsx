import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { type FC, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import SelectDrop from "../Components/SelectDrop";
import { get } from "../Utils/networkreq";
import { Toast } from "react-native-toast-notifications";
const Leaderboard: FC = ({ route }) => {
  const navigation = useNavigation();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [listData, setListData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<boolean>(false);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        style={styles.avatar}
        source={{ uri: `https://api.multiavatar.com/${item.userName}` }}
      />
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );
  useEffect(() => {
    const quizID = route?.params?.quizID; // Get quizID from route.params
    if (quizID) {
      setSelectedQuiz(quizID);
    }
  }, [route.params]);
  useEffect(() => {
    const fet = async () => {
      if (!selectedQuiz) return;
      try {
        setLoading(true);
        const resp = await get(`/quizzes/${selectedQuiz}/leaderboard`);
        if (resp?.status) {
          setListData(resp.dat);
        } else {
          setErr(true);
        }
      } catch {
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
    fet();
  }, [selectedQuiz]);

  const handleValueChange = (value: string | null) => {
    setSelectedQuiz(value); // Update the selectedQuiz state
  };

  if (err) {
    Toast.show("Empty or Error", {
      type: "danger",
      placement: "bottom",
      duration: 4000,
      animationType: "zoom-in",
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <AntDesign name="arrowleft" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Leaderboards</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <SelectDrop onValueChange={handleValueChange} />
      </View>
      <View style={styles.dataContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#37e9bb" />
        ) : err ? (
          <AntDesign name="exclamationcircle" size={50} color="grey" />
        ) : (
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.userName}
          />
        )}
      </View>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
  },
  dataContainer: {
    flex: 2,
    padding: 20,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#32167c",
    marginVertical: 10,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#37e9bb",
  },
  score: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6949fd",
  },
});

export default Leaderboard;
