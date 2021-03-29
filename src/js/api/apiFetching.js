import variables from './apiVariables';
import galleryTemplate from '../../templates/galleryCardTemplate.hbs';
// import galleryTemplate from '../../templates/galleryCardTemplate';
const galleryRef = document.querySelector('gallery') 
console.log(galleryRef);

const { BASE_URL, API_KEY } = variables;
const api = {
  fetchPopularFilms(page = '1') {
    console.dir(url);
    const url = `${BASE_URL}/3/movie/popular?api_key=${API_KEY}&page=${page}`;
    return fetch(url)
      .then(response => {
        console.log(response);
        if (response.ok) return response.json();
      })
      .catch(() => console.error('no popular'));
  },
  fetchFilmByQuery(page = '', searchQuery = '') {
    const url = `${BASE_URL}/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`;
    return fetch(url)
      .then(response => {
        if (response.ok) return response.json();
      })
      .catch(() => console.error('film is nod find!'));
  },
};
//console.dir(fetchPopularFilms)

// function renderCard(fetchPopularFilms) {
//   const markup = galleryTemplate (fetchPopularFilms);
//   blockForMarkupRef.insertAdjacentHTML('beforeend', markup);
// }

export default api;
