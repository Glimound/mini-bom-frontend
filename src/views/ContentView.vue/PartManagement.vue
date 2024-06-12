<template>
  <div class="part-management">
    <el-container>
      <el-header>
        <TheBreadcrumb />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 导航菜单 -->
          <TheNavMenu />
        </el-aside>
        <el-main>
          <el-button type="primary" @click="handleCreate">创建</el-button>
          <el-input
            placeholder="请输入英文名称"
            v-model="searchKeyword"
            class="input-with-select"
          >
            <el-button
              icon="el-icon-search"
              @click="handleSearch"
            ></el-button>
          </el-input>

          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              prop="englishName"
              label="英文名称"
            ></el-table-column>
            <el-table-column
              prop="chineseName"
              label="中文名称"
            ></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="handleEdit(row)"
                  >编辑</el-button
                >
                <el-button type="text" size="small" @click="handleDelete(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheNavMenu from "@/components/TheNavMenu.vue";
import { ref } from "vue";
// 定义表格数据
const tableData = ref([
    {
        englishName: "part1",
        chineseName: "部件1",
        status: "启用",
    }
]);
const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(1);


function handleCreate() {
    console.log("创建");
}
function handleSearch() {
    console.log("搜索");
}
function handleEdit(row) {
    console.log("编辑", row);
}
function handleDelete(row) {
    console.log("删除", row);
}

</script>

<style lang="scss">

</style>