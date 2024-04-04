<script setup lang="ts">
useHead({
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
