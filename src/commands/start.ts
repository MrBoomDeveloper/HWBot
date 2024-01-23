import { CommandEntry } from "../setup/commandsParser";
import HelpCommand from "./help";

const StartCommand: CommandEntry = {
	execute: HelpCommand.execute,
	isHidden: true
}

export default StartCommand;