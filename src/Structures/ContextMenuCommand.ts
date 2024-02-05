import {ContextMenuCommandBuilder, ContextMenuCommandInteraction} from 'discord.js';
import Bot from '../Bot/Bot';

type onInteractType = (bot: Bot, interaction: ContextMenuCommandInteraction) => void;

export default class ContextMenuCommand {
	constructor(public readonly contextMenuCommand: ContextMenuCommandBuilder, public readonly onInteract: onInteractType) {
	}
}