import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ClickerScreen from "../screens/ClickerScreen";

const Tab = createBottomTabNavigator();

const Navigation: React.FC = () => (
  <Tab.Navigator id={undefined}>
    <Tab.Screen
      name="Clicker"
      component={ClickerScreen}
    />
  </Tab.Navigator>
);

export default Navigation;
