<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import PageTitle from "@/components/PageTitle.vue";
import {
  checkinItems,
  clientBaseUrl,
  deepCopy,
  extrasItems,
  formatDateTime,
  padStr,
  sendToWhatsapp,
} from "@/others/util";
import {useDisplay} from "vuetify";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const {xs} = useDisplay();

const event = computed(() =>
  store.getters["event/getEventById"](route.params.eventId),
);
const attendees = computed(() => store.state.registration.attendees);
const editingAttendeeInit = {
  registration: null,
  checkin: null,
  extras: null,
};
const editingAttendee = reactive({...editingAttendeeInit});
const attendeeDetailsDialog = ref(false);

const openAtendeeDetailsDialog = (registrationId) => {
  const attendee = attendees.value.find(
    (item) => item.registration?.id == registrationId,
  );
  Object.assign(editingAttendee, deepCopy(attendee)); //deep clone
  editingAttendee.checkin.status =
    attendee.checkin?.status === true
      ? checkinItems[1].value
      : checkinItems[0].value;
  attendeeDetailsDialog.value = !attendeeDetailsDialog.value;
};

const updateCheckinStatus = async (registrationId) => {
  const attendee = attendees.value.find(
    (item) => item.registration?.id == registrationId,
  );
  if (attendee.checkin?.status === editingAttendee.checkin?.status) return;

  const newCheckin = {};
  Object.assign(newCheckin, {...editingAttendee.checkin, registrationId});

  await store
    .dispatch("checkin/save", {
      newCheckin,
      eventId: route.params.eventId,
    })
    .finally(() => {
      attendeeDetailsDialog.value = !attendeeDetailsDialog.value;
      Object.assign(editingAttendee, {
        ...editingAttendeeInit,
        checkin: {status: checkinItems[0].value},
      });
    });
};

const searchKeyword = ref(null);

const handleDownloadAttendees = () => {
  store.dispatch("registration/downloadAttendees", {
    eventId: route.params.eventId,
  });
};

const sendTicket = (registrationId) => {
  store.dispatch("registration/sendTicket", {
    registrationId,
    eventId: route.params.eventId,
  });
};

const removeRegistration = (registrationId) => {
  store.dispatch("registration/removeRegistration", {
    registrationId,
    eventId: route.params.eventId,
  });
};

const viewQr = (item) => {
  router.push({
    name: "qr-viewer",
    params: {id: item.id, qrUuid: item.qrUuid},
  });
};

const sortByCheckin = () => {
  store.dispatch("registration/setAttendees", {
    eventId: route.params.eventId,
    searchKeyword: searchKeyword.value,
    sortBy: "checkin",
  });
};

const handleSendToWhatsapp = (registration) => {
  const phone = registration.registrationData.phone.slice(1);
  const message = `QR code download link: ${clientBaseUrl}/qr/${registration.id}/${registration.qrUuid}`;
  sendToWhatsapp(phone, message);
};

const fetchData = () => {
  store.dispatch("registration/setAttendees", {
    eventId: route.params.eventId,
    searchKeyword: searchKeyword.value,
  });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title
          :sub-title="event?.name"
          justify="space-between"
          title="Attendee List"
        >
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="$router.back()"
          ></v-btn>
        </page-title>
      </v-col>
    </v-row>

    <div class="d-flex align-center justify-end my-2 my-md-4">
      <v-text-field
        v-model="searchKeyword"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        label="Search by name/email/phone"
        single-line
        variant="solo"
        @keydown.enter="fetchData"
        @click:append-inner="fetchData"
      ></v-text-field>
      <!--            download btn for mobile-->
      <v-btn
        v-if="xs"
        class="ml-2"
        color="primary"
        icon="mdi-download"
        rounded
        variant="tonal"
        @click="handleDownloadAttendees"
      ></v-btn>
      <!--            download btn for desktop-->
      <v-btn
        v-else
        class="ml-2"
        color="primary"
        prepend-icon="mdi-download"
        @click="handleDownloadAttendees"
      >Download
      </v-btn>
    </div>

    <v-row v-if="attendees.length > 0">
      <v-col>
        <v-table density="comfortable" hover>
          <thead>
          <tr>
            <th class="text-start">ID</th>
            <th class="text-start">Name</th>
            <th v-if="!xs" class="text-start">Phone</th>
            <th
              v-if="!xs"
              class="text-start v-label--clickable"
              @click="fetchData"
            >
              Registration Time
            </th>
            <th class="text-start v-label--clickable" @click="sortByCheckin">
              Check-in Status
            </th>
            <!--            <th class="text-start">Voucher</th>-->
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item, index) in attendees"
            :key="'r-' + index"
            class="clickable"
            @click="openAtendeeDetailsDialog(item.registration.id)"
          >
            <td>{{ padStr(item.registration.id, 5) }}</td>
            <td>{{ item.registration.registrationData?.name }}</td>
            <td v-if="!xs">
              {{ item.registration.registrationData?.phone }}
            </td>
            <td v-if="!xs">
              {{ formatDateTime(item.registration.registrationTime) }}
            </td>
            <td class="text-capitalize">
              <v-chip
                v-if="item.checkin?.status === true"
                color="success"
                variant="flat"
              >{{ checkinItems[1].title }}
              </v-chip>
              <v-chip v-else color="yellow" variant="flat"
              >{{ checkinItems[0].title }}
              </v-chip>
            </td>
            <!--            <td class="text-capitalize">-->
            <!--              <v-chip-->
            <!--                v-if="item.extras?.status === true"-->
            <!--                color="success"-->
            <!--                variant="flat"-->
            <!--              >{{ extrasItems[2].title }}-->
            <!--              </v-chip>-->
            <!--              <v-chip-->
            <!--                v-else-if="item.extras?.status === false"-->
            <!--                color="yellow"-->
            <!--                variant="flat"-->
            <!--              >{{ extrasItems[1].title }}-->
            <!--              </v-chip>-->
            <!--              <div v-else>{{ extrasItems[0].title }}</div>-->
            <!--            </td>-->
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
                  density="compact"
                  prepend-icon="mdi-email-fast"
                  title="Email Ticket"
                  @click="sendTicket(item.registration.id)"
                ></v-list-item>
                <v-list-item
                  density="compact"
                  prepend-icon="mdi-email-fast"
                  title="WhatsApp Ticket"
                  @click="handleSendToWhatsapp(item.registration)"
                ></v-list-item>
                <v-list-item
                  density="compact"
                  prepend-icon="mdi-eye"
                  title="Main QR Code"
                  @click="viewQr(item.registration)"
                ></v-list-item>
                <v-list-item
                  density="compact"
                  prepend-icon="mdi-eye"
                  title="Voucher QR Code"
                  @click="viewQr(item.extras)"
                ></v-list-item>
                <v-divider></v-divider>
                <confirmation-dialog
                  @confirm="removeRegistration(item.registration.id)"
                >
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
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-alert border="start" closable density="compact"
        >No Users found!
        </v-alert>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="attendeeDetailsDialog" width="500">
    <v-card>
      <v-card-title> Attendee Details</v-card-title>
      <v-card-text>
        <v-table density="compact">
          <tbody>
          <tr>
            <td class="rowTitle">Name</td>
            <td>
              {{ editingAttendee.registration?.registrationData?.name }}
            </td>
          </tr>
          <tr>
            <td class="rowTitle">Email</td>
            <td>
              {{ editingAttendee.registration?.registrationData?.email }}
            </td>
          </tr>
          <tr>
            <td class="rowTitle">Phone</td>
            <td>
              {{ editingAttendee.registration?.registrationData?.phone }}
            </td>
          </tr>
          <tr>
            <td class="rowTitle">Registration Time</td>
            <td>
              {{
                formatDateTime(editingAttendee.registration?.registrationTime)
              }}
            </td>
          </tr>
          <tr>
            <td class="rowTitle">Checkin Time</td>
            <td>
              {{
                editingAttendee.checkin?.checkinTime
                  ? formatDateTime(editingAttendee.checkin?.checkinTime)
                  : checkinItems[0].title
              }}
            </td>
          </tr>
          <tr>
            <td class="rowTitle">Checkin Status</td>
            <td class="text-capitalize">
              <v-select
                v-model="editingAttendee.checkin.status"
                :items="checkinItems"
                class="text-capitalize"
                density="compact"
                hide-details="auto"
                item-title="title"
                item-value="value"
              ></v-select>
            </td>
          </tr>

          <tr v-for="(value, key) in editingAttendee.registration?.registrationData?.others" :key="key">
            <td class="rowTitle">{{ key }}</td>
            <td>{{ value }}</td>
          </tr>

          </tbody>
        </v-table>
      </v-card-text>

      <div v-if="editingAttendee.extras?.id">
        <v-card-title>Purchased Extras</v-card-title>
        <v-card-text>
          <v-list v-if="editingAttendee.extras.extrasData?.length > 0">
            <v-list-item
              v-for="(item, index) in editingAttendee.extras.extrasData"
            >
              <v-divider class="mb-1"></v-divider>
              <v-list-item-title class="d-flex justify-space-between">
                <span>{{ item.name }}</span>
                <span>€ {{ item.price }}</span>
              </v-list-item-title>
              <v-list-item-subtitle
                v-for="(contentItem, contentIndex) in item.content"
              >
                <span>{{ contentItem.name }}</span> X
                <span>{{ contentItem.quantity }}</span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="attendeeDetailsDialog = false"
        >Close
        </v-btn>
        <v-btn
          color="primary"
          @click="updateCheckinStatus(editingAttendee.registration?.id)"
        >Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.rowTitle {
  width: 152px;
}
</style>
