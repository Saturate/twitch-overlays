# twitch-overlays

Responsive overlays for use with OBS Browser Source.

> Disclaimer: This is still work in progress, and a lot of changes are needed for the final version. Consider this a proof of concept.

## Getting started
The client and the server are independed, they can run on two servers or one, with no issue. The only thing you need is to configure CORS for the server, and a API endpoint for the client.

### Client



### Server

You can host this easily with Docker. To get started do the following:

- `cp server/config.js.sample server/config.js`
- `sudo nano server/config.js` and edit CLIENT_ID and SECRET_ID.
- `docker-compose up`

Now you can enjoy.