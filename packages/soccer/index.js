import { Plugin, Thread, Post } from '@matchbot/core';

import previewTemplate from './preview.js';
import threadTemplate from './thread.js';
export default class MatchbotSoccerPlugin extends Plugin {
    name = 'soccer';
    #baseUrl = 'https://v3.football.api-sports.io';
    #requestOptions = {};

    constructor(context) {
        super(context);

        this.teamId = context.config.teamId;
        this.season = context.config.season;

        const headers = new Headers();
        headers.append('x-rapidapi-key', process.env.API_KEY);
        headers.append('x-rapidapi-host', this.#baseUrl);
        this.#requestOptions = {
            method: 'GET',
            headers,
            redirect: 'follow'
        };
    }

    async fixtures() {
        const season = this.season || await this.#getLatestSeason();
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
                args: fixture,
                completed: fixture.status.short === 'FT',
            });
        });
    }

    async preview({ id }) {
        const fixture = await this.#getFixture(id);
        const body = previewTemplate(fixture);

        return new Post({
            name: `[MATCH PREVIEW]: (${fixture.league.name} ${fixture.league.round}) ${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
            body,
        });
    }

    async thread({ id }) {
        const fixture = await this.#getFixture(id);
        const body = threadTemplate(fixture);

        return new Post({
            name: `[MATCH THREAD]: (${fixture.league.name} ${fixture.league.round}) ${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
            body,
        });
    }

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

    async #getFixture(id) {
        const url = `${this.#baseUrl}/fixtures?id=${id}`;

        const result = await this.fetch(url, this.#requestOptions);

        if (result.results === 0) {
            this.logger.error('Fixture not found with id', id);
            return null;
        }

        return result.response[0];
    }
}
