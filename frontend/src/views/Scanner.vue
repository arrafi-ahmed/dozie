<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, reactive, ref} from "vue";
import {useStore} from "vuex";
import {QrcodeStream} from "vue-qrcode-reader";
import {useRoute, useRouter} from "vue-router";
import {checkinItems, extrasItems, formatDateTime} from "@/others/util";

const store = useStore();
const route = useRoute();
const router = useRouter();

// const qrScannerDialog = ref(false);
const isPaused = ref(false);

const event = computed(() =>
  store.getters["event/getEventById"](route.params.eventId),
);
const result = reactive({});
const handleScan = async ([decodedString]) => {
  isPaused.value = true; // pause the camera stream

  if (route.params.variant === "main") {
    await store
      .dispatch("checkin/scanByRegistrationId", {
        qrCodeData: decodedString.rawValue,
        eventId: route.params.eventId,
      })
      .then((res) => {
        Object.assign(result, {...res});
      })
      .catch((err) => {
        Object.assign(result, {...err.response.data?.payload});
      })
      .finally(() => {
        isPaused.value = false;
      });
  } else if (route.params.variant === "voucher") {
    await store
      .dispatch("registration/scanByExtrasPurchaseId", {
        qrCodeData: decodedString.rawValue,
        eventId: route.params.eventId,
      })
      .then((res) => {
        Object.assign(result, {...res});
      })
      .catch((err) => {
        Object.assign(result, {...err.response.data?.payload});
      })
      .finally(() => {
        isPaused.value = false;
      });
  }
};
const scannerVariant = computed(() => route.params.variant);

const switchScanner = () => {
  const nextVariant = scannerVariant.value === "main" ? "voucher" : "main";
  router
    .push({
      name: "scanner",
      params: {
        eventId: route.params.eventId,
        variant: nextVariant,
      },
    })
    .finally(() => {
      Object.keys(result).forEach((key) => delete result[key]);
    });
};

const onError = (err) => {
  console.error(99, err);
};
</script>
<template>
  <v-container>
    <v-row align="start">
      <v-col>
        <page-title
          :sub-title="event?.name"
          :title="`${scannerVariant} Scanner`"
          custom-class="text-capitalize"
          justify="space-between"
        >
          <v-btn
            icon="mdi-swap-vertical-circle-outline"
            variant="text"
            @click="switchScanner"
          ></v-btn>
          <!--          <v-btn-->
          <!--            icon="mdi-arrow-left"-->
          <!--            variant="text"-->
          <!--            density="comfortable"-->
          <!--            @click="$router.back()"-->
          <!--          ></v-btn>-->
        </page-title>
      </v-col>
    </v-row>

    <v-row align="center" class="fill-height" justify="center" no-gutters>
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card>
          <v-card-title>Scan QR Code</v-card-title>
          <v-card-text>
            <qrcode-stream
              :paused="isPaused"
              @detect="handleScan"
              @error="onError"
            ></qrcode-stream>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row
      align="center"
      class="fill-height mt-2 mt-md-4"
      justify="center"
      no-gutters
    >
      <v-col cols="12" lg="6" md="8" sm="10">
        <!--        show customer details-->
        <v-card v-if="scannerVariant === 'main'">
          <v-card-title>Attendee Details</v-card-title>
          <v-card-text>
            <v-table v-if="result.registrationData" density="compact">
              <tbody>
              <tr>
                <td class="rowTitle">Checkin Status</td>
                <td>
                  <v-chip
                    v-if="result.status === true"
                    color="success"
                    density="compact"
                    variant="flat"
                  >{{ checkinItems[1].title }}
                  </v-chip>
                  <v-chip
                    v-else
                    color="yellow"
                    density="compact"
                    variant="flat"
                  >
                    {{ checkinItems[0].title }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Checkin Time</td>
                <td>
                  {{
                    result.checkinTime
                      ? formatDateTime(result.checkinTime)
                      : "Pending"
                  }}
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Name</td>
                <td>
                  {{ result.registrationData?.name }}
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Email</td>
                <td>
                  {{ result.registrationData?.email }}
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Phone</td>
                <td>
                  {{ result.registrationData?.phone }}
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Registration Time</td>
                <td>
                  {{ formatDateTime(result.registrationTime) }}
                </td>
              </tr>

              <tr v-for="(value, key) in result.registrationData?.others" :key="key">
                <td class="rowTitle">{{ key }}</td>
                <td>{{ value }}</td>
              </tr>


              </tbody>
            </v-table>
            <v-alert v-else border="start" closable density="compact"
            >Nothing scanned yet!
            </v-alert>
          </v-card-text>
        </v-card>

        <v-card v-else-if="scannerVariant === 'voucher'">
          <v-card-title>Vouchers</v-card-title>
          <v-card-text>
            <v-table v-if="result.extrasData?.length > 0" density="compact">
              <tbody>
              <tr>
                <td class="rowTitle">Redeem Status</td>
                <td>
                  <v-chip
                    v-if="result.status === true"
                    color="success"
                    density="compact"
                    variant="flat"
                  >{{ extrasItems[2].title }}
                  </v-chip>
                  <v-chip
                    v-else-if="result.status === false"
                    color="yellow"
                    density="compact"
                    variant="flat"
                  >{{ extrasItems[1].title }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Redeemed At</td>
                <td>
                  {{
                    result.scannedAt
                      ? formatDateTime(result.scannedAt)
                      : "Pending"
                  }}
                </td>
              </tr>
              <tr>
                <td class="rowTitle">Items</td>
                <td>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in result.extrasData"
                      class="px-0"
                      density="compact"
                    >
                      <v-list-item-title class="d-flex justify-space-between">
                        <span>{{ item.name }}</span>
                        <!--                          <span>€ {{ item.price }}</span>-->
                      </v-list-item-title>
                      <v-list-item-subtitle
                        v-for="(contentItem, contentIndex) in item.content"
                      >
                        <span>{{ contentItem.name }}</span> X
                        <span>{{ contentItem.quantity }}</span>
                      </v-list-item-subtitle>
                      <v-divider class="mt-2"></v-divider>
                    </v-list-item>
                  </v-list>
                </td>
              </tr>
              </tbody>
            </v-table>
            <v-alert v-else border="start" closable density="compact"
            >Nothing scanned yet!
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
