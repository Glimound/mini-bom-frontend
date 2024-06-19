<template>
  <el-pagination
    :current-page="curPage"
    :page-size="pageSize"
    :total="totalRows"
    :page-sizes="[10, 25, 50, 100]"
    small="small"
    layout="total, prev, pager, next, sizes"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
const props = defineProps({
  curPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  totalRows: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['pageChange'])

function handleSizeChange(val) {
  emit('pageChange', props.curPage, val)
}

function handleCurrentChange(val) {
  emit('pageChange', val, props.pageSize)
}
</script>

<style scoped>

</style>
