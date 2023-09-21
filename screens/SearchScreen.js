import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { theme } from "../theme";
import { StatusBar } from "expo-status-bar";
import { fetchLocations } from "../api/weather";
import { useNavigation } from "@react-navigation/native";


export default function SearchScreen() {

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleSearch = async (loc) => {
        if (loc?.length > 2) {
            setLoading(true);
            try {
                const data = await fetchLocations({ cityName: loc });
                setLocations(data);
                setLoading(false);
            } catch { (error) => console.log(error)}
        }
    };

    const handleLocations = (loc) =>{
        navigation.replace("home", loc);
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    return (
        <View className='flex-1 relative border-2 border-yellow-400'>
            <StatusBar style="light" />
            <Image blurRadius={70} source={require("../assets/images/bg.png")} className="absolute h-full w-full" style={{resizeMode:'cover'}}/>
            <View className="mx-4 mt-10 z-50 flex-1">
                <View style={{ backgroundColor: theme.bgWhite(0.2) }} className="flex flex-row rounded-full">
                    <TextInput autoFocus onChangeText={handleTextDebounce} placeholder="Search City" placeholderTextColor="lightgray" className="pl-6 h-full flex-1 text-base text-white rounded-full"/>
                    <TouchableOpacity onPress={() => navigation.navigate('home')} className="rounded-full p-3 m-1 bg-neutral-500">
                        <XMarkIcon size={25} color={"white"} />
                    </TouchableOpacity>
                </View>
                { !loading ? (
                    locations.length > 0 ? (
                        <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                            {locations.map((loc, index) => {
                                let showBorder = index + 1 != locations.length;
                                let borderClass = showBorder ? "border-b-2 border-b-gray-400" : "";
                                return (
                                    <TouchableOpacity key={index} onPress={() => handleLocations(loc)} className={"flex-row items-center p-3 px-4 mb-1" + borderClass}>
                                        <MapPinIcon size={20} color="gray" />
                                        <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View> ) : null
                    ) : (
                    <View className="flex-1 flex-row justify-center items-center">
                        <ActivityIndicator size="large" color="#0bb3b2" />
                    </View>
                )}
            </View>
        </View>
    );
}
