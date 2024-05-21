import consola from "consola";
import { CommandRequest, CommandResponse, Results, getCommand } from "../data/commands";
import { logger } from "../util/logger";
import { parseCommand } from "../util/parser";
import { writeFile } from "node:fs/promises";
import { UserOperationType, getCurrentUserOperation } from "../data/operations";

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

	process:
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
		} break process;

		case "photo": {
			let operation = await getCurrentUserOperation(request.author);

			if(operation == null) {
				response = {
					message: {
						text: "Вы еще не начали ни одной операции. Что мне делать с этими фотографиями?"
					}
				}

				break process;
			}

			switch(operation.type) {
				case UserOperationType.PUBLISH_HOMEWORK: {
					for(const photo of request.message.photos) {
						const fileLink = await bridge.getFileLink(photo);

						const fetched = await fetch(fileLink);
						const buffer = Buffer.from(await fetched.arrayBuffer());

						writeFile(`./.saved/schedules/${photo}.jpg`, buffer);
					}

					response = {
						doReply: true,
						message: {
							text: "Фото приняты. Не забудьте отправить <b><u>/done</u></b> когда закончите. Если передумали, отправьте <b><u>/cancel</b></u>"
						}
					}
				} break process;

				default: {
					response = {
						message: {
							text: "Фотографии не подходят для текущей операции."
						}
					}
	
					break process;
				}			
			}
		}	
	}

	try {
		fillEmptyFields(request, response);
		await bridge.sendResponse(response);
	} catch(e) {
		consola.error(e);
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