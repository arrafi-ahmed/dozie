<script setup>
import {appInfo} from "@/others/util";
import {useStore} from "vuex";

const store = useStore();
</script>
<template>
  <v-footer class="bg-tertiary flex-grow-0">
    <v-row justify="center" no-gutters>
      <v-col class="text-center" cols="12">
        <small>
          &copy; <strong>{{ appInfo.name }}</strong> {{ new Date().getFullYear() }}
        </small>
      </v-col>
    </v-row>
  </v-footer>
</template>
