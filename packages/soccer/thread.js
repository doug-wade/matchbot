import Handlebars from 'handlebars';

const source = `
Welcome to the match thread for {{teams.home.name}} vs {{teams.away.name}}, in round {{league.round}} of the {{league.name}}.

Kickoff: {{fixture.date}}
Referee: {{fixture.referee}}
Venue: {{fixture.venue.name}} ({{fixture.venue.city}})
Score: {{fixture.goals.home}} - {{fixture.goals.away}}
Status: {{fixture.status.long}}
`;

export default Handlebars.compile(source);