import { useRef, useState, type FC, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import OptionCircle from "./OptionCircle";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";

const { width } = Dimensions.get("window");

type QuestionModal = {
  quizID: number;
  questions: any[];
};

const QuestionModal: FC<QuestionModal> = ({ questions, quizID }) => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Map<number, { chosen: number; isCorrect: boolean }>
  >(new Map());
  const [score, setScore] = useState<number>(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    setProgress(1);

    const totalDuration = 10000;
    const decrementInterval = 100;
    const decrementAmount = decrementInterval / totalDuration;

    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = Math.max(prevProgress - decrementAmount, 0);
        if (newProgress <= 0) {
          clearInterval(intervalId);
          goNext();
        }
        return newProgress;
      });
    }, decrementInterval);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      setCurrentIndex(0);
      setSelectedOptions(new Map());
      setScore(0);
    };
  }, []);

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      swiperRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
      setProgress(1);
    }
  };

  const finishQuiz = () => {
    navigation.navigate("Result", {
      score: score,
      totalQues: questions.length,
      quizId: quizID,
    });
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      swiperRef.current.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerClick = (chosenOptionId: number) => {
    const correctOptionId = parseInt(
      questions[currentIndex].correctOptionId,
      10
    );
    const isCorrect = chosenOptionId === correctOptionId;

    setSelectedOptions((prev) =>
      new Map(prev).set(currentIndex, { chosen: chosenOptionId, isCorrect })
    );

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const isAnswerSelected = (index: number, optionId: number) => {
    const selection = selectedOptions.get(index);
    return selection ? selection.chosen === optionId : false;
  };

  const getButtonStyle = (index: number, optionId: number) => {
    const selection = selectedOptions.get(index);
    if (selection) {
      if (selection.chosen === optionId) {
        return selection.isCorrect ? "#37e9bb" : "#ff4c4c";
      }
    }
    return "#1f1147";
  };

  return (
    <View style={styles.container}>
      <Progress.Bar progress={progress} width={width} color="#37e9bb" />
      <SwiperFlatList
        ref={swiperRef}
        data={questions}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionCounter}>
                {item.questionId < 10 ? `0${item.questionId}` : item.questionId}
                /
                {questions.length < 10
                  ? `0${questions.length}`
                  : questions.length}
              </Text>
              <Text
                style={styles.question}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.questionText}
              </Text>
            </View>
            <View style={styles.ImageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.options}>
              {item.options.map((option) => (
                <TouchableOpacity
                  key={option.optionId}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: getButtonStyle(
                        index,
                        parseInt(option.optionId, 10)
                      ),
                      opacity: selectedOptions.has(index) ? 0.5 : 1,
                    },
                  ]}
                  onPress={() => {
                    if (!selectedOptions.has(index)) {
                      handleAnswerClick(parseInt(option.optionId, 10));
                    }
                  }}
                  disabled={selectedOptions.has(index)}
                >
                  <OptionCircle optionNumber={option.optionId} />
                  <Text
                    style={styles.optionText}
                  >{`${option.optionText}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.navBut, { opacity: currentIndex === 0 ? 0.5 : 1 }]}
          onPress={goPrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBut}
          onPress={currentIndex === questions.length - 1 ? finishQuiz : goNext}
        >
          <Text style={styles.navButText}>
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  slide: {
    width,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#1f1147",
  },
  questionCounter: {
    color: "#37e9bb",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "left",
  },
  questionContainer: {
    marginTop: -10,
    paddingLeft: 15,
  },
  question: {
    color: "white",
    fontSize: 32,
    fontWeight: "400",
    textAlign: "left",
  },
  ImageContainer: {
    marginTop: 8,
    borderRadius: 40,
    width: "100%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    borderRadius: 20,
    height: 240,
  },
  options: {
    marginTop: 10,
    width: "95%",
  },
  optionButton: {
    borderWidth: 2,
    borderColor: "#361E70",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: "100%",
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 15,
    fontWeight: "600",
    color: "white",
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  navBut: {
    backgroundColor: "#6949fd",
    borderRadius: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: "40%",
  },
  navButText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 18,
  },
});

export default QuestionModal;
