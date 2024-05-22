import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

export async function checkExistence() {
	for(const dir of ["./.saved/schedules", "./.saved/hw", "./.saved/db"]) {
		try {
			await mkdir(dir, { recursive: true });
		} catch(e) {
			if(e.code != "EEXIST") {
				throw new Error(`Не удалось создать папку "${dir}"`, { cause: e });
			}
		}
	}

	if(!existsSync(".saved/db/users.json")) {
		await writeFile(".saved/db/users.json", "{}");
	}

	if(!existsSync(".saved/db/groups.json")) {
		await writeFile(".saved/db/groups.json", "[]");
	}

	if(!existsSync(".saved/db/hw.json")) {
		await writeFile(".saved/db/hw.json", "[]");
	}
}