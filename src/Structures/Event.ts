import {ClientEvents} from 'discord.js';
import Bot from '../Bot/Bot';

type onCallType = (bot: Bot, ...args: any[]) => void;

export default class Event {
	constructor(public readonly eventName: keyof ClientEvents, public readonly onCall: onCallType) {
	}
}
