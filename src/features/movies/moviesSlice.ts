import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MoviesState {
  favorites: Movie[];
}

const initialState: MoviesState = {
  favorites: [],
};
const saveFavorites = async (favorites: Movie[]) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites', error);
  }
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Movie>) => {
      const exists = state.favorites.find(m => m.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
        saveFavorites(state.favorites);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(m => m.id !== action.payload);
      saveFavorites(state.favorites);
    },
    setFavorites: (state, action: PayloadAction<Movie[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = moviesSlice.actions;
export default moviesSlice.reducer;
