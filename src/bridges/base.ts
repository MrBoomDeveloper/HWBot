import { CommandRequest, CommandResponse, Results, getCommand } from "../data/commands";
import { logger } from "../util/logger";
import { parseCommand } from "../util/parser";

export interface Bridge {
	start(): Promise<void>;
	sendResponse(reponse: CommandResponse): Promise<void>,
	getPrefix(): string | string[],
	resolveFirstArgument?(arg1: string): string | null
}

export async function resolveRequest(bridge: Bridge, request: CommandRequest) {
	if(request == null) {
		return;
	}

	logger.info(`Сообщение от ${request.author.name} (@${request.author.username}): ${request.message.text}`, bridge);

	if(request.message.text == null) {
		return;
	}

	const parsedCommand = parseCommand(request.message.text, bridge.getPrefix());
	if(parsedCommand == null || parsedCommand.length == 0) return;

	if(bridge.resolveFirstArgument != null) {
		const resolvedFirstArgument = bridge.resolveFirstArgument(parsedCommand[0]);
		if(resolvedFirstArgument == null) return;
		parsedCommand[0] = resolvedFirstArgument;
	}
	
	const foundCommand = getCommand(parsedCommand[0].toLowerCase());

	const args = [...parsedCommand];
	args.shift();

	const response: CommandResponse = (foundCommand != null)
		? await foundCommand.execute(request, args) : {
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