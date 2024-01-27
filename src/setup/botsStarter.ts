import { consola } from "consola";
import { DiscordBridge } from "../bridges/discord";
import { TelegramBridge } from "../bridges/telegram";
import { VKBridge } from "../bridges/vk";
import { startWebsite } from "../web/server";

export async function startAllBots() {
	return Promise.allSettled([
		new TelegramBridge(process.env.TELEGRAM_BOT_TOKEN).start(),
		new VKBridge().start(),
		new DiscordBridge().start(),
		startWebsite()
	]).then((a) => {
		let isAllOk = true;

		if(a[0].status == "rejected") {
			consola.error("Телеграм бот упал :(", a[0].reason);
			isAllOk = false;
		}

		if(a[1].status == "rejected") {
			consola.error("Вк бот упал :(", a[1].reason);
			isAllOk = false;
		}

		if(a[2].status == "rejected") {
			consola.error("Дискорд бот упал :(", a[2].reason);
			isAllOk = false;
		}

		if(a[3].status == "rejected") {
			consola.error("Вебсайт упал :(", a[3].reason);
			isAllOk = false;
		}

		if(isAllOk) {
			consola.success("Все боты были запущены успешно!");
		}

		return a;
	});
}