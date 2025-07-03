<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {toLocalISOString} from "@/others/util";
import DatePicker from "@/components/DatePicker.vue";

const store = useStore();
const route = useRoute();

const event = computed(() =>
  store.getters["event/getEventById"](route.params.eventId),
);
const statistics = computed(() => store.state.checkin.statistics);
const inputDate = ref(null);

const handleChangeDateStat = (date) => {
  store.dispatch("checkin/setStatistics", {
    date: toLocalISOString(date),
    eventId: route.params.eventId,
  });
};

onMounted(() => {
  inputDate.value = new Date();
  store.dispatch("checkin/setStatistics", {
    date: toLocalISOString(inputDate.value),
    eventId: route.params.eventId,
  });
});
</script>
<template>
  <v-container>
    <v-row align="start">
      <v-col>
        <page-title
          :sub-title="event?.name"
          justify="space-between"
          title="Statistics"
        >
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="$router.back()"
          ></v-btn>
        </page-title>
      </v-col>
    </v-row>

    <v-row align="stretch" justify="center">
      <v-col class="flex-grow-1" cols="12" md="6" sm="8">
        <v-card class="h-100">
          <v-card-title>Total Counts</v-card-title>
          <v-divider></v-divider>
          <v-card-text v-if="statistics">
            <div class="text-body-1">
              Total Registration:
              <v-chip color="primary" rounded="sm" size="x-large">
                {{ statistics.totalRegistrationCount || 0 }}
              </v-chip>
            </div>
            <div class="text-body-1 pt-2">
              Total Checkin:
              <v-chip color="primary" rounded="sm" size="x-large">
                {{ statistics.totalCheckinCount || 0 }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="flex-grow-1" cols="12" md="6" sm="8">
        <v-card class="h-100">
          <v-card-title>Historical Counts</v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle>
            <date-picker
              v-model="inputDate"
              :rules="[(v) => !!v || 'Date is required!']"
              color="primary"
              custom-class="mt-2 mt-md-4"
              label="Input Date"
              @update-date="handleChangeDateStat"
            ></date-picker>
          </v-card-subtitle>
          <v-card-text v-if="statistics">
            <div class="text-body-1">
              Registration:
              <v-chip color="primary" rounded="sm" size="x-large">
                {{ statistics.historicalRegistrationCount || 0 }}
              </v-chip>
            </div>
            <div class="text-body-1 pt-2">
              Checkin:
              <v-chip color="primary" rounded="sm" size="x-large">
                {{ statistics.historicalCheckinCount || 0 }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
