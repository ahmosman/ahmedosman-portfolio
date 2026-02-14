<template>
  <div class="carousel-container">
    <button 
      class="nav-arrow left" 
      @click="scroll('left')"
    >
      &#10094;
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
        ref="itemsRefs"
        @click="handleItemClick(index)"
      >
        <div :class="{ 'pointer-events-none': isDragging }">
          <ProjectCard 
            :project="project"
            :index="index"
            :isActive="index === activeIndex"
            :blockColor="blockColor"
            @open="$emit('open-details', project)"
          />
        </div>
      </div>

      <div class="spacer"></div>
    </div>

    <button 
      class="nav-arrow right" 
      @click="scroll('right')"
    >
      &#10095;
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ProjectCard from './ProjectCard.vue'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  blockColor: { type: String, default: '#fff' }
})

defineEmits(['open-details'])

const scrollContainer = ref(null)
const itemsRefs = ref([]) 
const activeIndex = ref(0)

const isMouseDown = ref(false)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)


function onScroll() {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  const centerLine = container.scrollLeft + (container.clientWidth / 2)

  let closestIndex = 0
  let minDistance = Infinity

  itemsRefs.value.forEach((el, index) => {
    if (!el) return
    const itemCenter = el.offsetLeft + (el.clientWidth / 2)
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

function scrollToIndex(index) {
  if (!itemsRefs.value[index] || !scrollContainer.value) return
  
  const target = itemsRefs.value[index]
  const container = scrollContainer.value
  const scrollPos = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2)

  container.scrollTo({
    left: scrollPos,
    behavior: 'smooth'
  })
}

function scroll(direction) {
  let newIndex = activeIndex.value + (direction === 'right' ? 1 : -1)
  if (newIndex < 0) newIndex = 0
  if (newIndex >= props.projects.length) newIndex = props.projects.length - 1
  scrollToIndex(newIndex)
}

function handleItemClick(index) {
  if (!isDragging.value) {
    scrollToIndex(index)
  }
}


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
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.6);
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
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow.left { left: 2rem; }
.nav-arrow.right { right: 2rem; }

@media (max-width: 768px) {
  .nav-arrow { display: none; }
  
  .carousel-item {
    width: 280px; 
    height: 420px;
    padding: 0 10px;
  }
  
  .spacer {
    width: calc(50vw - 150px); 
  }
}
</style>