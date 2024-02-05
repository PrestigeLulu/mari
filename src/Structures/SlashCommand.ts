import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import Bot from '../Bot/Bot';

type onInteractType = (bot: Bot, interaction: ChatInputCommandInteraction) => void;

export default class SlashCommand {
	constructor(public readonly slashCommand: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>, public readonly onInteract: onInteractType) {
	}
}