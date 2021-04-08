import MoviePagination from '../pagination/moviePagination';
import refs from '../refs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import enableModalMovieCardBtns from '../localStoragemovies/modalBtns';

const { prevRef, nextRef, searchInpRef, pageNumsRef, moviesListRef, queueBtnRef, watchedBtnRef } = refs;

const movie = new MoviePagination('.movies-list');
movie.init();

searchInpRef.addEventListener('keydown', onPressEnterSearch);
prevRef.addEventListener('click', movie.goToPrevPage);
nextRef.addEventListener('click', movie.goToNextPage);
pageNumsRef.addEventListener('click', movie.goToPage);
moviesListRef.addEventListener('click', openModal);

function onPressEnterSearch(event) {
  //do search on Enter press
  if (event.code === 'Enter') {
    event.preventDefault();
    requestMovie();
  }
}

function requestMovie() {
  //searching logic movies by query or popular
  if (!searchInpRef.value) {
    movie.pageReset();
    movie.searchKey = '';
    movie.byQueryFlag = false;
    return movie.init();
  }
  if (searchInpRef.value) {
    movie.pageReset();
    movie.searchKey = searchInpRef.value;
    movie.byQueryFlag = true;
    return movie.init();
  }
}

function openModal(event) {
  //open modal card of film
  event.preventDefault();
  const { target } = event;
  const movieTitle = target.alt;
  if (!movieTitle) {
    return;
  }
  const markup = movie.renderMovieCard(movieTitle);

  const modal = basicLightbox.create(markup);
  modal.show();
  const closeBtn = document.querySelector('.modal-close-btn');
  document.body.style.height = "100%";

  enableModalMovieCardBtns(movie, movieTitle);

  window.addEventListener('keydown', closeModalHandler);
  window.addEventListener('click', closeModalHandler);
  closeBtn.addEventListener('click', () => modal.close());
  document.body.style.overflow = "hidden";

  const autoVal = document.querySelector('.basicLightbox');

  function closeModalHandler(event) {

    if (event.type === 'click') {
      autoVal.addEventListener('click', closeModal);
      window.removeEventListener('click', closeModalHandler);
    }

    if (event.code === 'Escape') {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      modal.close();
     // addToQueueBtnRef.removeEventListener('keydown', addToQueueOnClick);
     // addToWatchedBtnRef.removeEventListener('keydown', addToWatchedOnClick);
      window.removeEventListener('keydown', closeModalHandler);
    }
  }
}

 function closeModal() {
   document.body.style.overflow = "auto";
   document.body.style.height = "auto";
  }
