<template>
  <div class="navigation">
    <el-menu :default-active="currentRoute" :router="true">
      <el-menu-item index="/attribute-management">
        <el-icon size="16">
          <Setting/>
        </el-icon>
        <span>属性管理</span>
      </el-menu-item>
      <el-menu-item index="/classification-management">
        <el-icon size="16">
          <Document/>
        </el-icon>
        <span>分类管理</span>
      </el-menu-item>
      <el-menu-item index="/part-management">
        <el-icon size="16">
          <Connection/>
        </el-icon>
        <span>Part&BOM管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";

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
    padding-top: 3px;
  }

  .el-menu-item {
    height: 40px;

    .el-icon {
      margin: 0px 5px 2px -5px;
    }
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