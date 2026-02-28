<template>
  <div
    class="carousel-container"
    role="region"
    aria-label="Projects carousel"
    aria-roledescription="carousel"
  >
    <button
      class="nav-arrow left"
      :style="{
        backgroundColor: blockColor,
        borderColor: blockColor,
      }"
      aria-label="Previous project"
      @click="scroll('left')"
    >
      <span aria-hidden="true">&#10094;</span>
    </button>

    <div
      class="carousel-scroll-area"
      ref="scrollContainer"
      @scroll="onScroll"
      @mousedown="startDrag"
      @mouseleave="stopDrag"
      @mouseup="stopDrag"
      @mousemove="doDrag"
    >
      <div class="spacer"></div>

      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="carousel-item"
        :ref="
          (el) => {
            if (el) itemsRefs[index] = el
          }
        "
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} of ${totalItems}: ${project.name}`"
        @click="handleItemClick(index)"
      >
        <div :class="{ 'pointer-events-none': isDragging }">
          <ProjectCard
            :project="project"
            :index="index"
            :isActive="index === activeIndex"
            :blockColor="blockColor"
            :showText="showText"
            @open="$emit('open-details', project)"
          />
        </div>
      </div>

      <!-- GitHub card -->
      <div
        v-if="githubUrl"
        class="carousel-item"
        :ref="
          (el) => {
            if (el) itemsRefs[projects.length] = el
          }
        "
        role="group"
        aria-roledescription="slide"
        :aria-label="githubLinkLabel"
        @click="handleGithubClick"
      >
        <div :class="{ 'pointer-events-none': isDragging }">
          <div
            class="github-card"
            :class="{
              'github-card--active': activeIndex === projects.length,
              'github-card--inactive': activeIndex !== projects.length,
            }"
            :style="{ backgroundColor: blockColor }"
          >
            <v-icon class="github-card__icon" size="80" aria-hidden="true">mdi-github</v-icon>
            <p class="github-card__label">{{ githubLabel }}</p>
          </div>
        </div>
      </div>

      <div class="spacer"></div>
    </div>

    <button
      class="nav-arrow right"
      :style="{
        backgroundColor: blockColor,
        borderColor: blockColor,
      }"
      aria-label="Next project"
      @click="scroll('right')"
    >
      <span aria-hidden="true">&#10095;</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import ProjectCard from './ProjectCard.vue'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  blockColor: { type: String, default: '#fff' },
  showText: { type: String, default: 'Show' },
  githubLabel: { type: String, default: '' },
  githubLinkLabel: { type: String, default: 'Visit GitHub' },
  githubUrl: { type: String, default: '' },
})

const totalItems = computed(() => props.projects.length + (props.githubUrl ? 1 : 0))

defineEmits(['open-details'])

const scrollContainer = ref(null)
const itemsRefs = ref([])
const activeIndex = ref(0)

const isMouseDown = ref(false)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// Update active index based on scroll position
function onScroll() {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  const centerLine = container.scrollLeft + container.clientWidth / 2

  let closestIndex = 0
  let minDistance = Infinity

  itemsRefs.value.forEach((el, index) => {
    if (!el) return
    const itemCenter = el.offsetLeft + el.clientWidth / 2
    const distance = Math.abs(centerLine - itemCenter)

    if (distance < minDistance) {
      minDistance = distance
      closestIndex = index
    }
  })

  if (activeIndex.value !== closestIndex) {
    activeIndex.value = closestIndex
  }
}

// Scroll to specific project index
function scrollToIndex(index) {
  if (!itemsRefs.value[index] || !scrollContainer.value) return

  const target = itemsRefs.value[index]
  const container = scrollContainer.value
  const scrollPos = target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2

  container.scrollTo({
    left: scrollPos,
    behavior: 'smooth',
  })
}

// Navigate left or right
function scroll(direction) {
  let newIndex = activeIndex.value + (direction === 'right' ? 1 : -1)
  if (newIndex < 0) newIndex = 0
  if (newIndex >= totalItems.value) newIndex = totalItems.value - 1
  scrollToIndex(newIndex)
}

// Handle item click
function handleItemClick(index) {
  if (!isDragging.value) {
    scrollToIndex(index)
  }
}

// Handle GitHub card click — first click centres it, second opens the link
function handleGithubClick() {
  if (isDragging.value) return
  if (activeIndex.value === props.projects.length) {
    window.open(props.githubUrl, '_blank', 'noopener,noreferrer')
  } else {
    scrollToIndex(props.projects.length)
  }
}

// Mouse drag handlers
function startDrag(e) {
  if (!scrollContainer.value) return
  isMouseDown.value = true
  isDragging.value = false

  startX.value = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft.value = scrollContainer.value.scrollLeft

  scrollContainer.value.style.scrollSnapType = 'none'
  scrollContainer.value.style.scrollBehavior = 'auto'
  scrollContainer.value.style.cursor = 'grabbing'
}

function stopDrag() {
  if (!isMouseDown.value) return
  isMouseDown.value = false

  if (!scrollContainer.value) return

  scrollContainer.value.style.scrollSnapType = 'x mandatory'
  scrollContainer.value.style.scrollBehavior = 'smooth'
  scrollContainer.value.style.cursor = 'grab'

  setTimeout(() => {
    isDragging.value = false
  }, 50)
}

function doDrag(e) {
  if (!isMouseDown.value || !scrollContainer.value) return

  e.preventDefault()

  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX.value) * 1.5

  if (Math.abs(walk) > 5) {
    isDragging.value = true
    scrollContainer.value.scrollLeft = scrollLeft.value - walk
  }
}

onMounted(async () => {
  await nextTick()
  onScroll()
  scrollToIndex(0)
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
}

.carousel-scroll-area {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  scrollbar-width: none;
  -ms-overflow-style: none;

  cursor: grab;
  user-select: none;
}

.carousel-scroll-area::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex-shrink: 0;
  scroll-snap-align: center;
  padding: 0 20px;
  width: 400px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.pointer-events-none {
  pointer-events: none;
}

.spacer {
  flex-shrink: 0;
  width: calc(50vw - 220px);
}

/* Arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  backdrop-filter: blur(5px);
  border: 2px solid;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: all 0.2s;
}

.nav-arrow:hover {
  filter: brightness(1.1);
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow.left {
  left: 2rem;
}
.nav-arrow.right {
  right: 2rem;
}

@media (max-width: 768px) {
  .nav-arrow {
    display: none;
  }

  .carousel-item {
    width: 280px;
    height: 420px;
    padding: 0 10px;
  }

  .spacer {
    width: calc(50vw - 150px);
  }
}

/* GitHub card */
.github-card {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition:
    transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
    opacity 0.5s ease,
    box-shadow 0.5s ease,
    filter 0.5s ease;
  padding: 1rem;
}

.github-card--active {
  transform: scale(1);
  opacity: 0.9;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.github-card--inactive {
  transform: scale(0.85);
  opacity: 0.5;
  filter: grayscale(40%);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.github-card__label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
  text-align: center;
  padding: 0 2rem;
  line-height: 1.5;
}
</style>
