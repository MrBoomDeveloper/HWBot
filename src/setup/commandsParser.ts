import { readdir as listFiles } from "fs/promises";
import { CommandEntry, addCommand } from "../data/commands";

export async function parseCommands() {
	const commandFiles = await listFiles("./src/commands/");
	const failed: string[] = [];
	const success: string[] = [];

	for(const commandFile of commandFiles) {
		let entry: CommandEntry;

		try {
			const command = await import(`../commands/${commandFile}`);
			entry = command.default as CommandEntry;
		} catch(e) {
			failed.push(`${commandFile} - ${e}`);
			continue;
		}

		if(Object.values(entry).length == 0) {
			failed.push(`${commandFile} - Не найден дескриптор команды`);
			continue;
		}

		if(entry.execute == null) {
			failed.push(`${commandFile} - Не найдена функция execute для команды`);
			continue;
		}

		const commandName = commandFile.split(".")[0];
		addCommand(commandName, entry);
		success.push(commandName);
	}

	if(success.length > 0) {
		console.info("Успешно спарсены следующие команды:", success.join(", "));
	}

	if(failed.length > 0) {
		console.error("Не удалось спарсить следующие команды:", failed.join(", "));
	}
}