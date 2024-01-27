import consola from "consola";
import { CommandRequest, CommandResponse } from "../data/commands";
import { Bridge } from "./base";

export class VKBridge implements Bridge {
	async start() {
		consola.warn("Вк мост еще не сделан.");
	}

	getCommand(message: any): CommandRequest | null {
		return null;
	}

	sendResponse(reponse: CommandResponse): Promise<void> {
		throw new Error("Method not implemented.");
	}

	getPrefix(): string | string[] {
		return "/";
	}

	async getFileLink(photoId: string): Promise<string> {
		return `https://vk.com/photo${photoId}`
	}
}