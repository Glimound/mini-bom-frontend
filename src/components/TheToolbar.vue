<template>
  <div class="toolbar">
    <div class="logo"></div>
    <div class="auth-management">
      <span>username</span>
      <span>logout</span>
    </div>
  </div>
</template>

<script setup>

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
    width: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 8px 20px 8px 0px;

    span {
      text-align: center;
      font-size: 10pt;
      color: #222226;
    }
  }
}
</style>