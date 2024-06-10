<template>
  <div class="navigation">
    <el-menu :default-active="currentRoute" :router="true">
      <el-menu-item index="/">
        <span>Part管理</span>
      </el-menu-item>
      <el-sub-menu index="/test">
        <template #title>
          <span>test2</span>
        </template>
          <el-menu-item index="/1">test2-1</el-menu-item>
          <el-menu-item index="/2">test2-2</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute = computed(() => {
  return route.path
})
</script>

<style lang="scss">
.navigation {
  width: 200px;
  height: 100%;
  position: fixed;
  top: 50px;

  .el-menu {
    height: 100%;
  }

  .el-menu-item {
    height: 40px;
  }

  .el-sub-menu {
    height: 40px;

    .el-sub-menu__title {
      height: 40px;
    }

    .el-menu-item {
      height: 40px;
    }
  }
}
</style>