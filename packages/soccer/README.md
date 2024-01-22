# @matchbot/soccer

A plugin for `@matchbot/core`.

## Installation

```shell
yarn add @matchbot/soccer @matchbot/core
```

## Getting started

First, you'll need to find your community id. Go to `http://<YOUR_INSTANCE>/api/v3/community?name=<YOUR_COMMUNITY_NAME>` (so, to find the id for the community reign_fc on lemmy.world, I go to <http://lemmy.world/api/v3/community?name=reign_fc>).

Next, you'll need your api key and team id. You can get these from <http://www.api-football.com>.

Create a .env file with the following format

```env
API_KEY=<YOUR_API_KEY>
LEMMY_USERNAME=<YOUR_LEMMY_USERNAME>
LEMMY_PASSWORD=<YOUR_LEMMY_PASSWORD>
```

Create an index.js with the following contents

```javascript
import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';

createBot({
    instance: <YOUR_LEMMY_INSTANCE>,
    plugins: [
        {
            community_id: <YOUR_COMMUNITY_ID>,
            config: { teamId: <YOUR_TEAM_ID> },
            plugin: soccer,
        }
    ]
});
```

Finally, start your bot!

```shell
node index.js
```

## API

### teamId

The id of the team from the api.

### season

The name of the season from the api.
