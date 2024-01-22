import { Plugin } from '@matchbot/core';

export default class MatchbotHockeyPlugin extends Plugin {
    name = 'hockey';

    async fixtures() {
        this.logger.log('getting hockey fixtures');

        return [];
    }
    async preview() {
        this.logger.log('getting hockey preview');
        
        (async () => {
            const response = await fetch('https://statsapi.web.nhl.com/api/v1/schedule?teamId=10&startDate=2021-01-01&endDate=2021-01-31');
            const data = await response.json();
            console.log(data);
        }

        return '';
    }

    async thread() {
        this.logger.log('getting hockey thread');

        return '';
    }
}
