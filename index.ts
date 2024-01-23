import dotenv from "dotenv";
import { startAllBots } from "./src/setup/botsStarter";
import { parseCommands } from "./src/setup/commandsParser";

dotenv.config();

startAllBots().then(parseCommands);