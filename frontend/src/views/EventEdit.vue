<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {getEventImageUrl, isValidImage, toLocalISOString,} from "@/others/util";
import {useDisplay} from "vuetify";
import DatePicker from "@/components/DatePicker.vue";

const {xs} = useDisplay();
const route = useRoute();
const router = useRouter();
const store = useStore();

const prefetchedEvent = computed(() =>
  store.getters["event/getEventById"](route.params.eventId),
);
const event = computed(() =>
  prefetchedEvent.value?.id ? prefetchedEvent.value : store.state.event.event,
);

const newEventInit = {
  id: null,
  name: null,
  description: null,
  location: null,
  ticketPrice: 0,
  maxAttendees: 1000,
  startDate: new Date(),
  endDate: new Date(),
  banner: null,
  clubId: null,
  createdBy: null,
  rmImage: null,
};
const newEvent = reactive({...newEventInit});

const form = ref(null);
const isFormValid = ref(true);

const handleBannerUpdate = (file) => {
  newEvent.banner = file;
};
const handleBannerClear = () => {
  newEvent.banner = null;
  newEvent.rmImage = event.value.banner;
};
const handleNewBannerClear = () => {
  newEvent.banner = event.value.banner ? event.value.banner : null;
};

const handleSubmitEditEvent = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const formData = new FormData();
  formData.append("id", newEvent.id);
  formData.append("name", newEvent.name);
  formData.append("description", newEvent.description);
  formData.append("location", newEvent.location);
  formData.append("ticketPrice", newEvent.ticketPrice);
  formData.append("maxAttendees", newEvent.maxAttendees);
  formData.append(
    "startDate",
    toLocalISOString(newEvent.startDate).slice(0, 10),
  );
  formData.append("endDate", toLocalISOString(newEvent.endDate).slice(0, 10));

  if (newEvent.banner) formData.append("files", newEvent.banner);
  if (newEvent.rmImage) formData.append("rmImage", newEvent.rmImage);

  store.dispatch("event/save", formData).then((result) => {
    // newEvent = {...newEvent, ...newEventInit}
    Object.assign(newEvent, {
      ...newEventInit,
    });
    router.push({
      name: "dashboard-admin",
    });
  });
};
const fetchData = async () => {
  if (!event.value?.id) {
    await store.dispatch("event/setEventByEventIdnClubId", {
      eventId: route.params.eventId,
    });
  }
};
onMounted(async () => {
  await fetchData();
  Object.assign(newEvent, {
    ...event.value,
    banner: null,
    startDate: new Date(event.value.startDate),
    endDate: new Date(event.value.endDate),
  });
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title
          :sub-title="event.name"
          justify="space-between"
          title="Edit Event"
        >
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="$router.back()"
          ></v-btn>
        </page-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-form
          ref="form"
          v-model="isFormValid"
          fast-fail
          @submit.prevent="handleSubmitEditEvent"
        >
          <v-text-field
            v-model="newEvent.name"
            :rules="[(v) => !!v || 'Name is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Name"
            prepend-inner-icon="mdi-format-title"
            required
          ></v-text-field>

          <v-textarea
            v-model="newEvent.description"
            :rules="[(v) => !!v || 'Description is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Description"
            prepend-inner-icon="mdi-text-box"
            required
          ></v-textarea>

          <v-text-field
            v-model="newEvent.location"
            :rules="[(v) => !!v || 'Location is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Location"
            prepend-inner-icon="mdi-map-marker"
            required
          ></v-text-field>

          <v-text-field
            v-model="newEvent.ticketPrice"
            :rules="[
              (v) =>
                (v !== null && v !== undefined && v !== '') ||
                'Ticket Price is required!',
            ]"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Ticket Price"
            prepend-inner-icon="mdi-currency-eur"
            required
            type="number"
          ></v-text-field>

          <v-text-field
            v-model="newEvent.maxAttendees"
            :rules="[
              (v) =>
                (v !== null && v !== undefined && v !== '') ||
                'Max Attendees is required!',
            ]"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Max Attendees"
            prepend-inner-icon="mdi-counter"
            required
            type="number"
          ></v-text-field>

          <date-picker
            v-model="newEvent.startDate"
            :rules="[(v) => !!v || 'Start Date is required!']"
            color="primary"
            custom-class="mt-2 mt-md-4"
            label="Start Date"
          ></date-picker>

          <date-picker
            v-model="newEvent.endDate"
            :rules="[
              (v) => !!v || 'End Date is required!',
              (v) =>
                newEvent.startDate <= newEvent.endDate ||
                'Start Date must be less than End Date',
            ]"
            color="primary"
            custom-class="mt-2 mt-md-4"
            label="End Date"
          ></date-picker>

          <v-row align="center" justify="start" no-gutters>
            <v-col class="mt-5" cols="12" sm="3">
              <v-img
                :src="getEventImageUrl(event.banner)"
                aspect-ratio="1"
                class="position-relative mx-1 border"
                cover
                rounded
              >
                <v-btn
                  v-if="newEvent.banner"
                  class="position-absolute rounded-0"
                  color="error"
                  density="comfortable"
                  icon="mdi-delete"
                  location="top end"
                  size="small"
                  @click="handleBannerClear"
                >
                </v-btn>
              </v-img>
              <v-file-input
                :rules="[
                  (v) =>
                    !v ||
                    (Array.isArray(v) ? v : [v]).every((file) =>
                      isValidImage(file),
                    ) ||
                    'Only jpg/jpeg/png allowed!',
                ]"
                accept="image/*"
                class="mx-1"
                clearable
                density="compact"
                hide-details="auto"
                label="Update Banner"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                show-size
                variant="solo-filled"
                @update:modelValue="handleBannerUpdate"
                @click:clear="handleNewBannerClear"
              >
                <template v-slot:selection="{}">
                  {{ "New Image" }}
                </template>
              </v-file-input>
            </v-col>
          </v-row>

          <div class="d-flex align-center mt-3 mt-md-4">
            <v-spacer></v-spacer>
            <v-btn
              :density="mobile ? 'comfortable' : 'default'"
              color="primary"
              type="submit"
            >Save
            </v-btn>
          </div>
        </v-form>
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
}
</style>
