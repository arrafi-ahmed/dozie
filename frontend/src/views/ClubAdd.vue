<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {isValidImage} from "@/others/util";
import {useDisplay} from "vuetify";

const {mobile} = useDisplay();
const router = useRouter();
const store = useStore();

const newClubInit = {
  name: null,
  description: null,
  logo: null,
};
const newClub = reactive({...newClubInit});

const form = ref(null);
const isFormValid = ref(true);

const handleClubLogo = (file) => {
  newClub.logo = file;
};

const handleAddClub = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const formData = new FormData();
  formData.append("name", newClub.name);
  formData.append("description", newClub.description);

  if (newClub.logo) formData.append("files", newClub.logo);

  await store.dispatch("club/save", formData).then((result) => {
    // newClub = {...newClub, ...newClubInit}
    Object.assign(newClub, {
      ...newClubInit,
    });
    router.push({
      name: "dashboard-sudo",
    });
  });
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title justify="space-between" title="Add Club">
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
          @submit.prevent="handleAddClub"
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
            v-model="newClub.description"
            :rules="[(v) => !!v || 'Location is required!']"
            class="mt-2 mt-md-4"
            clearable
            density="compact"
            hide-details="auto"
            label="Location"
            prepend-inner-icon="mdi-map-marker"
            required
          ></v-text-field>

          <v-file-input
            :rules="[
              (v) =>
                (Array.isArray(v) ? v : [v]).every((file) =>
                  isValidImage(file),
                ) || 'Only jpg/jpeg/png allowed!',
            ]"
            accept="image/*"
            class="mt-2 mt-md-4"
            density="compact"
            hide-details="auto"
            label="Logo"
            prepend-icon=""
            prepend-inner-icon="mdi-camera"
            show-size
            @update:modelValue="handleClubLogo"
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
              :density="mobile ? 'comfortable' : 'default'"
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
