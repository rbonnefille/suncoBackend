<template>
  <div class="mb-4 container">
    <h2 class="mt-3">Send a proactive SMS</h2>
    <VLabel id="phoneNumber" name="Phone Number" className="form-label" />
    <VInput
      id="phoneNumber"
      type="input"
      v-model="phoneNumber"
      placeholder="Enter a phone number" />
    <VLabel id="message" name="Message" className="mt-2 form-label" />
    <VInput
      id="message"
      type="input"
      v-model="message"
      placeholder="Enter a message" />
    <div class="mt-2 d-flex align-items-center">
      <VButton
        text="Send Notification"
        type="submit"
        class="btn btn-rounded-4 widgetBtn"
        @click="sendNotification"
        :disabled="isFormInvalid"
        :class="{ disabled: !phoneNumber || !message }" />
      <PulseLoader
        :loading="isLoading"
        color="#D1F470"
        size="10px"></PulseLoader>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import VInput from '@/components/VInput.vue';
  import VLabel from '@/components/VLabel.vue';
  import VButton from '@/components/VButton.vue';
  import { useToast } from 'vue-toastification';

  const toast = useToast();

  const isLoading = ref(false);
  const phoneNumber = ref('');
  const message = ref('');
  const errorMessage = ref('');

  const isFormInvalid = computed(() => !phoneNumber.value || !message.value);

  const sendNotification = async () => {
    try {
      isLoading.value = true;
      const notificationResponse = await fetch(`/notifications/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationId: phoneNumber.value.match(/^\+.*$/)
            ? phoneNumber.value
            : `+${phoneNumber.value}`,
          message: message.value,
        }),
      });
      const notificationData = await notificationResponse.json();
      if (!notificationData.notification ?? notificationData.error) {
        toast.warning(notificationData || notificationData.error, {
          position: 'bottom-center',
          timeout: 10000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          hideProgressBar: true,
          closeButton: 'button',
          icon: true,
          rtl: false,
        });
        throw new Error(notificationData.error);
      }
      toast.success(
        `Notification sent successfully!: ${notificationData?.notification?._id}`,
        {
          position: 'bottom-center',
          timeout: 10000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          hideProgressBar: true,
          closeButton: 'button',
          icon: true,
          rtl: false,
        },
      );
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
