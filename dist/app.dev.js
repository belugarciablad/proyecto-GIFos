'use strict';

var _api = require("../Proyecto GIFos/api.js");

var darkMode = document.getElementById('dark-mode');
var head = document.querySelector('head');
var logo = document.querySelector('.logo');
var darkLogo = 'assets/logo-mobile-modo-noct.svg';
var lightLogo = 'assets/logo-mobile.svg';
var iconSearch = document.querySelector('.icon-search');
var iconSearchDark = "assets/icon-search-modo-noct.svg";
var iconSearchLight = "assets/icon-search.svg";
var burguer = document.querySelector('.burguer');
var close = document.querySelector('.close');
var burguerDark = "assets/burger.svg";
var burguerLight = "assets/burger-modo-noct.svg";
var closeDark = "assets/close-modo-noct.svg";
var closeLight = "assets/close.svg";
var linkDark = document.createElement('link');
linkDark.href = "styles/dist/darkstyles.css";
linkDark.rel = "stylesheet";
darkMode.addEventListener('click', function () {
  !head.contains(linkDark) ? head.appendChild(linkDark) : head.removeChild(linkDark);
  logo.src = new RegExp(lightLogo.replace(/\+/g, '.')).test(logo.src) ? darkLogo : lightLogo;
  iconSearch.src = new RegExp(iconSearchLight.replace(/\+/g, '.')).test(iconSearch.src) ? iconSearchDark : iconSearchLight;
  burguer.src = new RegExp(burguerLight.replace(/\+/g, '.')).test(burguer.src) ? burguerDark : burguerLight;
  close.src = new RegExp(closeLight.replace(/\+/g, '.')).test(close.src) ? closeDark : closeLight;
}); //header border

var header = document.querySelector('.header');
document.addEventListener('scroll', function () {
  if (window.scrollY > 90) {
    header.style.borderBottom = '1px solid #9CAFC3';
    header.style.boxShadow = '0 2px 4px 1px';
  } else {
    header.style.borderBottom = 'none';
    header.style.boxShadow = '0 0 0 0';
  }
}); //active pages

var home = document.querySelector('.home');
var favorites = document.querySelector('.favorites');
var myGifos = document.querySelector('.myGifos');
var gifCreator = document.querySelector('.gif-creator');
var trendingGifos = document.querySelector('.real-trends');
var mygifosLi = document.querySelector('.mygifos-li');
var favLi = document.querySelector('.fav-li');
var createGif = document.getElementById('create-gif');
var inputBurguer = document.getElementById('input-burguer');

function activeClass(active, active2, inactive1, inactive2, inactive3, inactive4) {
  active.style.display = 'block';
  active2.style.display = 'block';
  inactive1.style.display = 'none';
  inactive2.style.display = 'none';
  inactive3.style.display = 'none';
  inactive4.style.display = 'none';

  if (inputBurguer.checked) {
    inputBurguer.checked = false;
  }
}

favLi.addEventListener('click', function () {
  return activeClass(favorites, trendingGifos, home, myGifos, gifCreator, gifCreator);
});
mygifosLi.addEventListener('click', function () {
  return activeClass(myGifos, trendingGifos, home, favorites, gifCreator, gifCreator);
});
logo.addEventListener('click', function () {
  return activeClass(home, trendingGifos, favorites, myGifos, gifCreator, gifCreator);
});
createGif.addEventListener('click', function () {
  return activeClass(gifCreator, gifCreator, home, favorites, myGifos, trendingGifos);
}); //fetch trendings

var url = "http://api.giphy.com/v1/gifs/trending?api_key=".concat(_api.api_key);
var trendingContainer = document.getElementById('trending-gif-container');
var position = 0;
var trendingList;

function callGif() {
  var response, result;
  return regeneratorRuntime.async(function callGif$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch(url));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          result = _context.sent;
          console.log(result);
          trendingList = result.data;
          console.log(trendingList);
          sliceGifArray();

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}

function sliceGifArray() {
  try {
    var trendingShort = trendingList.slice(position, position + 3);
    console.log(trendingShort);
    trendingContainer.innerHTML = "";
    trendingShort.forEach(function (item) {
      return renderGif(item, trendingContainer);
    });
  } catch (e) {
    console.error("error");
  }
}

function renderGif(gif, container) {
  var listItem, figure, img;
  return regeneratorRuntime.async(function renderGif$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          listItem = document.createElement('li');
          figure = document.createElement('figure');
          img = document.createElement('img');
          listItem.className = 'trending-gif-item';
          img.src = gif.images.original.url;
          img.alt = gif.title;
          figure.appendChild(img);
          listItem.appendChild(figure);
          container.appendChild(listItem);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
} //carrousel


var leftSlider = document.querySelector('.left-slider');
var rightSlider = document.querySelector('.right-slider');
leftSlider.addEventListener('click', function () {
  return slideLeft();
});
rightSlider.addEventListener('click', function () {
  return slideRight();
});

function slideRight() {
  if (position < 47) {
    position = position + 3;
    console.log(position);
    sliceGifArray();
  } else {
    position = 0;
    console.log(position);
    sliceGifArray();
  }
}

function slideLeft() {
  if (position > 3) {
    position = position - 3;
    console.log(position);
    sliceGifArray();
  } else {
    position = trendingList.length - 3;
    console.log(position);
    sliceGifArray();
  }
}

callGif(); //buscador

var searchInput = document.getElementById('search-bar');
var searchIcon = document.querySelector('.icon-search');
var searchContainer = document.createElement('ul');
var searchList = []; // const query = searchInput.value;

function callGifSearch(query) {
  var urlSearch, response, result;
  return regeneratorRuntime.async(function callGifSearch$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          urlSearch = "http://api.giphy.com/v1/gifs/search?api_key=".concat(_api.api_key, "&q=").concat(query);
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch(urlSearch));

        case 3:
          response = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          result = _context3.sent;
          return _context3.abrupt("return", result.data);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
}

var searchDiv = document.querySelector('.search-cont');

function renderGifSearch(gif, container) {
  var listItem, figure, img;
  return regeneratorRuntime.async(function renderGifSearch$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // callGifSearch();
          listItem = document.createElement('li');
          figure = document.createElement('figure');
          img = document.createElement('img');
          listItem.className = 'search-gif-item';
          container.className = 'search-gif-container';
          img.src = gif.images.original.url;
          img.alt = gif.title;
          figure.appendChild(img);
          listItem.appendChild(figure);
          container.appendChild(listItem);
          searchDiv.appendChild(container);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
} //suggestions


var suggestionsContainer = document.querySelector('.search-suggestions');
var suggestions = [];

function callGifSuggest() {
  var keySearch, urlSuggests, response, result;
  return regeneratorRuntime.async(function callGifSuggest$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          keySearch = searchInput.value;
          urlSuggests = "http://api.giphy.com/v1/gifs/search/tags?api_key=".concat(_api.api_key, "&q=").concat(keySearch, "&limit=4");
          _context5.next = 4;
          return regeneratorRuntime.awrap(fetch(urlSuggests));

        case 4:
          response = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          result = _context5.sent;
          return _context5.abrupt("return", result.data);

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function renderSuggestions(suggest, container) {
  var listItem, img, span;
  return regeneratorRuntime.async(function renderSuggestions$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          listItem = document.createElement('li');
          img = document.createElement('img');
          span = document.createElement('span');
          img.src = "assets/icon-search-modo-noct.svg";
          listItem.className = 'search-suggest-item';
          img.className = 'search-suggest-img';
          span.className = 'search-suggest-gif';
          span.innerText = suggest.name;
          listItem.appendChild(img);
          listItem.appendChild(span);
          container.appendChild(listItem);
          searchSuggestion(listItem, suggest.name);

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function searchSuggestion(li, sug) {
  li.addEventListener('click', function () {
    searchContainer.innerHTML = "";
    suggestionsContainer.innerHTML = "";
    searchListener(sug);
  });
}

searchInput.addEventListener('keyup', function (e) {
  if (searchInput.value != "") {
    iconSearch.src = closeLight;
    iconSearch.style.width = '14px';
    iconSearch.style.heigth = '14px';
  } else {
    iconSearch.src = iconSearchLight;
    iconSearch.style.width = '20px';
    iconSearch.style.heigth = '20px';
  }

  var keySearch = searchInput.value;

  if (e.key === "Enter") {
    suggestionsContainer.innerHTML = "";
    searchContainer.innerHTML = "";
    var query = searchInput.value;
    searchListener(query);

    if (keySearch === "") {
      searchContainer.innerHTML = "";
    }
  } else {
    suggestionsContainer.innerHTML = "";
    debounce(suggestListener, 'suggest'); // suggestListener();
    // suggestions.forEach(item => renderSuggestions(item, suggestionsContainer));    
  }
});
searchIcon.addEventListener('click', function () {
  suggestionsContainer.innerHTML = "";
  searchInput.value = "";
  iconSearch.src = iconSearchLight;
  iconSearch.style.width = '20px';
  iconSearch.style.heigth = '20px'; // searchContainer.innerHTML = "";
  // const query = searchInput.value;
  // searchListener(query);
});

function searchListener(query) {
  var searchList;
  return regeneratorRuntime.async(function searchListener$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(callGifSearch(query));

        case 2:
          searchList = _context7.sent;
          searchList.forEach(function (item) {
            return renderGifSearch(item, searchContainer);
          });

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function suggestListener() {
  var suggestList;
  return regeneratorRuntime.async(function suggestListener$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(callGifSuggest());

        case 2:
          suggestList = _context8.sent;
          suggestList.forEach(function (item) {
            return renderSuggestions(item, suggestionsContainer);
          });

        case 4:
        case "end":
          return _context8.stop();
      }
    }
  });
}

var timerIds = {};

function debounce(callback, timerKey) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
  clearTimeout(timerIds[timerKey]);
  timerIds[timerKey] = setTimeout(callback, delay);
}