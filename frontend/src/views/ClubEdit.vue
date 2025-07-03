<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {getClubImageUrl, isValidImage} from "@/others/util";
import {useDisplay} from "vuetify";

const {mobile} = useDisplay();
const route = useRoute();
const router = useRouter();
const store = useStore();

const currentUser = computed(() => store.state.user.currentUser);
const targetClubId = computed(() =>
  store.getters["user/isSudo"]
    ? route.params.clubId
    : store.getters["user/isAdmin"]
      ? currentUser.value.clubId
      : null,
);
const prefetchedClub = computed(() =>
  store.getters["club/getClubById"](targetClubId.value),
);
const club = computed(() =>
  prefetchedClub.value?.id ? prefetchedClub.value : store.state.club.club,
);

const newClubInit = {
  id: null,
  name: null,
  location: null,
  logo: null,
  rmImage: null,
};
const newClub = reactive({...newClubInit});

const form = ref(null);
const isFormValid = ref(true);

const handleLogoUpdate = (file) => {
  newClub.logo = file;
  if (club.value.logo) newClub.rmImage = club.value.logo;
};
const handleLogoClear = () => {
  newClub.logo = null;
  newClub.rmImage = club.value.logo;
};
const handleNewLogoClear = () => {
  newClub.logo = club.value.logo ? club.value.logo : null;
};

const redirectDestination = computed(() =>
  store.getters['user/isSudo']
    ? "dashboard-sudo"
    : store.getters['user/isAdmin']
      ? "dashboard-admin"
      : null,
);

const handleEditClub = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const formData = new FormData();
  formData.append("id", newClub.id);
  formData.append("name", newClub.name);
  formData.append("location", newClub.location ?? '');

  if (newClub.logo) formData.append("files", newClub.logo);
  if (newClub.rmImage) formData.append("rmImage", newClub.rmImage);

  await store.dispatch("club/save", formData).then((result) => {
    // newClub = {...newClub, ...newClubInit}
    Object.assign(newClub, {
      ...newClubInit,
    });
    router.push({
      name: redirectDestination.value,
    });
  });
};
const fetchData = async () => {
  if (!club.value?.id) {
    await store.dispatch("club/setClub", targetClubId.value);
  }
};
onMounted(async () => {
  await fetchData();
  Object.assign(newClub, {
    ...club.value,
  });
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title
          :sub-title="club.name"
          justify="space-between"
          title="Edit Club"
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
          @submit.prevent="handleEditClub"
        >
          <v-text-field
            v-model="newClub.name"
            :rules="[(v) => !!v || 'Name is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Name"
            prepend-inner-icon="mdi-account"
            required
          ></v-text-field>

          <v-text-field
            v-model="newClub.location"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Location"
            prepend-inner-icon="mdi-map-marker"
            required
          ></v-text-field>

          <v-row align="center" justify="start" no-gutters>
            <v-col class="mt-5" cols="12" sm="3">
              <v-img
                :src="getClubImageUrl(newClub.logo)"
                aspect-ratio="1"
                class="position-relative mx-1 border"
                cover
                rounded
              >
                <v-btn
                  v-if="newClub.logo"
                  class="position-absolute rounded-0"
                  color="error"
                  density="comfortable"
                  icon="mdi-delete"
                  location="top end"
                  size="small"
                  @click="handleLogoClear"
                >
                </v-btn>
              </v-img>

              <v-file-input
                accept="image/*"
                class="mx-1"
                density="compact"
                hide-details="auto"
                label="Update Logo"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                show-size
                variant="solo-filled"
                @update:modelValue="handleLogoUpdate"
                @click:clear="handleNewLogoClear"
              >
                <template v-slot:selection="{ fileNames }">
                  <template v-for="fileName in fileNames" :key="fileName">
                    <v-chip class="me-2" color="primary" label size="small">
                      {{ fileName }}
                    </v-chip>
                  </template>
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
