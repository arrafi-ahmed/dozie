<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, onMounted} from "vue";
import {useStore} from "vuex";
import {formatDate, getEventImageUrl} from "@/others/util";
import {useRoute, useRouter} from "vue-router";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const events = computed(() => store.state.event.events);
const currentUser = computed(() => store.getters["user/getCurrentUser"]);

const deleteEvent = (eventId) => {
  store.dispatch("event/removeEvent", {eventId});
};

const fetchData = () => {
  store.dispatch("event/setEvents", currentUser.value.clubId);
};
onMounted(() => {
  fetchData();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title justify="space-between" sub-title="Admin" title="Dashboard">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text">
              </v-btn>
            </template>
            <v-list density="comfortable">
              <v-list-item
                :to="{ name: 'event-add' }"
                density="compact"
                prepend-icon="mdi-plus"
                title="Add Event"
              ></v-list-item>
              <v-list-item
                :to="{
                  name: 'club-edit',
                }"
                density="compact"
                prepend-icon="mdi-pencil"
                title="Edit Club"
              ></v-list-item>
              <!--              <v-list-item-->
              <!--                :to="{-->
              <!--                  name: 'club-single',-->
              <!--                  params: {-->
              <!--                    clubId: currentUser.clubId,-->
              <!--                  },-->
              <!--                }"-->
              <!--                density="compact"-->
              <!--                prepend-icon="mdi-eye"-->
              <!--                title="View Club"-->
              <!--              ></v-list-item>-->
            </v-list>
          </v-menu>
        </page-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div v-if="events.length > 0" lines="three" rounded>
          <template v-for="(item, index) in events">
            <v-card v-if="item" :key="index" :title="item?.name" class="mt-2">
              <template #prepend>
                <v-avatar
                  :image="getEventImageUrl(item.banner)"
                  :size="80"
                  rounded="sm"
                ></v-avatar>
              </template>
              <template #append>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      class="ml-5"
                      icon="mdi-dots-vertical"
                      v-bind="props"
                      variant="text"
                    >
                    </v-btn>
                  </template>
                  <v-list density="comfortable">
                    <v-list-item
                      prepend-icon="mdi-qrcode"
                      title="Main Scanner"
                      @click="
                        router.push({
                          name: 'scanner',
                          params: {
                            eventId: item.id,
                            variant: 'main',
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-plus"
                      title="Import Attendees"
                      @click="
                        router.push({
                          name: 'import',
                          params: {
                            eventId: item.id,
                            variant: 'main',
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-form-select"
                      title="Form"
                      @click="
                        router.push({
                          name: 'form-builder',
                          params: {
                            eventId: item.id,
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-account-multiple-outline"
                      title="Attendees"
                      @click="
                        router.push({
                          name: 'event-attendees',
                          params: {
                            eventId: item.id,
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-qrcode"
                      title="Voucher Scanner"
                      @click="
                        router.push({
                          name: 'scanner',
                          params: {
                            eventId: item.id,
                            variant: 'voucher',
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-counter"
                      title="Statistics"
                      @click="
                        router.push({
                          name: 'statistics',
                          params: {
                            eventId: item.id,
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-pencil"
                      title="Edit"
                      @click="
                        router.push({
                          name: 'event-edit',
                          params: {
                            eventId: item.id,
                          },
                        })
                      "
                    ></v-list-item>
                    <v-list-item
                      prepend-icon="mdi-puzzle"
                      title="Vouchers"
                      @click="
                        router.push({
                          name: 'event-extras',
                          params: {
                            eventId: item.id,
                          },
                        })
                      "
                    ></v-list-item>

                    <v-divider></v-divider>

                    <confirmation-dialog @confirm="deleteEvent(item.id)">
                      <template #activator="{ onClick }">
                        <v-list-item
                          class="text-error"
                          prepend-icon="mdi-delete"
                          title="Delete"
                          @click.stop="onClick"
                        ></v-list-item>
                      </template>
                    </confirmation-dialog>
                  </v-list>
                </v-menu>
              </template>
              <template #subtitle>
                <div>
                  {{
                    `Date: ${formatDate(item.startDate)} - ${formatDate(
                      item.endDate,
                    )}`
                  }}
                  <br/>
                  {{ `Location: ${item.location}` }}
                </div>
              </template>
            </v-card>
          </template>
        </div>
        <v-alert v-else border="start" closable density="compact"
        >No items found!
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-avatar {
  border-radius: 0;
}

.v-avatar.v-avatar--density-default {
  width: calc(var(--v-avatar-height) + 80px);
  height: calc(var(--v-avatar-height) + 20px);
}
</style>
