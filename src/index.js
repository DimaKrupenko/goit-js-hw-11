import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const DEBOUNCE_DELAY = 300;
const API_KEY = '31276153-bbebebed3806edcc66ad5b8b4';
let page = 1;
let per_page = 40;
let markUp;
let searchQuery;
let totalHits;
let currentHits;

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.button.addEventListener('click', onLoad);

refs.button.disabled = true;

function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  searchQuery = refs.input.value;

  const url = `https://pixabay.com/api/?key=${API_KEY}&q="${searchQuery}"&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  // fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     refs.gallery.innerHTML = '';

  //     markUp = data.hits
  //       .map(
  //         item =>
  //           `<div class="photo-card">
  //           <img src="${item.webformatURL}" alt="" loading="lazy" width=100% />
  //           <div class="info">
  //               <p class="info-item">
  //               <b>Likes ${item.likes}</b>
  //               </p>
  //               <p class="info-item">
  //               <b>Views ${item.views}</b>
  //               </p>
  //               <p class="info-item">
  //               <b>Comments ${item.comments}</b>
  //               </p>
  //               <p class="info-item">
  //               <b>Downloads ${item.downloads}</b>
  //               </p>
  //           </div>
  //           </div>`
  //       )
  //       .join('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(url);
      refs.gallery.innerHTML = '';

      let markUp = response.data.hits
        .map(
          item =>
            `<div class="photo-card">
            <a class="gallery__link" href=${item.webformatURL} onclick="return false;">
            <img src="${item.largeImageURL}" alt="" loading="lazy" width=100% />
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
      refs.gallery.innerHTML = markUp;
      refs.button.disabled = false;
      totalHits = response.data.totalHits;

      if (markUp == '') {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      openModal();
    } catch (error) {
      console.log(error);
    }
  };

  fetchUsers();
  //   .then(data => {
  //   refs.gallery.innerHTML = '';

  //   markUp = data.hits
  //     .map(
  //       item =>
  //         `<div class="photo-card">
  //           <a class="gallery__link" href=${item.webformatURL} onclick="return false;">
  //           <img src="${item.largeImageURL}" alt="" loading="lazy" width=100% />
  //           <div class="info">
  //               <p class="info-item">
  //               <b>Likes ${item.likes}</b>
  //               </p>
  //               <p class="info-item">
  //               <b>Views ${item.views}</b>
  //               </p>
  //               <p class="info-item">
  //               <b>Comments ${item.comments}</b>
  //               </p>
  //               <p class="info-item">
  //               <b>Downloads ${item.downloads}</b>
  //               </p>
  //           </div>
  //           </div>`
  //     )
  //     .join('');
  //   refs.gallery.innerHTML = markUp;
  //   refs.button.disabled = false;
  //   totalHits = data.totalHits;
  //   openModal();
  //   notificationOpens();
  // });

  // });
}

window.addEventListener('scroll', () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

  if (scrollTop === scrollHeight - clientHeight) {
    console.log('???????????????? ????????????????');

    console.log(page);
    onLoad();
  }
});

function onLoad() {
  searchQuery = refs.input.value;
  page += 1;

  const url = `https://pixabay.com/api/?key=${API_KEY}&q="${searchQuery}"&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      markUp = data.hits
        .map(
          item =>
            `<div class="photo-card">
            <a class="gallery__link" href=${item.webformatURL} onclick="return false;">
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
      refs.gallery.insertAdjacentHTML('beforeend', markUp);
      openModal();
      totalHits = data.totalHits;
      currentHits = page * per_page;
      endSearch();
    });
}

function openModal() {
  // evt.preventDefault();
  const gallery = new SimpleLightbox('.gallery a');
}

function endSearch() {
  if (totalHits < currentHits) {
    refs.button.disabled = true;
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
