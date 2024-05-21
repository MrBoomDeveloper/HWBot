import { Bridge } from "../bridges/base";
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands";
import { PublishMessageOperation, UserOperationType, getCurrentUserOperation, setCurrentUserOperation } from "../data/operations";

const AddHwCommand: CommandEntry = {
	description: "Опубликовать новое дз",

	async execute(bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> {
		let operation = await getCurrentUserOperation(request.author);

		if(operation?.type == UserOperationType.PUBLISH_HOMEWORK) {
			return {
				doReply: true,
				message: {
					text: "Вы уже отправляете дз! Сначала завершите текущую операцию: <b><u>/done</u></b>, или отмените: <b><u>/cancel</u></b>"
				}
			}
		}

		setCurrentUserOperation<PublishMessageOperation>(request.author, {
			type: UserOperationType.PUBLISH_HOMEWORK,
			data: {}
		});

		return {
			doReply: true,
			message: {
				text: "Вы можете отправить несколько фотографий. После этого отправьте: <b><u>/done</u></b> для опубликования дз. Если вы передумали, то просто отправьте: <b><u>/cancel</u></b>"
			}
		}
	}
}

export default AddHwCommand;