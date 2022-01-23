
var userName = document.querySelector("#user");


var room = document.querySelector("#room");

var button = document.querySelector("#sendbutton");
button.addEventListener("click", onButtonSend );




function onButtonSend()
{
var server = new SillyClient();
server.connect("wss://tamats.com:55000",room.value);

server.on_ready=function(id){
	console.log(id);
}

}
