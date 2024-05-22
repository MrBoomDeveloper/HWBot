import { Bridge } from "../bridges/base";
import { CommandEntry, CommandRequest, CommandResponse } from "../data/commands";
import { PublishMessageOperation, UserOperation, UserOperationType, getCurrentUserOperation, removeCurrentUserOperation } from "../data/operations";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const DoneEntry: CommandEntry = {
	description: "Завершить текущую операцию",

	execute: async (bridge: Bridge, request: CommandRequest, args?: string[]): Promise<CommandResponse> => {
		const operation = await getCurrentUserOperation(request.author);

		if(operation == null) {
			return {
				message: {
					text: "Вы еще не начали ни одной операции. Завершать нечего."
				}
			}
		}

		switch(operation.type) {
			case UserOperationType.PUBLISH_HOMEWORK: {
				const submitOperation = (operation as UserOperation<PublishMessageOperation>).data;

				if(submitOperation.photos?.length == 0 && submitOperation.text == null) {
					return {
						message: {
							text: "Вы еще не отправили ни одной фотографии или сообщения!"
						}
					}
				}

				for(const photo of submitOperation.photos) {
					const fileLink = await bridge.getFileLink(photo);

					const fetched = await fetch(fileLink);
					const buffer = Buffer.from(await fetched.arrayBuffer());

					mkdir(`./.saved/hw`, { recursive: true });
					writeFile(`./.saved/hw/${photo}.jpg`, buffer);
				}
				
				await removeCurrentUserOperation(request.author);

				return {
					message: {
						text: "Дз успешно опубликовано :)"
					}
				}
			} break;

			case UserOperationType.SUBSCRIBE: {
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

				let table = users[bridge.getPlatformName()];

				if(table == null) {
					users[bridge.getPlatformName()] = [];
					table = users[bridge.getPlatformName()];
				}

				const found = ((table as any[])?.find(user => user.id == request.author.id));
				const items = Array.from(new Set(operation.data as string[]));

				if(found == null) {
					table.push({
						id: request.author.id,
						groups: items
					});
				} else {
					found.groups = items;
				}

				await writeFile(`${PATH_PREFIX}/users.json`, JSON.stringify(users));
				await removeCurrentUserOperation(request.author);

				return {
					message: {
						text: "Ваши подписки сохранены."
					}
				}
			}

			default: {
				return {
					message: {
						text: "Неизвестная операция. Обратитесь в поддержку: @MrBoomDev. " + operation.type
					}
				}
			}
		}
	}
}

export default DoneEntry;