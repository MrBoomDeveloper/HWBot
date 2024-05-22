import { Bridge } from "../bridges/base";
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands";
import { PublishMessageOperation, UserOperationType, getCurrentUserOperation, setCurrentUserOperation } from "../data/operations";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const AddHwCommand: CommandEntry = {
	description: "Опубликовать новое дз",

	async execute(bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> {
		let operation = await getCurrentUserOperation(request.author);

		if(operation?.type == UserOperationType.PUBLISH_HOMEWORK) {
			return {
				doReply: true,
				message: {
					text: "Вы уже отправляете дз! Сначала завершите текущую операцию: <b><u>/done</u></b>, или отмените: <b><u>/cancel</u></b>"
				}
			}
		}

		const PATH_PREFIX = ".saved/db";
		let groups, users;

		if(!existsSync(`${PATH_PREFIX}/users.json`) || !existsSync(`${PATH_PREFIX}/groups.json`)) {
			groups = {};
			users = {};

			await mkdir(PATH_PREFIX, { recursive: true });
			await writeFile(`${PATH_PREFIX}/users.json`, "{}");
			await writeFile(`${PATH_PREFIX}/groups.json`, "{}");
		} else {
			groups = JSON.parse(await readFile(`${PATH_PREFIX}/groups.json`, "utf8"));
			users = JSON.parse(await readFile(`${PATH_PREFIX}/users.json`, "utf8"));
		}

		const me = users[bridge.getPlatformName()]?.find(u => u.id == request.author.id);

		if(me == null) {
			return {
				doReply: true,
				message: {
					text: "Вы не состоите ни в одной группе. Вы не можете опубликовать дз. Используйте команду: <b><u>/subscribe</u></b>"
				}
			}
		}

		setCurrentUserOperation<PublishMessageOperation>(request.author, {
			type: UserOperationType.PUBLISH_HOMEWORK,
			data: {}
		});

		return {
			doReply: true,
			message: {
				text: "Вы можете отправить несколько фотографий. После этого отправьте: <b><u>/done</u></b> для опубликования дз. Если вы передумали, то просто отправьте: <b><u>/cancel</u></b>"
			}
		}
	}
}

export default AddHwCommand;