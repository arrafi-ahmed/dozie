// Composables
import {createRouter, createWebHistory} from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "register",
        name: "register",
        component: () => import("@/views/Register.vue"),
        meta: {
          requiresNoAuth: true,
          title: "Register",
        },
      },
      {
        path: "signin",
        name: "signin",
        component: () => import("@/views/Signin.vue"),
        meta: {
          requiresNoAuth: true,
          title: "Signin",
        },
      },
      {
        path: "signout",
        name: "signout",
        component: () => import("@/views/Signout.vue"),
        meta: {
          requiresAuth: true,
          title: "Signout",
        },
      },
      {
        path: "dashboard/sudo",
        name: "dashboard-sudo",
        component: () => import("@/views/DashboardSudo.vue"),
        meta: {
          requiresSudo: true,
          title: "Dashboard Sudo",
        },
      },
      {
        path: "dashboard/admin",
        name: "dashboard-admin",
        component: () => import("@/views/DashboardAdmin.vue"),
        meta: {
          requiresAdmin: true,
          title: "Dashboard Admin",
        },
      },
      {
        path: "dashboard",
        name: "dashboard",
        redirect: () => {
          const role = store.getters["user/getCurrentUser"]?.role;
          return role === "sudo"
            ? {name: "dashboard-sudo"}
            : role === "admin"
              ? {name: "dashboard-admin"}
              : {name: "not-found"};
        },
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "club/add",
        name: "club-add",
        component: () => import("@/views/ClubAdd.vue"),
        meta: {
          requiresSudo: true,
          title: "Add Club",
        },
      },
      {
        path: "club/edit/:clubId?",
        name: "club-edit",
        component: () => import("@/views/ClubEdit.vue"),
        meta: {
          requiresAuth: true,
          title: "Edit Club",
        },
      },
      {
        path: "club/:clubId/credential",
        name: "credential-generate",
        component: () => import("@/views/CredentialGenerate.vue"),
        meta: {
          requiresSudo: true,
          title: "Credentials",
        },
      },
      {
        path: "event/add",
        name: "event-add",
        component: () => import("@/views/EventAdd.vue"),
        meta: {
          requiresAdmin: true,
          title: "Add Event",
        },
      },
      {
        path: "event/:eventId/form",
        name: "form-builder",
        component: () => import("@/views/FormBuilder.vue"),
        meta: {
          requiresAdmin: true,
          title: "Form Builder",
        },
      },
      {
        path: "event/:eventId/edit",
        name: "event-edit",
        component: () => import("@/views/EventEdit.vue"),
        meta: {
          requiresAdmin: true,
          title: "Edit Event",
        },
      },
      {
        path: "event/:eventId/attendees",
        name: "event-attendees",
        component: () => import("@/views/EventAttendees.vue"),
        meta: {
          requiresAdmin: true,
          title: "Attendee List",
        },
      },
      {
        path: "event/:eventId/vouchers",
        name: "event-extras",
        component: () => import("@/views/EventExtras.vue"),
        meta: {
          requiresAdmin: true,
          title: "Vouchers",
        },
      },
      {
        path: "event/:eventId/scanner/:variant",
        name: "scanner",
        component: () => import("@/views/Scanner.vue"),
        meta: {
          requiresAdmin: true,
          title: "Scanner",
        },
      },
      {
        path: "event/:eventId/statistics",
        name: "statistics",
        component: () => import("@/views/Statistics.vue"),
        meta: {
          requiresAuth: true,
          title: "Statistics",
        },
      },
      {
        path: "event/:eventId/import",
        name: "import",
        component: () => import("@/views/Import.vue"),
        meta: {
          requiresAuth: true,
          title: "Import Attendees",
        },
      },
      {
        path: "qr/:id/:qrUuid",
        name: "qr-viewer",
        component: () => import("@/views/QrViewer.vue"),
        meta: {
          title: "QrCode Viewer",
        },
      },
      {
        path: "page/:type",
        name: "page-info",
        component: () => import("@/views/PageStatic.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/headerless/Headerless.vue"),
    children: [
      {
        path: "club/:clubId/event/:eventId/success",
        name: "event-register-success",
        component: () => import("@/views/EventRegisterSuccess.vue"),
        meta: {
          title: "Registration Successful",
        },
      },
      {
        path: "club/:clubId/event/:eventId",
        name: "event-register",
        component: () => import("@/views/EventRegister.vue"),
        meta: {
          title: "Event Registration",
        },
      },
      {
        path: "club/:clubId/event",
        name: "club-single",
        component: () => import("@/views/ClubSingle.vue"),
        meta: {
          title: "Club",
        },
      },
    ],
  },
  {
    path: "",
    name: "landing",
    // component: () => import("@/views/Landing.vue"),
    redirect: {
      name: "signin",
    },
  },
  {
    path: "/not-found/:status?/:message?",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
    props: (route) => ({
      status: route.params.status || 404,
      message: route.params.message || "Looks like you're lost!",
    }),
    meta: {},
  },
  {
    path: "/:catchAll(.*)",
    redirect: {
      name: "not-found",
      params: {status: 404, message: "Looks like you're lost!"},
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
