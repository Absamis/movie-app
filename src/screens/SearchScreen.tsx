import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { searchMovies } from '../api/tmdb';
import { Movie } from '../features/movies/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from './ScreenWrapper';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Debounce handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        search();
      } else {
        setResults([]);
      }
    }, 600); // wait 600ms after typing
    return () => clearTimeout(timer);
  }, [query]);

  const search = useCallback(async () => {
    try {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <ScreenWrapper>
        <View style={styles.container}>
        <TextInput
            placeholder="Search movies..."
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            placeholderTextColor="#999"
        />

        {loading ? (
            <View style={styles.center}>
            <ActivityIndicator size="large" color="#E50914" />
            </View>
        ) : (
            <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
                query.length > 1 ? (
                <View style={styles.center}>
                    <Text>No results found.</Text>
                </View>
                ) : null
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Details', { id: item.id })}
                >
                <Image
                    source={{
                    uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : 'https://via.placeholder.com/100x150',
                    }}
                    style={styles.poster}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.desc} numberOfLines={2}>
                    {item.overview}
                    </Text>
                </View>
                </TouchableOpacity>
            )}
            />
        )}
        </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: '#000',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 6,
  },
  poster: { width: 80, height: 120, borderRadius: 8 },
  title: { fontWeight: '600', fontSize: 16, color: '#111' },
  desc: { fontSize: 13, color: '#666', marginTop: 4 },
});
