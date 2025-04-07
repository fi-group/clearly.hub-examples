# Clearly.Hub - Examples

In this repository you can find some code examples as to how to consume the [Clearly.Hub API](https://hub.clearly.app/api/docs) and how to use the [Clearly.Hub](https://hub.clearly.app) authentication.

If you have questions or remarks about this repo, feel free to contact [Future Insight Support](mailto:support@futureinsight.nl)

## Getting started

```sh
git clone https://github.com/fi-group/clearly.hub-examples

$ npm install
```

Copy the example config `src/config/config.json.example` to `src/config/config.json` and run the application:

```sh
$ npm run dev
```

A webserver will now be running on [http://localhost:5173](http://localhost:5173)

## Available examples

This example application is a simple vite react-ts app. For the UI components material-ui is used.

These frameworks are purely used for ease of development of this example app; they are not necessary to use the Clearly.Hub functionality.

### Authentication (hosted UI)

Available on [http://localhost:5173/auth-hosted-ui](http://localhost:5173/auth-hosted-ui).

This example shows how to use the cognito hosted ui in order to have the user authenticate against Clearly.Hub and retrieve some basic details for this user (name + email address). For this to work, you need a client_id with configured callback urls.
Steps to get this working:

- Go to https://hub.clearly.app
- Create an application in a HUB where you are an owner
- After creating the application, go to the 'API Config' tab of the application
- Create an 'App Client' (Authorization Code Grant)
- Give the 'App Client' a name and fill in the 'callback urls' and 'sign out urls' (\*)
- use the 'Client Id' in the config.json

\*) Make sure to add http://localhost:5173/ to the callback and sign out urls for this example application to work.

Mind you; the signIn and signOut urls are taken verbatim. So `http://some-application.com` differs from `http://some-application.com/`. The urls should also be served over https. The only exception is localhost.

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
