import './css/styles.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const API_KEY = '31276153-bbebebed3806edcc66ad5b8b4';
let page = 1;

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  const searchQuery = refs.input.value;

  //   const options = {
  //     headers: {
  //       Autorization: '3127615-bbebebed3806edcc66ad5b8b4',
  //     },
  //   };

  const url = `https://pixabay.com/api/?key=${API_KEY}&q="${searchQuery}"&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const markUp = data.hits
        .map(
          item =>
            `<div class="photo-card">
            <img src="${item.webformatURL}" alt="" loading="lazy" width=100% />
            <div class="info">
                <p class="info-item">
                <b>Likes ${item.likes}</b>
                </p>
                <p class="info-item">
                <b>Views ${item.views}</b>
                </p>
                <p class="info-item">
                <b>Comments ${item.comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads ${item.downloads}</b>
                </p>
            </div>
            </div>`
        )
        .join('');
      if (markUp == '') {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      refs.gallery.insertAdjacentHTML('beforeend', markUp);
    });
}

function nextPage() {
  page += 1;
}
