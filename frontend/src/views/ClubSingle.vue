<script setup>
import {computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getApiPublicImgUrl, getEventImageUrl} from "@/others/util";
import {useStore} from "vuex";
import Logo from "@/components/Logo.vue";
import {useDisplay} from "vuetify";

const store = useStore();
const route = useRoute();
const router = useRouter();
const {sm} = useDisplay();

const club = computed(() => store.state.club.club);
const events = computed(() => store.state.event.events);

const fetchData = async () => {
  await Promise.all([
    store.dispatch("event/setActiveEvents", {
      clubId: route.params.clubId,
      currentDate: new Date().toLocaleDateString("en-CA"),
    }),
    store.dispatch("club/setClub", route.params.clubId),
  ]);
};
onMounted(async () => {
  await fetchData();
});
</script>
<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" no-gutters>
      <v-col cols="12" sm="10">
        <v-card
          v-if="club.id"
          class="mx-auto pa-0 pa-md-5 my-0 my-md-2 rounded-xl bg-transparent"
          density="compact"
          elevation="0"
          max-width="375"
          variant="flat"
        >
          <v-card-text>
            <logo
              v-if="club.logo"
              :img-src="getApiPublicImgUrl(club.logo, 'club-logo')"
              :max-width="sm ? 200 : 300"
              :title="!club.logo ? club.name : null"
              container-class="clickable"
              img-class="mx-auto"
              @click="
                router.push({
                  name: 'club-single',
                  params: { clubId: route.params.clubId },
                })
              "
            ></logo>
            <v-card-title class="text-center text-wrap mt-2 mt-md-5">
              Upcoming events
            </v-card-title>
            <v-card-subtitle class="text-center mb-4 mb-md-8"
            >Select and book your entry
            </v-card-subtitle>

            <v-carousel
              v-if="events?.length > 0"
              :show-arrows="true"
              continuous
              cycle
              height="100%"
              hide-delimiters
              width="100%"
            >
              <v-carousel-item
                v-for="(item, index) in events"
                :key="index"
                height="100%"
                rounded="lg"
              >
                <v-sheet
                  :aspect-ratio="0.5"
                  class="bg-transparent fill-height v-icon--clickable"
                  height="100%"
                  @click="
                    () =>
                      router.push({
                        name: 'event-register',
                        params: { clubId: item.clubId, eventId: item.id },
                      })
                  "
                >
                  <v-img
                    :aspect-ratio="0.563"
                    :cover="true"
                    :src="getEventImageUrl(item.banner)"
                    width="100%"
                  ></v-img>

                  <div class="bg-primary text-center pa-3">
                    <div class="font-weight-bold">{{ item.name }}</div>
                    <h5 class="font-weight-light text-truncate">
                      {{ item.description }}
                    </h5>
                  </div>
                </v-sheet>
              </v-carousel-item>

              <template v-slot:prev="{ props }">
                <v-icon
                  class="bg-grey-lighten-4 opacity-60 rounded-circle"
                  icon="mdi-chevron-left"
                  @click="props.onClick"
                ></v-icon>
              </template>
              <template v-slot:next="{ props }">
                <v-icon
                  class="bg-grey-lighten-4 opacity-60 rounded-circle"
                  icon="mdi-chevron-right"
                  @click="props.onClick"
                ></v-icon>
              </template>
            </v-carousel>
            <div v-else>
              <div class="text-center">No events available!</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
