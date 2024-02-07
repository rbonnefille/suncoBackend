# SunCo Dashboard

## Description

Simple frontend app developed with Vue.js in order to work with the SunCo and Messaging Widgets.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

- `npm install`
- create an environment file `.env` and add the following variables:

```
VITE_MESSAGING_KEY=
VITE_SUNCO_INTEGRATION_ID=
```
### How to get the Messaging Key:

![image](https://github.com/rbonnefille/suncoBackend/assets/60104678/f1c8ef48-c419-42ff-9611-fadee4fb3cf2)

### How to get the a SunCo integration id:

To get a SunCo integration id, you need to create a new Web integration via the API: https://docs.smooch.io/rest/#tag/Integrations
(How to generate a SunCo API Key: https://support.zendesk.com/hc/en-us/articles/4576088682266-Using-the-Conversations-API-keys)
Example:

```json
{
  "type": "web",
  "displayName": "SunCo Web Widget"
}
```

## Usage

To start the dev server: `npm run dev`
