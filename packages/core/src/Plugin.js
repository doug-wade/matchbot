export default class Plugin {
    constructor(context) {
        this.instance = context.instance;
        this.community = context.community;
        this.db = context.db;
        this.fetch = context.fetch;
        this.lemmy = context.lemmy;
        this.logger = context.logger;
    }
};
