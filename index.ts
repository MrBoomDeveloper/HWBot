import dotenv from "dotenv";
import { startAllBots } from "./src/setup/botsStarter";
import { parseCommands } from "./src/setup/commandsParser";
import { initDb } from "./src/setup/dbInit";

dotenv.config();

initDb()
	.then(startAllBots)
	.then(parseCommands);