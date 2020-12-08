'use strict'

import {api_key} from "../Proyecto GIFos/api.js";

const darkMode = document.getElementById('dark-mode');

const head = document.querySelector('head');

const logo = document.querySelector('.logo');
const darkLogo ='assets/logo-mobile-modo-noct.svg';
const lightLogo ='assets/logo-mobile.svg';
const iconSearch = document.querySelector('.icon-search');
const iconSearchDark = "assets/icon-search-modo-noct.svg";
const iconSearchLight = "assets/icon-search.svg";

const burguer = document.querySelector('.burguer');
const close = document.querySelector('.close');
const burguerDark = "assets/burger.svg";   
const burguerLight = "assets/burger-modo-noct.svg";
const closeDark = "assets/close-modo-noct.svg";
const closeLight = "assets/close.svg";


const linkDark = document.createElement('link');
linkDark.href = "styles/dist/darkstyles.css";
linkDark.rel = "stylesheet";

darkMode.addEventListener('click', () =>{
    (!head.contains(linkDark))? head.appendChild(linkDark) : head.removeChild(linkDark);

    logo.src = (new RegExp(lightLogo.replace(/\+/g, '.')).test(logo.src))? darkLogo:lightLogo;
    iconSearch.src = (new RegExp(iconSearchLight.replace(/\+/g, '.')).test(iconSearch.src))? iconSearchDark:iconSearchLight;
    burguer.src = (new RegExp(burguerLight.replace(/\+/g, '.')).test(burguer.src))? burguerDark:burguerLight;
    close.src = (new RegExp(closeLight.replace(/\+/g, '.')).test(close.src))? closeDark:closeLight;
})

//header border
const header = document.querySelector('.header');
document.addEventListener('scroll', ()=>{
    if(window.scrollY > 90){
        header.style.borderBottom = '1px solid #9CAFC3'; 
        header.style.boxShadow = '0 2px 4px 1px';
    }else{
        header.style.borderBottom = 'none'; 
        header.style.boxShadow = '0 0 0 0';
    }
})

//active pages
const home = document.querySelector('.home');
const favorites = document.querySelector('.favorites');
const myGifos = document.querySelector('.myGifos');
const gifCreator = document.querySelector('.gif-creator');
const trendingGifos = document.querySelector('.real-trends')
const mygifosLi = document.querySelector('.mygifos-li');
const favLi = document.querySelector('.fav-li');
const createGif = document.getElementById('create-gif');
const inputBurguer = document.getElementById('input-burguer');

function activeClass(active,active2, inactive1,inactive2,inactive3,inactive4){
    active.style.display = 'block';
    active2.style.display = 'block';
    inactive1.style.display = 'none';
    inactive2.style.display = 'none';
    inactive3.style.display = 'none';
    inactive4.style.display = 'none';
    if(inputBurguer.checked){
        inputBurguer.checked = false;
    }
}
favLi.addEventListener('click',()=> activeClass(favorites,trendingGifos,home,myGifos,gifCreator,gifCreator));
mygifosLi.addEventListener('click',()=> activeClass(myGifos,trendingGifos,home,favorites,gifCreator,gifCreator));
logo.addEventListener('click',()=> activeClass(home,trendingGifos,favorites,myGifos,gifCreator,gifCreator));
createGif.addEventListener('click',()=> activeClass(gifCreator,gifCreator,home,favorites,myGifos,trendingGifos))


//fetch trendings
const url = `http://api.giphy.com/v1/gifs/trending?api_key=${api_key}`;
const trendingContainer = document.getElementById('trending-gif-container');
let position = 0;
let trendingList;

async function callGif() {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    trendingList = result.data;
    console.log(trendingList);
    sliceGifArray();
}
function sliceGifArray(){
    try{
        let trendingShort = trendingList.slice(position,position+3);
        console.log(trendingShort);
        trendingContainer.innerHTML= "";
        trendingShort.forEach(item => renderGif(item,trendingContainer));
        
    }catch(e){
        console.error("error");
    }
}

async function renderGif(gif,container){
    const listItem = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    
    listItem.className = 'trending-gif-item';
    img.src = gif.images.original.url;
    img.alt = gif.title;
    
    figure.appendChild(img);
    listItem.appendChild(figure);
    container.appendChild(listItem); 
}

//carrousel
const leftSlider = document.querySelector('.left-slider');
const rightSlider = document.querySelector('.right-slider');

leftSlider.addEventListener('click', ()=> slideLeft());
rightSlider.addEventListener('click', ()=> slideRight());

function slideRight(){
    if(position<47){
        position= position + 3;
        console.log(position);  
        sliceGifArray();
    }else{
        position = 0;
        console.log(position); 
        sliceGifArray();
    }
}

function slideLeft(){
    if(position>3){
        position = position - 3;
        console.log(position);
        sliceGifArray();
    }else{
        position = trendingList.length-3;
        console.log(position); 
        sliceGifArray();
    }
}
callGif();

//buscador
const searchInput = document.getElementById('search-bar');
const searchIcon = document.querySelector('.icon-search');
let searchContainer = document.createElement('ul');
let searchList = [];

// const query = searchInput.value;
async function callGifSearch(query) {
    const urlSearch = `http://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${query}`;
    const response = await fetch(urlSearch);
    const result = await response.json();
    // console.log(result);
    return result.data;
    // console.log(searchList);
}
const searchDiv = document.querySelector('.search-cont');
async function renderGifSearch(gif,container){
    // callGifSearch();
    const listItem = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    
    listItem.className = 'search-gif-item';
    container.className = 'search-gif-container';
    img.src = gif.images.original.url;
    img.alt = gif.title;
    
    figure.appendChild(img);
    listItem.appendChild(figure);
    container.appendChild(listItem); 
    searchDiv.appendChild(container);
}

//suggestions

const suggestionsContainer = document.querySelector('.search-suggestions');
let suggestions = [];

async function callGifSuggest() {
    let keySearch = searchInput.value;
    const urlSuggests = `http://api.giphy.com/v1/gifs/search/tags?api_key=${api_key}&q=${keySearch}&limit=4`;
    const response = await fetch(urlSuggests);
    const result = await response.json();
    // console.log(result);
    return result.data;
}

async function renderSuggestions(suggest,container){
    const listItem = document.createElement('li');
    const img = document.createElement('img');
    const span = document.createElement('span');

    img.src = "assets/icon-search-modo-noct.svg";
    listItem.className = 'search-suggest-item';
    img.className = 'search-suggest-img';
    span.className = 'search-suggest-gif';

    span.innerText = suggest.name;
    listItem.appendChild(img);
    listItem.appendChild(span);
    container.appendChild(listItem); 
    searchSuggestion(listItem, suggest.name);
    
}

    

function searchSuggestion(li,sug){ 
    li.addEventListener('click', ()=>{
        searchContainer.innerHTML ="";
        suggestionsContainer.innerHTML = "";
        searchListener(sug);  
    });
}


searchInput.addEventListener('keyup', (e) => {
    if(searchInput.value != ""){
        
        iconSearch.src = closeLight;
        iconSearch.style.width = '14px';
        iconSearch.style.heigth = '14px';

    }else{
        iconSearch.src = iconSearchLight;
        iconSearch.style.width = '20px';
        iconSearch.style.heigth = '20px';
    }
    let keySearch = searchInput.value;

    if(e.key === "Enter"){
        suggestionsContainer.innerHTML = "";
        searchContainer.innerHTML = "";
        const query = searchInput.value;
        searchListener(query);
        if(keySearch === ""){
            searchContainer.innerHTML = "";
        }

    }else{
        suggestionsContainer.innerHTML = "";
        debounce(suggestListener,'suggest');
        // suggestListener();
        // suggestions.forEach(item => renderSuggestions(item, suggestionsContainer));    
    }
});

searchIcon.addEventListener('click',()=>{
    suggestionsContainer.innerHTML = "";
    searchInput.value = "";
    iconSearch.src = iconSearchLight;
    iconSearch.style.width = '20px';
    iconSearch.style.heigth = '20px';

    // searchContainer.innerHTML = "";
    // const query = searchInput.value;
    // searchListener(query);
} );

async function searchListener(query){
    const searchList = await callGifSearch(query);
    searchList.forEach(item => renderGifSearch(item,searchContainer));
}
async function suggestListener(){

    const suggestList = await callGifSuggest();
    suggestList.forEach(item => renderSuggestions(item,suggestionsContainer));
}

let timerIds = {};
function debounce(callback,timerKey,delay=300){
    clearTimeout(timerIds[timerKey]);
    timerIds[timerKey] = setTimeout(callback,delay);
}

 

