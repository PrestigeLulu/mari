import Bot from '../Bot/Bot';
import {ModalBuilder, ModalSubmitInteraction} from 'discord.js';

type onInteractType = (bot: Bot, interaction: ModalSubmitInteraction) => void;

export default class Modal {
	constructor(public readonly customId: string, public readonly modalBuilder: ModalBuilder, public readonly onInteract: onInteractType) {
	}
}
