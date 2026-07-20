<template>
  <div
    class="clue-card p-4 bg-gray-800/80 border-2 border-black rounded-lg hover:border-black/80 transition-colors duration-300 backdrop-blur-sm cursor-pointer"
  >
    <h3 class="text-lg font-bold text-teal-400 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-300">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>
