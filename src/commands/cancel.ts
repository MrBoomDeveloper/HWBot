import { Bridge } from "../bridges/base"
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands"
import { getCurrentUserOperation, removeCurrentUserOperation } from "../data/operations"

const CancelEntry: CommandEntry = {
	description: "Отменить текущую операцию",
	execute: async (bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> => {
		const operation = await getCurrentUserOperation(request.author);

		if(operation == null) {
			return {
				message: {
					text: "Вы еще не начали ни одной операции. Отменять нечего."
				}
			}
		}

		removeCurrentUserOperation(request.author);

		return {
			doReply: true,
			message: {
				text: "Операция отменена успешно."
			}
		}
	}
}

export default CancelEntry;