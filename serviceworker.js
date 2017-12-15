var CACHE_NAME = "cache-v2";
var CACHE_URLS = [
  //HTML
  "index.html",
  "newsletter.html",
  //CSS
  "css/index.css",
  "css/event.css",
  "css/skeleton.css",
  "css/newsletter.css",
  //JS
  "js/index.js",
  "js/event.js",
  "js/newsletter.js",
  "js/localforage.js",
  //IMAGES
  "img/main_intro.jpg",
  "img/social_fb.png",
  "img/social_in.png",
  "img/social_tw.png",
  "img/logo_white.png",
  "img/cover_1.jpg",
  //OTHER
  "//fonts.googleapis.com/css?family=Raleway:400,300,600"
];

self.addEventListener("install", function(event) {
  console.log("SW: install");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        cache.addAll(CACHE_URLS).catch(function(err) {
          console.log(err);
        });
      })
      .catch(function() {
        console.log("unable to open cache");
      })
  );
});

self.addEventListener("fetch", function(event) {
  var reqestURL = new URL(event.request.url);
  if ("jsonbin.io" in reqestURL) {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then(function(cache) {
          return fetch(event.request)
            .then(function(networResponse) {
              cache.put(event.request, networResponse.clone());
              return networResponse;
            })
            .catch(function() {
              return cache.match(event.request);
            });
        })
        .catch(function() {
          console.log("unable to open cache");
        })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(function(response) {
          return response || fetch(event.request);
        })
        .catch(function() {
          console.log("unable to open cache");
        })
    );
  }
});

//TODO: complete with real req
self.addEventListener("sync", function(event) {
  console.log("a sync catched");
  if (event.tag === "sync-newsletter") {
    console.log("is my sync");
    event.waitUntil(fetch("http://google.com")
      .then(function(response) {
        self.clients.matchAll().then(function(clients){
          clients.forEach(client => {
            client.postMessage("form sent");
          });
        })
      }));
  }
});
