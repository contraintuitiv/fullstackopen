import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({handleChange}) => <div><input onChange={handleChange} /></div>
const Countries = ({countries, handleShowClick}) => {
  if(countries.length>10){
    return(<p>Too many matches, be more specific</p>)
  }else if(countries.length===1){
    return(<SingleCountry country={countries[0]} />)
  }
  
  return(
    <div>{countries.map((country) => <Country key={country.name.common} name={country.name.common} handleShowClick={handleShowClick} />)}</div>
  )
}
const Country = ({name, handleShowClick}) => <div><p>{name} <button onClick={handleShowClick} value={name}>show</button></p></div>
const SingleCountry = ({country}) => {
  const [weather, setWeather] = useState({temp: '', pic: '', wind: ''})

  useEffect( () => {
    axios
    .get(`http://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[0]}&units=metric&appid=${process.env.REACT_APP_API_KEY_WEATHER}`)
    .then ( (response) => {
      setWeather(
      {temp: response.data.main.temp,
       icon: `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`,
       wind: response.data.wind.speed,
      }
      )

      console.log('weather', response.data)
      }
    )
  }, []
  )

  return (
  <div>
    
    <p>capital: {country.capital}</p>
    <p>area: {country.area}</p>
    <h3>languages</h3>
    <ul>
      {Object.values(country.languages).map( (language, index) => <li key={index}>{language}</li> )}
    </ul>
    <img src={country.flags.png} alt="flag of the country" />

    <h3>weather</h3>

    <Weather weather={weather} />
    
  </div>
  )
}

const Weather = ({weather}) => (
<div>
  <p>temperature: {weather.temp}°C</p>
  <p><img src={weather.icon} alt="icon which shows the weather" /></p>
  <p>wind: {weather.wind} m/s</p>
</div>
)


const App = () => {
  const [countries, setCountries] = useState([])
  const [shownCountries, setShownCountries] = useState([])
  const [filter, setFilter] = useState('b')

  useEffect( () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then( (response) => {
        console.log('response.data', response.data)
        setCountries(response.data)
       }
      )
  }, [])

  const handleFilterChange = (event) => {    
    setFilter(event.target.value)

    setShownCountries( countries.filter(
      (country) => country.name.common.toLowerCase().includes(filter.toLocaleLowerCase())
    )
    )
  }

  const handleShowClick = (event) => {
    const shownCountry = []
    shownCountry.push(countries.find(
      (country) => country.name.common===event.target.value)
    )
    setShownCountries ( shownCountry )

    console.log(shownCountries)
 
  }



  return (
    <div>
      <Filter handleChange={handleFilterChange} />
      <Countries countries={shownCountries} handleShowClick={handleShowClick} />
    </div>
  );
}

export default App;
