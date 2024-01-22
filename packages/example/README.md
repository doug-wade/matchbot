# @matchbot/example

This repository show how to use matchbot.

## Running locally

To run the example locally, first clone the repository and change directories to the root directory and bootstrap the monorepo

```shell
git clone https://github.com/doug-wade/matchbot/
cd matchbot
yarn
```

Then change directories into the example package

```shell
cd packages/example
```

Next edit the `matchbot.js` file in that directory (`packages/example/matchbot.js`) to have the configuration you'd like to try. By default, it is pointed at the `bot_test` community on [lemmy.world](https://lemmy.world/), but is set to dry run mode, which means it will not make any requests to your Lemmy server until you change the value to `false`.

Next, create a `.env` file (`packages/example/.env`) that has your lemmy credentials, and any other secrets needed by your plugins (like an `API_KEY`) into that file.

Finally, start the example with `yarn start`.
