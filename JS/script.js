// API LINKS 
const API_KEY = 'api_key=3f0a6394eaed35164396a8db8b19bdb3';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const API_URL_SORTED_REVENUE = "https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=3f0a6394eaed35164396a8db8b19bdb3";
const API_URL_SORTED_VOTES = "https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=3f0a6394eaed35164396a8db8b19bdb3&page=1&vote_count.gte=10000";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = BASE_URL + '/search/movie?' + API_KEY;
// API LINKS End 

// Genres Array 
const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]
// Genres Array End

// DOM Variables
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const revenueLink = document.getElementById("sort-by-revenue");
const voteLink = document.getElementById("sort-by-votes");
const popularityLink = document.getElementById("sort-by-popularity");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

const scrollBackUp = document.getElementById("scroll-back-up");
// DOM Variables End 

// Pagination Variables
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;
// Pagination Variables End 

// Selected Tags Array
let selectedGenre = [];
// Selected Tags Array End 

// Generate Genre Tags
setGenre();
// Generate Genre Tags End

// Function for Generating Genre Tags
function setGenre() {
  tagsEl.innerHTML = ``;

  genres.forEach(genre => {
    const t = document.createElement("div");

    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;

    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      }
        else {
          if (selectedGenre.includes(genre.id)) {
            selectedGenre.forEach((id, index) => {
              if (id == genre.id) {
                selectedGenre.splice(index, 1);
              }
            })
          } 
          else {
            selectedGenre.push(genre.id)
          }
      }

      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection()
    })

    tagsEl.append(t);
  })
}
// Function for Generating Genre Tags End 

// Highlighted Selected Genres
function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach(tag => {
    tag.classList.remove("highlight");
  })

  clearBtn();

  if (selectedGenre.length != 0) {
    selectedGenre.forEach(id => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("highlight");
    })
  }
}
// Highlighted Selected Genres End 

// Implement a Clear Btn Into the Genre Tags
function clearBtn() {

  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear x"
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    })
    tagsEl.append(clear);
  }
}
// Implement a Clear Btn Into the Genre Tags End

// Nav Link Filters 
revenueLink.addEventListener("click", () => {
  getMovies(API_URL_SORTED_REVENUE);
  showMovies(data.results);
})

voteLink.addEventListener("click", () => {
  getMovies(API_URL_SORTED_VOTES);
  showMovies(data.results);
})

popularityLink.addEventListener("click", () => {
  getMovies(API_URL);
  showMovies(data.results);
})
// Nav Link Filters End

// Get Initial Movies
getMovies(API_URL)
// Get Initial Movies

// Fetch Data From the TMDB API 
async function getMovies(url) {
  lastUrl = url;

  const res = await fetch(url);
  const data = await res.json();

  if (data.results == 0) {
    main.innerHTML = `<h1 id="no-results-found"> <img src="../Icon/error.png" alt=""/> No Results Found !</h1>`
  }
  else {
    showMovies(data.results);
    currentPage = data.page;
    nextPage = data.page + 1;
    prevPage = data.page - 1;
    totalPages = data.total_pages;

    current.innerText = currentPage;

    if (currentPage <= 1) {
      prev.classList.add('disabledd');
      next.classList.remove('disabledd')
    }
    else if (currentPage >= totalPages) {
    prev.classList.remove('disabledd');
    next.classList.add('disabledd')
    }
    else {
      prev.classList.remove('disabledd');
      next.classList.remove('disabledd')
    }
  }
}
// Fetch Data From the TMDB API End 

// Display the Fetched Movies From getMovies()
function showMovies(movies) {
  main.innerHTML = '';

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date, id} = movie;

    const movieEl = document.createElement("div");

    movieEl.classList.add("movie");

    movieEl.innerHTML = `
        <div class="card movie">
        <img src="${poster_path ? IMG_PATH + poster_path : "http://via.placeholder.com/1080x1580"}" class="card-img-top" alt="${title}" />
        <div class="card-body movie-info">
          <h3>${title}</h3>
          <small id="release-date">${release_date}</small>
          <span id="movie-rating" class="${getClassByRate(vote_average)}">${vote_average}</span>
          
        </div>
        <div class="overview">
        <h3 id="overview">Overview</h3>
          ${overview}
          </br>
          <button class="trailer btn btn-warning" id="${id}">View Trailer</button>
        </div>
      </div>
    `

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      openNav(movie);
    })

  })
}
// Display the Fetched Movies From getMovies() End

// Trailer Carousel 
// Overlay Content Variable
const overlayContent = document.getElementById("overlay-content");
// Overlay Content Variable End 

function openNav(movie) {
  let movieID = movie.id;
  fetch(BASE_URL + '/movie/' + movieID + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if (videoData) {
      document.getElementById("trailer-overlay").style.width = "100%";
      if (videoData.results.length > 0) {
        let embed = [];
        let indicators = [];
        videoData.results.forEach((video, index) => {
          let {name, key, site} = video; 

          if (site == 'YouTube') {
           embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                 `)
          indicators.push(`
            <span class="indicator">${index + 1}</span>
          `)
          } 
        })

        let content = `
          <h1 class="movie-title-in-overlay">"${movie.original_title}"</h1>
          </br>

          ${embed.join('')}
          </br>

          <div class="indicators">${indicators.join('')}</div>

        `

        overlayContent.innerHTML = content;
        activeSlide = 0;
        showVideos();
      } 
      else {
        overlayContent.innerHTML = `<h1 id="no-results-found"> No Results Found! </h1>`
      }
    }
  })
}

function closeNav() {
  document.getElementById("trailer-overlay").style.width = "0%";
}

// Function to Show Movie Trailers One by One
let activeSlide = 0; // Represents The Video That is Active
let totalVideos = 0; // Represents Total Number of Videos We Got Back From The API Request

function showVideos() {
  let embedClasses = document.querySelectorAll(".embed");
  let indicators = document.querySelectorAll(".indicator");

  totalVideos = embedClasses.length;

  embedClasses.forEach((embedTag, index) => {
    if (activeSlide == index) {
      embedTag.classList.add("show")
      embedTag.classList.remove("hide")
    }
    else {
      embedTag.classList.add("hide")
      embedTag.classList.remove("show")
    }
  })

  indicators.forEach((indicator, index) => {
    if (activeSlide == index) {
      indicator.classList.add("active");
    }
    else {
      indicator.classList.remove("active");
    }
  })

}
// Function to Show Movie Trailers One by One End
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  }
  else {
    activeSlide = totalVideos - 1;
  }

  showVideos();

})

rightArrow.addEventListener("click", () => {
  if (activeSlide < (totalVideos - 1)) {
    activeSlide++;
  }
  else {
    activeSlide = 0;
  }

  showVideos();

})
// Trailer Carousel End

// Set Movie Rating Color (Dependent on Rating Value)
function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  }

   else if (vote >= 5) {
    return "orange";
  }

   else {
    return "red";
  }
}
// Set Movie Rating Color (Dependent on Rating Value) End 

// Search Box Functionality
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  selectedGenre = [];
  highlightSelection();
  setGenre();

  if (searchTerm && searchTerm !== '') {

    getMovies(SEARCH_API + '&query=' + searchTerm);

    search.value = ''
  } else {
    window.location.reload();
  }
})
// Search Box Functionality End

// Pagination
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
  scrollBackUp.scrollIntoView({behavior : 'smooth'});
})


next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
  scrollBackUp.scrollIntoView({behavior : 'smooth'});
})

function pageCall(page) {
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length - 1].split('=');

  if (key[0] != 'page') {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  }
  else {
    key[1] = page.toString();
    let reunite = key.join('=');
    queryParams[queryParams.length - 1] = reunite;
    let joinQueries = queryParams.join('&');
    let url = urlSplit[0] + '?' + joinQueries;
    getMovies(url);
    
  }
}
// Pagination End