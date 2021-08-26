const socket = io.connect("http://localhost:4000/");

const button = document.getElementById("leButton");
const input = document.getElementById("textInput");

button.addEventListener("click", function () {
  console.log("test");
  socket.emit("sendmessage", { message: input.value });
});

socket.on("leYoohoo", (data) => {
  console.log(data);
});
