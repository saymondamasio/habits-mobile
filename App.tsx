import "./src/lib/dayjs";

import { StatusBar } from "expo-status-bar";

import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { Loading } from "./src/components/Loading";
import { Home } from "./src/screens/Home";
import { Routes } from "./src/routes";
import { View } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar style="light" translucent />
      <View className="flex-1 bg-background">
        <Routes />
      </View>
    </>
  );
}
