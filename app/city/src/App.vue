<script setup>
import { onMounted } from 'vue'
import { initCity } from './enter'

onMounted(() => {
  // 初始化三维场景
  initCity();
})
</script>

<template>
  <canvas id="city">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>

<style scoped>

</style>