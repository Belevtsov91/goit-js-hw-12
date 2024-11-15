


import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '47083807-1148cb0c408c5877c55e45261';

const fetchImages = async (query, page = 1, perPage = 15) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch images');
  }
};

export { fetchImages };
