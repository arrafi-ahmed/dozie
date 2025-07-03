<script setup>
import Logo from "@/components/Logo.vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, ref} from "vue";
import {getClientPublicImgUrl, getToLink, getUserImageUrl,} from "@/others/util";

const store = useStore();
const router = useRouter();

const signedin = computed(() => store.getters["user/signedin"]);
const currentUser = computed(() => store.getters["user/getCurrentUser"]);
const calcHome = computed(() => store.getters["user/calcHome"]);

const isSudo = computed(() => store.getters["user/isSudo"]);
const isAdmin = computed(() => store.getters["user/isAdmin"]);

const menuItemsSudo = [
  {
    title: "Dashboard",
    to: {name: "dashboard-sudo"},
    icon: "mdi-view-dashboard",
  },
  {
    title: "Add Club",
    to: {name: "club-add"},
    icon: "mdi-plus",
  },
];
const menuItemsAdmin = [
  {
    title: "Dashboard",
    to: {name: "dashboard-admin"},
    icon: "mdi-view-dashboard",
  },
  {
    title: "Add Event",
    to: {name: "event-add"},
    icon: "mdi-plus",
  },
  {
    title: "Edit Club",
    to: {name: "club-edit"},
    icon: "mdi-pencil",
  },
];

const menuItems = computed(() => {
  let items = [];
  if (isSudo.value) {
    items = items.concat(menuItemsSudo);
  } else if (isAdmin.value) {
    items = items.concat(menuItemsAdmin).concat({
      title: "View Club",
      to: {name: "club-single", params: {clubId: currentUser.value.clubId}},
      icon: "mdi-eye",
    });
  }
  return items;
});

const drawer = ref(false);
</script>

<template>
  <v-app-bar class="px-2 px-md-5 py-1 border-b" dense density="compact" flat>
    <!--      :img-src="getClientPublicImgUrl('logo.png')"-->
    <logo
      title="Dozie Events"
      :width="180"
      container-class="clickable"
      img-class="mx-auto"
      @click="router.push(calcHome)"
    />

    <template #append>
      <v-btn v-if="signedin" rounded="pill" @click="drawer = !drawer">
        <template #prepend>
          <v-avatar :size="30" rounded="circle" title>
            <v-img
              :aspect-ratio="1"
              :src="getUserImageUrl(currentUser.image)"
              alt="User Avatar"
              cover
            />
          </v-avatar>
        </template>
        <template #default>
          <span class="text-body-2 text-capitalize">{{
              currentUser.name
            }}</span>
        </template>
        <template #append>
          <v-icon
            :icon="drawer ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          ></v-icon>
        </template>
      </v-btn>
    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-if="signedin"
    v-model="drawer"
    :width="210"
    location="end"
    temporary
  >
    <v-list class="mt-4" color="primary" density="compact" nav>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        :to="getToLink(item)"
        rounded="lg"
      >
        <template #prepend>
          <!--          <v-img :src="item.icon" :width="20" cover />-->
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <template #title>
          <span class="font-size-1 font-weight-medium">{{ item.title }}</span>
        </template>
      </v-list-item>
    </v-list>
    <template #append>
      <div class="ma-5">
        <v-btn
          :to="{ name: 'signout' }"
          block
          color="primary"
          prepend-icon="mdi-exit-to-app"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.font-size-1 {
  font-size: 1rem;
  line-height: 1.2rem;
}
</style>
