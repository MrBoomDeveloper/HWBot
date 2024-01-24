import { CommandEntry } from "../data/commands";

const HWCommand: CommandEntry = {
	description: "Получить все дз",

	async execute() {
		return {
			doReply: true,
			message: {
				text: "Данный функционал еще не доделан"
			}
		}
	}
}

export default HWCommand;