import Notiflix from 'notiflix';
import ImgApiService from './img-API';
import debounce from 'lodash.debounce';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const DEBOUNCE_DELAY = 1000;

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.btnLoadMore');

const api = new ImgApiService();

form.addEventListener('submit', debounce(onFormChange, DEBOUNCE_DELAY));
btnLoadMore.addEventListener('click', fetchImgs);

function onFormChange(e) {
    e.preventDefault();

    const currentSearch = e.currentTarget.elements.searchQuery.value.trim();

    

}


