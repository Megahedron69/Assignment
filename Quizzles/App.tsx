import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ToastProvider } from "react-native-toast-notifications";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/Screens/Home";
import Leaderboard from "./app/Screens/Leaderboard";
import Quizzes from "./app/Screens/Quizzes";
import QuizScreen from "./app/Screens/QuizScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ResultComp from "./app/Components/ResultComp";
import { SheetProvider } from "react-native-actions-sheet";
import "./app/Utils/sheets";
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
export default function App() {
  const [loaded, error] = useFonts({
    Nunito: require("./assets/fonts/Nunito.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <NavigationContainer>
            <SheetProvider>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    header: () => null,
                    animation: "slide_from_left",
                  }}
                />
                <Stack.Screen
                  name="Leaderboard"
                  component={Leaderboard}
                  options={{
                    header: () => null,
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="Quizzes"
                  component={Quizzes}
                  options={{
                    header: () => null,
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="Quiz"
                  component={QuizScreen}
                  options={({ route }) => ({
                    title: `Quiz ${route.params?.quizId}`,
                    header: () => null,
                    animation: "fade",
                  })}
                />
                <Stack.Screen
                  name="Result"
                  component={ResultComp}
                  options={() => ({
                    header: () => null,
                    animation: "simple_push",
                  })}
                />
              </Stack.Navigator>

              <StatusBar
                style="auto"
                animated={true}
                translucent={true}
                backgroundColor="transparent"
              />
            </SheetProvider>
          </NavigationContainer>
        </ToastProvider>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Nunito",
  },
});
