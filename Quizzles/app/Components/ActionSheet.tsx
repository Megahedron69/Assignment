import ActionSheet from "react-native-actions-sheet";
import { View, Text, StyleSheet } from "react-native";
import React from "react";
import QuizForm from "./QuizForm";

const BottomSheet = () => {
  return (
    <ActionSheet>
      <QuizForm />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: "100%",
    backgroundColor: "black",
    padding: 20,
    borderTopLeftRadius: 43,
    marginTop: 16,
    borderTopRightRadius: 43,
  },
  text: {
    color: "white",
  },
});

export default BottomSheet;
