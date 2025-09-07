const team = {
  name: 'team',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      required: true
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'division',
      title: 'Division',
      type: 'reference',
      to: [{ type: 'division' }]
    },
    {
      name: 'coach',
      title: 'Coach',
      type: 'string'
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'homeVenue',
      title: 'Home Venue',
      type: 'string'
    },
    {
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'stats',
      type: 'object',
      initialValue: {
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        gamesPlayed: 0
      },
      fields: [
        {
          name: 'wins',
          type: 'number'
        },
        {
          name: 'losses',
          type: 'number'
        },
        {
          name: 'pointsFor',
          type: 'number'
        },
        {
          name: 'pointsAgainst',
          type: 'number'
        },
        {
          name: 'gamesPlayed',
          type: 'number'
        }
      ]
    }
  ],
}

export default team
