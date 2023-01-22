import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { AppRoutes } from "./app.routes";

export function Routes() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}
