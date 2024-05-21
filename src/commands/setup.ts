import { Bridge } from "../bridges/base";
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands";
import { OperationAs, UserOperationType, getCurrentUserOperation, setCurrentUserOperation } from "../data/operations";

const SetupCommand: CommandEntry = {
	description: "Авторизация",

	async execute(bridge: Bridge, request: CommandRequest): Promise<CommandResponse> {
		const operation = await getCurrentUserOperation<OperationAs>(request.author);

		if(operation != null) {
			return {
				doReply: true,
				message: {
					text: "Процесс авторизации уже начат!"
				}
			}
		}

		setCurrentUserOperation(request.author, {
			type: UserOperationType.SETUP,
			data: {}
		});

		return {
			doReply: true,
			message: {
				text: "Поехали! Для начало кто вы?"
			}
		}
	}
}

export default SetupCommand;