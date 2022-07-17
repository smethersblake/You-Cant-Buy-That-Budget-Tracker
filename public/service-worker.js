const APP_PREFIX = "BudgetTracker-"
const VERSION = "version_01"
const CACHE_NAME = APP_PREFIX + VERSION

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./manifest.json",
    "./icons/icon-512x512.png",
    "./icons/icon-384x384.png",
    "./icons/icon-192x192.png",
    "./icons/icon-152x152.png",
    "./icons/icon-144x144.png",
    "./icons/icon-128x128.png",
    "./icons/icon-96x96.png",
    "./icons/icon-72x72.png"
]

self.addEventListener("install", function (event)
{
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache)
        {
            console.log(CACHE_NAME + "installing");
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})
self.addEventListener("activate", function (event)
{
    event.waitUntil(
        caches.keys().then(function (keysList)
        {
            let casheList = keysList.filter(function (key)
            {
                return key.indexOf(APP_PREFIX)
            })
        })
    )
})
self.addEventListener("fetch", function (event)
{
    console.log("fetching " + event.request.url)
    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
        {
            return fetch(event.request).then(response =>
            {
                if (response.status === 200)
                {
                    cache.put(event.request.url, response.clone())
                }
                return response
            })
                .catch(err =>
                {
                return cache.match(event.request)
                })
            .catch(err => console.log(err))
        })
        // caches.match(event.request).then(function (request)
        // {
        //     if (request)
        //     {
        //         return request
        //     }
        // })
    )
})