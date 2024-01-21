import { Plugin, Thread } from '@matchbot/core';

export default class MatchbotSoccerPlugin extends Plugin {
    name = 'soccer';
    #baseUrl = 'https://v3.football.api-sports.io';
    #requestOptions = {};

    constructor(context) {
        super(context);

        this.teamId = context.config.teamId;

        const headers = new Headers();
        headers.append("x-rapidapi-key", process.env.API_KEY);
        headers.append("x-rapidapi-host", this.#baseUrl);
        this.#requestOptions = {
            method: 'GET',
            headers,
            redirect: 'follow'
        };
    }

    async fixtures() {
        const season = await this.#getLatestSeason();

        const url = `${this.#baseUrl}/fixtures?team=${this.teamId}&season=${season}`;
        let result = null;
        try {
            result = await this.fetch(url, this.#requestOptions);
        } catch (error) {
            this.logger.error('Failed to perform fetch with error', error);
            return [];
        }

        return result.response.map(({ fixture, league, teams }) => {
            const name = `(${league.name} ${league.round}) ${teams.home.name} vs ${teams.away.name}`;

            return new Thread({
                id: fixture.id,
                name,
                date: fixture.timestamp,
                args: fixture
            });
        });
    }

    async preview(...args) { console.log('soccer preview', ...args); }

    async thread(...args) { console.log('soccer thread', ...args); }

    async #getLatestSeason() {
        const url = `${this.#baseUrl}/teams/seasons?team=${this.teamId}`;
        
        let result = null;
        try {
            result = await this.fetch(url, this.#requestOptions);
        } catch (error) {
            this.logger.error('Failed to perform fetch with error', error);
            return [];
        }

        if (result.results === 0) {
            this.logger.error('No results found');
            return [];
        }

        const latestSeason = result.response[result.response.length - 1];
        this.logger.debug(`Found latest season ${latestSeason} for team ${this.teamId}`);
        return latestSeason;
    }
};
