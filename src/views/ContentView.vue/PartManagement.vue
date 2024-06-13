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
          <el-container>
            <el-radio-group v-model="queryType">
              <el-radio :label="1">按部件编码查询</el-radio>
              <el-input
                placeholder="请输入部件编码"
                v-model="searchKeywordCode"
                :disabled="queryType !== 1"
                class="input-with-select"
                style="width: 20%"
              ></el-input>
              <el-radio :label="2">按部件名称查询</el-radio>
              <el-input
                placeholder="请输入部件名称"
                v-model="searchKeywordName"
                :disabled="queryType !== 2"
                class="input-with-select"
                style="width: 20%"
              ></el-input>
            </el-radio-group>
            <el-button type="primary" :icon="Search" @click="Search">
              查询
            </el-button>
          </el-container>
          <el-button type="primary" :icon="Plus" @click="handleCreate"
            >创建</el-button
          >
          <el-table :data="tableData" border style="width: 100%" height="400">
            <el-table-column type="index" width="55" />
            <el-table-column
              prop="partCode"
              label="部件编码"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="partName"
              label="部件名称"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="version"
              label="版本号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="assemblyMode"
              label="装配模式"
              width="180"
            ></el-table-column>
            <el-table-column prop="partType" label="分类编码" width="180">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  :icon="Edit"
                  circle
                  size="small"
                  @click="handleEdit(row)"
                ></el-button>
                <el-button
                  link
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="handleDelete(row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
          <DialogCreatePart ref="addPart" :reload="getPart" :type="state.opType" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheNavMenu from "@/components/TheNavMenu.vue";
import { reactive, ref } from "vue";
import { Edit, Delete, Search, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import DialogCreatePart from "@/components/DialogCreatePart.vue";

// 定义表格数据 todo: 从后端获取
const tableData = ref([
  {
    partCode: "partCode",
    partName: "partName",
    version: "version",
    assemblyMode: "assemblyMode",
    partType: "partType",
  },
  {
    partCode: "partCode",
    partName: "partName",
    version: "version",
    assemblyMode: "assemblyMode",
    partType: "partType",
  },
  {
    partCode: "partCode",
    partName: "partName",
    version: "version",
    assemblyMode: "assemblyMode",
    partType: "partType",
  },
]);
//查询关键词
const searchKeyword = ref("");
// 分页，当前页，每页显示条数，总条数 todo: 从后端获取
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(1);
//todo: 控制查询方式
const queryType = ref(null);
const state = reactive({
  opType:'add',
});

//填充的part表单数据
const addPart = ref(null);
//创建
function handleCreate() {
  state.opType = "add";
  addPart.value.open();
}
//查询
function handleSearch() {
  console.log("搜索");
}
//编辑
function handleEdit(row) {
  console.log("编辑", row);
}
//删除
function handleDelete(row) {
  console.log("删除", row);
}

function getPart() {
  console.log("getPart");
}
</script>

<style lang="scss">
</style>