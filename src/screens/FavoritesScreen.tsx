import React, { useEffect } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setFavorites } from '../features/movies/moviesSlice';
import { RootState } from '../store/store';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';

export default function FavoritesScreen() {
  const favorites = useSelector((state: RootState) => state.movies.favorites);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadFavorites = async () => {
      const data = await AsyncStorage.getItem('favorites');
      if (data) {
        dispatch(setFavorites(JSON.parse(data)));
      }
    };
    loadFavorites();
  }, []);

  if (!favorites.length)
    return (
      <View style={styles.center}>
        <Text>No favorite movies yet.</Text>
      </View>
    );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
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
  card: { flex: 1, margin: 6, alignItems: 'center' },
  poster: { width: '100%', height: 250, borderRadius: 10 },
  title: { marginTop: 5, fontWeight: '600', fontSize: 14, color: '#222' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
