import api from '../api/apiFetching';
import moviesListTemplate from '../../templates/galleryCardTemplate.hbs';
import pageNumetationTemplate from '../../templates/page-numeration.hbs';
import { generatePosterPath } from '../movieHelpers/generatePoster';
import switchErrorHide from '../movieHelpers/switchError';
import getFromStorage from '../getFromStorage/getFromStorage';

class MoviePagination {
  #movies = [];
  searchKey = '';
  byQueryFlag = false;
  forLibraryFlag = false;
  movieType = '';
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.#movies = [];
    this.searchKey = '';
    this.byQueryFlag = false;
    this.movieType = '';
    this.forLibraryFlag = false;
    this.currentPage = 1;
    this.totalPages = 0;
    this.pageNumsRef = document.querySelector('.page-numbers');
    this.totalGenres = [];
    this.goToPrevPage = this.goToPrevPage.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.init = this.init.bind(this);
    this.bind = this.pageReset(this);
  }

  get movieType() {
    return this.movieType;
  }
  set movieType(movieType) {
    this.movieType = movieType;
  }

  get forLibraryFlag() {
    return this.forLibraryFlag;
  }
  set forLibraryFlag(forLibraryFlag) {
    this.forLibraryFlag = forLibraryFlag;
  }

  get byQueryFlag() {
    return this.byQueryFlag;
  }

  set byQueryFlag(byQueryFlag) {
    this.byQueryFlag = byQueryFlag;
  }

  get searchKey() {
    return this.searchKey;
  }

  set searchKey(searchKey) {
    if (!searchKey) {
      console.error('No query for search!');
    }
    this.searchKey = searchKey;
  }

  get movies() {
    return this.#movies;
  }

  set movies(movieList) {
    if (!movieList) {
      console.error('list non exist');
    }
    this.#movies = movieList;
    this.render();
  }

  // run this first in outer code - gets list of genres from the server and shows the first page of trending movies
  init() {
    this.getAllGenres();
    this.loadPage();
  }

  // shows the page of movies
  loadPage() {
    return this.fetchMovies().then(data => {
      this.prepareMovies();
      this.render();
    });
  }

  //fetch trending or searching movies by byQueryFlag value
  fetchMovies() {
    if(this.forLibraryFlag){
      return this.fetchMoviesFromLibrary();
    }
    if (!this.byQueryFlag && !this.forLibraryFlag) {
      return this.fetchMoviesPopular();
    }
    if (this.byQueryFlag && !this.forLibraryFlag) {
      return this.fetchMoviesByQuery();
    }
  }

  // fetches current page of searching movies
  fetchMoviesByQuery() {
    return api.fetchFilmByQuery(this.currentPage, this.searchKey).then(data => {
      const { results, total_pages } = data;
      switchErrorHide(results);
      this.totalPages = total_pages;
      this.#movies = results;
      return results;
    });
  }

  // fetches current page of trending movies
  fetchMoviesPopular() {
    return api.fetchPopularFilms(this.currentPage).then(data => {
      const { results, total_pages } = data;
      switchErrorHide(results);
      this.totalPages = total_pages;
      this.#movies = results;
      return results;
    });
  }

  // fetches movies from library depending on movieType
  fetchMoviesFromLibrary() {
      // const movieId = getFromStorage(this.movieType);  //uncomment line to use localStorage arrays of ids
      const moviesId = [550, 551, 552, 553, 554, 555]; //testing ids array  //comment or delete line to use localStorage arrays of ids
      let promisesArray = [];
      moviesId.forEach(movieId => promisesArray.push(api.fetchFilmById(movieId)) );
      return Promise.all(promisesArray).then(data => {
        this.movies = data;
        return this.movies;
      }); 
    }
  

  // renders markup
  render() {
    this.element.innerHTML = moviesListTemplate(this.movies);
    this.setPageNumbers();
  }

  // clears markup
  clear() {
    this.element.innerHTML = '';
  }

  //resets page
  pageReset() {
    this.currentPage = 1;
    this.#movies = [];
    this.clear();
  }

  // prepares info for movie cards
  prepareMovies() {
    this.movies.forEach(movie => {
      this.findMovieGenres(movie);
      this.getReleaseYear(movie);
      this.getPosterImg(movie);
      this.validateAvgVote(movie);
      this.validateMovieDescription(movie);
    });
  }

  // gets an array of all genres from the server
  getAllGenres() {
    api.fetchGanres().then(result => {
      const { genres } = result;
      this.totalGenres = [...genres];
    });
  }

  // translates array of genres of a movie to a string, limits count of genres to 3
  findMovieGenres(movie) {
    if (movie.genre_ids.length === 0) {
      movie.genre_ids = 'Genres unknown';
      return;
    }

    const maxGenresViewed = 3;
    if (movie.genre_ids.length > maxGenresViewed) {
      movie.genre_ids = movie.genre_ids.slice(0, 3);
      this.convertGenreIds(movie);
      movie.genre_ids.splice(maxGenresViewed - 1, 1, 'Other');
      movie.genre_ids = this.convertMovieGenresToString(movie.genre_ids);
      return;
    }
    movie.genre_ids = movie.genre_ids.slice(0, 3);
    this.convertGenreIds(movie);
    movie.genre_ids = this.convertMovieGenresToString(movie.genre_ids);
  }

  // converts movie's genres from ids to names ([28, 12] -> [Action, Adventure])
  convertGenreIds(movie) {
    for (let i = 0; i < movie.genre_ids.length; i++) {
      const genre = this.totalGenres.find(
        genreItem => genreItem.id === movie.genre_ids[i],
      );
      movie.genre_ids[i] = genre.name;
    }
  }

  // creates a string of movie's genres
  convertMovieGenresToString(genres) {
    genres = genres.join(', ');
    return genres;
  }

  // coverts release date to a year (2017-03-21 -> 2017)
  getReleaseYear(movie) {
    if (!movie.release_date) {
      movie.release_date = 'unknown';
      return;
    }

    const date = new Date(movie.release_date);
    const year = date.getFullYear();
    movie.release_date = year;
  }

  // if no average vote available, sets it to '-'
  validateAvgVote(movie) {
    movie.vote_average = movie.vote_average || '-';
  }

  // if no description available available, sets it to 'No description available'
  validateMovieDescription(movie) {
    movie.overview = movie.overview || 'No description available';
  }

  // generates path of a movie's poster image
  getPosterImg(movie) {
    movie.backdrop_path = generatePosterPath(movie.backdrop_path,movie.poster_path);
  }

  goToPrevPage() {
    if (this.currentPage === 1) {
      return;
    }

    this.currentPage -= 1;
    this.fetchMovies().then(results => {
      this.#movies = results;
      this.prepareMovies();
      this.render();
    });
  }

  goToNextPage() {
    if (this.currentPage === this.totalPages) {
      return;
    }

    this.currentPage += 1;
    this.fetchMovies().then(results => {
      this.#movies = results;
      this.prepareMovies();
      this.render();
    });
  }

  // shows page selected by page number
  goToPage(event) {
    const clickedElem = event.target;
    if (clickedElem.matches('button')) {
      const page = Number(clickedElem.innerHTML);

      if (this.currentPage === page) return;
      this.currentPage = page;
      this.fetchMovies().then(results => {
        this.#movies = results;
        this.prepareMovies();
        this.render();
      });
    }
  }

  // renders current page numbers' selection (1 ... 4 5 6 7 8 ... 89)
  setPageNumbers() {
    this.pageNumsRef.innerHTML = '';

    const firstPage = 1;
    const lastPage = this.totalPages;
    const currentPage = this.currentPage;
    const pagesTotal = this.totalPages;

    if (this.totalPages <= 7) {
      for (let i = 1; i < this.totalPages + 1; i++) {
        this.pageNumsRef.append(this.createPageButton(i));
      }
      return;
    }

    this.pageNumsRef.innerHTML = pageNumetationTemplate({
      firstPage,
      lastPage,
    });

    if (currentPage === firstPage) {
      this.pageNumsRef
        .querySelector('.first-page')
        .classList.add('active-page');
    }

    if (currentPage === pagesTotal) {
      this.pageNumsRef.querySelector('.last-page').classList.add('active-page');
    }

    this.middlePageNumsRef = document.querySelector('.middle-page-numbers');

    if (currentPage <= 4) {
      this.pageNumsRef.querySelector('.pre-separator').classList.add('hidden');
      for (let page = 2; page < 7; page++) {
        this.middlePageNumsRef.append(this.createPageButton(page));
      }
    }

    if (currentPage > pagesTotal - 4) {
      this.pageNumsRef.querySelector('.post-separator').classList.add('hidden');
      for (let page = pagesTotal - 5; page < pagesTotal; page++) {
        this.middlePageNumsRef.append(this.createPageButton(page));
      }
    }

    if (this.currentPage > 4 && this.currentPage <= this.totalPages - 4) {
      for (
        let page = this.currentPage - 2;
        page < this.currentPage + 3;
        page++
      ) {
        this.middlePageNumsRef.append(this.createPageButton(page));
      }
    }
  }

  // creates a page number's button and sets active page number
  createPageButton(pageNum) {
    let pageBtn = document.createElement('button');
    pageBtn.classList.add('pagination-controls', 'pagination-elem');
    if (this.currentPage === pageNum) pageBtn.classList.add('active-page');
    pageBtn.innerText = pageNum;
    return pageBtn;
  }

  //function that set helpers data for fetching movies from library by ids array from watched list
  libraryWatchedHelpersData(){
    this.movieType = 'watched';
    this.forLibraryFlag = true;
  }

  //function that set helpers data for fetching movies from library by ids array from queue list
  libraryQueueHelpersData(){
    this.movieType = 'queue';
    this.forLibraryFlag = true;
  }

  //function for clearing helpers data for fetching movies from library by id
  resetLibraryHelpersData(){
    this.movieType = '';
    this.forLibraryFlag = false;
  }
}

export default MoviePagination;
