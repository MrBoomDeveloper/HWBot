import { Bridge } from "../bridges/base"

interface BaseCommand {
	message: {
		text?: string,
		photos?: string[]
	}
}

export type RequestType = "text" | "file" | "photo" | "voice";

export interface CommandRequest extends BaseCommand {
	type: RequestType,

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

type CommandEntryExecute = (bridge: Bridge, request: CommandRequest, args?: string[]) => Promise<CommandResponse>;

export interface CommandEntry {
	execute: CommandEntryExecute,
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