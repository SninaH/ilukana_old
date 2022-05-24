'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "e2035e08cfdee714502013b1df1254f2",
"index.html": "98e625b2b2b97610d53abfe324ebddbd",
"/": "98e625b2b2b97610d53abfe324ebddbd",
"main.dart.js": "1be8af70fb86fec449e4fa540d7e2236",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "070b11416766fedf356da731de5d55c6",
"assets/AssetManifest.json": "42fba8ecc2edcf2641aa8845c5e2a664",
"assets/NOTICES": "5e7feb15b4ea57eab8ff9bc6da0322de",
"assets/FontManifest.json": "179918fe1fa781f4e5790826cc38f538",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/assets/hisa.png": "434cd03dd3608ceab216a36197075b96",
"assets/assets/kakijun%25E3%2582%25A2.gif": "c440453635e8892da4c3d10468d47352",
"assets/assets/aiueo.png": "b33bc26ee333c0b2a151b0bf918fc374",
"assets/assets/Rubik-Bold.ttf": "11598c28bd4c62d359b58d8a810f385f",
"assets/assets/mouth.png": "6643a73ad495dd20026a4cf879cb5c13",
"assets/assets/vrata.png": "60e746f06ac4344e50e9d8fbef43a5be",
"assets/assets/backButton.png": "80d87e2e597e5a0d3c7f225be1ac026d",
"assets/assets/brush.png": "f87d708bb61d0f0d33e43b5c74e37185",
"assets/assets/ilustracija%25E3%2581%2582.png": "ecdaedf0eb8f4c91075309cbd9971f79",
"assets/assets/ilustracija%25E3%2582%25A2.png": "91c8c8a6057818c0659552cb775f2dc3",
"assets/assets/kakijun%25E3%2581%2582.gif": "daee25c25b583a5c9638e444fdf1f253",
"assets/assets/funnyletter.png": "0e78f4b07485968310e1fd36995e6541",
"assets/assets/pravilapisanja.gif": "daee25c25b583a5c9638e444fdf1f253",
"assets/assets/aristotlebold.ttf": "1ac9be14e748a0370a05fdd5821dae12",
"assets/assets/homeButton.png": "f8d06a32185ea2be867b2f47609ffba2",
"assets/assets/gameover.png": "bccd0c7f797380bb0984d763f5279dd9",
"assets/assets/akasatana.png": "996ec1de666e4eccac1b9f09ba924924",
"assets/assets/cover.png": "b6c12456b33decd49fd8613e8789d466",
"assets/assets/hiragino.otf": "9235878c979f8fa583e3686441e351ae",
"assets/assets/pravilapisanjakatakana.gif": "c440453635e8892da4c3d10468d47352",
"assets/assets/makimono.png": "ecbe1a586d55a86527a316bc3be1e654",
"assets/assets/Rubik-Regular.ttf": "4b3f06816033d040ef0ed60865adb2d1",
"assets/assets/hiraginoMincho.otf": "899ca9905c562016b83da89c0865de62",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
