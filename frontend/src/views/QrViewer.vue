<script setup>
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import QRCodeVue3 from "qrcode-vue3";
import {useTheme} from "vuetify";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const theme = useTheme();

const id = computed(() => route.params.id);
const qrUuid = computed(() => route.params.qrUuid);

const qrCode = computed(() => {
  return JSON.stringify({
    id: id.value,
    qrUuid: qrUuid.value,
  });
});

const qrOptions = {
  type: "dot",
  color: theme.global.current.value.colors.primary,
};

const isSignedin = computed(() => store.getters["user/signedin"]);
</script>
<template>
  <v-container>
    <page-title justify="space-between" title="QR Code Viewer">
      <v-btn
        v-if="isSignedin"
        icon="mdi-arrow-left"
        variant="text"
        @click="$router.back()"
      ></v-btn>
    </page-title>
    <v-row align="center" justify="center">
      <v-col cols="auto mt-5">
        <QRCodeVue3
          v-if="id && qrUuid"
          :cornersSquareOptions="qrOptions"
          :dotsOptions="qrOptions"
          :download="true"
          :height="250"
          :value="qrCode"
          :width="250"
          downloadButton="v-btn v-theme--light v-btn--block bg-primary v-btn--density-default v-btn--size-small v-btn--variant-flat mt-2"
        />
        <v-alert v-else border="start" closable density="compact"
        >No data available!
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
