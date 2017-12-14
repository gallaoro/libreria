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
  "fonts.googleapis.com/css?family=Raleway:400,300,600"
];

self.addEventListener("install", function(event) {
  console.log("SW: install");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        cache.addAll(CACHE_URLS).catch(function() {
          console.log("cannot add responses to chache");
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
      caches.open(CACHE_NAME)
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
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request);
        })
        .catch(function() {
          console.log("unable to open cache");
        })
    );
  }
});

self.addEventListener("sync", function(event) {
  if (event.tag === "sync-newsletter-submission") {
    fetch("https://jsonbin.io/b/59cb768e36b21b0854312750")
      .then(function(response) {
        console.log(response);
        self.clients.matchAll().then(function(clients) {
          clients.forEach(function(element) {
            element.postMessage("lpl-newsletter-registered");
          });
          return Promise.resolve();
        });
      })
      .catch(function() {
        return Promise.reject();
      });
  }
});
