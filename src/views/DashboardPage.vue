<template>
  <div class="page">
    <TheToolbar />
    <div class="main-container">
      <TheNavMenu />
      <div class="content-area">
        <TheBreadcrumb />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheNavMenu from "@/components/TheNavMenu.vue";
import TheToolbar from "@/components/TheToolbar.vue";
</script>

<style lang="scss">
.page {
  height: 100vh;
  box-sizing: border-box;

  .main-container {
    padding-top: 50px;
    height: calc(100% - 50px);
    width: 100%;

    .content-area {
      width: calc(100% - 200px);
      padding-left: 200px;
      overflow-y: auto;
      height: auto;
    }
  }
}
</style>