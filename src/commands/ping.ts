import { CommandEntry } from "../setup/commandsParser";

const PingCommand: CommandEntry = {
	description: "Проверить, работает ли бот",

	async execute(request) {
		return {
			doReply: true,
			
			message: {
				text: "Понг!"
			}
		}
	}
}

export default PingCommand;