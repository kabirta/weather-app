import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Kolkata');
  const [inputCity, setInputCity] = useState('');

  const API_KEY = your_api_key;

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    Keyboard.dismiss();
  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.message || 'Failed to fetch weather');
        setWeatherData(null);
      }
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
    }
  };

  // Format time to 12-hour format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours} ${ampm}`;
  };

  // Mock hourly data - in a real app, you'd get this from an API
  const hourlyData = [
    { time: '5 PM', temp: 34 },
    { time: '6 PM', temp: 33 },
    { time: '7 PM', temp: 31 },
    { time: '8 PM', temp: 29 },
    { time: '9 PM', temp: 28 },
    { time: '10 PM', temp: 27 },
  ];

  if (loading && !weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city"
          placeholderTextColor="#888"
          value={inputCity}
          onChangeText={setInputCity}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {weatherData && (
        <>
          {/* Location Header */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{weatherData.name}</Text>
            <Text style={styles.regionText}>{weatherData.sys.country}, West Bengal</Text>
          </View>

          {/* Main Weather Info */}
          <View style={styles.mainWeatherContainer}>
            <Text style={styles.temperatureText}>
              {Math.round(weatherData.main.temp)}°
            </Text>
            <Text style={styles.weatherDescription}>
              {weatherData.weather[0].description}
            </Text>
            <View style={styles.tempRangeContainer}>
              <Text style={styles.tempRangeText}>
                {Math.round(weatherData.main.temp_min)} ~ {Math.round(weatherData.main.temp_max)}°
              </Text>
              <Text style={styles.realFeelText}>
                RealFeel {Math.round(weatherData.main.feels_like)}°
              </Text>
            </View>
          </View>

          {/* Current Conditions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Current conditions</Text>
            <View style={styles.conditionsGrid}>
              <View style={styles.conditionItem}>
                <Text style={styles.conditionLabel}>Humidity</Text>
                <Text style={styles.conditionValue}>{weatherData.main.humidity}%</Text>
              </View>
              <View style={styles.conditionItem}>
                <Text style={styles.conditionLabel}>Precipitation</Text>
                <Text style={styles.conditionValue}>0 mm</Text>
              </View>
              <View style={styles.conditionItem}>
                <Text style={styles.conditionLabel}>Wind</Text>
                <Text style={styles.conditionValue}>
                  {Math.round(weatherData.wind.speed * 3.6)} km/h
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <Text style={styles.conditionLabel}>AQI</Text>
                <Text style={styles.conditionValue}>Poor (96)</Text>
              </View>
              <View style={styles.conditionItem}>
                <Text style={styles.conditionLabel}>UV index</Text>
                <Text style={styles.conditionValue}>Moderate</Text>
              </View>
              <View style={styles.conditionItem}>
                <Text style={styles.conditionLabel}>Pressure</Text>
                <Text style={styles.conditionValue}>
                  {weatherData.main.pressure} mb
                </Text>
              </View>
            </View>
          </View>

          {/* Weather Today */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Weather today</Text>
            <Text style={styles.todayWeatherText}>
              {weatherData.weather[0].description}
            </Text>
          </View>

          {/* Hourly Forecast */}
          <View style={styles.sectionContainer}>
            <View style={styles.hourlyHeader}>
              <Text style={styles.sectionTitle}>Hourly forecast</Text>
              <Text style={styles.updatedText}>Updated now</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {hourlyData.map((hour, index) => (
                <View key={index} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{hour.time}</Text>
                  <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  regionText: {
    fontSize: 18,
    color: '#666',
  },
  mainWeatherContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
  },
  temperatureText: {
    fontSize: 84,
    fontWeight: '300',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 22,
    color: '#666',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  tempRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  tempRangeText: {
    fontSize: 18,
    color: '#333',
    marginRight: 20,
  },
  realFeelText: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionItem: {
    width: '48%',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
  },
  conditionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  conditionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  todayWeatherText: {
    fontSize: 18,
    color: '#333',
  },
  hourlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  updatedText: {
    fontSize: 14,
    color: '#888',
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 25,
    padding: 10,
    minWidth: 60,
  },
  hourlyTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  hourlyTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default WeatherApp;
