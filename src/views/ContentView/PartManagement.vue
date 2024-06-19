<template>
  <div class="part-management">
    <el-container>
      <el-radio-group class="query-radios" v-model="queryType">
        <el-radio :label="1">按部件编码查询</el-radio>
        <el-input
          placeholder="请输入部件编码"
          v-model="searchKeywordCode"
          :disabled="queryType !== 1"
          class="input-with-select"
          style="width: 20%"
          clearable
        ></el-input>
        <el-radio :label="2">按部件名称查询</el-radio>
        <el-input
          placeholder="请输入部件名称"
          v-model="searchKeywordName"
          :disabled="queryType !== 2"
          class="input-with-select"
          style="width: 20%"
          clearable
        ></el-input>
      </el-radio-group>
      <el-button
        class="search-button"
        type="primary"
        :icon="Search"
        @click="handleSearch"
      >
        查询
      </el-button>
    </el-container>
    <el-button
      class="createButton"
      type="primary"
      :icon="Plus"
      @click="handleCreate"
      >创建</el-button
    >
    <el-table
      class="partTable"
      :data="tableData"
      border
      style="width: 100%"
      height="350"
    >
      <el-table-column type="index" width="55" fixed="left"/>
      <el-table-column
        prop="id"
        label="部件编码"
        width="180"
        fixed
      ></el-table-column>
      <el-table-column
        prop="name"
        label="部件名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="versionId"
        label="版本号"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="mode"
        label="装配模式"
        width="180"
      ></el-table-column>
      <el-table-column prop="typeId" label="分类编码" width="180">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            :icon="Edit"
            circle
            size="small"
            class="editButton"
            @click="handleEdit(row)"
          ></el-button>
          <el-button
            link
            type="danger"
            :icon="Delete"
            circle
            size="small"
            class="deleteButton"
            @click="handleDelete(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:current-page="currentPage"
      :page-sizes="[5, 10, 20]"
      v-model:page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <DialogCreatePart ref="addPart" :reload="handleSearch" :type="state.opType" />
  </div>
</template>

<script setup>
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import TheNavMenu from "@/components/TheNavMenu.vue";
import { reactive, ref } from "vue";
import { Edit, Delete, Search, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import DialogCreatePart from "@/components/DialogCreatePart.vue";
import router from "@/router";
import { partService } from "@/services/apiServices";
import {onMounted} from "vue";
// 定义表格数据
/**
 * id:
 * name:
 * version:
 * mode:
 * typeId:
 */
const tableData = ref([]);
//查询关键词
const searchKeywordCode = ref("");
const searchKeywordName = ref("");
// 分页，当前页，每页显示条数，总条数 todo: 从后端获取
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(1);
//todo: 控制查询方式
const queryType = ref(1);
const state = reactive({
  opType: "add",
});
//填充的part表单数据
const addPart = ref(null);

//初始化查询所有部件并获取总数
onMounted(() => {
  handleSearch();
  total.value = tableData.value.length;
});

//根据关键词查询
function handleSearch() {
  const keyword = (queryType === 1 ? searchKeywordCode.value : searchKeywordName.value);
  partService.getParts(keyword,pageSize.value,currentPage.value).then((res) => {
    tableData.value = res.data.data.data;
    total.value = res.data.data.page.totalRows;
  }).catch((error) => {
    ElMessage({
      type: "error",
      message: error.message || "查询失败!",
    })
  });
}

//创建
function handleCreate() {
  state.opType = "add";
  addPart.value.open();
}

//编辑
function handleEdit(row) {
  state.opType = "edit";
  addPart.value.open(row.id);
}
//删除
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该部件, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    //deletePart, params:row.partCode
    //todo: 调用后端API删除
    axios
      .delete(`/part/delete,`,row.id)
      .then((res) => {
        const result = res.data; // 获取返回的数据
        if (result.message === "ok") {
          // 删除成功
          ElMessage({
            type: "success",
            message: result.message || "删除成功!", // 使用后端返回的消息或默认消息
          });
        } 
        else {
          // 删除失败
          ElMessage({
            type: "error",
            message: result.message || "删除失败!", // 使用后端返回的消息或默认消息
          });
        }
      })
      .catch((error) => {
        // 请求失败（网络问题或服务器错误等）
        ElMessage({
          type: "error",
          message: "请求失败，请稍后再试!",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消删除",
        });
      });
  });
}


// 分页
function handleSizeChange(newSize) {
  pageSize.value = newSize;
  currentPage.value = 1; // 每改变页大小，重置为第一页
  handleSearch();
}

function handleCurrentChange(newPage) {
  currentPage.value = newPage;
  handleSearch();
}
</script>

<style lang="scss">
.part-management {
  .query-radios {
    padding-top: 100px;
    // 居中
    justify-content: center;
    display: flex;
    margin-bottom: 20px;
    .input-with-select {
      margin-right: 20px;
    }
  }
  .search-button {
    margin-top: 100px;
  }
  .createButton {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .partTable {
    padding-left: 5px;
  }
}
</style>