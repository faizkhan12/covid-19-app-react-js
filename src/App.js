import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import "./App.css"
import InfoBox from "./Component/InfoBox"
import LineGraph from "./Component/LineGraph"
import Map from "./Component/Map"
import Table from "./Component/Table"
import { sortData } from "./util"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  // initial get all data from worldwide
  const getInitialData = async () => {
    try {
      const response = await fetch("https://disease.sh/v3/covid-19/all")
      const data = await response.json()
      setCountryInfo(data)
    } catch (err) {}
  }

  useEffect(() => {
    getInitialData()
  }, [])

  const getCountriesData = async () => {
    try {
      const response = await fetch("https://disease.sh/v3/covid-19/countries")
      const data = await response.json()
      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }))
      const sortedData = sortData(data)
      setTableData(sortedData)
      setCountries(countries)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getCountriesData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    const response = await fetch(url)
    const data = await response.json()

    setCountry(countryCode)
    setCountryInfo(data)
    console.log(countryInfo)
  }
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app_header'>
          <h1>Coronavirus Tracker </h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {/* Loop throught the entire countries */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Header */}
        </div>
        <div className='app__stats'>
          <InfoBox
            title='Cases'
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title='Recovered'
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title='Deaths'
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Covid Cases Update </h3>
          <Table countries={tableData} />
          <h3>WorldWide new cases </h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
