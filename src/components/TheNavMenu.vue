<template>
  <div class="navigation">
    <el-menu :default-active="currentRoute" :router="true">
      <el-sub-menu index="/">
        <template #title>
          <el-icon size ="small"><House /></el-icon>
          <span>控制台</span>
        </template>
        <el-menu-item index="/attributeManagement">
          <span>属性管理</span>
        </el-menu-item>
        <el-menu-item index="/classificationManagement">
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/partManagement">
          <span>部件&BOM管理</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { House } from "@element-plus/icons-vue";
const route = useRoute();

const currentRoute = computed(() => {
  return route.path;
});
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