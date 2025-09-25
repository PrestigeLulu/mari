import Bot from "../../Bot/Bot";
import Event from "../../Structures/Event";

function onCall(bot: Bot): void {
  console.log(`Logged in ${bot.user?.tag}`);
}

const Ready = new Event("clientReady", onCall);

export default Ready;
