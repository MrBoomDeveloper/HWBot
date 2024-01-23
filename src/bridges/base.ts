import { getCommand } from "../setup/commandsParser";

export interface Bridge {
	start(): Promise<void>;
	sendResponse(reponse: CommandResponse): Promise<void>
}

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

export async function resolveRequest(bridge: Bridge, request: CommandRequest) {
	if(request == null) {
		return;
	}

	const foundCommand = getCommand(request.message.text);

	const response: CommandResponse = (foundCommand != null)
		? await foundCommand.execute(request) : {
			replyTo: request.message.id,

			message: {
				text: Results.UNKNOWN_COMMAND
			}
		}

	try {
		fillEmptyFields(request, response);
		await bridge.sendResponse(response);
	} catch(e) {
		throw new Error(e);
	}
}

function fillEmptyFields(request: CommandRequest, response: CommandResponse) {
	if(response.chatId == null) {
		response.chatId = request.chat.id;
	}

	if(response.doReply == true && response.replyTo == null) {
		response.replyTo = request.message.id;
	}
}

export enum Results {
	UNKNOWN_COMMAND = "Я не знаю такой команды, узнайте все команды через /help",
	NULL_COMMAND = "Команда не была указанна"
}