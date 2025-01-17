import { fetchImages } from './pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let currentPage = 1;
const perPage = 100;
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

function renderGallery(images) {
  const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <a href="${largeImageURL}" class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="card-info">
        <p><b>Likes:</b> ${likes}</p>
        <p><b>Views:</b> ${views}</p>
        <p><b>Comments:</b> ${comments}</p>
        <p><b>Downloads:</b> ${downloads}</p>
      </div>
    </a>
  `).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function searchImages() {
  try {
    loader.classList.remove('hidden');
    const data = await fetchImages(query, currentPage, perPage);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, no images match your search. Please try again!',
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    renderGallery(data.hits);
    totalHits = data.totalHits;

    if (currentPage * perPage < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
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
    loader.classList.add('hidden');
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
