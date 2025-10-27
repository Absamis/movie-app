import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getPopularMovies } from '../api/tmdb';
import { Movie } from '../features/movies/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from './ScreenWrapper';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>Something went wrong. Please try again.</Text>
      </View>
    );

  return (
    <ScreenWrapper>
        <View style={styles.container}>
        <FlatList
            data={movies}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Details', { id: item.id })}
            >
                <Image
                source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
                style={styles.poster}
                />
                <Text style={styles.title} numberOfLines={1}>
                {item.title}
                </Text>
            </TouchableOpacity>
            )}
        />
        </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flex: 1, margin: 6, alignItems: 'center' },
  poster: { width: '100%', height: 250, borderRadius: 10 },
  title: { marginTop: 5, fontWeight: '600', fontSize: 14, color: '#222' },
});
