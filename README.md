# Clearly.Hub - Examples

In this repository you can find some code examples as to how to consume the [Clearly.Hub API](https://hub.clearly.app/api/docs) and how to use the [Clearly.Hub](https://hub.clearly.app) authentication.

If you have questions or remarks about this repo, feel free to contact [Future Insight Support](mailto:support@futureinsight.nl)

## Getting started

```sh
git clone https://github.com/fi-group/clearly.hub-examples

$ npm install
```

Copy/rename the example config `src/config/config.json.example` to `src/config/config.json` and run the application:

```sh
$ npm run dev
```
A webserver will now be running on [http://localhost:5173](http://localhost:5173)


Copy/rename the example config `basic/config.js.example` to `basic/config.js` and run the basic examples:
```sh
$ npm run basic
```
A webserver will now be running on [http://localhost:3000](http://localhost:3000)

## Available examples

This example application is a simple vite react-ts app. For the UI components material-ui is used.

These frameworks are purely used for ease of development of this example app; they are not necessary to use the Clearly.Hub functionality.

## Prerequisites
The following needs to be setup in Clearly.HUB to make use of all functionality of this example code.

Steps to get this working:

- Go to https://hub.clearly.app
- Create an application in a HUB where you are an owner
- After creating the application, go to the 'API Config' tab of the application
- Create an 'App Client' (Authorization Code Grant)
- Give the 'App Client' a name and fill in the 'callback urls' and 'sign out urls' (\*)
- use the 'Client Id' in the config.json (`userPoolClientId`)

\*) For callback and signout urls, add these (comma separated) values: `http://localhost:5173,https://hub.clearly.app/components`

Mind you; the signIn and signOut urls are taken verbatim. So `http://localhost:5173` differs from `http://localhost:5173/`. Urls should also be served over https. The only exception is localhost.

### Basic html/js
In the folder ./basic some plain html/js examples are given for the clearly-hub components. These can be started by running `npm run basic` and navigating to the url shown in the cmd window. For this a clientId has to be filled in config.js (copy/rename config.js.example to config.js in the folder ./basic and fill in the clientId).

In a real scenario of course, the components should only be used by someone who is signed into the calling application (see: *Authentication* below). Signing into the components is separate from signing into the calling application...

### Authentication (hosted UI)

Available on [http://localhost:5173/auth-hosted-ui](http://localhost:5173/auth-hosted-ui).

This example shows how to use the cognito hosted ui in order to have the user authenticate against Clearly.Hub and retrieve some basic details for this user (name + email address). 

### Components

Available on [http://localhost:5173/components](http://localhost:5173/components) and [http://localhost:5173/componentspopup](http://localhost:5173/componentspopup). See also [https://hub.clearly.app/connect](https://hub.clearly.app/connect).

Examples of three components:
1. Select Subscription
2. Register Resource
3. Logout

Clearly.HUB components are ready-made wizards that wrap some functionality of Clearly.HUB. They run on Clearly.HUB and can be called from other applications. When a user's interaction with a component is done, the component sends the result back to the calling application.

#### Subscription component
A wizard that contains two steps:
1. User must sign into the Clearly.HUB components environment
2. User selects a subscription for the calling application

This means of course that the calling application has to be configured correctly, including subscription models. 

#### Register Resource component
A wizard that contains 4 steps:
1. User must sign into the Clearly.HUB components environment
2. User selects the hub where they want to register the resourceUrl
3. User selects (or creates) the dataset that should contain the resourceUrl
4. User selects (or creates) the resource that points to the resourceUrl

#### Logout component
This component signs out the user from the Clearly.HUB components environment. This can be called for example just before the user signs out of the application.

All components can be used through redirects or inside a popup. 

### Catalog search

Available on [http://localhost:5173/catalog](http://localhost:5173/catalog).

This example shows how to query the [catalog](https://hub.clearly.app/datasets). Both for authenticated requests and for unauthenticated requests. Unauthenticated queries will only return public datasets.

Some simple sorting and filtering is shown. For more information about the used api calls, see the [Clearly.Hub API](https://hub.clearly.app/api/docs).

### Digital Twins

Availabe on [http://localhost:5173/digital-twins](http://localhost:5173/digital-twins). Both for authenticated requests and for unauthenticated requests. Unauthenticated queries will only return public digital twins.

### Browsing hubs

Availabel on [http://localhost:5173/hubs](http://localhost:5173/hubs). A really limited GraphQL example of fetching hubs. 

### General
Most of the examples only use some calls to the OpenAPI. Feel free to explore more of the [GraphQL endpoint](https://hub.clearly.app/docs) as well!
