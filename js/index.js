function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function downloadEvents() {
  var eventRequest = new XMLHttpRequest();
  eventRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var rawJson = eventRequest.responseText;
      extractEventsFromJson(rawJson, hideLoading);
    }
  };
  eventRequest.open(
    "GET",
    "https://jsonbin.io/b/59cb768e36b21b0854312750",
    true
  );
  eventRequest.send();
}

function extractEventsFromJson(json, callback) {
  var obj = JSON.parse(json);
  var event_list = obj.events;
  for (var event in event_list) {
    buildEventCardFromObject(event_list[event]);
  }
  callback();
}

function buildEventCardFromObject(object) {
  var e_title = object.event_title || "Titolo";
  var e_date = new Date(object.event_date);
  var e_image = object.event_image;
  var e_link = object.event_link;

  var eventDiv = document.createElement("div");
  eventDiv.className = "event-card";
  var gradient = "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5))";
  var backgroundString = gradient + ", url('" + e_image + "')";
  eventDiv.style.backgroundImage = backgroundString;
  var eventP = document.createElement("h4");
  eventP.innerHTML = e_title.slice(0, 56);
  eventDiv.appendChild(eventP);
  var eventA = document.createElement("a");
  eventA.setAttribute("href", e_link);
  eventA.appendChild(document.createElement("span"));
  eventDiv.appendChild(eventA);
  var eventH4 = document.createElement("h5");
  eventH4.innerHTML =
    getWeekDayFromDate(e_date) +
    " " +
    e_date.getDate() +
    " " +
    getMonthFormDate(e_date);
  eventDiv.appendChild(eventH4);
  document.getElementById("events").appendChild(eventDiv);
}

function getWeekDayFromDate(date) {
  var d = date.getDay();
  switch (d) {
    case 0:
      return "Domenica";
      break;
    case 1:
      return "Lunedì";
      break;
    case 2:
      return "Martedì";
      break;
    case 3:
      return "Mercoledì";
      break;
    case 4:
      return "Giovedì";
      break;
    case 5:
      return "Venerdì";
      break;
    case 6:
      return "Sabato";
      break;
  }
}

function getMonthFormDate(date) {
  var m = date.getMonth();
  switch (m) {
    case 0:
      return "gennaio";
      break;
    case 1:
      return "febbraio";
      break;
    case 2:
      return "marzo";
      break;
    case 3:
      return "aprile";
      break;
    case 4:
      return "maggio";
      break;
    case 5:
      return "giugno";
      break;
    case 6:
      return "luglio";
      break;
    case 7:
      return "agosto";
      break;
    case 8:
      return "settembre";
      break;
    case 9:
      return "ottobre";
      break;
    case 10:
      return "novembre";
      break;
    case 11:
      return "dicembre";
      break;
  }
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

window.onload = function() {
  downloadEvents();
  setTimeout(setInterval(function(){changeHeaderBackground();}, 5000),5000);
};

/*
   ------------------ Backgroud carousel -----------------------------
*/
var bgImages = [
  "/img/main_intro.jpg",
  "/img/main_intro2.jpg",
  "/img/main_intro3.jpg",
  "/img/main_intro4.jpg"
];

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function changeHeaderBackground() {
  shuffleArray(bgImages);
  var next = bgImages[0];
  var nextProp =
    "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(" +
    next +
    ") top left / cover no-repeat";
  document.getElementById("home").style.background = nextProp;
}

/*
   ------------------ Service Worker registration -----------------------------
*/
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceworker.js")
    .then(function(registration) {
      console.log("Service Worker registered. Scope: ", registration.scope);
    })
    .catch(function(err) {
      console.log("Service Worker registration failed. Err: ", err);
      console.log(
        "Maybe you should try to use a better browser... *cough* Firefox *cough*"
      );
    });
}
