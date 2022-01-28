const Server = require("./Server");

const main = new Server();
main.CreateSettings();
main.CreateWebsocket();
main.MainLoop();