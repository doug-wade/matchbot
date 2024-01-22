import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';

createBot({
    instance: 'lemmy.world',
    verbose: true,
    dryRun: true,
    cache: 860000000,
    plugins: [
        {
            community: 65003, // soundersfc
            config: { teamId: 1595 },
            plugin: soccer,
        },
        {
            community: 86091, // reign_fc
            config: { teamId: 3002 },
            plugin: soccer,
        },
        {
            community: 86115, // ballard_fc
            config: { teamId: 18882 },
            plugin: soccer,
        },
        {
            community: 5344, // seattlekraken
            config: { teamId: 1436 },
            plugin: hockey,
        },
    ]
});
