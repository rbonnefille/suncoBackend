export const snippets = [
  {
    id: 'Prevent Agent Workspace to display CSAT messages',
    description:
      'Agent Workspace will not display CSAT messages if the metadata type is csat',
    content: `
    {
      "author": {
        "type": "business",
        "avatarUrl": "https://url-of-your-brand-image.com",
        "displayName": "Customer Service"
      },
      "content": {
        "type": "text",
        "text": "Rate your conversation",
        "actions": [
          {
            "type": "link",
            "text": "CSAT Here",
            "uri": "https://api.simplesat.io/api/rating/xxxxxxxxxxxx/{{ticket.id}}/?source=zendesk"
          }
        ]
      },
      "metadata": {
        "type": "csat"
      }
    }
  `,
  },
];
