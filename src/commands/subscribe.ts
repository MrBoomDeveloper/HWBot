import { Bridge, fillEmptyFields } from "../bridges/base";
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands";
import { UserOperation, UserOperationType, getCurrentUserOperation, setCurrentUserOperation } from "../data/operations";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const PATH_PREFIX = ".saved/db";

const SubscribeEntry: CommandEntry = {
	description: "Подписаться на уведомления.",

	async execute(bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> {
		let operation = await getCurrentUserOperation(request.author);

		if(operation != null) {
			if(operation.type == UserOperationType.SUBSCRIBE) {
				return {
					doReply: true,
					message: {
						text: "Вы уже начали процесс выбора подписки. Сначала завершите ее: <b><u>/done</u></b>, или отмените: <b><u>/cancel</u></b>"
					}
				}
			} else {
				return {
					doReply: true,
					message: { text: "Другая операция в процессе. Сначала завершите ее: <b><u>/done</u></b>, или отмените: <b><u>/cancel</u></b>" }
				}
			}
		}

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

		let subscribeOperation = (operation || { type: UserOperationType.SUBSCRIBE, data: [] }) as UserOperation<any>;
		setCurrentUserOperation<any>(request.author, subscribeOperation);

		let currentPath = getSelection(null, groups);

		if(currentPath == null) {
			return {
				message: {
					text: "База данных еще не сформирована. Обратитесь к разработчику: @MrBoomDev."
				}
			}
		}

		return {
			doReply: true,
			message: { text: "Выберите вашу группу" },
			buttons: getSelectionItem(currentPath, groups).items.map((item) => ({ 
				text: item.name,

				id: JSON.stringify({ 
					act: "sub_select", 
					path: currentPath + "_" + item.id
				})
			})),
		}
	}
}

export async function resolveButton(bridge: Bridge, request: CommandRequest) {
	let groups, users;

	if(!existsSync(`${PATH_PREFIX}/users.json`) || !existsSync(`${PATH_PREFIX}/groups.json`)) {
		groups = {};
		users = {};

		await mkdir(PATH_PREFIX, { recursive: true });
		await writeFile(`${PATH_PREFIX}/groups.json`, "{}");
		await writeFile(`${PATH_PREFIX}/users.json`, "{}");
	} else {
		groups = JSON.parse(await readFile(`${PATH_PREFIX}/groups.json`, "utf8"));
		users = JSON.parse(await readFile(`${PATH_PREFIX}/users.json`, "utf8"));
	}

	const extra = JSON.parse(request.button.id);
	const item = getSelectionItem(extra.path, groups);

	const operation = await getCurrentUserOperation<any[]>(request.author);
	operation.data.push(extra.path);

	if(item.with != null) {
		const path = extra.path as string;
		operation.data.push(path.substring(0, path.lastIndexOf("_")) + "_" + item.with);
	}

	await bridge.sendResponse(fillEmptyFields(request, {
		doReply: true,
		message: { text: `Ваша группа выбрана: ${item.name}. Для сохранения нажмите <b><u>/done</u></b>` },
	}));
}

export function getSelectionItem(path?: string, map?: any) {
	//TODO: Make normal implementation!

	switch(path) {
		case "bash_seraf1_10a": return map[0].items[0].items[0];
		case "bash_seraf1_10a_all": return map[0].items[0].items[0].items[0];
		case "bash_seraf1_10a_math-physics": return map[0].items[0].items[0].items[1];
		case "bash_seraf1_10a_sci-bio": return map[0].items[0].items[0].items[2];
		default: throw new Error("Unknown path: " + path);
	}
}

export function getSelection(path?: string, map?: any) {
	if(map == null) {
		return null;
	}

	let currentParent = map;

	if(path != null) {
		const parts = path.split("_");

		for(const part of parts) {
			if(Array.isArray(currentParent)) {
				currentParent = currentParent.find((item) => item.id == part);
			} else if(currentParent.items != null) {
				currentParent = currentParent.items.find((item) => item.id == part);
			} else {
				throw new Error("Unexpected file structure!");
			}
		}
	}

	if(Array.isArray(currentParent)) {
		if(currentParent.length == 0) {
			return path;
		}

		if(currentParent.length == 1) {
			if(path == null) {
				path = getSelection(currentParent[0]["id"], map);
			} else {
				path += getSelection(`${path}_${currentParent[0]["id"]}`, map);
			}
		}
		return path;
	} else if(currentParent.items != null) {
		if(currentParent.items.length == 0) {
			return path;
		}

		if(currentParent.items.length == 1) {
			if(path == null) {
				path = getSelection(currentParent.items[0]["id"], map);
			} else {
				return getSelection(`${path}_${currentParent.items[0]["id"]}`, map);
			}
		}
	}

	return path;
}

export default SubscribeEntry;