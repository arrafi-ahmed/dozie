<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";
import PageTitle from "@/components/PageTitle.vue";
import termsContent from "@/others/content/terms.html?raw";
import privacyPolicyContent from "@/others/content/privacy-policy.html?raw";
import cookiePolicyContent from "@/others/content/cookie-policy.html?raw";

const route = useRoute();

const pageTitle = computed(() =>
  route.params.type === "terms"
    ? "Terms & Condition"
    : route.params.type === "privacy-policy"
      ? "Privacy Policy"
      : route.params.type === "cookie-policy"
        ? "Cookie Policy"
        : null,
);

const staticContent = computed(() =>
  route.params.type === "terms"
    ? termsContent
    : route.params.type === "privacy-policy"
      ? privacyPolicyContent
      : route.params.type === "cookie-policy"
        ? cookiePolicyContent
        : null,
);
</script>
<template>
  <v-container>
    <page-title :title="pageTitle" justify="space-between">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="$router.back()"
      ></v-btn>
    </page-title>
    <v-row align="center" justify="center">
      <v-col cols="auto mt-5">
        <div v-html="staticContent"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
