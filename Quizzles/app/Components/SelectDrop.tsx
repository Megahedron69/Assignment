import { type FC, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import OptionCircle from "./OptionCircle";

import { Toast } from "react-native-toast-notifications";
const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];
type data = {
  label: string;
  value: string;
};
type dropDownProps = {
  data: data[];
  onValueChange: (value: string | null) => void;
};

const DropdownComponent: FC<dropDownProps> = ({ onValueChange }) => {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <OptionCircle optionNumber={5} />
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#32167c" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        containerStyle={styles.containerz}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select Quiz" : "Choose quiz"}
        searchPlaceholder="Search Quiz"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          onValueChange(item.value);
          setIsFocus(false);
        }}
        activeColor="#37e9bb"
        autoScroll
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "#37e9bb" : "white"}
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1147",
    padding: 16,
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#32167c",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    shadowColor: "#32167c",
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  containerz: {
    backgroundColor: "#32167c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#32167c",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    borderColor: "#32167c",
    elevation: 7,
  },
  label: {
    position: "absolute",
    backgroundColor: "red",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 24,
    color: "white",
    fontWeight: "600",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    marginLeft: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 18,
    color: "white",
    borderColor: "#37e9bb",
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
