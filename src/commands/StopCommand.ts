import { BaseCommand } from "../structures/BaseCommand";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["st"],
    name: "stop",
    description: "Stop the queue",
    usage: "{prefix}stop"
})
export class StopCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message): any {
        message.guild?.queue?.songs.clear();
        message.guild?.queue?.currentPlayer?.stop(true);
        message.guild!.queue!.oldMusicMessage = null; message.guild!.queue!.oldVoiceStateUpdateMessage = null;

        message.channel.send({ embeds: [createEmbed("info", "⏹ Queue stopped.")] })
            .catch(e => this.client.logger.error("STOP_CMD_ERR:", e));
    }
}
