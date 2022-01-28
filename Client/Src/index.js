import { Engine } from "./Engine";

const engine = new Engine();
engine.LoadLocalStorage();
engine.ConnectServer();
engine.CreateAction();
engine.MainLoop();