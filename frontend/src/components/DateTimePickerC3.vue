<script setup>
import {computed, reactive, ref, watch} from "vue";

// the input data in JSON format
const {data, step, type} = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  step: {
    type: Number,
    default: () => ({}),
  },
  type: {
    type: String,
    default: () => ({}),
  },
});

const inputValueInit = {
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
};
const inputValue = reactive({...inputValueInit});

watch(
  () => data,
  (newVal) => {
    inputValue.startDate = newVal.startDate;
    inputValue.startTime = newVal.startTime;
    inputValue.endDate = newVal.endDate;
    inputValue.endTime = newVal.endTime;
  },
);

const start = ref(null);
const end = ref(null);

// the format of the time, either 24-hour or 12-hour
const format = ref("24");

// the flag to show or hide the picker
const showStartPicker = ref(false);
const showEndPicker = ref(false);

const startDate = ref(null);
const startTime = ref(null);
const endDate = ref(null);
const endTime = ref(null);

const setBothPicker = async (value) => {
  showStartPicker.value = showEndPicker.value = value;
};

// the error message to be displayed if the input is not compatible
const error = reactive({start: "", end: ""});

// the validation routine to verify the input data
const validate = (value, datetimeType) => {
  // check if the value is empty
  if (!value) {
    return "Please enter a value";
  }
  // check if the value matches the expected format
  const regex =
    type === "date-time"
      ? /^\d{4}-\d{2}-\d{2} \d?\d:\d{2}( (AM|PM))?$/
      : type === "date"
        ? /^\d{4}-\d{2}-\d{2}$/
        : type === "time"
          ? /^\d?\d:\d{2}( (AM|PM))?$/
          : null;
  if (!regex.test(value)) {
    const msg = "Please enter a valid date and time";
    if (datetimeType === "start") error.start = msg;
    else if (datetimeType === "end") error.end = msg;
  }
  return "";
};

// the function to clear the value and the text box
const clearValue = (datetimeType) => {
  Object.assign(inputValue, {...inputValueInit});
  if (datetimeType === "start") start.value = null;
  else if (datetimeType === "end") end.value = null;
  error.value = "";
};

// the function to submit the value and hide the picker
const submitValue = (datetimeType) => {
  if (datetimeType === "start") {
    if (type === "date-time") {
      start.value =
        inputValue.startDate +
        " " +
        (format.value === "12"
          ? convertTo12Hour(inputValue.startTime)
          : inputValue.startTime);
    } else if (type === "date") {
      start.value = inputValue.startDate;
    } else if (type === "time") {
      start.value =
        format.value === "12"
          ? convertTo12Hour(inputValue.startTime)
          : inputValue.startTime;
    }
    validate(start.value, datetimeType);
    // showStartPicker.value = false;
  } else if (datetimeType === "end") {
    if (type === "date-time") {
      end.value =
        inputValue.endDate +
        " " +
        (format.value === "12"
          ? convertTo12Hour(inputValue.endTime)
          : inputValue.endTime);
    } else if (type === "date") {
      end.value = inputValue.endDate;
    } else if (type === "time") {
      end.value =
        format.value === "12"
          ? convertTo12Hour(inputValue.endTime)
          : inputValue.endTime;
    }
    validate(start.value, datetimeType);
    setBothPicker(false);
  }
};

// the function to convert a 24-hour time to a 12-hour time
const convertTo12Hour = (time) => {
  const hour = Number(time.split(":")[0]);
  const minute = Number(time.split(":")[1]);
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 || 12;
  return hour12 + ":" + minute + " " + period;
};

// watch the value changes and validate them
watch(start.value, (newValue) => {
  validate(newValue, "start");
});
watch(end.value, (newValue) => {
  validate(newValue, "end");
});
const startLabel = computed(() =>
  type === "date-time"
    ? "Start Date-Time"
    : type === "date"
      ? "Start Date"
      : type === "time"
        ? "Start Time"
        : null,
);
const endLabel = computed(() =>
  type === "date-time"
    ? "End Date-Time"
    : type === "date"
      ? "End Date"
      : type === "time"
        ? "End Time"
        : null,
);
</script>
<template>
  <!--  start date-time-->
  <div class="date-time-component" @click="setBothPicker(true)">
    <div class="text-box">
      <label for="start">{{ startLabel }}</label> <br/>
      <input id="start" v-model="start" readonly type="text"/>
      <button v-if="start" @click="clearValue('start')">x</button>
    </div>
    <div v-if="showStartPicker" class="picker">
      <div class="calendar">
        <input
          v-if="type === 'date' || type === 'date-time'"
          ref="startDate"
          v-model="inputValue.startDate"
          :max="data?.endDate || ''"
          :min="data?.startDate || ''"
          type="datetime-local"
        />
      </div>
      <div class="clock">
        <!--        <input-->
        <!--          ref="startTime"-->
        <!--          v-if="type === 'time' || type === 'date-time'"-->
        <!--          type="time"-->
        <!--          v-model="inputValue.startTime"-->
        <!--          :step="step * 60 || 1"-->
        <!--        />-->
        <div v-if="type === 'date-time' || type === 'time'" class="format">
          <label
          ><input v-model="format" type="radio" value="24"/>24-hour</label
          >
          <label
          ><input v-model="format" type="radio" value="12"/>12-hour</label
          >
        </div>
      </div>
      <div class="buttons">
        <button @click="showStartPicker = false">Cancel</button>
        <button @click="submitValue('start')">OK</button>
      </div>
    </div>
    <div v-if="error.start" class="error">{{ error.start }}</div>
  </div>

  <!--  end date-time-->
  <div class="date-time-component">
    <div class="text-box">
      <label for="end">{{ endLabel }}</label> br
      <input
        id="end"
        v-model="end"
        readonly
        type="text"
        @click="showEndPicker = true"
      />
      <button v-if="end" @click="clearValue('end')">x</button>
    </div>
    <div v-if="showEndPicker" class="picker">
      <div class="calendar">
        <input
          v-if="type === 'date' || type === 'date-time'"
          ref="endDate"
          v-model="inputValue.endDate"
          :max="data?.endDate || ''"
          :min="data?.endDate || ''"
          type="date"
        />
      </div>
      <div class="clock">
        <input
          v-if="type === 'time' || type === 'date-time'"
          ref="endTime"
          v-model="inputValue.endTime"
          :step="step * 60 || 1"
          type="time"
        />
        <div v-if="type === 'date-time' || type === 'time'" class="format">
          <label
          ><input v-model="format" type="radio" value="24"/>24-hour</label
          >
          <label
          ><input v-model="format" type="radio" value="12"/>12-hour</label
          >
        </div>
      </div>
      <div class="buttons">
        <button @click="showEndPicker = false">Cancel</button>
        <button @click="submitValue('end')">OK</button>
      </div>
    </div>
    <div v-if="error.end" class="error">{{ error.end }}</div>
  </div>
</template>
<style>
.date-time-component {
  /* customize the component style here */
  --color-primary: #42b983;
  --color-secondary: #35495e;
  --color-background: #fff;
  --color-border: #eee;
  --color-error: #f00;
}

.text-box {
  //display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 4px;
}

/*

.text-box input {
  flex: 1;
  border: none;
  outline: none;
}

.text-box button {
  background: none;
  border: none;
  cursor: pointer;
}
*/
.picker {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 8px;
}

.calendar {
  margin-bottom: 8px;
}

.clock {
  //display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.format {
  //display: flex;
}

.buttons {
  display: flex;
  //justify-content: flex-end;
}

.buttons button {
  margin-left: 8px;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
}

.error {
  color: var(--color-error);
  font-weight: bold;
}
</style>
