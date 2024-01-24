import { CommandEntry } from "../data/commands";

const HWCommand: CommandEntry = {
	description: "Отправить всем дз",

	async execute(request, args) {
		return {
			doReply: true,
			message: {
				text: "Данный функционал еще не доделан"
			}
		}
	}
}

export default HWCommand;