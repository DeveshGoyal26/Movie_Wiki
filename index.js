page();
//Which page i am on
function page() {
  let page_imon = document.body.id;
  switch (page_imon) {
    case "trending_page":
      trending_page();
      break;
    case "movies":
      console.log("movies");
      let id = JSON.parse(localStorage.getItem("movie_id"));
      console.log(id);
      movies_page(id);
      break;
    default:
      trending_page();
  }
}

//Trending page all function
function trending_page() {
  // All id containers
  let b = document.getElementById("trending_page")
  let search_btn = document.getElementById("search_btn");
  let search = document.querySelector("#search");
  let no_result = document.getElementById("no_result");
  let search_result = document.getElementById("search_result");
  let container = document.getElementById("container");
  let trending_sort = document.getElementById("trending");
  let search_div = document.getElementById("inner_search_div")

  async function search_fetch() {
    try {
      let name = search.value;

      if (name === "") {
        search_result.style.display = "none";
      }

      let res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=5faa3dce078012aba85480ef307491ad&language=en-US&page=1&include_adult=false&query=${name}`
      );

      let search_res = await res.json();

      let search_data = search_res.results;

      return search_data;
    } catch (error) {
      console.log("error:", error);
    }
  }

  function search_show(data) {
    search_result.style.display = "flex";
    search_result.innerText = null;
    data.map(function (el) {
      let name_p = document.createElement("p");
      name_p.innerText = el.original_title;
      name_p.addEventListener("click", function () {
        localStorage.setItem("movie_id", JSON.stringify(el.id));
        window.location.href = "Movie.html";
      });
      search_result.append(name_p);
    });
  }

  async function main() {
    try {
      let search_d = await search_fetch();

      if (search_d === undefined) {
        return false;
      }
      console.log("search_d:", search_d);

      search_show(search_d);
    } catch (error) {
      console.log("error:", error);
    }
  }

  let timeout;
  search.addEventListener("focus", main);
  b.addEventListener("focusout",function(){
    setTimeout( function(){
      search_result.style.display = "none"
    }, 100);
   
  })

 function foo(x) {
  console.log(x)
}
  //   
  // }
  search.addEventListener("input", function () {

    if (timeout) {
      clearTimeout(timeout);
    }

    // console.log('timeout:', timeout)

    timeout = setTimeout(function () {
      main();
    }, 1000);
    
  });

  //Trending sort
  trending_sort.addEventListener("change", sortby);
  let trend = "day";
  function sortby() {
    if (trending_sort.value === "day") {
      console.log("trending_sort:", trending_sort.value);
      trend = "day";
      trending_func();
    } else if (trending_sort.value === "week") {
      console.log("trending_sort:", trending_sort.value);
      trend = "week";
      trending_func();
    }
  }

  //All url
  let omdb = `https://www.omdbapi.com/?s=${name}&apikey=a3df8c0f&plot=full`;
  let trending = `https://api.themoviedb.org/3/trending/movie/${trend}?api_key=5faa3dce078012aba85480ef307491ad`;
  let id;
  let acter = `https://api.themoviedb.org/3/person/${id}?api_key=5faa3dce078012aba85480ef307491ad&language=en-US`;
  let genre = `https://api.themoviedb.org/3/genre/movie/list?api_key=5faa3dce078012aba85480ef307491ad&language=en-US`;
  let credits = `https://api.themoviedb.org/3/movie/299534/credits?api_key=5faa3dce078012aba85480ef307491ad&language=en-US`;

  trending_func();

  //Whole of Trending data fetch
  async function trending_func() {
    try {
      let trending = `https://api.themoviedb.org/3/trending/movie/${trend}?api_key=5faa3dce078012aba85480ef307491ad`;

      let genre_res = await fetch(genre);

      let res = await fetch(trending);

      let trending_data = await res.json();

      let genre_data = await genre_res.json();

      console.log("trending_data:", trending_data);

      console.log("trending_data:", trending_data.results);

      trending_append(trending_data.results, genre_data.genres);
    } catch (error) {
      console.log("error:", error);
    }
  }

  //Appending all Trending movies
  function trending_append(data, genre_data) {
    no_result.innerText = null;

    container.innerText = null;

    data.map(function (el) {
      let div = document.createElement("div");
      div.setAttribute("class", "movie_div");
      div.addEventListener("click", function () {
        localStorage.setItem("movie_id", JSON.stringify(el.id));
        window.location.href = "Movie.html";
      });

      let img = document.createElement("img");
      if (el.Poster != "N/A") {
        img.src = `https://image.tmdb.org/t/p/w500` + el.poster_path;
      } else {
        img.src =
          "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id1138179183?k=20&m=1138179183&s=612x612&w=0&h=iJ9y-snV_RmXArY4bA-S4QSab0gxfAMXmXwn5Edko1M=";
      }

      title_div = document.createElement("div");
      let title_w = document.createElement("p");
      let title = document.createElement("p");
      title.style.fontSize = "15px";
      title.style.height = "fit-content"
      if (el.original_title === undefined) {
        title.innerText = el.original_name;
      } else {
        title.innerText = el.original_title;
      }
      title_div.append(title_w, title);

      let date_div = document.createElement("div");
      let date_w = document.createElement("p");

      let date = document.createElement("p");
      date.style.fontSize = "12px";
      date.innerText = el.release_date;
      date_div.append(date_w, date);
      let genre_div = document.createElement("div");
      let genre_w = document.createElement("p");
      let genre = document.createElement("p");
      genre.style.fontSize = "12px";
      var arr = [];
      el.genre_ids.map(function (elem) {
        for (var i = 0; i < genre_data.length; i++) {
          if (genre_data[i].id == elem) {
            arr.push(genre_data[i].name);
          }
        }
        genre.innerText = arr.join(", ");
      });
      genre_div.append(genre_w, genre);

      div.append(img, title_div, date_div, genre_div);
      container.append(div);
    });
  }
}

function movies_page(id) {
  let container = document.getElementById("container_div");
  let b = document.getElementById("bacground_div");

  more_details(id);

  async function more_details(id) {
    try {
      let ids = `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=5faa3dce078012aba85480ef307491ad`;

      let res = await fetch(ids);

      let ids_data = await res.json();

      let imdb_id = ids_data.imdb_id;

      let omdb = `https://www.omdbapi.com/?i=${imdb_id}&apikey=a3df8c0f&plot=full`;

      let res1 = await fetch(omdb);

      let movie = await res1.json();

      let themoviedb_details = `https://api.themoviedb.org/3/movie/${imdb_id}?api_key=5faa3dce078012aba85480ef307491ad&language=en-US`;

      let res2 = await fetch(themoviedb_details);

      let details_themoviedb = await res2.json();

      let credits = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=5faa3dce078012aba85480ef307491ad&language=en-US`;

      let res3 = await fetch(credits);

      let all_cast = await res3.json();
      // console.log("all_cast:", all_cast);
      console.log("all_cast:", all_cast.cast);

      movie_imdb_append(movie, details_themoviedb);
      cast_details(all_cast.cast);
    } catch (error) {
      console.log("error:", error);
    }
  }

  function movie_imdb_append(movie_data1, movie_data2) {
    console.log("details_themoviedb2:", movie_data2);

    console.log("movie_data1:", movie_data1);

    let backdrop =
      `https://image.tmdb.org/t/p/original` + movie_data2.backdrop_path;
    b.style.background = "url(" + backdrop + ")center / cover no-repeat";

    let img_div = document.createElement("div");
    let img = document.createElement("img");

    img.src = "https://image.tmdb.org/t/p/w300" + movie_data2.poster_path;

    img_div.append(img);


    let title = document.createElement("h1");
    title.style.fontSize = "50px";
    title.innerText = movie_data1.Title;

    let info_div = document.createElement("div")
    info_div.setAttribute("id","info_div")

    let genre_div = document.createElement("div")
    let arr = [];
    for(var i=0;i<movie_data2.genres.length;i++){
      arr.push(movie_data2.genres[i].name)
    }
    let genre_w = document.createElement("h2")
    genre_w.innerText = "Gnere"
    let genre_p = document.createElement("p")
    genre_p.innerText = arr.join(", ")
    genre_div.append(genre_w,genre_p)

    let release_div = document.createElement("div")
    let release_w = document.createElement("h2")
    release_w.innerText = "Release Date"
    let release = document.createElement("p")
    release.innerText = movie_data1.Released
    release_div.append(release_w,release)

    let runtime_div = document.createElement("div")
    let runtime_w = document.createElement("h2")
    runtime_w.innerText = "Runtime"
    let runtime = document.createElement("p")
    runtime.innerText = movie_data1.Runtime
    runtime_div.append(runtime_w,runtime)

    let language_div = document.createElement("div")
    let language_w = document.createElement("h2")
    language_w.innerText = "Language"
    let language = document.createElement("p")
    language.innerText = movie_data1.Language
    language_div.append(language_w,language)

    let metasore_div = document.createElement("div")
    let metasore_w = document.createElement("h2")
    metasore_w.innerText = "Metasore"
    let metasore = document.createElement("p")
    metasore.innerText = movie_data1.Metascore
    metasore_div.append(metasore_w,metasore)

    info_div.append(language_div,runtime_div,release_div,genre_div,metasore_div)





    let ratings_div = document.createElement("div")
    ratings_div.style.gridTemplateColumns = `repeat(${movie_data1.Ratings.length+1},1fr)`;
    ratings_div.setAttribute("id","ratings_div")
    for(var a=0;a<movie_data1.Ratings.length;a++){
      if(a==0){
        let h2 = document.createElement("h2")
        let p = document.createElement("h3")
        let innerdiv = document.createElement("div")
        h2.innerText = "IMDB"
        p.innerText = movie_data1.imdbRating
        innerdiv.append(h2,p)
        ratings_div.append(innerdiv)
      }
      let h2 = document.createElement("h2")
      let p = document.createElement("h3")
      let innerdiv = document.createElement("div")

        h2.innerText = movie_data1.Ratings[a].Source
        p.innerText = movie_data1.Ratings[a].Value
        innerdiv.append(h2,p)
        ratings_div.append(innerdiv)
    }

    
  

    let overview_div = document.createElement("div");
    overview_div.setAttribute("id","overview")
    let overview_w = document.createElement("h3")
    overview_w.innerText = "Overview"
    let overview = document.createElement("p");
    overview.innerText = movie_data2.overview;
    overview_div.append(overview_w,overview);

    let plot_div = document.createElement("div");
    plot_div.setAttribute("id","plot")
    let plot_w = document.createElement("h3")
    plot_w.innerText = "Plot"
    let plot = document.createElement("p");
    plot.innerText = movie_data1.Plot;
    plot_div.append(plot_w,plot);

    let cast_heading = document.createElement("h2")
    cast_heading.innerText = "Cast"

    container.append(img_div, title, info_div, ratings_div, overview_div, plot_div,cast_heading);
  }

  let cast_container = document.createElement("div")
  cast_container.setAttribute("id","cast_container")


  function cast_details(cast) {
    console.log('cast:', cast)
    for(var i=0;i<12;i++){
    let div = document.createElement("div")
    let pic = document.createElement("div")
    let img = document.createElement("img")
    if(cast[i].profile_path!=undefined){
    img.src = `https://image.tmdb.org/t/p/w300` + cast[i].profile_path
    }else{
      img.src = `data:image/jpeg;base64,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`
    }
    pic.append(img)

    let name = document.createElement("h3")
    name.innerText = cast[i].original_name

    let char = document.createElement("p")
    char.innerText = "Role of  "+cast[i].character

    div.append(pic,name,char)
    cast_container.append(div)
    if(i==11){
      container.append(cast_container)
    }
    }
  }
}


let back_btn = document.getElementById("go_back")

back_btn.addEventListener("click",function(){
  window.location.href = "index.html"
})
