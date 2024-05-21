import { Bridge } from "../bridges/base"
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands"
import { PublishMessageOperation, UserOperation, UserOperationType, getCurrentUserOperation, removeCurrentUserOperation } from "../data/operations"

const DoneEntry: CommandEntry = {
	description: "Завершить текущую операцию",

	execute: async (bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> => {
		const operation = await getCurrentUserOperation(request.author);

		if(operation == null) {
			return {
				message: {
					text: "Вы еще не начали ни одной операции. Завершать нечего."
				}
			}
		}

		switch(operation.type) {
			case UserOperationType.PUBLISH_HOMEWORK: {
				const submitOperation = (operation as UserOperation<PublishMessageOperation>).data;

				if(submitOperation.photos?.length == 0 || submitOperation.text == null) {
					return {
						message: {
							text: "Вы не отправили ни одной фотографии или текст."
						}
					}
				}
				
				await removeCurrentUserOperation(request.author);

				return {
					doReply: true,
					message: {
						text: "Дз успешно опубликовано :)"
					}
				}
			} break;

			default: {
				return {
					doReply: true,
					message: {
						text: "Не известная операция. Обратитесь в поддержку: @MrBoomDev. " + operation.type
					}
				}
			}
		}
	}
}

export default DoneEntry;