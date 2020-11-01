# VerifyPluginServer

## Purpose of this Project

To make it harder for random people to come on a private Minecraft server
and destroy it (or take it over) this is the server which can be used for the VerifyPlugin which can be found here: https://github.com/Megapixel99/VerifyPlugin.

## Configure System (environment) properties

To configure the server successfully:
* run `npm i` in the root directory of the project
* duplicate `.sample.env` and rename it to `.env`
* set `MONGO_CONNECT` to your MongoDB connection URL

## How run the server

In the root directory of this project run `npm start` to start the server. After
the server has been running for a few seconds you should see `Connected to MongoDB!`
output in your console, if you do not please re-configure your `MONGO_CONNECT`
variable.

## How use the server

GET `/verify/status/id/:id` returns whether a given id has already been
verified or not

GET `/verify/status/ign/:ign` returns whether a given in game name has
already been verified or not

GET `/verify/status/uuid/:uuid` returns whether a given Minecraft UUID has
already been verified or not and will update the player's in game name
if it has changed

POST `/add/id/:id` creates a new code for the ID of a player which will not be verified

PUT `/change/role/:role/player/:player` changes the role of the player on
the server by either their in game name or id

PUT `/verify/reset/code/ign/:ign` resets the code of a player by their
in game name

PUT `/verify/id/:id/code/:code/ign/:ign/uuid/:uuid` verifies a player

### Example MongoDB object

```
{
  id: "optionalThirdPartyID",
  uuid: "minecraftUUID",
  ign: "yourMcName",
  code: "rAndOm",
  verified: true/fale,
  role: null,
  mute: false,
}
```
Also see `dbModels.js`

## License
```
Copyright 2020 Seth Wheeler

Licensed under the MIT License.
```
