import { CommandEntry, getCommands } from "../data/commands";

const HelpCommand: CommandEntry = {
	description: "Вывести список команд",

	async execute() {
		let text = "<b>Список команд:</b> \n";

		text += Object.entries(getCommands())
			.filter(([key, value]) => !value.isHidden && !value.isAdmin && key != "help")
			.map(([key, value]) => {
				let result = `    /${key}`;

				if(value.arguments != null && value.arguments.length > 0) {
					result += ` [ ${value.arguments.join(", ")} ]`;
				}

				if(value.description != null) {
					result += ` - ${value.description}`;
				}

				return result;
			}).join("\n");

		text += "\n\n<b>Поддержка:</b> @MrBoomDev"

		return {
			doReply: true,
			message: { text }
		}
	}
}

export default HelpCommand;