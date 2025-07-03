<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, onMounted, reactive, ref} from "vue";
import Extras from "@/models/Extras";
import {useStore} from "vuex";
import ExtrasItem from "@/models/ExtrasItem";
import {useRoute, useRouter} from "vue-router";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const currentUser = computed(() => store.state.user.currentUser);
const targetClubId = computed(() =>
  currentUser.value.role === "sudo"
    ? route.params.clubId
    : currentUser.value.role === "admin"
      ? currentUser.value.clubId
      : null,
);
const club = computed(() => store.state.club.club);
const extras = computed(() => store.state.event.extras);

const newExtras = reactive({...new Extras()});

const openAddExtrasDialog = () => {
  addExtrasDialog.value = !addExtrasDialog.value;
};
const addExtrasDialog = ref(false);
const addExtrasForm = ref(null);
const isAddExtrasFormValid = ref(true);

const openEditExtrasDialog = ({id}) => {
  editExtrasDialog.value = !editExtrasDialog.value;
  const foundExtra = extras.value.find((item) => item.id === id);
  if (foundExtra) {
    Object.assign(newExtras, {...foundExtra});
  }
};
const editExtrasDialog = ref(false);
const editExtrasForm = ref(null);
const isEditExtrasFormValid = ref(true);

const addMoreExtrasItems = () => {
  newExtras.content = newExtras.content.concat({
    ...new ExtrasItem(),
  });
};
const handleExtrasSave = async () => {
  if (addExtrasDialog.value) {
    await addExtrasForm.value.validate();
    if (!isAddExtrasFormValid.value) return;
  } else if (editExtrasDialog.value) {
    await editExtrasForm.value.validate();
    if (!isEditExtrasFormValid.value) return;
  }

  newExtras.eventId = route.params.eventId;

  store.dispatch("event/saveExtras", {newExtras}).then((result) => {
    // newEvent = {...newEvent, ...newEventInit}
    Object.assign(newExtras, {
      ...new Extras(),
    });
    if (addExtrasDialog.value) {
      addExtrasDialog.value = !addExtrasDialog.value;
    } else if (editExtrasDialog.value) {
      editExtrasDialog.value = !editExtrasDialog.value;
    }
  });
};

const deleteExtras = async ({extrasId}) => {
  await store.dispatch("event/removeExtras", {
    extrasId,
    eventId: route.params.eventId,
  });
};

const fetchData = async () => {
  await Promise.allSettled([
    store.dispatch("club/setClub", targetClubId.value),
    store.dispatch("event/setExtras", route.params.eventId),
  ]);
};
onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title
          :sub-title="club.name"
          justify="space-between"
          title="Vouchers"
        >
          <div class="d-flex align-center">
            <v-btn
              class="mr-2"
              color="primary"
              prepend-icon="mdi-plus"
              rounded="lg"
              @click="openAddExtrasDialog"
            >
              Create
            </v-btn>
          </div>

          <!--          <v-menu>-->
          <!--            <template v-slot:activator="{ props }">-->
          <!--              <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text">-->
          <!--              </v-btn>-->
          <!--            </template>-->
          <!--            <v-list density="comfortable">-->
          <!--              <v-list-item-->
          <!--                link-->
          <!--                density="compact"-->
          <!--                prepend-icon="mdi-plus"-->
          <!--                title="Create"-->
          <!--                @click="openAddVoucherDialog"-->
          <!--              ></v-list-item>-->
          <!--            </v-list>-->
          <!--          </v-menu>-->
        </page-title>
      </v-col>
    </v-row>

    <v-row align="stretch">
      <v-col v-for="(extra, index) in extras" cols="12" lg="3" md="4" sm="6">
        <v-card class="fill-height" rounded="lg">
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              <div>{{ extra.name }}</div>
              <v-chip density="compact"> € {{ extra.price }}</v-chip>
            </div>
          </v-card-title>
          <v-card-subtitle>
            {{ extra.description }}
          </v-card-subtitle>
          <v-card-text>
            <div>Contents:</div>
            <v-list density="compact">
              <v-list-item v-for="(content, contentIndex) in extra.content">
                <template #prepend>
                  <v-chip density="comfortable" size="small"
                  >{{ content.quantity }} x
                  </v-chip>
                </template>
                <template #title> &nbsp;{{ content.name }}</template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-space-between">
            <v-btn
              class="border-grey"
              prepend-icon="mdi-square-edit-outline"
              rounded="lg"
              variant="outlined"
              @click="openEditExtrasDialog({ id: extra.id })"
            >Edit
            </v-btn>
            <confirmation-dialog
              @confirm="deleteExtras({ extrasId: extra.id })"
            >
              <template #activator="{ onClick }">
                <v-btn
                  color="error"
                  prepend-icon="mdi-close"
                  rounded="lg"
                  variant="flat"
                  @click="onClick"
                >Delete
                </v-btn>
              </template>
            </confirmation-dialog>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="addExtrasDialog" :width="500">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h2>Add Voucher</h2>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="addExtrasDialog = !addExtrasDialog"
        />
      </v-card-title>
      <v-card-text>
        <v-form
          ref="addExtrasForm"
          v-model="isAddExtrasFormValid"
          fast-fail
          @submit.prevent="handleExtrasSave"
        >
          <v-text-field
            v-model="newExtras.name"
            :rules="[(v) => !!v || 'Name is required!']"
            class="mt-2"
            clearable
            density="comfortable"
            hide-details="auto"
            label="Name"
          />
          <v-textarea
            v-model="newExtras.description"
            :rules="[(v) => !!v || 'Description is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="comfortable"
            hide-details="auto"
            label="Description"
          />
          <v-text-field
            v-model="newExtras.price"
            :rules="[(v) => !!v || 'Price is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="comfortable"
            hide-details="auto"
            label="Price"
            type="number"
          />
          <v-row
            v-for="(item, index) in newExtras.content"
            :key="index"
            no-gutters
          >
            <v-col cols="9">
              <v-text-field
                v-model="item.name"
                :label="`Item #${index + 1}`"
                :rules="[(v) => !!v || 'Item is required!']"
                class="mt-2 mt-md-4"
                clearable
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="item.quantity"
                :label="`Quantity`"
                :rules="[(v) => !!v || 'Quantity is required!']"
                class="mt-2 mt-md-4 ml-2"
                density="comfortable"
                hide-details="auto"
                min="0"
                type="number"
              />
            </v-col>
          </v-row>
          <v-btn
            class="mt-2"
            color="primary"
            size="small"
            @click="addMoreExtrasItems"
          >
            Add More Item
          </v-btn>

          <v-card-actions class="mt-2 mt-md-4">
            <v-spacer/>
            <v-btn color="primary" type="submit" variant="flat"> Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editExtrasDialog" :width="500">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h2>Edit Voucher</h2>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="editExtrasDialog = !editExtrasDialog"
        />
      </v-card-title>
      <v-card-text>
        <v-form
          ref="editExtrasForm"
          v-model="isEditExtrasFormValid"
          fast-fail
          @submit.prevent="handleExtrasSave"
        >
          <v-text-field
            v-model="newExtras.name"
            :rules="[(v) => !!v || 'Name is required!']"
            class="mt-2"
            clearable
            density="comfortable"
            hide-details="auto"
            label="Name"
          />
          <v-textarea
            v-model="newExtras.description"
            :rules="[(v) => !!v || 'Description is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="comfortable"
            hide-details="auto"
            label="Description"
          />
          <v-text-field
            v-model="newExtras.price"
            :rules="[(v) => !!v || 'Price is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="comfortable"
            hide-details="auto"
            label="Price"
            type="number"
          />
          <v-row
            v-for="(item, index) in newExtras.content"
            :key="index"
            no-gutters
          >
            <v-col cols="9">
              <v-text-field
                v-model="item.name"
                :label="`Item #${index + 1}`"
                :rules="[(v) => !!v || 'Item is required!']"
                class="mt-2 mt-md-4"
                clearable
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="item.quantity"
                :label="`Quantity`"
                :rules="[(v) => !!v || 'Quantity is required!']"
                class="mt-2 mt-md-4 ml-2"
                density="comfortable"
                hide-details="auto"
                min="0"
                type="number"
              />
            </v-col>
          </v-row>
          <v-btn
            class="mt-2"
            color="primary"
            size="small"
            @click="addMoreExtrasItems"
          >
            Add More Item
          </v-btn>

          <v-card-actions class="mt-2 mt-md-4">
            <v-spacer/>
            <v-btn color="primary" type="submit" variant="flat"> Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.border-grey {
  border-color: #00000020;
}
</style>
