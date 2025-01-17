window.global = window;

import { fetchImages } from './pixabay-api.js';
import { createGalleryMarkup, renderGallery } from './render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

if (!loader) {
  console.error('Loader element not found!');
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',     
  captionDelay: 250,        
  close: true,               
  nav: true,          
  scrollZoom: false,        
  overlayOpacity: 0.8,       
  animationSpeed: 300,      
  enableKeyboard: true,     
  doubleTapZoom: 2,        
});


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = form.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  loader.classList.remove('hidden');
  gallery.innerHTML = '';

  try {
    const data = await fetchImages(query);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    const markup = createGalleryMarkup(data.hits);
    renderGallery(gallery, markup);

    iziToast.success({
      title: 'Success',
      message: `Found ${data.hits.length} images!`,
      position: 'topRight',
    });

    lightbox.refresh();  

    form.reset();

  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    loader.classList.add('hidden');
  }
});
