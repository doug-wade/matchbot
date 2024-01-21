import { Plugin } from '@matchbot/core';

export default class MatchbotHockeyPlugin extends Plugin {
    static name = 'hockey';

    async fixtures() {
        this.logger.log('getting fixtures');

        return [];
    }
    async preview() {
        this.logger.log('getting preview');

        return '';
    }

    async thread() {
        this.logger.log('getting thread');

        return '';
    }
}
