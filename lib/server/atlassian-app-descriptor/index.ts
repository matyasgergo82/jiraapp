import template from "./template.json" assert { type: "json" };

// This key is used to identify the app in the Atlassian Marketplace
export let APP_KEY = template.key + (import.meta.dev ? ".dev" : "");

// This is the descriptor that is sent to Atlassian to install the app
const descriptor = JSON.parse(JSON.stringify(template)) as Omit<typeof template, "$schema"> & Record<string, unknown>;

// Remove the $schema key from the descriptor, because Atlassian doesn't like it
delete descriptor["$schema"];

// Set the app key in the descriptor
descriptor.key = APP_KEY;

export default descriptor;
