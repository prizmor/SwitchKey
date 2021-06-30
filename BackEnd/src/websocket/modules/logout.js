module.exports = function (data, socket, connectedUsers) {
  try {
    socket.disconnect();
  } catch (e) {
    console.log(e);
  }
}
