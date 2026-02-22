<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click="close">
        <div class="modal-content" :style="{ backgroundColor: backgroundColor }" @click.stop>
          <div class="modal-header">
            <div class="header-links">
              <a v-if="projectLink" :href="projectLink" target="_blank" rel="noopener noreferrer" class="icon-link"
                title="View Project">
                <svg-icon type="mdi" :path="mdiOpenInNew" />
              </a>
              <a v-if="githubLink" :href="githubLink" target="_blank" rel="noopener noreferrer" class="icon-link"
                title="View on GitHub">
                <svg-icon type="mdi" :path="mdiGithub" />
              </a>
            </div>
            <button class="close-btn" @click="close">
              <svg-icon type="mdi" :path="mdiClose" />
            </button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="mobile-footer-links" v-if="projectLink || githubLink">
            <a v-if="projectLink" :href="projectLink" target="_blank" rel="noopener noreferrer" class="footer-link"
              title="View Project">
              <svg-icon type="mdi" :path="mdiOpenInNew" />
            </a>
            <a v-if="githubLink" :href="githubLink" target="_blank" rel="noopener noreferrer" class="footer-link"
              title="View on GitHub">
              <svg-icon type="mdi" :path="mdiGithub" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiOpenInNew, mdiGithub, mdiClose } from '@mdi/js'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#fff',
  },
  projectLink: {
    type: String,
    default: '',
  },
  githubLink: {
    type: String,
    default: '',
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
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  color: #111;
}

.modal-header {
  position: absolute;
  top: 1.75rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 10;
}

.header-links {
  display: flex;
  margin: 1rem;
  gap: 1rem;
}

.icon-link {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s, color 0.2s;
  display: flex;
  align-items: center;
}

.icon-link svg {
  width: 2.2rem;
  height: 2.2rem;
}

.icon-link:hover {
  transform: scale(1.15);
  color: #606187;
}

.close-btn {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.close-btn svg {
  width: 2.2rem;
  height: 2.2rem;
}

.close-btn:hover {
  transform: scale(1.1);
}

.modal-body {
  width: 100%;
  padding-top: 2rem;
}

.mobile-footer-links {
  display: none;
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

/* Mobile - Show footer links, hide header links */
@media (max-width: 1099px) {
  .header-links {
    display: none;
  }

  .mobile-footer-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .footer-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: transparent;
    border: 1px solid #555;
    color: #555;
    text-decoration: none;
    border-radius: 50%;
    font-weight: 600;
    transition: all 0.2s;
  }

  .footer-link:hover {
    background: #606187;
    color: #fff;
    transform: scale(1.1);
  }

  .footer-link svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .modal-content {
    padding: 3rem 1.5rem;
  }
}
</style>
