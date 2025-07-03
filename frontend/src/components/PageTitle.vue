<script setup>
const {title, subTitle, justify, customClass} = defineProps({
  title: {type: String},
  subTitle: {type: String},
  justify: {type: String, default: "space-between"},
  customClass: {type: String},
});
</script>

<template>
  <v-row :class="customClass" :justify="justify" align="center" no-gutters>
    <v-col cols="10">
      <div v-if="subTitle" class="text-overline">{{ subTitle }}</div>
      <h2 v-if="title">{{ title }}</h2>
    </v-col>
    <v-col cols="auto">
      <slot></slot>
    </v-col>
  </v-row>
  <v-divider class="my-2"></v-divider>
</template>

<style scoped></style>
