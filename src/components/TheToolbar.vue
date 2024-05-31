<template>
  <div class="toolbar">
    <p>testtest</p>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
  .toolbar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    z-index: 20;
    position: fixed;
    top: 0px;
    background-color: white;

    p {
      font-size: 20px;
      letter-spacing: 2px;
      color: #666666;
      font-weight: bold;
    }
  }
</style>