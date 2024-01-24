import { Bridge } from "../bridges/base";

const RADEON_ID = 2110317941;

export const logger = {
	info(text: string, bridge?: Bridge) {
		console.info(text);

		if(bridge != null) {
			bridge.sendResponse({
				chatId: RADEON_ID,
				message: {
					text
				}
			});
		}

	}
}