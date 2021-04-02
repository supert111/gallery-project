import refs from '../refs';

const { moviesListRef, loaderRef } = refs;
console.dir(moviesListRef);

function workLoader() {
   
if(moviesListRef.innerHTML === '') {
    setTimeout(() => {
    loaderRef.classList.remove('visually-hidden');
    console.log('He')
    return;
}, 10000);

}
  else {
    setTimeout(() => {
        //loaderRef.classList.add('visually-hidden');
        console.log('Hehe');
        console.dir(moviesListRef.innerHTML)
      }, 3000);
    //loaderRef.classList.remove('visually-hidden');
  }    
}
export default workLoader;