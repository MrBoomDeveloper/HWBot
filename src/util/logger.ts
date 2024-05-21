import consola from "consola";
import { Bridge } from "../bridges/base";

export const logger = {
	info(text: string, bridge?: Bridge) {
		consola.info(text);

		if(bridge != null) {
			// bridge.sendResponse({
			// 	chatId: RADEON_ID,
			// 	message: {
			// 		text
			// 	}
			// });
		}

	}
}