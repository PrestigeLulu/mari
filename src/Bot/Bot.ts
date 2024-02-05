import ClientAllOptions from './ClientAllOptions';
import {Client} from 'discord.js';
import {TOKEN} from '../Config/Config';
import Initialize from './Initialize';

export default class Bot extends Client {
	constructor() {
		super(ClientAllOptions);
		Initialize(this);
	}

	login(): Promise<string> {
		return super.login(TOKEN);
	}
}