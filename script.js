// my api key
const API_KEY = "e9bfe5f6a4b2bef1a50a68816ec5a654";

// current page and query tracking variables
let currentPage = 1;
let currentQuery = "";

/**
 * Fetches a list of movies from The Movie Database (TMDB) API.
 *
 * @param {string|null} query - The search term used to query for movies. If this parameter is null,
 *                              the function fetches a list of popular movies by default.
 * @param {number} page - The page number to fetch from the API. Each page contains a list of movies.
 *
 * This function makes a fetch request to either the 'search movie' endpoint or the 'popular movies' endpoint
 * of the TMDB API, depending on whether a query parameter is provided. The page parameter determines
 * the page number of the results to fetch. The function creates and appends a div for each movie
 * to the movie list in the DOM.
 *
 * @returns {void}
 *
 * @throws {Error} Will throw an error if the fetch request fails.
 */

function fetchMovies(query, page) {
  let url;
  if (query) {
    // If there is a query, constructs url for search endpoint
    url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`;
  } else {
    // If there is no query, fetch popular movies endpoint
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
  }

  // Fetch the data from the API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const movieList = document.getElementById("movie-grid");

      // Clear the movie list if we're fetching the first page
      if (page === 1) {
        movieList.innerHTML = "";
      }

      // Loop through the results and create a movie div for each movie
      data.results.forEach((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.className = "movie-card";

        // Create the movie thumbnail
        const movieThumbnail = document.createElement("img");
        movieThumbnail.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieThumbnail.className = "movie-poster";
        movieDiv.appendChild(movieThumbnail);

        // Create the movie title
        const movieTitle = document.createElement("h3");
        movieTitle.textContent = movie.title;
        movieDiv.appendChild(movieTitle);

        // Create the movie votes
        const votes = document.createElement("p");
        votes.textContent = `Votes: ${movie.vote_count}`;
        movieDiv.appendChild(votes);

        // append the movie div to the movie list
        movieList.appendChild(movieDiv);
      });
    })
    // Catch any errors and log them to the console
    .catch((error) => {
      console.log(`The Error: ${error}`);
    });
}

// Initial fetch of popular movies
fetchMovies(null, currentPage);

// When the Load More button is clicked, increment the page and fetch more movies
document
  .getElementById("load-more-movies-btn")
  .addEventListener("click", () => {
    if (!currentQuery) {
      // Only load more for the popular movies, not for the search results
      currentPage++;
      fetchMovies(null, currentPage);
    }
  });

// Search feature using event listener
document.getElementById("search-input").addEventListener("input", (e) => {
  currentQuery = e.target.value;
  currentPage = 1; // Reset current page to 1 for a new search

  const loadMoreButton = document.getElementById("load-more-movies-btn");

  if (currentQuery) {
    loadMoreButton.style.display = "none";
    fetchMovies(currentQuery, currentPage);
  } else {
    loadMoreButton.style.display = "block";
    fetchMovies(null, currentPage);
  }
});

// clear search button
const closeSearchButton = document.getElementById("close-search-button"); // adding event listener to the clear search
closeSearchButton.addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  currentQuery = "";
  currentPage = 1;

  // hide the clear search button
  closeSearchButton.style.display = "none";
  fetchMovies(null, currentPage);
});
