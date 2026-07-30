import './style.css'


// load the saved wallpaper

function wallpaperColorCheck(image){
  const img = new Image();

  img.onload = () => {
    // makes the image a canvas and checks for the pixel brightness
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // canvas.width = img.width;
    // canvas.height = img.height;

    // ctx.drawImage(img, 0, 0);

    //Scaled down so its easier
    canvas.width = 50;
    canvas.height = 50;

    ctx.drawImage(img, 0, 0, 50, 50);

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let total = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      total += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    }

    const brightness = total / (pixels.length / 4);
    // console.log(brightness);
    document.body.classList.remove("light-text", "dark-text");
    if (brightness < 128) {
      document.body.classList.add("light-text");
    } else {
      document.body.classList.add("dark-text");
    }
  };

  img.src = image;

};

const savedWallpaper = localStorage.getItem("customWallpaper");

if (savedWallpaper) {
    document.body.style.backgroundImage = `url(${savedWallpaper})`;
    wallpaperColorCheck(savedWallpaper);
};



function screenClose(element) {
  element.style.display = "none";

};
function screenOpen(element) {
  element.style.display = "flex";
  //   element.classList.remove('fade');

};

// ----------
// Time
// ----------
function updateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const time = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit"

  });
  // var currentTime = new Date().toLocaleString();
  // var timeText = document.querySelector("#timeElement");
  // timeText.innerHTML = currentTime
  document.querySelector("#timeElement").innerHTML = `${time}`
  document.querySelector("#date").innerHTML = `${date}`
};
updateTime();
setInterval(updateTime, 1000);


// ------------------------
// Bookmark logic and stuff
// ------------------------

const bookmarkMaker = document.querySelector("#bookmarkMaker");
const bookmarkCreate = document.querySelector("#createBook");
const urlInput = document.querySelector("#urlinput");
const nameInput = document.querySelector("#nameInput");
const submitBk = document.querySelector("#addmark");
const bookmarksContainer = document.querySelector("#bookmarks"); // Targets your buttons div
const cancelBook = document.querySelector("#cancelmark");
const createContainer = document.querySelector("#createContainer");

// const logoUrl = `https://google.com{urlInput}&sz=64`;
// const imgHtml = `<img src="${logoUrl}"/>`;



//making array
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
// let bookmarks = [];
// localStorage.removeItem("bookmarks");

bookmarkCreate.addEventListener('click', function () {
  screenOpen(bookmarkMaker);
});
cancelBook.addEventListener('click', function () {
  screenClose(bookmarkMaker);
});

//add the new bookmarks
function showBookmarks() {

  const oldLinks = bookmarksContainer.querySelectorAll('.dynamic-bookmark');
  oldLinks.forEach(link => link.remove());


  bookmarks.forEach((item, index) => {

    //creates a new bookmark
    const newButton = document.createElement('a');
    newButton.href = item.url;
    newButton.target = "_blank";
    //text for new bookmark
    const text = document.createElement("span");
    text.textContent = item.name;
    text.style.fontFamily = "Nunito";
    text.id = "bookmarktext";
    text.style.fontSize = "20px";
    const deleteBtn = document.createElement('button');
    //adds the delete button for the bookmark
    deleteBtn.classList.add('deleteBtn');
    const deleteimg = document.createElement('img');
    deleteimg.src = `${import.meta.env.BASE_URL}assets/red-trash-can-icon.png`;

    // deleteimg

    deleteBtn.appendChild(deleteimg);


    newButton.classList.add('dynamic-bookmark');
    const img = document.createElement("img");

    img.classList.add('bookimg');
    const domain = new URL(item.url).hostname;

    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    // const text = document.createElement("span");
    // text.textContent = item.name;

    deleteBtn.addEventListener('click', function (e) {
      e.preventDefault(); // doesnt open bookmark
      e.stopPropagation();
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      showBookmarks();
    })

    //append each new element to the bookmark
    newButton.append(deleteBtn);
    newButton.append(img);
    newButton.append(text);
    // newButton.append(deleteBtn);
    //Adds the new bookmark before the create bookmark button
    bookmarksContainer.insertBefore(newButton, createContainer);
  });
}


submitBk.addEventListener('click', function (e) {

  if (!nameInput.value || !urlInput.value) {
    return alert("Please fill both fields!");
  }
  let urla = urlInput.value.trim();

  if (!urla.startsWith("http://") && !urla.startsWith("https://")) {
    urla = "https://" + urla;
  }
  const newBook = {
    name: nameInput.value,
    url: urla
  };

  bookmarks.push(newBook);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  // console.log(localStorage.getItem("bookmarks"));


  showBookmarks();
  screenClose(bookmarkMaker);


  nameInput.value = "";
  urlInput.value = "";
});


showBookmarks();

// ------------
// APOD Stuff,
// ------------
const apodDisplay = document.getElementById("apoddisplay");
const apodTitle = document.getElementById("apodtitle");
const apodinfo = document.getElementById("info");
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const videoApod = document.getElementById("apodvideo");

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const apodurl = data.url;
    console.log(data);
    if (data.media_type === "video") {
      apodDisplay.style.display = "none";
      videoApod.style.display = "flex";
      videoApod.src = apodurl;
    } else {
      videoApod.style.display = "none";
      apodDisplay.style.display = "flex";
      apodDisplay.style.backgroundImage = `url(${apodurl})`;

    }

    apodinfo.innerHTML = data.explanation;
    apodTitle.innerHTML = data.title;
    apodDisplay.innerHTML = "";
  })
  .catch(error => {
    console.error(error);
  });


// ----------
// Timer stuff
// ----------
const hour = document.getElementById("hour");
const min = document.getElementById("min");
const sec = document.getElementById("sec");
const start = document.getElementById("start");
const reset = document.getElementById("reset");
const pause = document.getElementById("pause");

let countdown;
let totalSeconds = 0;
let timeLeft = 0;
// let resume = true;
let isPaused = false;

function startTime() {
  let h = parseInt(hour.value) || 0;
  let m = parseInt(min.value) || 0;
  let s = parseInt(sec.value) || 0;

  //create timeleft first
  if (timeLeft === 0) {
    totalSeconds = (h * 3600) + (m * 60) + (s)
    timeLeft = totalSeconds;
  }



  hour.value = h;
  min.value = m;
  sec.value = s;


  if (totalSeconds == 0) {
    bar.style.width = "0%";
    alert("Please enter a value in at least on of the input fields!");
    console.log("Please enter a value.");
    

    return;
  }
  else if (totalSeconds > 0) {
    if (!isPaused) {
      clearInterval(countdown)
      countdown = setInterval(() => {

        // s--;
        timeLeft--;
        //changes the bar width based on time
        var percent = (timeLeft / totalSeconds) * 100;
        bar.style.width = percent + "%";
        if (percent == 0) {
          bar.style.width = "0%";

        };

        //this basically converts everything back into correct time format so 100sec becomes 1 min 40 sec
        h = Math.floor(timeLeft / 3600);
        m = Math.floor((timeLeft % 3600) / 60);
        s = timeLeft % 60;

        hour.value = h;
        min.value = m;
        sec.value = s;

        if (h === 0 && m === 0 && s === 0) {
          clearInterval(countdown);

        };

      }, 1000);
    } else if (isPaused) {
      console.log("paused")
    }
  };
};


start.addEventListener('click', function () {
  // bar.style.width = "100%";

  isPaused = false;
  startTime();
});
reset.addEventListener('click', function () {
  clearInterval(countdown);
  totalSeconds = 0;
  timeLeft = 0;
  isPaused = false;
  hour.value = 0;
  min.value = 0;
  sec.value = 0;
  bar.style.width = "100%";
});
pause.addEventListener('click', function () {
  clearInterval(countdown);
  isPaused = true;
})

// -------------
// Weather Stuff
// -------------

async function getWeather() {
  navigator.geolocation.getCurrentPosition(success, error);

  async function success(position) {
    try {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // Build weather URL
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}` +
        `&longitude=${lon}` +
        `&current=temperature_2m,wind_speed_10m,is_day,wind_direction_10m,precipitation,rain,showers,snowfall,cloud_cover,weather_code` +
        `&temperature_unit=fahrenheit` +
        `&wind_speed_unit=mph` +
        `&timezone=auto` +
        `&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code` +
        `&models=ecmwf_ifs`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      const sunrise = weatherData.daily.sunrise[0].split("T")[1];
      const sunset = weatherData.daily.sunset[0].split("T")[1];
      const temperature = weatherData.current.temperature_2m;
      const windspeed = weatherData.current.wind_speed_10m;
      const high = weatherData.daily.temperature_2m_max[0];
      const low = weatherData.daily.temperature_2m_min[0];
      const winddirect = weatherData.current.wind_direction_10m;
      const perceptprob = weatherData.daily.precipitation_probability_max[0];
      const perceptprobtmr = weatherData.daily.precipitation_probability_max[1];
      const rainsum = weatherData.daily.precipitation_sum[0];
      let day = "";
      let dayhigh = 0;
      const codeb = weatherData.current.weather_code;
      const isDay = weatherData.current.is_day;
      const iconb = weatherIcon(codeb, isDay);
      const localTime = new Date().toLocaleTimeString("en-US", {
        timeZone: weatherData.timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

      function weatherIcon(code, is_day) {
        switch (code) {
          case 0:
            return is_day
              ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/clear-day.svg"
              : "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/clear-night.svg";
          case 1:
          case 2:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/mostly-clear-day.svg";
          case 3:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/overcast.svg";
          case 45:
          case 48:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/fog.svg";
          case 51:
          case 53:
          case 55:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/drizzle.svg";
          case 56:
          case 57:
          case 66:
          case 67:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/sleet.svg";
          case 61:
          case 63:
          case 65:
          case 80:
          case 81:
          case 82:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/rain.svg";
          case 71:
          case 73:
          case 75:
          case 77:
          case 85:
          case 86:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/snow.svg";
          case 95:
          case 96:
          case 99:
            return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/thunderstorms-overcast-rain.svg";
          default:
            return "..."

        }
      }





      console.log(`Temperature: ${weatherData.current.temperature_2m}°F`);
      console.log(`Wind: ${weatherData.current.wind_speed_10m} mph`);
      console.log(`Daytime: ${weatherData.current.is_day ? "Yes" : "No"}`);
      console.log(`Local Time: ${localTime}`);


      // console.log(`Sunrise: ${sunrise.split("T")[1]}`);
      // console.log(`Sunset: ${sunset.split("T")[1]}`);
      document.getElementById("sunrise").innerHTML = `🌅Sunrise: <strong>${sunrise}`;
      document.getElementById("sunset").innerHTML = `🌇Sunset: <strong>${sunset}`;

      document.getElementById("currentIcon").src = iconb;

      document.getElementById("currenttemp").innerHTML = `<strong>${temperature}°F`;

      document.getElementById("maxtemp").innerHTML = `High: ${high}°F`;
      document.getElementById("mintemp").innerHTML = `Low : ${low}°F`;

      document.getElementById("perceptprob").innerHTML = `🌧️Chance of Rain: <strong>${perceptprob}%`;

      document.getElementById("rainsum").innerHTML = `Total Precipitation: <strong>${rainsum}mm`;


    } catch (error) {
      console.error(error);
    }
  }



  function error() {
    alert("Location permission denied.");
    document.getElementById("currenttemp").innerHTML = "Location permission denied";
    document.getElementById("currenttemp").style.fontSize = "15px";
    document.getElementById("currenttemp").style.marginLeft = "-40px";
    document.getElementById("currenttemp").style.marginTop = "10px";
    document.getElementById("currentIcon").style.visibility = "hidden";
  }
}

getWeather();

// document.getElementById("searchBtn").addEventListener("click", function(){
//     const city = document.getElementById("cityInput").value.trim();

//     if (city) {
//         getWeather(city);
//     }
// });

// --------------
// Flight Tracker
// --------------


const FLIGHT_API_KEY = import.meta.env.VITE_AIRLAB_API_KEY;



const flightInput = document.getElementById("flightInput");
const findFlight = document.getElementById("findflight");
const aircraftmodel = document.getElementById("aircraftmodel");
const airlines = document.getElementById("airlines");
const arrival = document.getElementById("arrival");
const depart = document.getElementById("depart");
const departCity = document.getElementById("departcity");
const arriveCity = document.getElementById("arrivecity");
const departtime = document.getElementById("departtime");
const arrivaltime = document.getElementById("arrivaltime");
const status = document.getElementById("status");
const collapse = document.getElementById("collapse");
let isCollapse = true;

findFlight.addEventListener('click', function () {
  const flightNumber = flightInput.value.trim();

  if (flightNumber) {
    getFlight(flightNumber);
  }
});

collapse.addEventListener('click', function () {
  if (isCollapse == true) {
    document.getElementById("flightinfo").style.visibility = "hidden";
    document.getElementById("flightinfo").style.height = "0px";
    document.getElementById("flightContainer").style.height = "90px";
    collapse.innerHTML = "Expand";
    isCollapse = false;
  }
  else if (isCollapse == false) {
    document.getElementById("flightinfo").style.visibility = "visible";
    document.getElementById("flightinfo").style.height = "190px";
    document.getElementById("flightContainer").style.height = "270px";
    collapse.innerHTML = "Collapse";
    isCollapse = true;
  }
})

async function getFlight(flightNumber) {
  try {
    //fetching data from the API
    const url =
      `https://airlabs.co/api/v9/flight?` +
      `api_key=${FLIGHT_API_KEY}` +
      `&flight_iata=${flightNumber}`;


    const response = await fetch(url);

    const data = await response.json();
    const flight = data.response;
    if (!flight) {
      console.log(data);
      alert("Flight not found");
      return;
    }

    // const aircraftURL =
    // `https://airlabs.co/api/v9/aircraft?` +
    // `api_key=${FLIGHT_API_KEY}` +
    // `&reg_number=${flight.reg_number}`;
    // const responseb = await fetch(aircraftURL);

    // const datab = await responseb.json();
    // console.log("Flight data:", data);
    // console.log("Aircraft data:", datab);
    // const plane = datab.response;

    //fallback for each plane based on icao codes
    const aircraftCodes = {
      //Airbus
      "A318": "Airbus A318",
      "A319": "Airbus A319",
      "A320": "Airbus A320",
      "A20N": "Airbus A320neo",
      "A321": "Airbus A321",
      "A21N": "Airbus A321neo",
      "A332": "Airbus A330-200",
      "A333": "Airbus A330-300",
      "A339": "Airbus A330-900neo",
      "A342": "Airbus A340-200",
      "A343": "Airbus A340-300",
      "A345": "Airbus A340-500",
      "A346": "Airbus A340-600",
      "A359": "Airbus A350-900",
      "A35K": "Airbus A350-1000",
      "A388": "Airbus A380",

      //Boeing 737s
      "B731": "Boeing 737-100",
      "B732": "Boeing 737-200",
      "B733": "Boeing 737-300",
      "B734": "Boeing 737-400",
      "B735": "Boeing 737-500",
      "B736": "Boeing 737-600",
      "B737": "Boeing 737-700",
      "B738": "Boeing 737-800",
      "B739": "Boeing 737-900",
      "B37M": "Boeing 737 MAX 7",
      "B38M": "Boeing 737 MAX 8",
      "B39M": "Boeing 737 MAX 9",
      "B3XM": "Boeing 737 MAX 10",

      //Boeing 747s
      "B741": "Boeing 747-100",
      "B742": "Boeing 747-200",
      "B743": "Boeing 747-300",
      "B744": "Boeing 747-400",
      "B748": "Boeing 747-8",

      //Boeing 757s
      "B752": "Boeing 757-200",
      "B753": "Boeing 757-300",

      //Boeing 767
      "B762": "Boeing 767-200",
      "B763": "Boeing 767-300",
      "B764": "Boeing 767-400",

      //Boeing 777
      "B772": "Boeing 777-200",
      "B77L": "Boeing 777-200LR",
      "B773": "Boeing 777-300",
      "B77W": "Boeing 777-300ER",

      // Boeing 787 Dreamliner
      "B788": "Boeing 787-8 Dreamliner",
      "B789": "Boeing 787-9 Dreamliner",
      "B78X": "Boeing 787-10 Dreamliner",

      // Boeing 717
      "B712": "Boeing 717",

      // Embraer Regional Jets
      "E135": "Embraer ERJ-135",
      "E145": "Embraer ERJ-145",
      "E170": "Embraer E170",
      "E75L": "Embraer E170",
      "E175": "Embraer E175",
      "E190": "Embraer E190",
      "E195": "Embraer E195",
      "E290": "Embraer E190-E2",
      "E295": "Embraer E195-E2",

      // Bombardier / Mitsubishi Regional
      "CRJ1": "Bombardier CRJ-100",
      "CRJ2": "Bombardier CRJ-200",
      "CRJ7": "Bombardier CRJ-700",
      "CRJ9": "Bombardier CRJ-900",
      "CRJX": "Bombardier CRJ-1000",

      // ATR Turboprops
      "AT43": "ATR 42-300",
      "AT45": "ATR 42-500",
      "AT46": "ATR 42-600",
      "AT72": "ATR 72",

      // De Havilland
      "DH8A": "Dash 8-100",
      "DH8B": "Dash 8-200",
      "DH8C": "Dash 8-300",
      "DH8D": "Dash 8 Q400",

      // Smaller private/business aircraft
      "C172": "Cessna 172",
      "C208": "Cessna Caravan",
      "GL5T": "Gulfstream G550",
      "GL7T": "Gulfstream G700",
      "GLEX": "Bombardier Global Express",
      "PC12": "Pilatus PC-12"
    };
    console.log(flight);
    // const arrival = new Date(flight.arr_time_utc.replace(" ", "T") + "Z");
    const now = new Date();
    if (flight.status === "en-route" || flight.status === "landed") {


      if (flight.dep_actual_utc) {
        if (flight.dep_actual_utc) {
          const departureTime = new Date(flight.dep_actual_utc.replace(" ", "T") + "Z");

          const diff = now - departureTime;

          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            departtime.innerHTML = `Departed ${hours}h ${minutes}m ago`;
          } else {
            departtime.innerHTML = "Not departed";
          }

          console.log("Departure:", departureTime.toString());
          console.log("Departure UTC:", departureTime.toISOString());

        } else if (flight.dep_time_utc) {
          const departureTime = new Date(flight.dep_time_utc.replace(" ", "T") + "Z");

          const diff = now - departureTime;

          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            departtime.innerHTML = `Departed ${hours}h ${minutes}m ago`;
          } else {
            departtime.innerHTML = "Not departed";
          }
        } else {
          const departureTime = new Date(flight.dep_time.replace(" ", "T") + "Z");

          const diff = now - departureTime;

          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            departtime.innerHTML = `Departed ${hours}h ${minutes}m ago`;
          } else {
            departtime.innerHTML = "Not departed";
          }
        }
      } else {
        // No actual departure time available.
        departtime.innerHTML = "Departed";
      }
    } else {
      departtime.innerHTML = "Not Departed";
    }


    if (flight.status === "landed") {
      arrivaltime.innerHTML = "Arrived";
    } else {
      if (flight.arr_estimated_utc) {
        const arrivalTime = new Date(flight.arr_estimated_utc.replace(" ", "T") + "Z");

        const diff = arrivalTime - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          arrivaltime.innerHTML = `Landing in ${hours}h ${minutes}m`;
        } else {
          arrivaltime.innerHTML = "Arrived";
        }

        // console.log("Arrival:", arrivalTime.toString());
        // console.log("Arrival UTC:", arrivalTime.toISOString());
      }
      else if (flight.arr_time_utc) {
        const arrivalTime = new Date(flight.arr_time_utc.replace(" ", "T") + "Z");

        const diff = arrivalTime - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          arrivaltime.innerHTML = `Landing in ${hours}h ${minutes}m`;
        } else {
          arrivaltime.innerHTML = "Arrived";
        }
      }
      else if (flight.arr_time) {
        const arrivalTime = new Date(flight.arr_time.replace(" ", "T") + "Z");

        const diff = arrivalTime - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          arrivaltime.innerHTML = `Landing in ${hours}h ${minutes}m`;
        } else {
          arrivaltime.innerHTML = "Arrived";
        }
      }
    }





    let aircraft = flight.model || aircraftCodes[flight.aircraft_icao] || "Unavailable";
    aircraft = aircraft.replace(/\s*\([^)]*\)/g, "");
    // console.log("Local time:", new Date().toString());
    // console.log("UTC time:", new Date().toISOString());







    document.getElementById("flightinfo").style.visibility = "visible";
    document.getElementById("flightinfo").style.height = "190px";
    document.getElementById("flightContainer").style.height = "270px";
    document.getElementById("collapse").style.visibility = "visible";

    aircraftmodel.innerHTML = `${aircraft}`;
    airlines.innerHTML = `${flight.airline_name || "Unavailable"}`;
    depart.innerHTML = `${flight.dep_iata || "Unavailable"}`;
    departCity.innerHTML = `<strong>${flight.dep_city}`;
    arrival.innerHTML = `${flight.arr_iata || "Unavailable"}`;
    arriveCity.innerHTML = `<strong>${flight.arr_city}`;
    status.innerHTML = `Status: ${flight.status}`;


  } catch (error) {
    console.error("Flight error:", error);
  }
}

// --------
// Calendar
// --------
const grid = document.getElementById("grid");
const monthYear = document.getElementById("monthYear");
const now = new Date();
let currentMonth = now.getMonth();
let currentYear = now.getFullYear();

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderCalendar() {
  // Clear previous days
  grid.querySelectorAll(".day").forEach(d => d.remove());

  monthYear.textContent = monthNames[currentMonth] + " " + currentYear;


  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  firstDay = (firstDay + 6) % 7;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();


  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("span");
    blank.className = "day";
    grid.appendChild(blank);
  }

  //Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("span");
    cell.className = "day";
    cell.textContent = d;

    if (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      cell.classList.add("today");
    }
    grid.appendChild(cell);
  }
}

document.getElementById("prev").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});

document.getElementById("next").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

renderCalendar();

// --------
// Settings
// --------

const settingsContainer = document.getElementById("settings");
const openSettings = document.getElementById("opensettings");
const backgroundBtn = document.getElementById("backgroundBtn");
const settingsMenu = document.getElementById("settingsmenu");
const backgroundSettings = document.getElementById("backgroundsettings");
const upload = document.getElementById("wallpaperupload");
const wallpaperBtn = document.getElementById("changewallpaper");
const wallpaperBack = document.getElementById("closebackset");
const closeMenu = document.getElementById("closemenu");


openSettings.addEventListener('click', function () {
  settingsMenu.style.display = "flex";
  settingsContainer.style.width = "140px";
  settingsContainer.style.height = "280px";

});

backgroundBtn.addEventListener('click', function () {
  backgroundSettings.style.display = "flex";
  settingsMenu.style.display = "none";
  settingsContainer.style.width = "115px";
  settingsContainer.style.height = "210px";
});

wallpaperBtn.addEventListener('click', function () {
  upload.click();
});
wallpaperBack.addEventListener('click', function () {
  backgroundSettings.style.display = "none";
  settingsMenu.style.display = "flex";
  settingsContainer.style.width = "140px";
  settingsContainer.style.height = "280px";
})
closeMenu.addEventListener('click', function () {
  settingsMenu.style.display = "none";
  settingsContainer.style.width = "60px";
  settingsContainer.style.height = "60px";
})

upload.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const image = e.target.result;

    document.body.style.backgroundImage = `url(${image})`;

    localStorage.setItem("customWallpaper", image);

    wallpaperColorCheck(image);
  };
    

  reader.readAsDataURL(file);
  backgroundSettings.style.display = "none";
  settingsContainer.style.width = "60px";
  settingsContainer.style.height = "60px";
});



// fetch(`https://airlabs.co/api/v9/flight?api_key=${FLIGHT_API_KEY}`)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data)
//       // const flighturl = data.url;
//       // apodDisplay.style.backgroundImage = `url(${apodurl})`;
//       // apodinfo.innerHTML = data.explanation;
//       // apodTitle.innerHTML = data.title;
//   })
//   .catch(error => {
//     console.error(error);
//   });










// HttpRequest request = HttpRequest.newBuilder()
//   .uri(URI.create("http://airlabs.co/api/v9/ping?api_key=36e77f48-7d71-442d-ab05-e5f5b8974b57"))
//   .method("GET", HttpRequest.BodyPublishers.noBody())
//   .build();

// HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

// System.out.println(response.body());
