// Import the Discord library.
import Discord, {
    VoiceChannel,
    VoiceState,
} from 'discord.js';

// The ID of the channel that triggers the creation of a new dynamic voice channel.
const triggerChannelId = '1099238407588282478';

// 管理動態語音頻道的 Class
export default class DynamicVoiceChannelManager {

    // 創建新的動態語音頻道
    /**
    * @param {VoiceState} newState - The new state of the voice channel.
    */
    private async createNewDynamicVoiceChannel(newState: VoiceState): Promise<VoiceChannel> {
        // Get the parent voice channel of the new voice channel.
        const parentVoiceChannel = newState.channel as VoiceChannel;

        // Get the member of the new voice channel.
        const member = newState?.member as Discord.GuildMember;

        // Create a new voice channel with the name of the member's display name.
        const newVoiceChannel = await parentVoiceChannel.clone({
            name: `${newState.member?.displayName} 的語音頻道`,
        });

        // Set the permission overwrites for the new voice channel.
        await newVoiceChannel.permissionOverwrites.edit(
            member.user,
            {
                MuteMembers: true,
                DeafenMembers: true,
                PrioritySpeaker: true,
                ManageChannels: true,
            }
        );

        // Return the new voice channel.
        return newVoiceChannel;
    }

    // Determines whether a voice channel should be deleted.
    /**
     * @param {VoiceChannel} oldVoiceChannel - The old voice channel.
     * @param {GuildBasedChannel} mainChannel - The main channel.
     */
    private async shouldDeleteVoiceChannel(
        oldVoiceChannel: VoiceChannel | null,
        mainChannel: VoiceChannel
    ): Promise<boolean> {
        // Check if oldVoiceChannel is null or parent properties are null or not equal
        if (
            !oldVoiceChannel ||
            !oldVoiceChannel.parent ||
            !mainChannel.parent ||
            oldVoiceChannel.parent.id !== mainChannel.parent.id
        ) {
            return false;
        }
    
        // If the old voice channel is the trigger channel, do not delete it.
        if (oldVoiceChannel.id === triggerChannelId) {
            return false;
        }
    
        // If the old voice channel has no members, delete it.
        return oldVoiceChannel.members.size === 0;
    }

    // Handles dynamic voice channels.
    async handleDyanmicVoiceChannel(oldState: VoiceState, newState: VoiceState) {
        // If the new state's channel ID is the same as the trigger channel ID,
        // create a new dynamic voice channel for the member.
        if (newState.channel?.id === triggerChannelId) {
            const newVoiceChannel = await this.createNewDynamicVoiceChannel(newState);
            await newState.member?.voice.setChannel(newVoiceChannel);
        }

        // If the old state's channel ID is the same as the trigger channel ID
        // and the new state's channel ID is not the same as the trigger channel ID,
        // delete the old dynamic voice channel.
        if (
            oldState.channel?.id !== triggerChannelId && newState.channel?.id !== triggerChannelId
        ) {
            const oldVoiceChannel = oldState.channel as VoiceChannel;
            const mainChannel = await oldState.guild.fetch();
            const dynamicVoiceChannel = await mainChannel.channels.fetch(
                triggerChannelId
            ) as VoiceChannel;

            if (await this.shouldDeleteVoiceChannel(oldVoiceChannel, dynamicVoiceChannel)) {
                await oldVoiceChannel.delete();
            }
        }
    }
}
