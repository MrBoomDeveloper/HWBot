import { CommandRequest, CommandResponse, Results, getCommand } from "../data/commands";
import { logger } from "../util/logger";
import { parseCommand } from "../util/parser";
import { writeFile } from "node:fs/promises";

export interface Bridge {
	start(): Promise<void>;
	sendResponse(reponse: CommandResponse): Promise<void>,
	getPrefix(): string | string[],
	resolveFirstArgument?(arg1: string): string | null,
	getFileLink(photoId: string): Promise<string | null>
}

export async function resolveRequest(bridge: Bridge, request: CommandRequest) {
	let response: CommandResponse;

	if(request == null || request.type == null) {
		return;
	}

	switch(request.type) {
		case "text": {
			logger.info(`Сообщение от ${request.author.name} (@${request.author.username}): ${request.message.text}`, bridge);

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

			response = (foundCommand != null)
				? await foundCommand.execute(bridge, request, args) : {
					replyTo: request.message.id,

					message: {
						text: Results.UNKNOWN_COMMAND
					}
				}
		} break;

		case "photo": {
			const photo = request.message.photos[request.message.photos.length - 1];
			const fileLink = await bridge.getFileLink(photo);

			const fetched = await fetch(fileLink);
			const buffer = Buffer.from(await fetched.arrayBuffer());

			writeFile(`./.saved/schedules/${photo}.jpg`, buffer);

			response = {
				message: {
					text: "Фото не поддерживаются."
				}
			}
		} break;
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