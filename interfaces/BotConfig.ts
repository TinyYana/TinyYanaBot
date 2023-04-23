export interface BotConfig {
    welcome: {
        title: string;
        description: string;
        channelId: string;
    };
    memberCount: {
        memberCountChannelId: string;
    };
    dynamicVoiceChannel: {
        triggerChannelId: string
    }
}