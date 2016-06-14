/**
 * Created by Phaeton on 12.06.2016.
 */
var logout = document.getElementById("logout");
logout.onclick = function (event) {
    $('<form method=POST action=/logout>').submit();
    return false;
};

/*window.onbeforeunload = function () {
    $('<form method=POST action=/logout>').submit(function () {

    });
    return false;
    if (!confirm("???")) return false;
};*/