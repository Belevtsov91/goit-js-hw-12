






import { fetchImages } from './js/pixabay-api';
import { renderImages, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

const hideElement = (el) => el.classList.add('hidden');
const showElement = (el) => el.classList.remove('hidden');

const handleSearch = async (event) => {
  event.preventDefault();
  query = form.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query!' });
    return;
  }

  clearGallery();
  page = 1;
  hideElement(loadMoreBtn);

  try {
    loader.style.display = 'block';
    const data = await fetchImages(query, page, perPage);
    loader.style.display = 'none';

    if (data.hits.length === 0) {
      iziToast.info({ title: 'Info', message: 'No images found. Try another query.' });
      return;
    }

    renderImages(data.hits);
    totalHits = data.totalHits;
    if (page * perPage < totalHits) {
      showElement(loadMoreBtn);
    } else {
      iziToast.info({ title: 'Info', message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({ title: 'Error', message: error.message });
  }
};

const handleLoadMore = async () => {
  page += 1;
  try {
    loader.style.display = 'block';
    const data = await fetchImages(query, page, perPage);
    loader.style.display = 'none';

    renderImages(data.hits);

    if (page * perPage >= totalHits) {
      hideElement(loadMoreBtn);
      iziToast.info({ title: 'Info', message: "We're sorry, but you've reached the end of search results." });
    }

    // Smooth scroll
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({ title: 'Error', message: error.message });
  }
};

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);
