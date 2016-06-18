var socket = io.connect();

var form = $("#room form");
var ul = $("#room ul");

form.submit(function () {
    var input = $(this).find(":input");
    var text = input.val();
    input.val("");
    
    socket.emit("message", text, function (data) {
        $("<li>", {text: text}).appendTo(ul);
    });
    
    return false;
});

socket.on("message", function (text) {
    $("<li>", {text: text}).appendTo(ul);
})