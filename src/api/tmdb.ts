import axios from 'axios';

const API_KEY = 'd51c4cfb35f93baf91a0efbf0ec2bffc'; // replace this
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getPopularMovies = async (page = 1) => {
  const res = await tmdb.get('/movie/popular', { params: { page } });
  return res.data.results;
};

export const searchMovies = async (query: string, page = 1) => {
  const res = await tmdb.get('/search/movie', { params: { query, page } });
  return res.data.results;
};

export const getMovieDetails = async (id: number) => {
  const res = await tmdb.get(`/movie/${id}`);
  return res.data;
};

export const getMovieVideos = async (id: number) => {
  const res = await tmdb.get(`/movie/${id}/videos`);
  return res.data.results;
};
