<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click="close">
        <div class="modal-content" :style="{ backgroundColor: backgroundColor }" @click.stop>
          <button class="close-btn" @click="close">&times;</button>

          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#fff',
  },
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 12px;
  padding: 3rem 2.5rem; /* Larger top padding so X doesn't overlap */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  color: #111;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 2.5rem;
  color: #333;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  z-index: 10;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tablet and Desktop - Larger modal */
@media (min-width: 768px) {
  .modal-content {
    max-width: 800px;
    padding: 3.5rem 3rem;
  }
}

@media (min-width: 1100px) {
  .modal-content {
    max-width: 1000px;
    max-height: 85vh;
    padding: 4rem 3.5rem;
  }
}
</style>
