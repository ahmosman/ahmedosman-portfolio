<template>
  <div class="city-bg">
    <div class="scene">
      <div class="sun-container" :style="{ transform: `rotate(${sunRotation}deg)` }">
        <svg viewBox="-105 -105 210 210" class="sun-svg">
          <g v-for="(item, index) in items" :key="item.id" class="wedge-group"
            :class="{ active: activeIndex === index }" @click.stop="selectItem(index)" @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = null">

            <path :d="getWedgePath(index)" class="wedge-shape" />

            <text class="wedge-text" :transform="getTextTransform(index)" text-anchor="middle"
              dominant-baseline="middle">
              {{ item.title }}
            </text>
          </g>
        </svg>
      </div>

      <div class="mountain"></div>
      <img class="city-bg-svg" src="@/assets/svg/5-city-about-blank.svg" alt="About Page Background" />
    </div>

    <div class="content">
      <div class="description-area">
        <Transition name="fade" mode="out-in">
          <div :key="activeIndex" v-if="activeItem" class="text-wrapper">
            <p class="desc-text">{{ activeItem.description }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores'

const dataStore = useDataStore()

const activeIndex = ref(1)
const hoverIndex = ref(null)

const items = computed(() => dataStore.getAboutSections)
const activeItem = computed(() => items.value[activeIndex.value] || null)

const SECTOR_ANGLE = 40
const RADIUS = 105
const TEXT_RADIUS = 55

const sunRotation = computed(() => {
  return -1 * (activeIndex.value * SECTOR_ANGLE)
})


const d2r = (deg) => (deg * Math.PI) / 180

const getPoint = (angle, r) => {
  const x = r * Math.cos(d2r(angle))
  const y = r * Math.sin(d2r(angle))
  return `${x} ${y}`
}

const getWedgePath = (index) => {
  const startAngle = (index * SECTOR_ANGLE) - (SECTOR_ANGLE / 2)
  const endAngle = (index * SECTOR_ANGLE) + (SECTOR_ANGLE / 2)

  const p1 = getPoint(startAngle, RADIUS)
  const p2 = getPoint(endAngle, RADIUS)

  return `M 0 0 L ${p1} A ${RADIUS} ${RADIUS} 0 0 1 ${p2} Z`
}

const getTextTransform = (index) => {
  const angle = index * SECTOR_ANGLE
  return `rotate(${angle}) translate(${TEXT_RADIUS})`
}

const selectItem = (index) => {
  activeIndex.value = index
}


</script>

<style scoped>
.scene {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  overflow: hidden;
}

.sun-container {
  position: absolute;
  bottom: 80vh;
  left: -20vw;
  width: 50vw;
  height: 50vw;
  min-width: 300px;
  min-height: 300px;
  max-width: 800px;
  max-height: 800px;

  border-radius: 50%;
  background-color: #EFDDB3;
  z-index: 1;
  transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.05);
}

.wedge-shape {
  fill: transparent;
  stroke: transparent;
  transition: fill 0.3s ease;
}

.wedge-group:hover .wedge-shape {
  fill: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.wedge-text {
  font-size: 0.7em;
  font-family: sans-serif;
  fill: #999;
  font-weight: 400;
  text-transform: capitalize;
  transition: all 0.5s ease;
  pointer-events: none;
  user-select: none;
}

.wedge-group.active .wedge-text {
  fill: #5e5e5e;
  font-size: 0.85em;
}

.wedge-group:hover .wedge-text {
  fill: #777;
}

.mountain {
  position: absolute;
  bottom: 20vh;
  width: 100%;
  height: 60%;
  background-color: var(--about-mountain-color);
  z-index: 3;
  clip-path: polygon(-215% 100%, 215% 100%, 75% 0%);
  pointer-events: none;
}

.city-bg-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: auto;
  display: block;
  z-index: 4;
  pointer-events: none;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

.description-area {
  position: absolute;
  top: 10%;
  left: 40%;
  width:50%;
  pointer-events: auto;
}

.desc-text {
  font-size: 1.4rem;
  line-height: 1.6;
  color: #7A7A7A;
  font-weight: 400;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Media Queries */
@media (min-width: 1700px) {
  .sun-container {
    bottom: 110vh;
  }

  .desc-text {
    font-size: 1.6rem;
  }
}

@media (max-width: 1000px) {
  .mountain {
    bottom: 0;
  }

  .sun-container {
    bottom: 55vh;
  }
}

@media (max-width: 700px) {
  .mountain {
    bottom: 0;
  }

  .sun-container {
    bottom: 40vh;
  }

  .description-area {
    top: 0;
    left: 0;
    margin: 1.5em;
    width: calc(100% - 3em);
  }

  .desc-text {
    font-size: 1.2em;
  }
}


@media (max-width: 1300px) {
  .description-area {
    top: 5%;
  }
}

@media (max-width: 400px) {
  .desc-text {
    font-size: 1em;
  }
}

@media (max-height: 800px) {
  .desc-text {
    font-size: 2vh;
  }
}
</style>
