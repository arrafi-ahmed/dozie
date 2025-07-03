<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {isValidImage, toLocalISOString} from "@/others/util";
import {useDisplay} from "vuetify";
import DatePicker from "@/components/DatePicker.vue";

const {xs} = useDisplay();
const router = useRouter();
const store = useStore();

const newEventInit = {
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
};
const newEvent = reactive({...newEventInit});

const form = ref(null);
const isFormValid = ref(true);

const handleEventBanner = (file) => {
  newEvent.banner = file;
};

const handleAddEvent = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const formData = new FormData();
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
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title justify="space-between" title="Add Event">
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
          @submit.prevent="handleAddEvent"
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

          <v-file-input
            accept="image/*"
            class="mt-2 mt-md-4"
            density="compact"
            hide-details="auto"
            label="Banner"
            prepend-icon=""
            prepend-inner-icon="mdi-camera"
            show-size
            @update:modelValue="handleEventBanner"
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="fileName in fileNames" :key="fileName">
                <v-chip class="me-2" color="primary" label size="small">
                  {{ fileName }}
                </v-chip>
              </template>
            </template>
          </v-file-input>

          <div class="d-flex align-center mt-3 mt-md-4">
            <v-spacer></v-spacer>
            <v-btn
              :density="xs ? 'comfortable' : 'default'"
              color="primary"
              type="submit"
            >Add
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
