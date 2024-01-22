# Contributing

## Writing plugins

To create a new plugin, create a class that extends `Plugin` from `@matchbot/core`.

```javascript
import { Plugin } from '@matchbot/core';

export default class MyMatchbotPlugin extends Plugin {
    name = '<MY_MATCHBOT_PLUGIN_NAME>';

    async fixtures() {}
    async preview() {}
    async thread() {}
};
```

There are six provided keys on the instance after instantiation: `instance`, `verbose`, `db`, `lemmy`, `logger` and `community_id`.

### Plugin lifecycle methods

Note that all methods are `async`. For a full example, see `@matchbot/soccer`.

#### fixtures()

Called once per day, this method gets all fixtures and schedules match threads. Must return an array of `Thread` from `@matchbot/core`, which then are persisted to the threads database.

#### preview()

Called a configurable amount of time before a match to create a match preview thread. Must return a `Post` object from `@matchbot/core`.

#### thread()

Called on a loop while the match is live to update the match thread post.
