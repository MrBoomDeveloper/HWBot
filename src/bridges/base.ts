import consola from "consola";
import { CommandRequest, CommandResponse, Results, getCommand } from "../data/commands";
import { logger } from "../util/logger";
import { parseCommand } from "../util/parser";
import { writeFile } from "node:fs/promises";
import { PublishMessageOperation, UserOperationType, getCurrentUserOperation } from "../data/operations";
import { resolveButton } from "../commands/subscribe";

export interface Bridge {
	start(): Promise<void>;
	sendResponse(reponse: CommandResponse): Promise<void>,
	getPrefix(): string | string[],
	resolveFirstArgument?(arg1: string): string | null,
	getFileLink(photoId: string): Promise<string | null>,
	getPlatformName(): string
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

		case "button": {
			let extra;

			try {
				extra = JSON.parse(request.button.id);
			} catch(e) {
				response = {
					doReply: true,
					message: { text: "Failed to parse extra data!" }
				}

				break process;
			}

			switch(extra.act) {
				case "sub_select": {
					await resolveButton(bridge, request);
				} return;
			}
		} break;

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
					const publishHwOperation = operation.data as PublishMessageOperation;

					if(publishHwOperation.photos == null) publishHwOperation.photos = [];
					publishHwOperation.photos.push(request.message.photos[request.message.photos.length - 1]);

					response = {
						doReply: true,
						message: {
							text: "Фото принято. Не забудьте отправить <b><u>/done</u></b> когда закончите. Если передумали, отправьте <b><u>/cancel</u></b>"
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

export function fillEmptyFields(request: CommandRequest, response: CommandResponse) {
	if(response.chatId == null) {
		response.chatId = request.chat.id;
	}

	if(response.doReply == true && response.replyTo == null) {
		response.replyTo = request.message.id;
	}

	return response;
}