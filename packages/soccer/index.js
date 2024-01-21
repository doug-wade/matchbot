import { Plugin, Thread } from '@matchbot/core';

export default class MatchbotSoccerPlugin extends Plugin {
    static name = 'SOCCER';
    static baseUrl = 'https://v3.football.api-sports.io';

    constructor(context) {
        super(context);

        this.name = context.config.name;
        this.teamId = context.config.teamId;
    }

    async fixtures() {
        const myHeaders = new Headers();
    
        myHeaders.append("x-rapidapi-key", process.env.API_KEY);
        myHeaders.append("x-rapidapi-host", this.baseUrl);
    
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        let fixtures = [];
        try {
            const response = await this.fetch(`https://v3.football.api-sports.io/team=${this.teamId}`, requestOptions);
            const result = await response.json();

            if (result.api.error) {
                this.logger.error('Fetching fixtures failed with error', result.api.error);
                return [];
            }

            if (result.api.results === 0) {
                return [];
            }

            fixtures = result.response.map((fixture) => {
                return new Thread({
                    date: fixture.timestamp,
                    name: this.name,
                    args: fixture
                });
            });
        } catch (error) {
            this.logger.error('Failed getting fixtures with error', error);
        }

        return fixtures;
    }

    async preview(...args) { console.log('soccer preview', ...args); }

    async thread(...args) { console.log('soccer thread', ...args); }
};
