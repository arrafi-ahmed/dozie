<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import Phone from "@/components/Phone.vue";
import {isValidEmail} from "@/others/util";

const {items, overAllIndex, quantityIndex, type} = defineProps([
  "items",
  "overAllIndex",
  "quantityIndex",
  "type",
]);
const inputResponses = ref([]);

const emit = defineEmits(["update"]);

const handleUpdatePhone = ({formattedPhone, index}) => {
  inputResponses.value[index] = formattedPhone;
};

watch(
  () => items,
  (newVal) => {
    if (newVal) {
      inputResponses.value = newVal.map((item) =>
        item?.typeId == 3 ? [] : null,
      );
    }
  },
  {immediate: true},
);
watch(inputResponses.value, (newVal) => {
  emit("update", {newVal, overAllIndex, quantityIndex});
});
</script>

<template>
  <!--  for additional questions-->
  <div
    v-if="type === 'question' && items?.length > 0 && items[0]"
    class="rounded py-2"
  >
    <template v-for="(item, index) in items" :key="index">
      <div v-if="item.typeId == 0">
        <v-text-field
          v-model="inputResponses[index]"
          :rules="[
            (v) => !!v || !item.required || 'required',
            (v) =>
              item.fieldName?.toLowerCase() === 'email'
                ? isValidEmail(v) || 'Invalid email'
                : true,
          ]"
          class="mt-2 mt-md-4 input-color-primary"
          clearable
          color="tertiary"
          density="default"
          hide-details="auto"
          rounded="lg"
          variant="solo-filled"
        >
          <template v-slot:label>
            <div>
              <span>{{ item.text }}</span>
              <span v-if="item.required" class="text-error"> *</span>
            </div>
          </template>
        </v-text-field>
      </div>

      <div v-else-if="item.typeId == 1">
        <v-textarea
          v-model="inputResponses[index]"
          :rules="[(v) => !!v || !item.required || 'required']"
          class="mt-2 mt-md-4 input-color-primary"
          clearable
          color="tertiary"
          density="default"
          hide-details="auto"
          rounded="lg"
          variant="solo-filled"
        >
          <template v-slot:label>
            <div>
              <span>{{ item.text }}</span>
              <span v-if="item.required" class="text-error"> *</span>
            </div>
          </template>
        </v-textarea>
      </div>

      <div
        v-else-if="item.typeId == 2"
        class="mt-2 mt-md-4 v-label d-block pl-4 border rounded-lg pa-2"
      >
        <v-radio-group
          v-model="inputResponses[index]"
          :rules="[(v) => !!v || !item.required || 'required']"
          class="input-color-primary"
          clearable
          color="primary"
          density="default"
          hide-details="auto"
          rounded="lg"
          variant="solo-filled"
        >
          <template v-slot:label>
            <div class="text-wrap">
              <span>{{ item.text }}</span>
              <span v-if="item.required" class="text-error"> *</span>
            </div>
          </template>
          <template v-if="item.options?.length > 0">
            <v-radio
              v-for="(childItem, childIndex) in item.options"
              :key="index"
              :class="{ 'mt-n2': childIndex > 0 }"
              :label="childItem"
              :value="childItem"
            ></v-radio>
          </template>
        </v-radio-group>
      </div>
      <div
        v-else-if="item.typeId == 3 && item.options?.length > 0"
        class="mt-2 mt-md-4 v-label d-block px-8 border rounded-lg pa-2"
      >
        <div class="text-wrap">
          <span>{{ item.text }}</span>
          <span v-if="item.required" class="text-error"> *</span>
        </div>

        <v-checkbox
          v-for="(childItem, childIndex) in item.options"
          :key="childIndex"
          v-model="inputResponses[index]"
          :class="{ 'mt-n2': childIndex > 0 }"
          :label="childItem"
          :single-line="false"
          :value="childItem"
          color="primary"
          density="compact"
          hide-details="auto"
        ></v-checkbox>
      </div>
      <div v-else-if="item.typeId == 4 && item.options?.length > 0">
        <v-select
          v-model="inputResponses[index]"
          :items="item.options"
          :rules="[(v) => !!v || !item.required || 'required']"
          class="mt-2 mt-md-4 input-color-primary"
          clearable
          color="tertiary"
          density="default"
          hide-details="auto"
          rounded="lg"
          variant="solo-filled"
        >
          <template v-slot:label>
            <div>
              <span>{{ item.text }}</span>
              <span v-if="item.required" class="text-error"> *</span>
            </div>
          </template>
        </v-select>
      </div>

      <div v-else-if="item.typeId == 5 && item.options?.length > 0">
        <phone
          :index="index"
          :item="item"
          @update-phone="handleUpdatePhone"
        ></phone>
      </div>
    </template>
  </div>
</template>

<style>
.v-label {
  opacity: var(--v-high-emphasis-opacity);
}
</style>
