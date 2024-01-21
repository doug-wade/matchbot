export default class Thread {
    constructor(context) {
        this.name = context.name;
        this.args = context.args;
        this.date = context.date;
        this.id = context.id;
        this.completed = context.completed;
    }
}