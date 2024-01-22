# Matchbot

Matchbot is a pluggable Lemmy bot framework for making matchbots for various sports. See `packages/example` for an example of how to use the bot framework.

## Creating bots

### Example

Here is a minimal example of a bot that posts match threads to the Reign FC lemmy community on `lemmy.world` for Reign FC matches using the soccer plugin.

```javascript
import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';

createBot({
    plugins: [
        {
            plugin: soccer,
            config: { teamId: 3002 },
            community_id: 86091,
        },
    ]
});
```

## Creating plugins

Here is a minimal example of a plugin that fetches data from an api

```javascript
import { Plugin } from '@matchbot/core';

export default class MatchbotExamplePlugin extends Plugin {
    #baseUrl = "<YOUR_URL_HERE>";
    name = 'example';

    async fixtures() {
        const response = this.fetch(`${baseUrl}/fixtures`);

        return response.fixtures.map(fixture => {
            new Thread({
                id: fixture.id,
                name: fixture.name,
                date: fixture.timestamp,
                args: fixture,
                completed: fixture.completed,
            });
        });
    }
    async preview() {
        const response = this.fetch(`${baseUrl}/preview`);

        return new Post({
            name: response.name,
            body: response.body
        });
    }

    async thread() {
        const response = this.fetch(`${baseUrl}/thread`);

        return '';
    }
}
```