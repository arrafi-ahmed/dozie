/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VFileUpload } from 'vuetify/labs/VFileUpload'
// Composables
import {createVuetify} from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VFileUpload,
  },
  theme: {
    themes: {
      light: {
        colors: {
          // primary: "#b8936f",
          // secondary: "#d8c3a5",
          // tertiary: "#fdfbe5",
          primary: "#6464d3",
          secondary: "#4000b8",
          tertiary: "#c7d7ff",
        },
      },
    },
  },
});
