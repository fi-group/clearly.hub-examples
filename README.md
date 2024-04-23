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
The example application is a simple vite react-ts app. For the UI components material-ui is used.

These frameworks are purely used for ease of development of this example app; they are not necessary to use the Clearly.Hub functionality.

### Authentication (hosted UI)
Available on [http://localhost:5173/auth-hosted-ui](http://localhost:5173/auth-hosted-ui).

This example shows how to use the cognito hosted ui in order to have the user authenticate against Clearly.Hub and retrieve some basic details for this user (name + email address). For this to work [Future Insight](https://www.futureinsight.nl) needs to create an application for you. Please send an email to [Future Insight Support](mailto:support@futureinsight.nl) with the following information:
- Name of the application you're going to develop (can be a test app)
- A short description of your use case
- redirectSignInUrl
- redirectSignOutUrl

Mind you; the signIn and signOut urls are taken verbatim. So `http://some-application.com` differs from `http://some-application.com/`.

For both the signIn and signOut urls, [http://localhost:5173/](http://localhost:5173/) will also be added to the list of allowed urls to facilitate development. Also in this case: use `localhost` instead of `127.0.0.1` when developing.

Future Insight will get in touch with you to provide the following information:
- userPoolId
- userPoolClientId
- oauth domain

### Catalog search
Available on [http://localhost:5173/catalog](http://localhost:5173/catalog).

This example shows how to query the [catalog](https://hub.clearly.app/datasets). Both for authenticated requests and for unauthenticated requests. Unauthenticated queries will only return public datasets.

Some simple sorting and filtering is shown. For more information about the used api calls, see the [Clearly.Hub API](https://hub.clearly.app/api/docs).

In this example only some calls are used to the OpenAPI. Feel free to explore the [GraphQL endpoint](https://hub.clearly.app/docs) as well!

### Browsing hubs
TODO
