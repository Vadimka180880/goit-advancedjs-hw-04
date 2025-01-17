export async function fetchImages(query, page = 1, perPage = 20) {
    const API_KEY = '48253938-b7cad64a48e9cab445357bf5d';
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    });
  
    try {
      const response = await fetch(`${BASE_URL}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  