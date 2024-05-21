import { Bridge } from "../bridges/base";
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands";

const SettingsCommand: CommandEntry = {
	description: "Настройки",
	
	async execute(bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> {
		return {
			doReply: true,
			message: {
				text: "Данный функционал еще не доделан"
			}
		}
	}
}

export default SettingsCommand;