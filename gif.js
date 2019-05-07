const init = () => {
  // search buttom
  let btn = document.querySelector("#searchGifs");
  btn.addEventListener("click", getGifs);

  // clear results button
  let clearnResultsBtn = document.querySelector("#clearResults");
  clearnResultsBtn.addEventListener("click", clearResults);
}

const getGifs = async () => {
  // get search term
  let searchTerm = document.querySelector("#searchTerm").value;

  // error message if no search terms, else request gifs
  if (searchTerm == "") {
    // clear any previous results
    removeResultsDiv();

    // display error message
    let error = displayResultsDiv();
    error.setAttribute("style", "margin-top: 8px; margin-bottom: 60px; color: #e82e00;");
    error.innerHTML = "<p>You didn't enter any search terms.</p>";

  } else {
    // request gifs
    let gifs = await requestGifs(searchTerm);
    // ^^waits for results to come back before continues with display

    // error message if no results come back, else display gifs
    if (gifs.data.length == 0) {
      // clear any previous results
      removeResultsDiv();

      // display error message
      let error = displayResultsDiv();
      error.setAttribute("style", "margin-top: 8px; margin-bottom: 60px; color: #e82e00;");
      error.innerHTML = "<p>Sorry, we didn't find any gifs matching that search.</p>";

    } else {
      // display gifs
      console.log(gifs);
      displayGifs(gifs);
    }
  }
}

const requestGifs = async searchTerm => {
  const url = `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&limit=10&api_key=oqNZVWM2tmbDZuiqrA09Iys2sVWWD6aB`;

  return await fetch(url).then(gifData => gifData.json())
    .then(jsonGifData => {
      return jsonGifData;
    })
  //returns a promise^^^^ that gets resolved with the JSON data as text.. have to convert into json object with .json() part of fetch api... returns another promise
}

const displayGifs = gifs => {
  // clear previous results
  removeResultsDiv();

  // create gif div
  let resultsDiv = displayResultsDiv();
  resultsDiv.setAttribute("style", "margin-top: 35px; margin-bottom: 60px;");
  resultsDiv.innerHTML = "<p>Results</p>";

  // map data to url to img element on page (gifs.data is an array)
  let urls = gifs.data.map(x => x.images.fixed_height.url);
  let imgs = urls.map(x => {
    let img = document.createElement("img");
    img.setAttribute("src", x);
    img.setAttribute("style", "margin: 5px;");
    let resultsDiv = document.getElementById("resultsDiv");
    resultsDiv.appendChild(img);
  })
}

const clearResults = () => {
  // clear previous results
  removeResultsDiv();

  // clear field
  document.querySelector("#searchTerm").value = "";
}

const removeResultsDiv = () => {
  // div contains gifs or error message
  if (document.getElementById("resultsDiv")) {
    document.getElementById("resultsDiv").parentNode.removeChild(document.getElementById("resultsDiv"));
  }
}

const displayResultsDiv = () => {
  // create and append results div
  let resultsDiv = document.createElement("div");
  resultsDiv.setAttribute("id", "resultsDiv");
  let mainContentDiv = document.getElementById("mainContent");
  mainContentDiv.appendChild(resultsDiv);
  return resultsDiv;
}

window.onload = init;
