import dotenv from "dotenv";
import { startAllBots } from "./src/setup/botsStarter";
import { parseCommands } from "./src/setup/commandsParser";
import { initDb } from "./src/setup/dbInit";
import consola from "consola";

dotenv.config();
consola.start("Запуск...");

initDb()
	.then(startAllBots)
	.then(parseCommands)
	.then(() => consola.success("Запуск завершен!"))