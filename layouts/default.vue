<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
  meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  script: [
    { src: "https://connect-cdn.atl-paas.net/all.js" },
    { innerHTML: "window.AP?.theming?.initializeTheming()" },
  ],
});
</script>

<script lang="ts">
if (window?.AP) {
  AP.sizeToParent(true);
}
</script>

<template>
  <section class="ac-content">
    <slot />
  </section>
</template>
