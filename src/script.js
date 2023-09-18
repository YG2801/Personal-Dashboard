import { generateRandom, getStr } from "./utility.js"
import {
  NINJA_API_KEY,
  NEWS_API_KEY,
  UNSPLASH_API_KEY,
  WEATHER_API_KEY,
} from "../api.js"

const tempEl = document.getElementById("temp-main")
const inputEl = document.getElementById("city-name-input")
const submitBtn = document.getElementById("city-name-submit")
const weatherIconEl = document.getElementById("weather-icon")
const mainBgEl = document.getElementById("main-bg")
const photoAuthorEl = document.getElementById("photo-author")
const cardArrowEl = document.getElementById("card-arrow")
const newsSectionEl = document.getElementById("news-section")
const weatherCardEl = document.getElementById("weather-card")

let lat
let lon

function getQuote() {
  fetch("https://api.api-ninjas.com/v1/quotes?category=inspirational", {
    method: "GET",
    headers: {
      "X-Api-Key": `${NINJA_API_KEY}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw Error("Something went wrong in Quotes section!")
      } else {
        return response.json()
      }
    })
    .then((data) => {
      if (data[0].quote.split(" ").length > 20) {
        throw Error("Quote exceeding length!")
      } else {
        document.getElementById("quote").textContent = `"${data[0].quote}"`
        document.getElementById(
          "quote-author"
        ).textContent = `- ${data[0].author}`
      }
    })
    .catch((err) => {
      console.log(err)
      document.getElementById("quote").textContent =
        " The purpose of our lives is to be happy "
      document.getElementById("quote-author").textContent = "- Dalai Lama"
    })
}

function getTime() {
  const t = new Date()
  let hr = t.getHours()
  let min = t.getMinutes()
  if (hr < 10) hr = `0${hr}`
  if (min < 10) min = `0${min}`
  document.getElementById("time").textContent = `${hr}:${min}`
  setInterval(() => {
    const t = new Date()
    let hr = t.getHours()
    let min = t.getMinutes()
    if (hr < 10) hr = `0${hr}`
    if (min < 10) min = `0${min}`
    document.getElementById("time").textContent = `${hr}:${min}`
  }, 1000)
}

function getCrypto() {
  fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin%2Cbitcoin%2Cdogecoin%2Cethereum%2Cripple&vs_currencies=usd"
  )
    .then((resp) => {
      if (!resp.ok) {
        throw Error("Something went wrong with Crypto section!")
      } else {
        return resp.json()
      }
    })
    .then((data) => {
      document.getElementById("crypto-section").innerHTML = `
          <p class="text-outline-light text-xl font-semibold text-yellow-200">
            🎯 BNB : $${data.binancecoin.usd}
          </p>
          <p class="text-outline-light text-xl font-semibold text-yellow-200">
            🎯 Bitcoin : $${data.bitcoin.usd}
          </p>
          <p class="text-outline-light text-xl font-semibold text-yellow-200">
            🎯 Dogecoin : $${data.dogecoin.usd}
          </p>
          <p class="text-outline-light text-xl font-semibold text-yellow-200">
            🎯 Ethereum : $${data.ethereum.usd}
          </p>
          <p class="text-outline-light text-xl font-semibold text-yellow-200">
            🎯 XRP : $${data.ripple.usd}
          </p>
      `
    })
    .catch((err) => {
      console.log(err)
      document.getElementById("crypto-section").innerHTML = ""
    })
}

function getNews() {
  fetch(
    `https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey=${NEWS_API_KEY}`
  )
    .then((resp) => {
      if (!resp.ok) {
        throw Error("Something went wrong with News section!")
      } else {
        return resp.json()
      }
    })
    .then((data) => {
      const newsHtml = data.articles
        .map((obj) => {
          return `
        <div class="mb-2 p-2 bg-gray-900/60 hover:bg-gray-900/80">
          <a
            href=${obj.url}
            target="_blank"
          >
            <img
              src=${obj.urlToImage}
              alt=""
              class="w-[100%] bg-cover"
            />
            <h4 class="text-xl font-semibold tracking-wider transition-all p-4">
              ${obj.title}
            </h4>
            <p class="ml-4">${obj.author}</p>
          </a>
        </div>
        `
        })
        .join("")
      document.getElementById("news-cards").innerHTML = newsHtml
    })
    .catch((err) => {
      console.log(err)
      document.getElementById(
        "news-cards"
      ).innerHTML = `<p class="text-2xl font-semibold leading-10">No Data Available</p>`
    })
}

function getImage(str) {
  const index = generateRandom()
  fetch(
    `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_API_KEY}&page=1&query=${str}&orientation=landscape`
  )
    .then((resp) => {
      if (!resp.ok) {
        throw Error("Something went wrong with Image section!")
      } else {
        return resp.json()
      }
    })
    .then((data) => {
      mainBgEl.style.backgroundImage = `url("${data.results[index].urls.regular}")`
      photoAuthorEl.textContent = `Photo By : ${data.results[index].user.name}`
    })
    .catch((err) => {
      console.log(err)
      mainBgEl.style.backgroundImage = `url("")`
      photoAuthorEl.textContent = ``
    })
}

function getWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric
    `
  )
    .then((resp) => {
      if (!resp.ok) {
        throw Error("Something went wrong with Weather section!")
      } else {
        return resp.json()
      }
    })
    .then((data) => {
      weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      tempEl.innerHTML = `${data.main.temp} °C`
      weatherCardEl.innerHTML = `
        <p class="text-outline-light text-xl font-semibold leading-10"><i class="fa-solid fa-temperature-arrow-down" style="color: #e9eaed"></i> Min Temp : ${data.main.temp_min} °C</p>
        <p class="text-outline-light text-xl font-semibold leading-10"><i class="fa-solid fa-temperature-arrow-up" style="color: #e9eaed"></i> Max Temp : ${data.main.temp_max} °C</p>
        <p class="text-outline-light text-xl font-semibold leading-10"><i class="fa-solid fa-temperature-three-quarters" style="color: #e9eaed"></i> Feels Like : ${data.main.feels_like} °C</p>
        <p class="text-outline-light text-xl font-semibold leading-10"><i class="fa-solid fa-droplet" style="color: #e9eaed"></i> Humidity : ${data.main.humidity}%</p>
      `
      let str = getStr(data.weather[0].main)
      getImage(str)
    })
    .catch((err) => {
      console.log(err)
      tempEl.textContent = `? °C`
      weatherIconEl.src = ""
      mainBgEl.style.backgroundImage = `url("")`
      photoAuthorEl.textContent = ``
      weatherCardEl.innerHTML = `<p class="text-2xl font-semibold leading-10">No Data Available</p>`
    })
}

function getCoordinates(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`
  )
    .then((resp) => {
      if (!resp.ok) {
        throw Error("Something went wrong with getting Coordinates!")
      } else {
        return resp.json()
      }
    })
    .then((data) => {
      lat = data[0].lat
      lon = data[0].lon
      getWeather()
    })
    .catch((err) => {
      console.log(err)
      tempEl.textContent = `? °C`
      weatherIconEl.src = ""
      mainBgEl.style.backgroundImage = `url("")`
      photoAuthorEl.textContent = ``
      weatherCardEl.innerHTML = `<p class="text-2xl font-semibold leading-10">No Data Available</p>`
    })
}

function getCity() {
  const city = inputEl.value.toLowerCase().trim()
  inputEl.value = ""
  if (city) {
    getCoordinates(city)
  }
}

submitBtn.addEventListener("click", () => {
  getCity()
})

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getCity()
  }
})

cardArrowEl.addEventListener("click", () => {
  weatherCardEl.classList.toggle("show-card")
  if (cardArrowEl.classList.contains("fa-chevron-down")) {
    cardArrowEl.classList.remove("fa-chevron-down")
    cardArrowEl.classList.add("fa-chevron-up")
  } else {
    cardArrowEl.classList.remove("fa-chevron-up")
    cardArrowEl.classList.add("fa-chevron-down")
  }
})

document
  .getElementById("news-section-open-icon")
  .addEventListener("click", () => {
    newsSectionEl.classList.add("show-news-section")
    newsSectionEl.scrollTop = 0
  })

document
  .getElementById("news-section-close-icon")
  .addEventListener("click", () => {
    newsSectionEl.classList.remove("show-news-section")
  })

mainBgEl.addEventListener("click", (e) => {
  if (e.target.id != "card-arrow" && e.target.id != "news-section-open-icon") {
    weatherCardEl.classList.remove("show-card")
    cardArrowEl.classList.remove("fa-chevron-up")
    cardArrowEl.classList.add("fa-chevron-down")
    newsSectionEl.classList.remove("show-news-section")
  }
})

// Rendering Data
getQuote()
getTime()
getCrypto()
getNews()
navigator.geolocation.getCurrentPosition(
  (position) => {
    lat = position.coords.latitude
    lon = position.coords.longitude
    if (lat && lon) {
      getWeather()
    }
  },
  () => {
    alert("Please give Location Access!\nIf provided reload the page")
  }
)
