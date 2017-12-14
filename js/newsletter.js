/*
   ------------------ Service Worker registration -----------------------------
*/
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceworker.js",{scope: "/libreria"})
    .then(function(registration) {
      navigator.serviceWorker.addEventListener("message", function(event) {
        console.log(event.data);
        document.getElementById("sendButton").value = "Inviato";
        document.getElementById("sendButton").style.backgroundColor = "green";
        document.getElementById("sendButton").style.borderColor = "green";
      });
      console.log("Service Worker registered. Scope: ", registration.scope);
    })
    .catch(function(err) {
      console.log("Service Worker registration failed. Err: ", err);
      console.log(
        "Maybe you should try to use a better browser... *cough* Firefox *cough*"
      );
    });
}

/*
  ------------------ Page specific code ---------------------------------------
*/

// Basic menu
let openNav = function() {
  document.getElementById("myNav").style.width = "100%";
};

let closeNav = function() {
  document.getElementById("myNav").style.width = "0%";
};

let checkedEmail = function() {
  if (document.getElementById("emailCheckbox").checked) {
    sendEmailNewsletter();
  } else {
    notsendEmailNewsletter();
  }
};

let checkedSMS = function() {
  if (document.getElementById("SMSCheckbox").checked) {
    sendSMSNewsletter();
  } else {
    notsendSMSNewsletter();
  }
};

let sendSMSNewsletter = function() {
  document.getElementById("phoneInputDiv").style.display = "block";
  document.getElementById("SMSCheckbox").checked = true;
};

let notsendSMSNewsletter = function() {
  document.getElementById("phoneInputDiv").style.display = "none";
  sendEmailNewsletter();
};

let sendEmailNewsletter = function() {
  document.getElementById("emailInputDiv").style.display = "block";
  document.getElementById("emailCheckbox").checked = true;
};

let notsendEmailNewsletter = function() {
  document.getElementById("emailInputDiv").style.display = "none";
  sendSMSNewsletter();
};

let checkVerifica = function(risposta) {
  return true;
};

let sottoscriviNewsletter = function(submission) {
  localforage.setItem("submission", submission);
  document.getElementById("sendButton").value = submission.stato;
  document.getElementById("sendButton").style.backgroundColor = "orange";
  document.getElementById("sendButton").style.borderColor = "orange";
  document.getElementById("sendButton").diabled = true;
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.sync.register("sync-newsletter");
    });
  } else {
    console.log("no newsletter for who dont have a sw");
  }
};

window.onload = function() {
  document
    .getElementById("newsletterForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      var email = document.getElementById("emailInput").value;
      var tel = document.getElementById("phoneInput").value;
      var nome = document.getElementById("nameInput").value;
      var cognome = document.getElementById("surnameInput").value;
      var interessi = document.getElementById("notes").value;
      var verifica = document.getElementById("robotCheck").value;

      var submission = {
        email: email,
        tel: tel,
        nome: nome,
        cognome: cognome,
        interessi: interessi,
        stato: "Inviando..."
      };

      if (checkVerifica(verifica)) {
        sottoscriviNewsletter(submission);
      }
    });
};
