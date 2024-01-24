interface BaseCommand {
	message: {
		text?: string,
		photos?: string[]
	}
}

export interface CommandRequest extends BaseCommand {
	message: {
		text?: string,
		photos?: string[],
		id: number
	},

	author: {
		name: string,
		username: string,
		id: number
	},

	chat: {
		id: number,
		name: string
	}
}

export interface CommandResponse extends BaseCommand {
	replyTo?: number,
	chatId?: number,
	doReply?: boolean
}

const commands: Record<string, CommandEntry> = {}

export interface CommandEntry {
	execute: (request: CommandRequest, args?: string[]) => Promise<CommandResponse>,
	arguments?: string[],
	description?: string,
	isAdmin?: boolean,
	isHidden?: boolean
}

export function addCommand(name: string, entry: CommandEntry) {
	commands[name] = entry;
}

export function getCommand(command: string): CommandEntry | null {
	return commands[command] ?? null;
}

export function getCommands() {
	return commands;
}

export enum Results {
	UNKNOWN_COMMAND = "Я не знаю такой команды, узнайте все команды через /help",
	NULL_COMMAND = "Команда не была указанна"
}