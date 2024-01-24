import { CommandEntry, getCommands } from "../data/commands";

const HelpCommand: CommandEntry = {
	description: "Вывести список команд",

	async execute(request) {
		const formatted = Object.entries(getCommands())
			.filter(([key, value]) => !value.isHidden && !value.isAdmin && key != "help")
			.map(([key, value]) => {
				let result = `  /${key}`;

				if(value.arguments != null && value.arguments.length > 0) {
					result += ` [ ${value.arguments.join(", ")} ]`;
				}

				if(value.description != null) {
					result += ` - ${value.description}`;
				}

				return result;
			});

		return {
			doReply: true,

			message: {
				text: "Список команд: \n" + formatted.join("\n")
			}
		}
	}
}

export default HelpCommand;