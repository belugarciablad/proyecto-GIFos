'use strict'

import {api_key} from "../proyecto-GIFos/api.js";

const darkMode = document.getElementById('dark-mode');

const head = document.querySelector('head');

const logo = document.querySelector('.logo');
const darkLogo ='assets/logo-mobile-modo-noct.svg';
const lightLogo ='assets/logo-mobile.svg';
const iconSearch = document.querySelector('.icon-search');
const iconSearchDark = "assets/icon-search-modo-noct.svg";
const iconSearchLight = "assets/icon-search.svg";
const searchZoom = document.querySelector('.searchZoom');

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
favLi.addEventListener('click',()=>{
    activeClass(favorites,trendingGifos,home,myGifos,gifCreator,gifCreator);
    let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
    favContainer.innerHTML = "";
    localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
    if(localStorageFavorites != null){
        nofavsContainer.style.display ="none";
    }else{
        nofavsContainer.style.display ="block";
    }
});
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
    const cardSpecs = document.createElement('div');
    const username = document.createElement('p');
    const title = document.createElement('p');
    const iconCardContainer = document.createElement('div');
    const fav = document.createElement('img');
    const disFav = document.createElement('img');
    const download = document.createElement('img');
    const expand = document.createElement('img');
    
    listItem.className = 'trending-gif-item gif-item';
    img.src = gif.images.original.url;
    img.alt = gif.title;
    title.innerText = gif.title.split('by')[0];
    username.innerText = gif.username;
    fav.src = "assets/icon-fav.svg";
    fav.alt = "empty-heart";
    disFav.src = "assets/icon-fav-active.svg";
    disFav.alt = "full-heart";
    download.src = "assets/icon-download.svg";
    expand.src = "assets/icon-max-normal.svg";

    cardSpecs.className = 'card-specifications';
    iconCardContainer.className = 'card-icons-container';
    title.className ='gif-title';
    username.className ='gif-username';
    fav.className ='gif-fav-icon gif-card-icons';
    disFav.className ='gif-fav-icon gif-card-icons dis-fav';
    download.className ='gif-download-icon gif-card-icons';
    expand.className ='gif-expand-icon gif-card-icons';
    
    figure.appendChild(img);
    listItem.appendChild(figure);
    listItem.appendChild(cardSpecs);
    iconCardContainer.appendChild(fav);
    iconCardContainer.appendChild(disFav);
    iconCardContainer.appendChild(download);
    iconCardContainer.appendChild(expand);
    container.appendChild(listItem); 

    cardSpecs.append(iconCardContainer);
    cardSpecs.append(username);
    cardSpecs.append(title);
    listItem.appendChild(cardSpecs);

    
    fav.addEventListener('click', ()=>{
        addFavoriteToLocalStorage(gif.id, gif.title, gif.username, gif.images.original.url);
        fav.style.display ="none";
        disFav.style.display = "block";
        let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
        favContainer.innerHTML = "";
        localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
        if(localStorageFavorites != null){
            nofavsContainer.style.display ="none";
        }else{
            nofavsContainer.style.display ="block";
        }
    })
        disFav.addEventListener('click',()=>{
        removeFavoriteFromLocalStorage(gif.id,gif.title,gif.username,gif.images.original.url);
        fav.style.display = "block";
        disFav.style.display = "none";
        let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
        favContainer.innerHTML = "";
        localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
        if(localStorageFavorites != null){
            nofavsContainer.style.display ="none";
        }else{
            nofavsContainer.style.display ="block";
        }
    })
    let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
    if(localStorageFavorites.find(item => item.id == gif.id)){
        fav.style.display ="none";
        disFav.style.display = "block";
    }else{
        fav.style.display = "block";
        disFav.style.display = "none";
    }
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
    const cardSpecs = document.createElement('div');
    const username = document.createElement('p');
    const title = document.createElement('p');
    const iconCardContainer = document.createElement('div');
    const fav = document.createElement('img');
    const disFav = document.createElement('img');
    const download = document.createElement('img');
    const expand = document.createElement('img');
    
    listItem.className = 'search-gif-item gif-item';
    container.className = 'search-gif-container';
    img.src = gif.images.original.url;
    img.alt = gif.title;
    title.innerText = gif.title.split('by')[0];
    username.innerText = gif.username;
    fav.src = "assets/icon-fav.svg"
    fav.alt = "empty-heart";
    disFav.src = "assets/icon-fav-active.svg";
    disFav.alt = "full-heart";
    download.src = "assets/icon-download.svg"
    expand.src = "assets/icon-max-normal.svg"
    
    cardSpecs.className = 'card-specifications';
    iconCardContainer.className = 'card-icons-container card-icons-container-search ';
    title.className ='gif-title gif-title-search';
    username.className ='gif-username gif-username-search';
    fav.className ='gif-fav-icon gif-card-icons';
    disFav.className ='gif-fav-icon gif-card-icons dis-fav';
    download.className ='gif-download-icon gif-card-icons';
    expand.className ='gif-expand-icon gif-card-icons';
        
    
    figure.appendChild(img);
    listItem.appendChild(figure);
    iconCardContainer.appendChild(fav);
    iconCardContainer.appendChild(disFav);
    iconCardContainer.appendChild(download);
    iconCardContainer.appendChild(expand);
    container.appendChild(listItem); 
    searchDiv.appendChild(container);
    
    cardSpecs.append(iconCardContainer);
    cardSpecs.append(username);
    cardSpecs.append(title);
    listItem.appendChild(cardSpecs);

    
    fav.addEventListener('click', ()=>{
        addFavoriteToLocalStorage(gif.id, gif.title, gif.username, gif.images.original.url);
        fav.style.display ="none";
        disFav.style.display = "block";
        let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
        favContainer.innerHTML = "";
        localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
        if(localStorageFavorites != null){
            nofavsContainer.style.display ="none";
        }else{
            nofavsContainer.style.display ="block";
        }
    })
        disFav.addEventListener('click',()=>{
        removeFavoriteFromLocalStorage(gif.id,gif.title,gif.username,gif.images.original.url);
        fav.style.display = "block";
        disFav.style.display = "none";
        let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
        favContainer.innerHTML = "";
        localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
        if(localStorageFavorites != null){
            nofavsContainer.style.display ="none";
        }else{
            nofavsContainer.style.display ="block";
        }
    })
    let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || [];
    if(localStorageFavorites.find(item => item.id == gif.id)){
        fav.style.display ="none";
        disFav.style.display = "block"; 
    }else{
        fav.style.display = "block";
        disFav.style.display = "none";
    }
    
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
        searchZoom.style.opacity = '100%';
        searchInput.style.marginLeft = '0px';
        
        iconSearch.src = closeLight;
        iconSearch.style.width = '14px';
        iconSearch.style.heigth = '14px';
        
    }else{
        searchZoom.style.opacity = '0';
        // searchInput.style.marginLeft = '45px';

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

    searchZoom.style.opacity = '0';
    // searchInput.style.marginLeft = '45px';
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

// fetch trending titles


async function callTrendingTitles() {
    const urlTrendingTitles = `http://api.giphy.com/v1/trending/searches?api_key=${api_key}&limit=4`;
    const response = await fetch(urlTrendingTitles);
    const result = await response.json();
    // console.log(result.data);
    return result.data;
}
async function renderTrendingTitles(title,container){
    const trendingTerm = document.createElement('li');
    trendingTerm.innerHTML = title;
    trendingTerm.className = 'li-trending-terms';
    container.appendChild(trendingTerm);
}

const trendingTerms = document.querySelector('.ul-trending-terms');

async function trendingTitlesListener(){
    const trendingTitlesResult =  await callTrendingTitles();
    const trendingTitles = await trendingTitlesResult.slice(0,4);
    console.log(trendingTitles);
    const trendingLineExceptLast = await trendingTitles.slice(0,3);
    const trendingLineLast = await trendingTitles.slice(3,4);
    const trendingLine = [];
    trendingLineExceptLast.forEach(item => trendingLine.push(item+", "));
    trendingLine.push(trendingLineLast[0]);
    console.log(trendingLine);
    trendingLine.forEach(item =>  renderTrendingTitles(item,trendingTerms))
}
trendingTitlesListener();



//favorites

const favContainer = document.querySelector('.fav-container');
const nofavsContainer = document.getElementById('no-content-fav');

function addFavoriteToLocalStorage(id, title, username, image){
    
    let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || [];
    localStorageFavorites = localStorageFavorites.concat({
        id: id,
        title: title,
        username: username,
        image: image
    })
    localStorage.setItem('favList', JSON.stringify(localStorageFavorites))
    // favListener();
    console.log(localStorageFavorites)
}

function removeFavoriteFromLocalStorage(id, title, username, image){
    
    let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
    localStorageFavorites = localStorageFavorites.filter(item => item.id !==id);
    localStorage.setItem('favList', JSON.stringify(localStorageFavorites));
    console.log(localStorageFavorites);
    // console.log(localStorage.getItem('favList'));
}


function renderFav(gifId,image, tit, uname, container){

    const listItem = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const cardSpecs = document.createElement('div');
    const username = document.createElement('p');
    const title = document.createElement('p');
    const iconCardContainer = document.createElement('div');
    const fav = document.createElement('img');
    const disFav = document.createElement('img');
    const download = document.createElement('img');
    const expand = document.createElement('img');
    
    const id = gifId;

    listItem.className = 'fav-gif-item gif-item';
    container.className = 'fav-gif-container';
    img.src = image;
    img.alt = tit;
    title.innerText = tit;
    username.innerText = uname;
    fav.src = "assets/icon-fav.svg"
    fav.alt = "empty-heart";
    disFav.src = "assets/icon-fav-active.svg"
    disFav.alt = "full-heart";
    download.src = "assets/icon-download.svg"
    expand.src = "assets/icon-max-normal.svg"
    
    cardSpecs.className = 'card-specifications';
    iconCardContainer.className = 'card-icons-container card-icons-container-search ';
    title.className ='gif-title gif-title-search';
    username.className ='gif-username gif-username-search';
    fav.className ='gif-fav-icon gif-card-icons';
    disFav.className ='gif-fav-icon gif-card-icons dis-fav';
    download.className ='gif-download-icon gif-card-icons';
    expand.className ='gif-expand-icon gif-card-icons';
    
    
    figure.appendChild(img);
    listItem.appendChild(figure);
    iconCardContainer.appendChild(fav);
    iconCardContainer.appendChild(disFav);
    iconCardContainer.appendChild(download);
    iconCardContainer.appendChild(expand);
    container.appendChild(listItem); 
    // favDiv.appendChild(container);
    
    cardSpecs.append(iconCardContainer);
    cardSpecs.append(username);
    cardSpecs.append(title);
    listItem.appendChild(cardSpecs);

    
    fav.addEventListener('click', ()=>{
        addFavoriteToLocalStorage(id, title, username, image);
        fav.style.display ="none";
        disFav.style.display = "block";
        let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
        favContainer.innerHTML = "";
        localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
        if(localStorageFavorites != null){
            nofavsContainer.style.display ="none";
        }else{
            nofavsContainer.style.display ="block";
        }
    })
        disFav.addEventListener('click',()=>{
        removeFavoriteFromLocalStorage(id, title, username, image);
        fav.style.display = "block";
        disFav.style.display = "none";
        let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
        favContainer.innerHTML = "";
        localStorageFavorites.forEach(item => renderFav(item.id, item.image, item.title, item.username, favContainer));
        if(localStorageFavorites != null){
            nofavsContainer.style.display ="none";
        }else{
            nofavsContainer.style.display ="block";
        }
    })
    let localStorageFavorites = JSON.parse(localStorage.getItem('favList')) || []
    if(localStorageFavorites.find(item => item.id == id)){
        fav.style.display ="none";
        disFav.style.display = "block";
    }else{
        fav.style.display = "block";
        disFav.style.display = "none";
    }
}


    

