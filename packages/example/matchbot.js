import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';

createBot({
    instance: 'lemmy.world',
    verbose: true,
    dryRun: true,
    cache: 860000000,
    plugins: [
        {
            community_id: 41717, // bot_test
            config: { teamId: 2282, season: '2023' }, // Monterrey
            plugin: soccer,
        }
    ]
});
