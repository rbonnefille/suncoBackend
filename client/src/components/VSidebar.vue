<template>
  <div>
    <div
      class="offcanvas offcanvas-end"
      :class="{ show: isOpen }"
      :style="{ visibility: isOpen ? 'visible' : 'hidden' }"
      tabindex="-1"
      id="sidebar-offcanvas"
      aria-labelledby="sidebarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="sidebarLabel">
          <slot name="title">Sidebar</slot>
        </h5>
        <button
          type="button"
          class="btn-close"
          @click="closeSidebar"
          aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <slot>
          <p>Sidebar content goes here</p>
        </slot>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="offcanvas-backdrop fade show"
      @click="closeSidebar"></div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const isOpen = ref(false);

  const openSidebar = () => {
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    isOpen.value = false;
    document.body.style.overflow = '';
  };

  // Expose methods to parent components
  defineExpose({
    openSidebar,
    closeSidebar,
  });

  // Close sidebar on Escape key
  const handleEscape = event => {
    if (event.key === 'Escape' && isOpen.value) {
      closeSidebar();
    }
  };

  // Add event listener on mount
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleEscape);
  }

  // Cleanup on unmount
  import { onUnmounted } from 'vue';
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    }
  });
</script>

<style scoped>
  .offcanvas-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
