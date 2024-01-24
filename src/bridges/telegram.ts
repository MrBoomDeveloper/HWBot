import { Bridge, CommandRequest, CommandResponse, resolveRequest } from "./base";
import TelegramBot from "node-telegram-bot-api";

export class TelegramBridge implements Bridge {
	private client: TelegramBot;
	private token: string;

	constructor(token: string) {
		if(token == null) {
			throw new Error("Хей, ты случаем не забыл про файл \".env\"? Укажи токен в переменной окружения TELEGRAM_BOT_TOKEN");
		}

		this.token = token;
	}

	async start() {
		this.client = new TelegramBot(this.token, { polling: true });

		this.client.on("message", async (message) => {
			resolveRequest(this, this.getRequest(message));
		});

		this.client.on("polling_error", (error) => {
			if(error.message == CLONE_INSTANCE_ERROR) {
				throw new Error("Клон уже запущен, выключай его!");
			}

			throw new Error("Телегам бот упал :(", { cause: error });
		});
	}

	async sendResponse(reponse: CommandResponse): Promise<void> {
		if(reponse.message.photos != null) {
			//await this.client.sendMediaGroup(reponse.chatId, reponse.message.photos);
			throw new Error("Фото не поддерживаются.");
		}

		await this.client.sendMessage(reponse.chatId, reponse.message.text, {
			reply_to_message_id: reponse.replyTo
		});
	}

	getRequest(message: TelegramBot.Message): CommandRequest | null {
		return {
			message: {
				text: message.text,
				id: message.message_id
			},
			
			author: {
				id: message.from.id,
				name: message.from.first_name,
				username: message.from.username
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