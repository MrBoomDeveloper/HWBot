import consola from "consola";
import { CommandRequest, CommandResponse, RequestType } from "../data/commands";
import { Bridge, resolveRequest } from "./base";
import TelegramBot, { InputMedia } from "node-telegram-bot-api";
import { readFile } from "node:fs/promises";

export class TelegramBridge implements Bridge {
	private client: TelegramBot;
	private token: string;

	constructor(token: string) {
		if(token == null) {
			throw new Error("Хей, ты случаем не забыл про файл \".env\"? Укажи токен в переменной окружения TELEGRAM_BOT_TOKEN");
		}

		this.token = token;
	}

	async getFileLink(photoId: string): Promise<string> {
		return await this.client.getFileLink(photoId);
	}

	async start() {
		this.client = new TelegramBot(this.token, { polling: true });

		this.client.on("text", async (message) => resolveRequest(this, this.getRequest(message, "text")));
		this.client.on("photo", async (message) => resolveRequest(this, this.getRequest(message, "photo")));
		this.client.on("document", async (message) => resolveRequest(this, this.getRequest(message, "file")));
		this.client.on("voice", async (message) => resolveRequest(this, this.getRequest(message, "voice")));

		this.client.on("polling_error", (error) => {
			if(error.message == CLONE_INSTANCE_ERROR) {
				throw new Error("Клон уже запущен, выключай его!");
			}

			throw new Error("Телегам бот упал :(", { cause: error });
		});

		consola.success("Телеграм бот запущен!");
	}

	async sendResponse(response: CommandResponse): Promise<void> {
		if(response.message.photos != null) {
			/**
			 * Нам нужно напрямую отправлять картинки, однако предоставленный интерфейс 
			 * не предоставляет возможности использовать буферы, лишь картинки. 
			 * Однако имплементация поддерживает буферы, поэтому мы можем без указания типа использовать буферы.
			 */

			const photos = [];

			for(let i = 0; i < response.message.photos.length; i++) {
				const photo = response.message.photos[i];
				const buffer = await readFile(`./.saved/schedules/${photo}`);

				photos.push({
					type: "photo",
					media: buffer,
					caption: ((i == 0) ? response.message.text : undefined)
				});
			}

			// В телеграме используется ограничение на 10 картинок в одном сообщении
			while(photos.length > 10) {
				photos.pop();
				consola.warn("Ограничение на 10 картинок в одном сообщениию. Лишние картинки были удалены.");
			}

			await this.client.sendMediaGroup(response.chatId, photos, {
				reply_to_message_id: response.replyTo,
			});

			return;
		}

		await this.client.sendMessage(response.chatId, response.message.text, {
			reply_to_message_id: response.replyTo,
			parse_mode: "HTML"
		});
	}

	getRequest(message: TelegramBot.Message, type: RequestType): CommandRequest | null {
		return {
			type,

			message: {
				text: message.text,
				id: message.message_id,
				photos: message.photo?.map((photo) => photo.file_id)
			},
			
			author: {
				id: message.from.id,
				name: message.from.first_name,
				username: message.from.username,
				platform: "telegram"
			},

			chat: {
				name: message.chat.title,
				id: message.chat.id
			}
		};
	}

	resolveFirstArgument(arg1: string): string | null {
		const username = `@${process.env.TELEGRAM_BOT_USERNAME}`;

		if(arg1.endsWith(username)) {
			arg1 = arg1.substring(0, arg1.length - username.length);
		} else if(arg1.includes("@")) {
			return null;
		}

		return arg1;
	}

	getPrefix(): string | string[] {
		return "/";
	}
}

const CLONE_INSTANCE_ERROR = "ETELEGRAM: 409 Conflict: terminated by other getUpdates request; make sure that only one bot instance is running";