import descriptor from "~/lib/server/atlassian-app-descriptor";

export default defineEventHandler(async (event) => {
  descriptor.baseUrl = `https://${event.node.req.headers.host}`;
  return descriptor;
});
