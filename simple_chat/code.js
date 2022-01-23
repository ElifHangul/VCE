
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('id01').style.display='block';
  const button = document.querySelector('#emoji-button');
  const picker = new EmojiButton({
      // position of the emoji picker. Available positions:
      // auto-start, auto-end, top, top-start, top-end, right, right-start, right-end, bottom, bottom-start, bottom-end, left, left-start, left-end
    position: "bottom-start",
     
});

  picker.on('emoji', emoji => {
    document.querySelector('#chatinput').value += emoji;
  });
  button.addEventListener('click', () => {
    picker.pickerVisible ? picker.hidePicker() : picker.showPicker(button);
  });
});

window.setInterval(function() {
  var elem = document.getElementById('chat');
  elem.scrollTop = elem.scrollHeight;
}, 2000);
document.getElementById("chatinput").setAttribute("disabled", true);
document.getElementById("sendbutton").setAttribute("disabled", true);
document.getElementById("emoji-button").setAttribute("disabled",true);
var button_login=document.querySelector("#loginbutton");
button_login.addEventListener("click",onButtonLogin);

var user_name,room_name;

var server = new SillyClient();

function onButtonLogin()
{
	user_name = document.querySelector("#user_name").value;
	room_name = document.querySelector("#room_name").value;

	if(user_name!=="" && room_name!==""){
		document.getElementById("chatinput").removeAttribute("disabled");
		document.getElementById("sendbutton").removeAttribute("disabled");
		document.getElementById("emoji-button").removeAttribute("disabled");
		document.getElementById('id01').style.display='none';
		server.connect("wss://tamats.com:55000",room_name);
		myName.innerHTML = user_name;
	}
	else{
		alert("Please enter a user name and room name");
	}
	
}
var chat_container = document.querySelector("#chat");


var input = document.querySelector("#chatinput");

input.addEventListener("keydown", onKeyDown );

var button = document.querySelector("#sendbutton");
button.addEventListener("click", onButtonSend );

var messageArray=[];
var userArray = [];
var usernameArray=[];

function onKeyDown(event)
{
if(event.key != "Enter")
return;
onButtonSend();
}

server.on_message  = function(user_id,msg_str){
	
	var message = JSON.parse( msg_str );
	if(message.type == "msg"){
		messageArray.push(message);
		
		var userName = document.createElement("p");
		userName.className = "uname";
		userName.innerHTML = message.username;
		var div1 = document.createElement("div");
		div1.className = "received-chats";
		var div2 = document.createElement("div");
		div2.className = "received-chats-img";
		var img = document.createElement("IMG");
		img.setAttribute("src", "avatar.png");
		var div3 = document.createElement("div");
		div3.className="received-msg";
		var div4=document.createElement("div");
		div4.className = "received-msg-inbox";
		var div5 = document.createElement("div");
		div5.className = "content";
		var elem = document.createElement("p");
		elem.innerHTML = message.text;
		var b = document.createElement("br");
		
		div5.appendChild(elem);
		div4.appendChild(div5);
		div3.appendChild(div4);
		div2.appendChild(img);
		div1.appendChild(div2);
		div1.appendChild(div3)
		chat_container.appendChild(userName);
		chat_container.appendChild(div1);
		chat_container.appendChild(b);
	}
	else if(message.type == "req"){
		userArray.push(message.userid);
		for (i=0;i<messageArray.length;i++)
		    server.sendMessage(messageArray[i],message.userid);
		for(j=0;j<usernameArray.length;j++)
			server.sendMessage(usernameArray[i]);
	}
		
	else if(message.type == "uname"){
		console.log(message.username);
	}
	
	
};
server.on_room_info = function(info){
		console.log(info);
		var message_req={
			type:"req",
			userid:info.clients[info.clients.length-1],
			username: user_name
		};
		var msg_str = JSON.stringify( message_req );
		server.sendMessage(msg_str,info.clients[0]);
		
		
	};
//this methods is called when a new user is connected
server.on_user_connected = function( user_id ){

	if(!userArray.includes(user_id)){
		server.on_room_info;
	}
		var usermsg={
		type:"uname",
		userid:user_id,
		username : user_name
		};
		var msg_str_us = JSON.stringify( usermsg );
		server.sendMessage(msg_str_us);
}

function onButtonSend()
{
	var message = {
		type:"msg",
		text : input.value,
		username : user_name
		
	};
	var div1 = document.createElement("div");
	div1.className="outgoing-chats";
	var div2 = document.createElement("div");
	div2.className="outgoing-chats-msg";
	var elem = document.createElement("p");
	elem.innerHTML = input.value;
	var div3 = document.createElement("div");
	div3.className="outgoing-chats-img";
	var img = document.createElement("IMG");
	img.setAttribute("src", "avatar.png");
	div3.appendChild(img);
	div2.appendChild(elem);
	div1.appendChild(div3);
	div1.appendChild(div2);
	
	input.value = "";
	chat_container.appendChild(div1);

	messageArray.push(message);
	var msg_str = JSON.stringify( message );
	server.sendMessage(msg_str);


}
