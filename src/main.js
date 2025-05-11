import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const searchInput = document.querySelector('.form-input');
const loadMoreBtn = document.querySelector('.load-more-btn');

let query = '';
let currentPage = 1;
let totalPages = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = searchInput.value.trim();

  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  showLoader();
  await fetchAndRenderImages();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  await fetchAndRenderImages();
});

async function fetchAndRenderImages() {
  try {
    showLoader();
    const data = await getImagesByQuery(query, currentPage);
    const { hits, totalHits } = data;

    if (hits.length === 0 && currentPage === 1) {
      iziToast.error({ message: 'Sorry, no images found.' });
      hideLoadMoreButton();
      return;
    }

    createGallery(hits);
    totalPages = Math.ceil(totalHits / 15);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    if (currentPage > 1) {
      scrollByThreeCards();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong. Try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function scrollByThreeCards() {
  const { height: cardHeight } = document
    .querySelector('.gallery-item-wrapper')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}
