import descriptorTemplate from "../../lib/descriptor/descriptor-template.json";

export default defineEventHandler(async (event) => {
  let descriptorTemplateWithoutSchema = JSON.parse(
    JSON.stringify(descriptorTemplate).replaceAll(
      "{{APP_HOST}}",
      event.req.headers.host ?? ""
    )
  ) as Omit<typeof descriptorTemplate, "$schema"> & Record<string, unknown>;
  delete descriptorTemplateWithoutSchema["$schema"];

  return descriptorTemplateWithoutSchema;
});
