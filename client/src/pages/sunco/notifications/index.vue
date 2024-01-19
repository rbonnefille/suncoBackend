<template>
  <div class="mb-4 container">
    <h2 class="mt-3">Send a proactive SMS</h2>
    <VLabel id="phoneNumber" name="Phone Number" className="form-label" />
    <VInput
      id="phoneNumber"
      type="input"
      v-model="phoneNumber"
      placeholder="Enter a phone number"
    />
    <VLabel id="message" name="Message" className="mt-2 form-label" />
    <VInput
      id="message"
      type="input"
      v-model="message"
      placeholder="Enter a message"
    />
    <div class="mt-2">
      <button
        class="btn btn-rounded-4"
        @click="sendNotification"
        :disabled="!phoneNumber || !message"
        :class="{ disabled: !phoneNumber || !message }"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 200px;
        "
      >
        <template v-if="isLoading">
          <PulseLoader
            :loading="isLoading"
            :color="'#ffffff'"
            :size="`10px`"
          ></PulseLoader>
        </template>
        <template v-else> Send Notification </template>
      </button>
    </div>

    <div class="mt-2">
      <div v-if="errorMessage">
        <VError class="mt-2" :errorMessage="errorMessage" />
      </div>
      <div v-else-if="successMessage">
        <p>
          {{ successMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import VError from "@/components/VError.vue";
import VInput from "@/components/VInput.vue";
import VLabel from "@/components/VLabel.vue";

const isLoading = ref(false);
const phoneNumber = ref("");
const message = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const sendNotification = async () => {
  try {
    isLoading.value = true;
    const notificationResponse = await fetch(`/notifications/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destinationId: phoneNumber.value.match(/^\+.*$/)
          ? phoneNumber.value
          : `+${phoneNumber.value}`,
        message: message.value,
      }),
    });
    const notificationData = await notificationResponse.json();
    if (notificationData.error) {
      throw new Error(notificationData.error);
    }
    successMessage.value = `Notification sent successfully!: ${notificationData?.notification?._id}`;
  } catch (error) {
    errorMessage.value = error;
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<route lang="json">
{
  "name": "SunCo Notifications",
  "meta": {
    "title": "SunCo Notifications"
  }
}
</route>

<style lang="scss" scoped>
button {
  background: #d6eef1;
  border: none;
  color: #03363d;
  text-align: center;
  text-decoration: none;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.disabled {
  background: #d6eef1;
  border: none;
  color: #03363d;
  text-align: center;
  text-decoration: none;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}

button:focus,
button:hover {
  background-color: #03363d;
  color: white;
}

// button:focus {
//     background-color: #03363d;
//     color: white;
// }
</style>
