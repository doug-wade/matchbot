import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';
import hockey from '@matchbot/hockey';

createBot({
    instance: 'lemmy.world',
    verbose: true,
    cache: 86400000,
    plugins: [
        {
            community: 'soundersfc',
            config: { teamId: 1595 },
            plugin: soccer,
        },
        {
            community: 'reign_fc',
            config: { teamId: 3002 },
            plugin: soccer,
        },
        {
            community: 'ballardfc',
            config: { teamId: 18882 },
            plugin: soccer,
        },
        {
            community: 'seattlekraken',
            config: { teamId: 1436 },
            plugin: hockey,
        },
    ]
});
