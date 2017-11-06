function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function checkedEmail() {
  if (document.getElementById("emailCheckbox").checked) {
    sendEmailNewsletter();
  } else {
    notsendEmailNewsletter();
  }
}

function checkedSMS() {
  if (document.getElementById("SMSCheckbox").checked) {
    sendSMSNewsletter();
  } else {
    notsendSMSNewsletter();
  }
}

function sendSMSNewsletter() {
  document.getElementById("phoneInputDiv").style.display = "block";
  document.getElementById("SMSCheckbox").checked = true;
}

function notsendSMSNewsletter() {
  document.getElementById("phoneInputDiv").style.display = "none";
  sendEmailNewsletter();
}

function sendEmailNewsletter() {
  document.getElementById("emailInputDiv").style.display = "block";
  document.getElementById("emailCheckbox").checked = true;
}

function notsendEmailNewsletter() {
  document.getElementById("emailInputDiv").style.display = "none";
  sendSMSNewsletter();
}

function checkVerifica(risposta) {
  return true;
}

function sottoscriviNewsletter(submission){
  localforage.setItem("submission", submission);
  document.getElementById("sendButton").value = submission.stato;
  document.getElementById("sendButton").style.backgroundColor = "orange";
  document.getElementById("sendButton").style.borderColor = "orange";
  document.getElementById("sendButton").diabled = true;
  if("serviceWorker" in navigator && "SyncManager" in window){
    navigator.serviceWorker.ready.then(function(registration){
      registration.sync.register("sync-newsletter-submission");
    }).catch(function(){
      var newsletterRequest = new XMLHttpRequest();
      newsletterRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var rawJson = eventRequest.responseText;
          document.getElementById("sendButton").value = "Inviato";
          document.getElementById("sendButton").style.backgroundColor = "green";
          document.getElementById("sendButton").style.borderColor = "green";
        }
      };
      eventRequest.open(
        "GET",
        "http://jsonbin.io/b/59cb768e36b21b0854312750", //TODO:
        true
      );
      eventRequest.send();
    });
  }else{
    var newsletterRequest = new XMLHttpRequest();
    newsletterRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var rawJson = eventRequest.responseText;
        document.getElementById("sendButton").value = "Inviato";
        document.getElementById("sendButton").style.backgroundColor = "green";
        document.getElementById("sendButton").style.borderColor = "green";
      }
    };
    eventRequest.open(
      "GET",
      "http://jsonbin.io/b/59cb768e36b21b0854312750", //TODO:
      true
    );
    eventRequest.send();
  }
}

window.onload = function(){
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

/*
   ------------------ Service Worker registration -----------------------------
*/
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceworker.js")
    .then(function(registration) {
      navigator.serviceWorker.addEventListener("message", function(event){
        console.log(event.data);
        document.getElementById("sendButton").value = "Inviato";
        document.getElementById("sendButton").style.backgroundColor = "green";
        document.getElementById("sendButton").style.borderColor = "green";
      });
      console.log("Service Worker registered. Scope: ", registration.scope);
    })
    .catch(function(err) {
      console.log("Service Worker registration failed. Err: ", err);
      console.log("Maybe you should try to use a better browser... *cough* Firefox *cough*");
    });
}

