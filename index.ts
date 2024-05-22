import dotenv from "dotenv";
import { startAllBots } from "./src/setup/botsStarter";
import { parseCommands } from "./src/setup/commandsParser";
import consola from "consola";
import { checkExistence } from "./src/data/db";

dotenv.config();
consola.start("Запуск...");

checkExistence()
	.then(startAllBots)
	.then(parseCommands)
	.then(() => consola.success("Запуск завершен!"))