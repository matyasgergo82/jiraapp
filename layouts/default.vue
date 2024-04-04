<script setup lang="ts">
useHead({
  meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  script: [
    { src: "https://connect-cdn.atl-paas.net/all.js" },
    { innerHTML: "window.AP?.theming?.initializeTheming()" },
  ],
});

if (import.meta.browser) {
  if (!AP.user?.getCurrentUser) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized! Not in Jira context!",
      fatal: true,
    });
  }
  AP.sizeToParent(true);
}
</script>

<template>
  <section class="ac-content">
    <slot />
  </section>
</template>
