<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {useDisplay} from "vuetify";
import PageTitle from "@/components/PageTitle.vue";

const {xs} = useDisplay();
const store = useStore();
const route = useRoute();
const router = useRouter();

const attendeeImportDialog = ref(false);
const attendeeImportForm = ref(null);
const isAttendeeImportFormValid = ref(true);
const attendeeImportExcel = ref(null);

const handleAttendeeImport = async () => {
  if (!attendeeImportExcel.value) {
    store.commit("addSnackbar", {
      text: "Excel file required!",
      color: "error",
    });
    return;
  }
  const formData = new FormData();
  formData.append("eventId", route.params.eventId);
  formData.append("attendeeImportExcel", attendeeImportExcel.value);

  store.dispatch("registration/bulkImportAttendee", formData).then((result) => {
    router.push({name: "event-attendees", params: {eventId: route.params.eventId}});
  });
};
</script>

<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col>
        <page-title justify="space-between" title="Import">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="$router.back()"
          ></v-btn>
        </page-title>

        <v-card
          class="mx-auto pa-4 pa-md-8 my-4"
          elevation="0"
          max-width="700"
          rounded="lg"
        >
          <v-card-title class="text-center font-weight-bold">
            <h2>Attendee Import</h2>
          </v-card-title>
<!--          <v-card-subtitle-->
<!--            class="text-center v-icon&#45;&#45;clickable text-decoration-underline"-->
<!--            @click="attendeeImportDialog = !attendeeImportDialog"-->
<!--          >-->
<!--            <v-icon>mdi-information-outline</v-icon>-->
<!--            Import instruction-->
<!--          </v-card-subtitle>-->
          <v-card-text>
            <v-form
              ref="attendeeImportForm"
              v-model="isAttendeeImportFormValid"
              fast-fail
              @submit.prevent="handleAttendeeImport"
            >
              <v-file-upload
                v-model="attendeeImportExcel"
                :hide-browse="false"
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                class="mt-2 mt-md-4"
                clearable
                density="compact"
                show-size
                title="Upload excel"
                variant="compact"
              />

              <v-btn
                :density="xs ? 'comfortable' : 'default'"
                block
                class="mt-2 mt-md-4"
                color="primary"
                rounded="lg"
                size="large"
                type="submit"
              >
                Import Now
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

<!--  <v-dialog-->
<!--    v-model="attendeeImportDialog"-->
<!--    :max-width="600"-->
<!--  >-->
<!--    <v-card>-->
<!--      <v-card-title>How to Prepare Your Import File</v-card-title>-->
<!--      <v-card-text class="text-pre-wrap">-->
<!--        <ul class="mx-3 import-instruction">-->
<!--          <li>-->
<!--            <div class="mb-3">-->
<!--              In excel file, include the following columns:-->
<!--            </div>-->
<!--            <code>identity start end authenticity attendee_conditions-->
<!--              void_conditions support_contact usage_advice-->
<!--            </code>-->
<!--            <v-img-->
<!--              :src="getClientPublicImageUrl('excel-demo-import-attendee.png')"-->
<!--              class="mt-3"-->
<!--            />-->
<!--            <div class="d-flex justify-center">-->
<!--              <v-btn-->
<!--                :href="-->
<!--                  getClientPublicImageUrl('excel-demo-import-attendee.png')-->
<!--                "-->
<!--                :ripple="false"-->
<!--                class="mx-auto"-->
<!--                icon-->
<!--                size="x-small"-->
<!--                target="_blank"-->
<!--                variant="plain"-->
<!--              >-->
<!--                (+) View full size-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </v-card-text>-->
<!--      <v-card-actions>-->
<!--        <v-btn-->
<!--          color="secondary"-->
<!--          variant="flat"-->
<!--          @click="attendeeImportDialog = !attendeeImportDialog"-->
<!--        >-->
<!--          Close-->
<!--        </v-btn>-->
<!--      </v-card-actions>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
</template>

<style>
.import-instruction li {
  margin-bottom: 0.5rem;
}
</style>
