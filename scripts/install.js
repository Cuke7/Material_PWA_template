"use strict";

let deferredInstallPrompt = null;
const installButton = document.getElementById("butInstall");
installButton.addEventListener("click", installPWA);

// CODELAB: Add event listener for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);


function saveBeforeInstallPromptEvent(evt) {
  // CODELAB: Add code to save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
  installButton.style.display = "block";
  //console.log('saveBeforeInstallPromptEvent => block')
}


function installPWA(evt) {
  deferredInstallPrompt.prompt();
  // Hide the install button, it can't be called twice.
  installButton.setAttribute("hidden", true);
  installButton.style.display = "none";
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
}

window.addEventListener("appinstalled", logAppInstalled);

function logAppInstalled(evt) {
  // CODELAB: Add code to log the event
  console.log('PWA app was installed.', evt);
}