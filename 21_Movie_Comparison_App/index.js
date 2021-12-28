const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    return `
            <img src="${imgSrc}" />
            ${movie.Title}  (${movie.Year}) 
        `;
  },
  onOptionSelect(movie, root) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, root);
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: keys.OMDb,
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    } else {
      return response.data.Search;
    }
  },
};

let leftMovie;
let rightMovie;

async function onMovieSelect(movie, root) {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: keys.OMDb,
      i: movie.imdbID,
    },
  });

  let queryString;

  if (root.id === "left-autocomplete") {
    queryString = "#left-summary";
    leftMovie = response.data;
  } else {
    queryString = "#right-summary";
    rightMovie = response.data;
  }

  document.querySelector(queryString).innerHTML = movieTemplate(response.data);

  if (leftMovie && rightMovie) {
    runComparison();
  }
}

const runComparison = () => {
  let leftSideStats = document
    .querySelector("#left-summary")
    .querySelectorAll(".notification");
  let rightSideStats = document
    .querySelector("#right-summary")
    .querySelectorAll(".notification");

  leftSideStats.forEach((leftStat, index) => {
    let rightStat = rightSideStats[index];
    let leftSideValue = parseFloat(leftStat.dataset.value);
    let rightSideValue = parseFloat(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

const movieTemplate = (movieDetail) => {
  console.log(movieDetail);
  let boxOffice = parseInt(movieDetail.BoxOffice.replace(/[,$]/g, ""));
  let metaScore = parseInt(movieDetail.Metascore);
  let imdbRating = parseFloat(movieDetail.imdbRating);
  let imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  let count = 0;
  let awards = movieDetail.Awards.split(" ").forEach((word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return;
    } else {
      count += value;
    }
  });

  console.log(count);

  return `
          <article class="media">
            <figure class="media-left">
              <p class="image">
                <img src="${movieDetail.Poster}" />
              </p>
            </figure>
            <div class="media-content">
              <div class="content">

                <h1>${movieDetail.Title} </h1>
                <h4>${movieDetail.Genre} </h4>
                <p>${movieDetail.Plot} </p>
            </div>
          </article>
          <article data-value=${count} class="notification is-primary">
            <p class="title">${movieDetail.Awards} </p>
            <p class="subtitle">Awards</p>
          </article>
          <article data-value=${boxOffice} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice} </p>
            <p class="subtitle">Box Office</p>
          </article>
          <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore} </p>
            <p class="subtitle">Meta Score</p>
          </article>
          <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating} </p>
            <p class="subtitle">IMDB Rating</p>
          </article>
          <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes} </p>
            <p class="subtitle">IMDB Votes</p>
          </article>

  
  `;
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
});
