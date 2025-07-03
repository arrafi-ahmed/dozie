<script setup>
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, onMounted, reactive, ref, toRaw} from "vue";
import PageTitle from "@/components/PageTitle.vue";
import {useDisplay} from "vuetify";
import {input_fields} from "@/others/util";
import FormItemsEditable from "@/components/FormItemsEditable.vue";

const {xs} = useDisplay();
const route = useRoute();
const router = useRouter();
const store = useStore();

const newFormQuestions = ref([]);

const formItemTypes = reactive([...input_fields]);
const findFormItemTypeIndex = (id) =>
  formItemTypes.findIndex((item) => item.id == id);

const dialog = ref(false);
const selectedFormItemType = reactive({id: null, title: null});

const questionInit = {
  id: null,
  typeId: null,
  text: null,
  required: true,
  options: [],
};
const question = reactive({...questionInit});
const isQuestionOptionsRequired = computed(() => {
  return selectedFormItemType.id != 0 && selectedFormItemType.id != 1;
});
const openDialog = (itemTypeId) => {
  Object.assign(question, {...questionInit, options: []});
  dialog.value = !dialog.value;
  const foundIndex = findFormItemTypeIndex(itemTypeId);
  Object.assign(selectedFormItemType, formItemTypes[foundIndex]);
};

const formItemAdd = ref(null);
const isFormItemAddValid = ref(true);

const addFormItem = async (selectedFormItemType) => {
  await formItemAdd.value.validate();
  if (isQuestionOptionsRequired.value && question.options.length === 0) {
    isFormItemAddValid.value = false;
  }
  if (!isFormItemAddValid.value) return;

  question.typeId = selectedFormItemType.id;
  if (selectedFormItemType.id == 0 || selectedFormItemType.id == 1) {
    delete question.options;
  }

  newFormQuestions.value.push({...question});
  // newFormWQuestion.questions = newFormWQuestion.questions.concat(formItems);
  dialog.value = !dialog.value;
};

const publishForm = ref(null);
const isPublishFormValid = ref(true);

const submitForm = ref(false);

const handleSubmitPublishForm = async () => {
  await publishForm.value.validate();
  if (!isPublishFormValid.value) return;

  submitForm.value = true;
  store
    .dispatch("form/save", {
      formQuestions: toRaw(newFormQuestions.value),
      rmQIds,
      eventId: route.params.eventId,
    })
    .then((result) => {
      router.push({
        name: "dashboard-admin",
      });
    })
    .finally(() => (submitForm.value = false));
};

const additionalAnswers = ref([]);
const handleUpdateAdditionalAnswers = ({newVal}) => {
  additionalAnswers.value = newVal;
};

const rmQIds = [];
const handleRemoveQuestion = (qId, index) => {
  if (qId) {
    const filteredQuestions = newFormQuestions.value.filter(
      (item) => item.id != qId,
    );
    rmQIds.push(qId);
    newFormQuestions.value = [...filteredQuestions];
  } else {
    newFormQuestions.value.splice(index, 1);
  }
};

onMounted(() => {
  store
    .dispatch("form/setFormQuestions", {
      eventId: route.params.eventId,
    })
    .then((result) => {
      Object.assign(newFormQuestions.value, {...result});
      if (newFormQuestions.value[0] === null) newFormQuestions.value = [];
    });
});

const event = computed(() =>
  store.getters["event/getEventById"](route.params.eventId),
);
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <page-title
          :sub-title="event?.name"
          justify="space-between"
          title="Form Builder"
        >
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="$router.back()"
          ></v-btn>
        </page-title>
      </v-col>
    </v-row>

    <div class="d-flex justify-end">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-plus" rounded v-bind="props" variant="tonal"></v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            v-for="item in formItemTypes"
            :key="item.id"
            :title="item.title"
            density="compact"
            link
            @click="openDialog(item.id)"
          ></v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-row>
      <v-col>
        <v-form
          ref="publishForm"
          v-model="isPublishFormValid"
          fast-fail
          @submit.prevent="handleSubmitPublishForm"
        >
          <div
            v-if="
              newFormQuestions &&
              newFormQuestions.length > 0 &&
              newFormQuestions[0]
            "
          >
            <form-items-editable
              :key="`${newFormQuestions.length}`"
              :items="newFormQuestions"
              @remove="handleRemoveQuestion"
              @update="handleUpdateAdditionalAnswers"
            />
          </div>
          <div>
            <v-row class="mt-2 mt-md-4" justify="end">
              <v-col cols="auto">
                <v-btn
                  :density="xs ? 'comfortable' : 'default'"
                  color="primary"
                  type="submit"
                >Save
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" width="500">
    <v-card density="compact">
      <v-card-title>
        <div class="d-flex align-center justify-lg-space-between">
          <span class="flex-grow-1">Add {{ selectedFormItemType?.title }}</span>
          <v-checkbox
            v-model="question.required"
            class="flex-grow-0"
            density="compact"
            hide-details
            label="Required?"
          ></v-checkbox>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="formItemAdd"
          v-model="isFormItemAddValid"
          fast-fail
          @submit.prevent="addFormItem(selectedFormItemType)"
        >
          <v-text-field
            v-model="question.text"
            :rules="[(v) => !!v || 'Question Text is required!']"
            clearable
            density="compact"
            hide-details="auto"
            label="Question Text"
          ></v-text-field>

          <template v-if="isQuestionOptionsRequired">
            <v-row align="center" class="mt-2 mt-md-4">
              <v-col cols="auto"><h4>Answer Options:</h4></v-col>
              <v-col>
                <v-btn
                  density="comfortable"
                  icon="mdi-plus"
                  question
                  @click="question.options.push(null)"
                ></v-btn>
              </v-col>
            </v-row>
            <div class="mt-2 mt-md-4">
              <div
                v-for="(item, index) in question.options"
                :key="index"
                class="mt-1"
              >
                <v-text-field
                  v-model="question.options[index]"
                  :label="`Option ${index + 1}`"
                  :rules="[(v) => !!v || `Option ${index + 1} is required!`]"
                  clearable
                  density="compact"
                  hide-details="auto"
                ></v-text-field>
              </div>
            </div>
          </template>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :density="xs ? 'comfortable' : 'default'"
              color="primary"
              type="submit"
            >Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
