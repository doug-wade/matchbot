import { Plugin } from '@matchbot/core';

export default class MatchbotHockeyPlugin extends Plugin {
    name = 'hockey';

    async fixtures() {
        this.logger.log('getting hockey fixtures');

        return [];
    }
    async preview() {
        this.logger.log('getting hockey preview');

        return '';
    }

    async thread() {
        this.logger.log('getting hockey thread');

        return '';
    }
}
