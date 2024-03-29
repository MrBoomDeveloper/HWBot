import consola from "consola";
import { CommandRequest, CommandResponse } from "../data/commands";
import { Bridge } from "./base";

export class DiscordBridge implements Bridge {
	async start() {
		consola.warn("Дискорд мост еще не сделан.");
	}

	getCommand(message: any): CommandRequest | null {
		return null;
	}

	sendResponse(reponse: CommandResponse): Promise<void> {
		throw new Error("Method not implemented.");
	}

	getPrefix(): string | string[] {
		return ["/", "hw!"];
	}

	async getFileLink(photoId: string): Promise<string> {
		return null;
	}
}