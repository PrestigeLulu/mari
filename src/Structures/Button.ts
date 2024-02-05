import Bot from '../Bot/Bot';
import {ButtonBuilder, ButtonInteraction} from 'discord.js';

type onInteractType = (bot: Bot, interaction: ButtonInteraction) => void;

export default class Button {
	constructor(public readonly customId: string, public readonly buttonBuilder: ButtonBuilder, public readonly onInteract: onInteractType) {
	}
}