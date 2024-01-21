# Matchbot

Matchbot is a pluggable Lemmy bot framework for making matchbots for various sports. See `packages/example` for an example of how to use the bot framework.

## Creating bots

### Options

There are ten options that can be passed to `createBot`.

#### cache

This is the number of milliseconds to cache network requests made with the fetch client. If set to 0, then no caching will be used. This is used to reduce the number of network requests that are made to apis using the fetch client, which is helpful for reducing costs.

For instance, if you have an api that only allows 100 requests per 24 hours to a single endpoint to stay on their free tier, then you can set the cache value to 864000 (about 14 minutes), and then you can guarantee that you will never go over the free tier.

This is most useful when developing a plugin, since development tends to lead to lots of network requests. For users of `createBot`, it is easier to control the number of network requests using `fixturePollInterval` and `matchPollInterval`.

#### databaseFilename

The name of the file to be used to save the state of the application in. If you're looking to back up your match thread bot, this is the file to backup. Defaults to matchbot.db.

#### dryRun

Whether the bot should make network requests. When set to true, the bot instead emits debug log lines when it would have called the network. Defaults to false.

#### fixturePollInterval

This is the interval at which the bot will check for new fixtures. Fixtures change infrequently, so this can generally be set to a large value. Defaults to one day (86400000 milliseconds).

#### instance

This is the lemmy instance that you want your bot to post to. Defaults to lemmy.world.

#### matchPollInterval

This is the interval at which the bot will poll for creating and updating match threads. Use this to tune cost vs responsiveness. Defaults to 5 minutes (300000 milliseconds).

#### plugins

This is the list of plugins for your bot to run. Consult the documentation for the individual plugins to find the options that they support. Defaults to an empty list.

#### previewThreadInterval

This is the amount of time before a fixture is scheduled to post the preview thread. Defaults to 28000000 milliseconds (8 hours).

#### userAgent

This is the user agent string that the bot will use to identify itself to your lemmy instance and your fetch requests using the `fetch` function provided. It's good manners to identify yourself for ease of logging and rate-limiting, so we encourage you to change the userAgent string to contain some information that can be used to contact you, the administrator of the bot -- your email address, a link to a github repository, something. Defaults to Mozilla/5.0 (compatible; @matchbot/1.0; +https://github.com/doug-wade/matchbot).

#### verbose

Whether or not to emit verbose logging. Defaults to false.

### Example

Here is a minimal example of a bot that posts match threads to the Reign FC lemmy community on `lemmy.world` for Reign FC matches using the soccer plugin.

```javascript
import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';

createBot({
    plugins: [
        soccer({
            teamId: 3002,
            community: 'reign_fc',
        }),
    ]
});
```

### Defaults

These are the default values for the configuration options.

```javascript
createBot({
    cache: 0,
    databaseFilename: 'matchbot.db',
    dryRun: false,
    fixturePollInterval: 86400000, // 1 day
    instance: 'lemmy.world',
    matchPollInterval: 300000, // 5 minutes
    plugins: [],
    previewThreadInterval: 28000000, // 8 hours
    userAgent: 'Mozilla/5.0 (compatible; @matchbot/1.0; +https://github.com/doug-wade/matchbot)',
    verbose: false,
});
```

## Writing plugins

To create a new plugin, create a class that extends `Plugin` from `@matchbot/core`.

```javascript
import { Plugin } from '@matchbot/core';

class MyMatchbotPlugin extends Plugin {
    static name = '<MY_MATCHBOT_PLUGIN_NAME>';

    async fixtures() {}
    async preview() {}
    async thread() {}
};
```

There are six provided keys on the instance after instantiation: `instance`, `verbose`, `db`, `lemmy`, `logger` and `community`.

### Plugin lifecycle methods

Note that all methods are `async`. For a full example, see `@matchbot/soccer`.

#### fixtures()

Called once per day, this method gets all fixtures and schedules match threads. Must return an array of `Thread` from `@matchbot/core`, which then are persisted to the threads database.

#### preview()

Called a configurable amount of time before a match to create a match preview thread. Must return a `Post` object from `@matchbot/core`.

#### thread()

Called on a loop while the match is live to update the match thread post.
