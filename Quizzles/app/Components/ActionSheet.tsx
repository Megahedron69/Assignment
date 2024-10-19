import ActionSheet from "react-native-actions-sheet";
import type { FC } from "react";
import QuizForm from "./QuizForm";

const BottomSheet: FC = () => {
  return (
    <ActionSheet>
      <QuizForm />
    </ActionSheet>
  );
};

export default BottomSheet;
