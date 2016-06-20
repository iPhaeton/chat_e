var socket = io.connect("", {
    reconnectionAttempts: 10
});

var form = $("#room form");
var ul = $("#room ul");
var stat = $("#stat ul");
var input = $("#room input");

function sendMessage () {
    var text = input.val();
    input.val("");
    
    socket.emit("message", text, function (data) {
        $("<li>", {text: text}).appendTo(ul);
    });
    
    return false;
};

function printMessage(text) {
    $("<li>", {text: text}).appendTo(ul);
};

function printStatus(text) {
    $("<li>", {text: text}).appendTo(stat);
};

socket
    .on("message", function (text) {
        printMessage(text)
    })
    .on("connect", function () {
        printStatus("Connected");
        form.on("submit", sendMessage);
        input.prop("disabled", false);
    })
    .on("disconnect", function () {
        printStatus("Connection lost");
        form.off("submit", sendMessage);
        input.prop("disabled", true);
    })
    .on("reconnect_failed", function () {
        alert("Connection is lost forever");
    });