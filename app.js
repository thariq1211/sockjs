var stompClient = null;

var url = "https://iswitch.ddns.net:8199";
var captured = "188";
var result = captured ? captured : "defaultValue";

console.log("extension_user = " + result);

function setConnected(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  if (connected) {
    $("#conversation").show();
  } else {
    $("#conversation").hide();
  }
  $("#greetings").html("");
}

function connect() {
  var socket = new SockJS(`${url}/gs-guide-websocket`);
  stompClient = Stomp.over(socket);
  console.log({ stompClient, socket });
  stompClient.connect({}, function (frame) {
    setConnected(true);
    console.log("Connected: " + frame);

    stompClient.subscribe(`/topic/acw/${captured}`, (greeting) => {
      const res = JSON.parse(greeting.body);
      console.log({ res });
      showGreeting(res.detail);
    });
  });
}

function sendName() {
  stompClient.send(
    `/app/acw/${captured}`,
    {},
    JSON.stringify({
      extension: captured,
      cases: "3",
      detail: $("#name").val(),
    })
  );
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}
function sendStatus() {
  stompClient.send("/app/hello", {}, JSON.stringify({ name: result }));
}

function showGreeting(message) {
  $("#greetings").append(`<tr><td> ${message} <tr><td>`);
}

$(function () {
  $("form").on("submit", function (e) {
    e.preventDefault();
  });
  $("#connect").click(function () {
    connect();
  });
  $("#disconnect").click(function () {
    disconnect();
  });
  $("#send").click(function () {
    sendName();
  });
});
