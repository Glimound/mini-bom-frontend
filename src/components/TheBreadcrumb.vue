<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="!isRootPath" :to="{ path: currentPath }">{{ currentTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const currentTitle = computed(() => {
  return route.meta.title
})
const currentPath = computed(() => {
  return route.path
})
const isRootPath = computed(() => {
  return route.path === '/'
})
</script>

<style lang="scss">
.breadcrumb {
  position: fixed;
  width: calc(100% - 200px);
  height: 50px;
  background-color: white;
  z-index: 10;
  display: flex;
  align-items: center;

  .el-breadcrumb {
    margin-left: 20px;
  }
}
</style>