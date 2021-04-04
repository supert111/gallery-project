//import cardTemplate from '../../templates/modal.hbs';
import refs from '../refs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const { moviesListRef } = refs;

moviesListRef.addEventListener('click', event => {
    console.dir(event);
    const { target } = event;
    console.dir(target);
           if(target.className !== 'poster-img') {
               return;
           }
        basicLightbox.create(`

        //width="800" height="600"
        document.querySelector('.modal');
        //moviesListRef.innerHTML = this.temp;
      
	    `).show()

    })