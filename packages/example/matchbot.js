import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';
import hockey from '@matchbot/hockey';

createBot({
    instance: 'lemmy.world',
    verbose: true,
    cache: 24 * 60 * 60 * 1000,
    plugins: [
        {
            community: 'bot_test',
            config: { teamId: 40 },
            plugin: soccer,
        },
        {
            community: 'bot_test',
            config: { teamId: 1436 },
            plugin: hockey,
        }
        
        // Real config:
        // {
        //     community: 'soundersfc',
        //     config: { teamId: 1595 },
        //     plugin: soccer,
        // },
        // {
        //     community: 'reign_fc',
        //     config: { teamId: 3002 },
        //     plugin: soccer,
        // },
        // {
        //     community: 'ballardfc',
        //     config: { teamId: 18882 },
        //     plugin: soccer,
        // },
        // {
        //     community: 'seattlekraken',
        //     config: { teamId: 1436 },
        //     plugin: hockey,
        // },
    ]
});
