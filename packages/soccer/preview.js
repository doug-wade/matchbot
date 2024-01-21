import Handlebars from 'handlebars';

const source = `
Welcome to the matchbot soccer preview for {{teams.home.name}} vs {{teams.away.name}}, in round {{league.round}} of the {{league.name}}.

Kickoff is at {{fixture.date}}, or when this post is about 8 hours old.

{{#if fixture.referee}}
The referee will be {{fixture.referee}}.

{{/if}}
The venue is {{fixture.venue.name}} in {{fixture.venue.city}}.
`;

export default Handlebars.compile(source);