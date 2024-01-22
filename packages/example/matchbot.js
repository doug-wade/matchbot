import { createBot } from '@matchbot/core';
import soccer from '@matchbot/soccer';
import hockey from '@matchbot/hockey';

createBot({
    instance: 'lemmy.world',
    verbose: true,
    cache: 24 * 60 * 60 * 1000,
    plugins: [
        {
            community_id: 41717, // bot_test
            config: { teamId: 2282, season: '2023' },
            plugin: soccer,
        },
        {
            community_id: 41717, // bot_test
            config: { teamId: 1436 },
            plugin: hockey,
        }
        
        // Real config:
        // {
        //     community: 65003, // soundersfc
        //     config: { teamId: 1595 },
        //     plugin: soccer,
        // },
        // {
        //     community: 86091, // reign_fc
        //     config: { teamId: 3002 },
        //     plugin: soccer,
        // },
        // {
        //     community: 86115 // ballard_fc
        //     config: { teamId: 18882 },
        //     plugin: soccer,
        // },
        // {
        //     community: 5344 // seattlekraken
        //     config: { teamId: 1436 },
        //     plugin: hockey,
        // },
    ]
});
