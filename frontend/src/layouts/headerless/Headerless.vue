<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import FOG from "vanta/dist/vanta.fog.min";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import HeaderlessFooter from "./Footer.vue";

const route = useRoute();
const store = useStore();
let vantaEffect = null;
const fogElement = ref(null);
const currentUser = computed(() => store.getters["user/getCurrentUser"]);

// const theme = useTheme();
// const themeColors = computed(() => theme.global.current.value.colors);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onMounted(async () => {
  await nextTick();
  await delay(1000);

  // Initialize VANTA.FOG with options
  if (fogElement.value && !["sudo", "admin"].includes(currentUser.value.role)) {
    vantaEffect = FOG({
      el: fogElement.value,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: fogElement.value.offsetHeight,
      minWidth: fogElement.value.offsetWidth,
      highlightColor: "#ffffff",
      midtoneColor: "#f5fbff",
      lowlightColor: "#f09999",
      baseColor: "#b8ccfc",
      blurFactor: 0.4,
      speed: 1.5,
      zoom: 1.2,
    });
  }
});
</script>

<template>
  <v-app full-height>
    <div ref="fogElement" class="fill-height bg-tertiary d-flex align-center">
      <v-main>
        <router-view :key="route.fullPath"/>
      </v-main>
    </div>
    <headerless-footer></headerless-footer>
  </v-app>
</template>

<style scoped></style>
