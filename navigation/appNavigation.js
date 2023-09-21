import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";


LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

export default function AppNavigation(){
    const Stack = createNativeStackNavigator()
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="home" options={{headerShown:false}} component={HomeScreen}/>
            <Stack.Screen name="search" options={{headerShown:false}} component={SearchScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
    )
}