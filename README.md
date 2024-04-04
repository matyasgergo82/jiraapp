# Nuxt 3 Atlassian Jira Connect App Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The Jira app descriptor will be available on `http://localhost:3000/jira/descriptor`.

To be able to install it in Jira, the app needs to be reachable from the internet.
One way to achieve this is to use [ngrok](https://ngrok.com/). Install it, then run ngrok alongside
the dev server:

```bash
ngrok http 3000
```

At this point the dev server will be available on the ngrok forwarding address, ex:
`https://e893-195-38-97-85.ngrok-free.app/jira/descriptor`

Where `e893-195-38-97-85` will be your own unique, ephemeral id.

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

To install the locally run preview in Jira, ngrok may be used the same way as for the development server (see above).
