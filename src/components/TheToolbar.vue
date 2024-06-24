<template>
  <div class="toolbar">
    <div class="logo"></div>
    <div class="auth-management">
      <el-text class="mx-1" small>{{ authStore.username }}</el-text>
      <el-button type="plain" link small @click="logout">logout</el-button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss">
.toolbar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 20;
  position: fixed;
  top: 0px;
  background-color: white;

  .auth-management {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 8px 20px 8px 0px;

    .el-button {
      text-decoration: underline;
    }
  }
}
</style>