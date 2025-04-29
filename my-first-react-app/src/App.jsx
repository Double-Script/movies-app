// import {useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'
import React, {useEffect, useState } from "react"
import Search from "./assets/Components/Search.jsx"
import Spinner from "./assets/Components/Spinner.jsx";
import MovieCard from "./assets/Components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";


const API_BASE_URL='https://api.themoviedb.org/3';

const API_KEY= import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

// useEffect(effect: ()=>{

// }, deps:[]);

const App=()=> {
  // const [count, setCount] = useState(0)
  const[searchTerm, setSearchTerm] = useState('');
  const[errorMessage, setErrorMessage] = useState('')
  const[moviesList, setMoviesList] = useState([]);
  const[isLoading, setIsLoading]= useState(false);
  const[debouncedSearchTerm,setDebouncedSearchTerm] = useState('');
  const[TrendingMovies, setTrendingMovies] = useState([]);

useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies=async(query= '')=>{
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      // alert(response);
    if(!response.ok){
      throw new Error('failed to fetch movies');
    }
    const data = await response.json();
    if(data.Response == 'false'){
      setErrorMessage(data.Error  || 'failed to fetch movies');
      setMoviesList([]);
      return;
    }
    setMoviesList(data.results || []);

    if (query && data.results.length > 0) {
      await updateSearchCount(query,data.results[0]);
    }
    } catch (error) {
      console.error(`error ocurd during fetching movies: ${error}`)
      setErrorMessage('Error fetching movies please try again later.');
    }finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  },[debouncedSearchTerm]);
  // const[]
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
        <img src="hero.png" alt="hero banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {TrendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending movies</h2>
            <ul>
              {TrendingMovies.map((movie, index)=> (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 >All movies</h2>

          {isLoading ? (
            <Spinner />
          ): errorMessage ?(
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
            {moviesList.map((movie) =>(
              <MovieCard key={movie.id} movie={movie} />
            ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
