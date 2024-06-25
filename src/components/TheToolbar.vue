<template>
  <div class="toolbar">
    <div class="logo">
      <el-image style="width: 35px; height: 35px" src="./src/assets/logo-l.png" :fit="fit" />
      <el-divider direction="vertical" style="height: 30px; margin: 0px 10px;"/>
      <el-image style="width: 100px; height: 20px" src="./src/assets/logo-r.png" :fit="fit" />
    </div>
    <div class="auth-management">
      <el-text class="mx-1" small>{{ authStore.username }}</el-text>
      <el-button type="info" link small @click="logout">logout</el-button>
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
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 20;
  position: fixed;
  top: 0px;
  background-color: white;

  .logo {
    margin: 2px 0px 0px 25px;
    display: flex;
    align-items: center;

  }

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