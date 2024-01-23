import { readdir as listFiles } from "fs/promises";
import { CommandRequest, CommandResponse } from "../bridges/base";

const commands: Record<string, CommandEntry> = {}

export interface CommandEntry {
	execute: (request: CommandRequest) => Promise<CommandResponse>,
	arguments?: string[],
	description?: string,
	isAdmin?: boolean
}

export async function parseCommands() {
	const commandFiles = await listFiles("./src/commands/");
	console.info(`Найдены следующие команды: ${commandFiles}`);

	for(const commandFile of commandFiles) {
		const command = await import(`../commands/${commandFile}`);
		const defaultFunction = command.default;

		if(defaultFunction == null) {
			throw new Error(`Файл ${commandFile} не содержит команды!`);
		}

		const info = defaultFunction() as CommandEntry;

		if(info.execute == null) {
			throw new Error(`Файл ${commandFile} не содержит команды!`);
		}

		const commandName = commandFile.split(".")[0];
		commands[commandName] = info;
	}

	console.info("Команды загружены успешно!");
}

export function getCommand(command: string): CommandEntry | null {
	return commands[command] ?? null;
}