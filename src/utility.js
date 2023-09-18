function generateRandom() {
  return Math.floor(Math.random() * 10)
}

function getStr(main) {
  if (main === "Clouds") return "cloudy+weather"
  if (main === "Rain") return "rain"
  if (main === "Mist") return "misty"
  if (main === "Haze") return "haze"
  if (main === "Clear") return "clear+sky"
  if (main === "Thunderstorm") return "thunderstorm"
  if (main === "Drizzle") return "drizzle"
  if (main === "Smoke") return "smoky+weather"
  if (main === "Dust" || main === "Sand") return "dusty+weather"
  if (main === "Fog") return "fog"
  return "nature"
}

export { generateRandom, getStr }
