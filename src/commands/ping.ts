import { CommandEntry } from "../data/commands";

const PingCommand: CommandEntry = {
	description: "Проверить, работает ли бот",

	async execute() {
		return {
			doReply: true,
			
			message: {
				text: "Понг!"
			}
		}
	}
}

export default PingCommand;