<template>
  <div class="navigation">
    <el-menu :default-active="currentRoute" :router="true">
      <el-menu-item index="/">
        <span>Home</span>
      </el-menu-item>
      <el-sub-menu index="/test">
        <template #title>
          <span>管理</span>
        </template>
          <el-menu-item index="/bomManagement">
          <span>Bom管理</span>
          </el-menu-item>
          <el-menu-item index="/partManagement">
          <span>部件管理</span>
          </el-menu-item>
          <el-menu-item index="/attributeManagement">
          <span>属性管理</span>
          </el-menu-item>
          <el-menu-item index="/classificationManagement">
          <span>分类管理</span>
          </el-menu-item>
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
    i {
      margin-right: 10px;
    }
  }

  .el-submenu {
    i {
      margin-right: 10px;
    }

    .el-menu-item {
      margin-left: 10px;
    }
  }
}
</style>