import { readdir as listFiles } from "fs/promises";
import { CommandRequest, CommandResponse } from "../bridges/base";

const commands: Record<string, CommandEntry> = {}

export interface CommandEntry {
	execute: (request: CommandRequest) => Promise<CommandResponse>,
	arguments?: string[],
	description?: string,
	isAdmin?: boolean,
	isHidden?: boolean
}

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
		commands[commandName] = entry;
	}

	console.info("Команды загружены успешно!");
}

export function getCommand(command: string): CommandEntry | null {
	return commands[command] ?? null;
}

export function getCommands() {
	return commands;
}