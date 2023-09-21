import { View, Text, Image,TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import { ActivityIndicator } from "react-native";
import { getData, storeData } from "../utils/asyncStorage";
import { useNavigation, useRoute } from "@react-navigation/native";


export default function HomeScreen() {

  const { params: loc } = useRoute();
  const navigation = useNavigation()
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleWeather = async (location) => {
    try {
      const forecast = await fetchWeatherForecast({ cityName: location?.name, days: "7",});
      setWeather(forecast);
      setLoading(false);
      storeData("city", location?.name);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const getWeatherData = async () => {
      let myCity = await getData("city");
      let cityName = myCity || "Guntur";
      const data = await fetchWeatherForecast({ cityName, days: "7" });
      setWeather(data);
      storeData("city", cityName);
      setLoading(false);
    };

    if (loc) {
      handleWeather(loc);  // Handle the case when loc is provided (e.g., from SearchScreen).
    } else {
      getWeatherData();   // Handle the initial load with a default location (e.g., "Guntur").
    }
  }, [loc]);


  const { location, current } = weather;

  return (
    <View className="relative flex-1 ">
      <StatusBar style="light" />
      <Image blurRadius={70} source={require("../assets/images/bg.png")} className='absolute w-full h-full' style={{resizeMode:'cover'}}/>
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <ActivityIndicator size="large" color="#0bb3b2" />
        </View>
      ) : (
        <View className="flex-1 mx-2 mt-10 justify-between">
          {/* Search Section */}
          <TouchableOpacity onPress={() => navigation.navigate('search')} style={{ backgroundColor: theme.bgWhite(0.3) }} className="rounded-full p-3 ml-auto mr-0">
            <MagnifyingGlassIcon size={30} strokeWidth={2} color={"white"} />
          </TouchableOpacity>
            <View className="flex-1 flex-col justify-around mb-2 ">
              <View className="max-h-fit justify-between gap-y-7 ">
                {/* Location */}
                <View className='p-2 mt-2'>
                  <Text className="text-white text-center text-2xl font-bold">{location?.name } ,
                    <Text className="text-xl font-semibold text-gray-100"> {location?.country}</Text>
                  </Text>
                </View>
                {/* Weather Image */}
                <View className="flex-row max-h-fit justify-center items-center">
                  <Image source={weatherImages[current?.condition?.text]} className="w-52 h-52"/>
                </View>
                {/* Degree Celsius */}
                <View className="space-y-1">
                  <Text className="text-center font-semibold text-white text-6xl">{current?.temp_c}&deg;C</Text>
                  <Text className="text-center text-white text-xl font-medium tracking-widest">{current?.condition?.text}</Text>
                </View>
                {/* Other Stats */}
                <View className="flex-row justify-between p-2">
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require("../assets/icons/wind.png")} className="w-6 h-6"/>
                    <Text className="font-semibold text-white text-base">{current?.wind_kph}km</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image  source={require("../assets/icons/drop.png")}  className="w-6 h-6"/>
                    <Text className="font-semibold text-white text-base">{current?.humidity}%</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require("../assets/icons/sun.png")} className="w-6 h-6"/>
                    <Text className="font-semibold text-white text-base">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                  </View>
                </View>
              </View>
              <View className="max-h-fit space-y-4 -mt-7 ">
                <View className="flex-row items-center mx-2 space-x-2">
                  <CalendarDaysIcon size={22} color={"white"} />
                  <Text className="text-white text-base">Daily Forecast</Text>
                </View>
                <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 15 }} showsHorizontalScrollIndicator={false}>
                  {weather?.forecast?.forecastday?.map((item, index) => {
                    let date = new Date(item.date);
                    let options = { weekday: "long" };
                    let dayName = date.toLocaleDateString("en-US", options).split(",")[0];
                    return (
                      <View key={index} className="flex justify-center items-center w-24 rounded-3xl py-3 space-x-1 mr-4" style={{ backgroundColor: theme.bgWhite(0.15) }}>
                        <Image source={weatherImages[item?.day?.condition?.text]} className="h-11 w-11"/>
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&deg;</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
        </View>
      )}
    </View>
  );
}
