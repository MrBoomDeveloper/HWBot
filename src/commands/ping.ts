import { CommandEntry } from "../setup/commandsParser";

export default function Details(): CommandEntry {
	return {
		description: "Проверить, работает ли бот",

		async execute(request) {
			return {
				replyTo: request.message.id,
				message: {
					text: "Понг!"
				}
			}
		}
	}
}