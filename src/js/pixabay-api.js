import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '24246852-77467cbf1dd5333394cba3aaf';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: PER_PAGE,
    },
  });
  return response.data;
}
