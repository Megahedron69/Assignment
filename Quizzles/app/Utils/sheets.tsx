import { registerSheet } from "react-native-actions-sheet";
import BottomSheet from "../Components/ActionSheet";
import { SheetDefinition } from "react-native-actions-sheet";
registerSheet("example-sheet", BottomSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "example-sheet": SheetDefinition;
  }
}

export {};
