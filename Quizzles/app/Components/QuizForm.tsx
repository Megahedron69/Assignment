import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ScrollView, SheetManager } from "react-native-actions-sheet";
import { Formik } from "formik";
import * as Yup from "yup";
import { Toast } from "react-native-toast-notifications";
import { post } from "../Utils/networkreq";
import { useNavigation } from "@react-navigation/native";

const QuestionSchema = Yup.object().shape({
  quizName: Yup.string().required("Quiz name is required"),
  totalQuestions: Yup.number()
    .required("Total questions is required")
    .positive("Must be a positive number")
    .integer("Must be an integer"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        questionText: Yup.string().required("Question text is required"),
        imageUrl: Yup.string().required("Image Prompt is required"),
        options: Yup.array()
          .of(
            Yup.object().shape({
              optionText: Yup.string().required("Option text is required"),
            })
          )
          .length(4, "Must have exactly 4 options") // Must have exactly 4 options
          .required("Options are required"),
        correctOptionId: Yup.string().required("Correct option is required"),
      })
    )
    .required("Questions are required"),
});

const QuizForm = () => {
  const navigation = useNavigation();
  const initialQuestions = [
    {
      questionText: "",
      imageUrl: "",
      options: [
        { optionText: "" },
        { optionText: "" },
        { optionText: "" },
        { optionText: "" },
      ],
      correctOptionId: "",
    },
  ];

  const handleSubmit = async (values) => {
    const questionsArray = values.questions.map((question, index) => ({
      questionId: String(index + 1),
      questionText: question.questionText,
      imageUrl:
        "https://dummyimage.com/600x400/000/fff&text=" +
        question.imageUrl
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("+"),
      options: question.options.map((option, optionIndex) => ({
        optionId: String(optionIndex + 1),
        optionText: option.optionText,
      })),
      correctOptionId: question.correctOptionId,
    }));

    try {
      const response = await post("/quizzes", {
        quizName: values.quizName,
        questions: questionsArray,
        totalQuestions: values.questions.length,
      });

      if (response) {
        Toast.show("Quiz submitted successfully!", { type: "success" });
        SheetManager.hide("example-sheet");
      } else {
        Toast.show("Failed to submit quiz", { type: "danger" });
      }
    } catch (error) {
      Toast.show("An error occurred: " + error.message, { type: "danger" });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{
          quizName: "",
          totalQuestions: initialQuestions.length,
          questions: initialQuestions,
        }}
        validationSchema={QuestionSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          errors,
        }) => {
          const addQuestion = () => {
            const newQuestion = {
              questionText: "",
              imageUrl: "",
              options: [
                { optionText: "" },
                { optionText: "" },
                { optionText: "" },
                { optionText: "" },
              ],
              correctOptionId: "",
            };
            // Update the questions and totalQuestions in Formik state
            setFieldValue("questions", [...values.questions, newQuestion]);
            setFieldValue("totalQuestions", values.questions.length + 1);
          };

          return (
            <>
              <TextInput
                placeholder="Quiz Name"
                placeholderTextColor={"#736f73"}
                style={styles.input}
                onChangeText={handleChange("quizName")}
                onBlur={handleBlur("quizName")}
                value={values.quizName}
              />
              {errors.quizName && (
                <Text style={styles.error}>{errors.quizName}</Text>
              )}

              <TextInput
                placeholder="Total Questions"
                placeholderTextColor={"#736f73"}
                style={styles.input}
                keyboardType="numeric"
                editable={false} // Disable input
                value={String(values.questions.length)} // Show the current number of questions
              />
              {errors.totalQuestions && (
                <Text style={styles.error}>{errors.totalQuestions}</Text>
              )}

              {values.questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                  <TextInput
                    placeholder={`Question ${index + 1}`}
                    style={styles.input}
                    onChangeText={handleChange(
                      `questions[${index}].questionText`
                    )}
                    onBlur={handleBlur(`questions[${index}].questionText`)}
                    value={question.questionText}
                  />
                  {errors.questions?.[index]?.questionText && (
                    <Text style={styles.error}>
                      {errors.questions[index].questionText}
                    </Text>
                  )}

                  <TextInput
                    placeholder="AI Image prompt"
                    style={styles.input}
                    onChangeText={handleChange(`questions[${index}].imageUrl`)}
                    onBlur={handleBlur(`questions[${index}].imageUrl`)}
                    value={question.imageUrl}
                  />
                  {errors.questions?.[index]?.imageUrl && (
                    <Text style={styles.error}>
                      {errors.questions[index].imageUrl}
                    </Text>
                  )}
                  <View style={{ height: 15 }}></View>
                  {question.options.map((option, optionIndex) => (
                    <TextInput
                      key={optionIndex}
                      placeholder={`Option ${optionIndex + 1}`}
                      style={[styles.input]}
                      onChangeText={handleChange(
                        `questions[${index}].options[${optionIndex}].optionText`
                      )}
                      onBlur={handleBlur(
                        `questions[${index}].options[${optionIndex}].optionText`
                      )}
                      value={option.optionText}
                    />
                  ))}
                  {errors.questions?.[index]?.options && (
                    <Text style={styles.error}>
                      {errors.questions[index].options[0]?.optionText}
                    </Text>
                  )}

                  <TextInput
                    placeholder="Correct Option ID"
                    style={styles.input}
                    onChangeText={handleChange(
                      `questions[${index}].correctOptionId`
                    )}
                    onBlur={handleBlur(`questions[${index}].correctOptionId`)}
                    value={question.correctOptionId}
                  />
                  {errors.questions?.[index]?.correctOptionId && (
                    <Text style={styles.error}>
                      {errors.questions[index].correctOptionId}
                    </Text>
                  )}
                </View>
              ))}

              <TouchableOpacity style={styles.button} onPress={addQuestion}>
                <Text style={styles.buttonText}>Add Question</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit Quiz</Text>
              </TouchableOpacity>
            </>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#361e70",
    borderTopLeftRadius: 43,
    borderTopRightRadius: 43,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: "#6949fd",
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 10,
    color: "#37e9bb",
    textShadowColor: "black",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 4,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#6949fd",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 6,
  },
  submitButton: {
    backgroundColor: "#37e9bb",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#6949fd",
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 6,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 2,
    textAlign: "left",
  },
});

export default QuizForm;
