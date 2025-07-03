<script setup>
import {Toaster} from "vue-sonner";
import ProgressLoader from "@/components/ProgressLoader.vue";
import {watch} from "vue";
import {useRoute} from "vue-router";
import {appInfo} from "@/others/util";

const route = useRoute();
const toastOptions = {
  class: "pa-3",
  style: {fontFamily: "'Poppins', sans-serif"},
};

watch(route, (to) => {
  document.title =
    (to.meta.title && to.meta.title + " | " + appInfo.name) || appInfo.name;
});
</script>
<template>
  <progress-loader/>
  <Toaster
    :toast-options="toastOptions"
    closeButton
    expand
    position="bottom-left"
    richColors
    theme="dark"
  />
  <router-view/>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap");

.v-application {
  font-family: "Poppins", sans-serif;
}

body,
.custom-toast {
  font-family: "Poppins", sans-serif !important;
}

.clickable {
  cursor: pointer;
}

.v-chip-0-padding {
  padding: 0 !important;
}

.flex-sticky {
  position: sticky;
  align-self: flex-start;
  z-index: 999;
}

.div-sticky {
  position: sticky;
  height: auto;
  z-index: 999;
}

.top-60 {
  top: 60px;
}

.z-index-max {
  z-index: 999999 !important;
}

.input-color-primary .v-field {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-tertiary));
}

.limit-max-width-xl {
  max-width: 1400px !important;
  margin: 0 auto;
}
</style>
