export default class Plugin {
    constructor(context) {
        this.instance = context.instance;
        this.community_id = context.community_id;
        this.db = context.db;
        this.fetch = context.fetch;
        this.lemmy = context.lemmy;
        this.logger = context.logger;
    }
}
