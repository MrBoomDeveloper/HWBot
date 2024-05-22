import { CommandEntry } from "../data/commands";
import { readdir, readFile } from "fs/promises";

const HWCommand: CommandEntry = {
	description: "Получить все дз",

	async execute() {
		const files = await readdir(".saved/hw");

		if(files.length == 0) {
			return {
				doReply: true,
				message: {
					text: "Дз не найдено"
				}
			}
		}

		return {
			doReply: true,
			message: {
				text: "Вот вам пара картинок, загруженных к боту пользователями...",
				photos: files.map((file) => `.saved/hw/${file}`)
			}
		}
	}
}

export default HWCommand;