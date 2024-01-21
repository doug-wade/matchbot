import { LemmyHttp } from 'lemmy-js-client';

export default class LemmyClient {
    #jwt;
    #client;

    constructor (config) {
        const headers = {
            'User-Agent': config.userAgent,
            'Accept': 'application/json',
        };
        this.#client = new LemmyHttp(config.instance, headers);
    }

    async login () {
        if (this.config.dryRun) {
            this.logger.debug('Dry run, not logging in');
            return;
        }

        if (this.#jwt) {
            return;
        }

        const loginForm = {
            username_or_email: process.env.LEMMY_USERNAME,
            password: process.env.LEMMY_PASSWORD,
        };
        const response = await client.login(loginForm);
        this.#jwt = response.jwt;
    }

    async createPost({ name, body }) {
        const postForm = {
            community_id: this.community,
            name,
            body,
            auth: this.#jwt,
        };
        
        if (this.config.dryRun) {
            this.logger.debug('Dry run, not creating post', postForm);
            return;
        }

        return null; // await this.#client.createPost(postForm);
    }
}
