import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { getMovieDetails, getMovieVideos } from '../api/tmdb';
import { Movie } from '../features/movies/types';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../features/movies/moviesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from './ScreenWrapper';

export default function DetailsScreen() {
  const route = useRoute<any>();
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const favorites = useSelector((state: RootState) => state.movies.favorites);
  const dispatch = useDispatch();

  const isFavorite = favorites.some((m) => m.id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);

        const videos = await getMovieVideos(id);
        const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = () => {
    if (!movie) return;
    if (isFavorite) dispatch(removeFavorite(movie.id));
    else dispatch(addFavorite(movie));
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );

  if (!movie)
    return (
      <View style={styles.center}>
        <Text>Movie not found.</Text>
      </View>
    );

  return (
    <ScreenWrapper>
        <ScrollView style={styles.container}>
        <Image
            source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.poster}
        />
        <View style={styles.content}>
            <View style={styles.headerRow}>
            <Text style={styles.title}>{movie.title}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
                <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? '#E50914' : '#555'}
                />
            </TouchableOpacity>
            </View>

            <Text style={styles.subText}>
                <Icon name="star" color='#eba809ff' /> {movie.vote_average.toFixed(1)}   | {movie.release_date}
            </Text>

            <Text style={styles.overview}>{movie.overview}</Text>

            {trailerKey && (
            <TouchableOpacity
                style={styles.trailerButton}
                onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)}
            >
                <Icon name="play-circle-outline" size={22} color="#fff" />
                <Text style={styles.trailerText}> Watch Trailer</Text>
            </TouchableOpacity>
            )}
        </View>
        </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: '100%', height: 400 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', flex: 1 },
  subText: { color: '#666', marginTop: 4, fontSize: 14 },
  overview: { marginTop: 12, fontSize: 15, lineHeight: 22, color: '#333' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trailerButton: {
    flexDirection: 'row',
    backgroundColor: '#E50914',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  trailerText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
