
init();

let DataDiv = document.getElementById("DataDiv");

function init() {
    if ("serviceWorker" in navigator) {
        console.log("Service Worker is supported");

        navigator.serviceWorker
            .register("service-worker.js")
            .then(function (swReg) {
                console.log("Service Worker is registered", swReg);
            })
            .catch(function (error) {
                console.error("Service Worker Error", error);
            });
    } else {
        console.warn("Service worker is not supported");
    }

    updateData();
}


function updateData() {
    // Get data from cache
    getDataFromCache().then((data) => {
        console.log("Displaying data info from cache", data);
        DataDiv.innerHTML = data.data.name;
    });
    // Get data from network
    getDataFromNetwork().then((data) => {
        console.log("Displaying data info from API", data);
        DataDiv.innerHTML = data.data.name;
    });
}

function getDataFromNetwork() {
    return fetch(`https://reqres.in/api/products/3`)
        .then((response) => {
            return response.json();
        })
        .catch(() => {
            return null;
        });
}

function getDataFromCache() {
    if (!("caches" in window)) {
        return null;
    }
    const url = `https://reqres.in/api/products/3`;
    return caches
        .match(url)
        .then((response) => {
            if (response) {
                return response.json();
            }
            return null;
        })
        .catch((err) => {
            console.error("Error getting data from cache", err);
            return null;
        });
}

// Configure share button

document.getElementById('ShareButton').addEventListener("click", function () {
    if (navigator.share) {
        navigator
            .share({
                title: "My share title",
                text: "My share text",
                url: "My PWA url",
            })
            .then(() => console.log("Successful share"))
            .catch((error) => console.log("Error sharing", error));
    }
});


// Material components
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.querySelector('.mdc-top-app-bar'));