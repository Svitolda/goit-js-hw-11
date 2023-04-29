import Notiflix from 'notiflix';
import ImgApiService from './img-API';
import debounce from 'lodash.debounce';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const DEBOUNCE_DELAY = 1000;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.btnLoadMore');

const api = new ImgApiService();

form.addEventListener('submit', debounce(onFormChange, DEBOUNCE_DELAY));
btnLoadMore.addEventListener('click', fetchImgs);

function onFormChange(e) {
    e.preventDefault();

    const currentSearch = e.target.elements.searchQuery.value.trim();

    // console.log(e.target);
    if (currentSearch !== api.query) {
        gallery.innerHTML = '';
        api.resetPage();
    }

    api.query = currentSearch;
    fetchImgs();

}

function fetchImgs(){
    api.fetchImg().then(data => {
        if (data.hits.length === 0 && api.page !== 1) {
            hideLoadMoreBtn();
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
        return;
        } 
        if (data.hits.length === 0) {
            if(loadmoreBtn.classList.has('is-hidden')){
                hideLoadMoreBtn();
            }
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
        }
        showLoadMoreBtn();
        if (data.hits.length === 0 && api.page !== 1) {
            Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');

        hideLoadMoreBtn();
            return;
        }
        if (40 * api.page > data.totalHits && api.page !== 1) {
            Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');

        hideLoadMoreBtn();
        return;
        }
        if (api.page === 1) {
            Notiflix.Notify.success('Hooray! We found ${data.totalHits} images.')
        }
        
        gallery.insertAdjacentHTML(
            'beforeend',
            cardsMarkup(data.hits)
          );

        const lightbox = new SimpleLightbox('.gallery a',{
            captionDelay: 250,
            captionData: 'alt',
        });

        lightbox.refresh();

        api.incrementPage();

        smoothScrool()
    })
    .catch(console.log)
}

function cardsMarkup(data){
    return data.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
    }) => {
           `<div class="photo-card">
            <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes <br> ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views <br> ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments <br> ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads <br> ${downloads}</b>
                </p>
            </div>
        </div>`
    }).join('');
}

function showLoadMoreBtn() {
    refs.loadmoreBtn.classList.remove('hide');
  }
  
function hideLoadMoreBtn() {
refs.loadmoreBtn.classList.add('hide');
}

function smoothScrool() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }