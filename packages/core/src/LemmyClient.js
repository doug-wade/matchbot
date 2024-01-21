import { LemmyHttp } from 'lemmy-js-client';

class LemmyClient {
    #jwt;
    #client;

    constructor (config, logger) {
        this.logger = logger;
        this.dryRun = config.dryRun;

        const headers = {
            'User-Agent': config.userAgent,
            'Accept': 'application/json',
        };
        
        let instance;
        if (config.instance.startsWith('http')) {
            instance = config.instance;
        } else {
            instance = `https://${config.instance}`;
        }

        this.#client = new LemmyHttp(instance, headers);
    }

    async login() {
        if (this.dryRun) {
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
        const response = await this.#client.login(loginForm);
        this.#jwt = response.jwt;
    }

    async createPost({ name, body }, community_id) {
        const postForm = {
            community_id,
            name,
            body,
            auth: this.#jwt,
        };
        
        if (this.dryRun) {
            this.logger.debug('Dry run, not creating post', postForm);
            return;
        }

        return await this.#client.createPost(postForm);
    }
}

let lemmyClient;
export default async (config, logger) => {
    if (lemmyClient) {
        return lemmyClient;
    }

    const localLemmyClient = new LemmyClient(config, logger);
    await localLemmyClient.login();
    lemmyClient = localLemmyClient;

    return lemmyClient;
}
