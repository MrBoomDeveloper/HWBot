import { readdir as listFiles } from "fs/promises";
import { CommandEntry, addCommand } from "../data/commands";

export async function parseCommands() {
	const commandFiles = await listFiles("./src/commands/");
	console.info(`Найдены следующие команды: ${commandFiles}`);

	for(const commandFile of commandFiles) {
		const command = await import(`../commands/${commandFile}`);
		const entry = command.default as CommandEntry;

		if(command.default == null) {
			throw new Error(`Файл ${commandFile} не содержит команды!`);
		}

		if(entry.execute == null) {
			throw new Error(`Файл ${commandFile} не содержит команды!`);
		}

		const commandName = commandFile.split(".")[0];
		addCommand(commandName, entry);
	}

	console.info("Команды загружены успешно!");
}