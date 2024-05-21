import { Bridge } from "../bridges/base";
import { CommandEntry, CommandRequest } from "../data/commands";
import { mkdir } from "fs/promises";

const ScheduleCommand: CommandEntry = {
	description: "Отправить новое расписание",

	async execute(bridge: Bridge, request: CommandRequest, args: string[]) {
		return {
			doReply: true,
			message: {
				text: "Данный функционал еще не доделан"
			}
		}
	}
}

export default ScheduleCommand;