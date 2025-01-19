import { fetchImages } from './js/pixabay-api.js';
import { createGalleryMarkup, renderGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.getElementById('loader');

let query = '';
let currentPage = 1;
const perPage = 15;
let totalHits = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

async function searchImages() {
  try {
    showLoader();
    hideLoadMoreButton();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = await fetchImages(query, currentPage, perPage);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, no images match your search. Please try again!',
        position: 'topRight',
      });
      return;
    }

    const markup = createGalleryMarkup(data.hits);
    renderGallery(gallery, markup);
    lightbox.refresh();
    totalHits = data.totalHits;

    if (currentPage * perPage < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load images. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  query = form.elements.searchQuery.value.trim();

  if (query === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  gallery.innerHTML = '';
  currentPage = 1;
  hideLoadMoreButton();

  searchImages();
});

loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  searchImages();

  setTimeout(() => {
    const { height: cardHeight } = document.querySelector('.gallery a').getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 500);
});



