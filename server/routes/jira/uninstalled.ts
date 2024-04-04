import { unauthorizeClient, verifyLifecycleRequest } from "~/lib/server/atlassian-app-auth";

export default defineEventHandler(async (event) => {
  const authorizationJwt = event.node.req.headers.authorization?.slice(4);

  if (!(await verifyLifecycleRequest(authorizationJwt))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await readBody<{
    clientKey: string;
    [K: string]: string | undefined;
  }>(event);

  await unauthorizeClient(payload.clientKey);

  return new Response();
});
