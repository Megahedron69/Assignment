import { registerSheet } from "react-native-actions-sheet";
import BottomSheet from "../Components/ActionSheet";
import { SheetDefinition } from "react-native-actions-sheet";
registerSheet("example-sheet", BottomSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "example-sheet": SheetDefinition;
  }
}

export {};
