# @matchbot/core

## Installing

```shell
npm i -S @matchbot/core
```

## Getting Started

First, create a file called `index.js`, and put a call to `createBot` inside.

```js
import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';

createBot({
    plugins: [
        {
            community_id: <YOUR_COMMUNITY_ID>,
            config: { teamId: <YOUR_TEAM_ID> },
            plugin: soccer,
        }
    ]
});
```

Next, create a file called `.env` with your `LEMMY_USERNAME`, `LEMMY_PASSWORD`, and any secrets required for your plugins.

```env
LEMMY_USERNAME=<YOUR_LEMMY_USERNAME>
LEMMY_PASSWORD=<YOUR_LEMMY_PASSWORD>
API_KEY=<YOUR_API_KEY>
```

Then, run `node index.js`. You now have a bot running!

You'll likely want to use something to restart the node process in case it dies, like [pm2](https://pm2.keymetrics.io/).

## API

### createBot

This is the main entry point for most users of matchbot. This is used to create a new bot, for example

```js
import { createBot } from '@matchbot/core';

createBot({
    verbose: true,
    plugins: [
        {
            community_id: 41717, // bot_test
            config: { teamId: 2282, season: '2023' }, // Monterrey
            plugin: soccer,
        }
    ]
});
```

There are ten options that can be passed to a fully configured `createBot`. Here they all are with their default values

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

### Post

This is the data class to return from `thread()` and `preview()`.

### Thread

This is the data class to return from `fixtures()`.

### Plugin

This is a class for plugins to extend from. It provides some utilities helpful for writing plugins, and establishes the contract between plugins and the core libraries.

```javascript
import { Plugin } from '@matchbot/core';

export default class MyMatchbotPlugin extends Plugin {
    name = '<MY_MATCHBOT_PLUGIN_NAME>';

    async fixtures() {}
    async preview() {}
    async thread() {}
};
```
