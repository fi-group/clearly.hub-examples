# Clearly.Hub - Examples

In this repository you can find some code examples as to how to consume the [Clearly.Hub API](https://hub.clearly.app/api/docs) and how to use the [Clearly.Hub](https://hub.clearly.app) authentication and hosted components.

The full developer documentation is on the Clearly.Hub support site:

- [API & Developer Quick Start](https://support.clearly.app/hub/api-quickstart.html): credentials, access tokens and your first API call
- [API Examples](https://support.clearly.app/hub/api-examples.html): step-by-step examples of the most common API tasks
- [Hosted Components](https://support.clearly.app/hub/hosted-components.html): the hosted login (IAM) and the Select Subscription, Select Hub and Register Resource components

If you have questions or remarks about this repo, feel free to contact [Future Insight Support](mailto:support@futureinsight.nl)


## Getting started

### 1. Create an app client in Clearly.Hub

The authentication and components examples need the Client Id of your own app client. The catalog, digital twins and hubs examples also work without one.

- Go to https://hub.clearly.app
- Create an application in a HUB where you are an owner (not in your personal hub: personal hubs can't have apps)
- After creating the application, go to the 'API Config' tab of the application
- Create an 'App Client' (Authorization Code Grant)
- Give the 'App Client' a name and fill in the 'callback urls' and 'sign out urls' (\*)
- Copy the 'Client Id': you need it in step 3

\*) For callback and sign out urls, add these (comma separated) values:

```
http://localhost:5173,http://localhost:5173/components,http://localhost:5173/componentspopup,http://localhost:3000/billing-redirect,http://localhost:3000/billing-popup,https://hub.clearly.app/components
```

- `http://localhost:5173` is used by the authentication example.
- `http://localhost:5173/components`, `http://localhost:5173/componentspopup`, `http://localhost:3000/billing-redirect` and `http://localhost:3000/billing-popup` are the pages the components send the user back to: every page that calls a component sends its own url (without query string) as `redirect_url`, and Clearly.Hub only accepts a `redirect_url` that is registered as callback url.
- `https://hub.clearly.app/components` is needed because the user signs in to the components with your app client.

Mind you; the callback and sign out urls are taken verbatim. So `http://localhost:5173` differs from `http://localhost:5173/`. Urls should also be served over https. The only exception is localhost.

### 2. Install

```sh
git clone https://github.com/fi-group/clearly.hub-examples
cd clearly.hub-examples
npm install
```

### 3. Configure

- Copy/rename `src/config/config.json.example` to `src/config/config.json`, and fill in your Client Id as `userPoolClientId`.
- Copy/rename `basic/config.js.example` to `basic/config.js`, and fill in your Client Id as `clientId`.

The `redirectSignIn` and `redirectSignOut` urls in `config.json` must be registered exactly like that on your app client (see step 1). Until a Client Id is filled in, the example app shows a warning, and the authentication and components examples won't work.

### 4. Run

```sh
npm run dev
```
The example app will now be running on [http://localhost:5173](http://localhost:5173)

```sh
npm run basic
```
The basic html/js examples will now be running on [http://localhost:3000](http://localhost:3000)

`npm run build` builds the example app, and `npm run lint` checks the code.

## Available examples

This example application is a simple vite react-ts app. For the UI components material-ui is used.

These frameworks are purely used for ease of development of this example app; they are not necessary to use the Clearly.Hub functionality.

### Basic html/js
In the folder ./basic some plain html/js examples are given for the Billing (Select Subscription) component, both through a redirect and inside a popup. They are started with `npm run basic`, and need the Client Id in `basic/config.js` (see *Getting started*).

The helpers in `basic/components.js` build the request for a component and check its result. They are the plain JavaScript version of `src/components/componentsHelper.ts`.

In a real scenario of course, the components should only be used by someone who is signed into the calling application (see: *Authentication* below). The components use the same hosted login: if the user still has an active session there, for example because they just signed in to your application, they are signed in to the components automatically.

### Authentication (hosted UI)

Available on [http://localhost:5173/auth-hosted-ui](http://localhost:5173/auth-hosted-ui).

This example shows how to use the cognito hosted ui in order to have the user authenticate against Clearly.Hub and retrieve some basic details for this user (name + email address). 

### Components

Available on [http://localhost:5173/components](http://localhost:5173/components) and [http://localhost:5173/componentspopup](http://localhost:5173/componentspopup). See also [Hosted Components](https://support.clearly.app/hub/hosted-components.html) on the support site.

Examples of three components:
1. Select Subscription
2. Select Hub
3. Register Resource

Clearly.HUB components are ready-made wizards that wrap some functionality of Clearly.HUB. They run on Clearly.HUB and can be called from other applications. When a user's interaction with a component is done, the component sends the result back to the calling application.

Every component ends with a data access step, where the user confirms which information is sent to the calling application.

#### Subscription component
A wizard that contains two steps:
1. User selects which of their subscriptions to the calling application they want to use (this also decides which hub is billed)
2. User confirms the data access

This means of course that the calling application has to be configured correctly, including subscription models. A user without a subscription is pointed to the application's page in Clearly.HUB, where they can subscribe.

#### Select Hub component
A wizard that contains two steps:
1. User selects one of the hubs they own
2. User confirms the data access

#### Register Resource component
A wizard that contains 4 steps:
1. User selects the hub where they want to register the resource url (only hubs they own)
2. User selects (or creates) the dataset that should contain the resource url
3. User selects (or creates) the resource that points to the resource url
4. User confirms the data access

#### Checking the result
The result of a component is signed by Clearly.HUB. The examples (`src/components/componentsHelper.ts`) show how to handle it:

- every request contains a new random `state`, which comes back in the result as `request.state`, so the application can check that the result belongs to a request it started itself;
- the signature of the result is verified with the public key of Clearly.HUB (`https://hub.clearly.app/.well-known/public-key.pem`, Ed25519);
- the result is either `SUCCESS` or `CANCELED`.

In these examples the checks run in the browser, to keep them simple. In a real application, verify the result in your backend before trusting it.

All components can be used through redirects or inside a popup. 

### Catalog search

Available on [http://localhost:5173/catalog](http://localhost:5173/catalog).

This example shows how to query the [catalog](https://hub.clearly.app/datasets). Both for authenticated requests and for unauthenticated requests. Unauthenticated queries will only return public datasets.

Some simple sorting and filtering is shown. For more information about the used api calls, see the [Clearly.Hub API](https://hub.clearly.app/api/docs) and the [API Examples](https://support.clearly.app/hub/api-examples.html).

### Digital Twins

Available on [http://localhost:5173/digital-twins](http://localhost:5173/digital-twins). Both for authenticated requests and for unauthenticated requests. Unauthenticated queries will only return public digital twins.

### Browsing hubs

Available on [http://localhost:5173/hubs](http://localhost:5173/hubs). A really limited GraphQL example of fetching hubs. 

### General
Most of the examples only use some calls to the OpenAPI. Feel free to explore more of the [GraphQL endpoint](https://hub.clearly.app/docs) as well!
