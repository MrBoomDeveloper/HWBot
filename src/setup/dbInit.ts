import { mkdir } from "node:fs/promises";

export async function initDb() {
	await createDirs();
}

async function createDirs() {
	for(const dir of ["./.saved/schedules"]) {
		try {
			await mkdir(dir, { recursive: true });
		} catch(e) {
			if(e.code != "EEXIST") {
				throw new Error(`Не удалось создать папку "${dir}"`, { cause: e });
			}
		}
	}
}