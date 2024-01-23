import { Bridge, CommandRequest, CommandResponse } from "./base";

export class VKBridge implements Bridge {
	async start() {
		console.warn("Вк мост еще не сделан.");
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
}