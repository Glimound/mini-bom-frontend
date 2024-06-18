<template>
  <div class="attribute-management">
    <div class="filter-box">
      <el-form :inline="true" :model="filterData">
      <el-form-item label="属性信息查询">
        <el-input class="input" v-model="filterData.attribute" placeholder="请输入关键字" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button class="button-submit" type="primary" @click="filterSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-divider class="divider"/>
    <div class="attribute-wrapper">
      <el-table :data="attributeData" height="300">
        <el-table-column prop="name" label="属性中文名称"/>
        <el-table-column prop="nameEn" label="属性英文名称"/>
        <el-table-column prop="description" label="中文描述"/>
        <el-table-column prop="descriptionEn" label="英文描述"/>
        <el-table-column prop="type" label="数据类型"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
          <el-button link type="primary" size="small" @click="handleListClassifications(scope.row)">查看分类</el-button>
          <el-button link type="primary" size="small">修改</el-button>
          <el-button link type="primary" size="small">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tabs">
      <el-tabs model-value="0">
        <el-tab-pane :label="labelText">
          <div class="classification-wrapper">
            <el-table :data="relevantClassifications" height="150">
              <el-table-column prop="businessCode" label="分类码"/>
              <el-table-column prop="name" label="分类中文名称"/>
              <el-table-column prop="nameEn" label="分类英文名称"/>
              <el-table-column prop="description" label="分类中文描述"/>
              <el-table-column prop="descriptionEn" label="分类英文描述"/>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <the-pagination
      class="pagination"
      :curPage="page.curPage"
      :pageSize="page.pageSize"
      :totalRows="page.totalRows"
      @pageChange="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AttributeService } from '@/services/apiServices';
import ThePagination from '@/components/ThePagination.vue'

const attributeData = ref([])
const filterData = ref({
  attribute: ''
})
const page = ref({})
const relevantClassifications = ref([])
const selectedAttributeName = ref('')

const labelText = computed(() => {
  return !!selectedAttributeName.value ? `属性 <${selectedAttributeName.value}> 的所属分类` : '属性所属分类'
})

function filterSubmit() {
  getAttributes(page.value.pageSize, page.value.curPage)
}

function handlePageChange(curPage, pageSizes) {
  page.value.curPage = curPage
  page.value.pageSize = pageSizes
  getAttributes(pageSizes, curPage)
}

function getAttributes(pageSize, currPage) {
  AttributeService.getAttributes(pageSize, currPage, filterData.value.attribute)
  .then(({data}) => {
    attributeData.value = data.data.data
    page.value = data.data.page
  })
}

function handleListClassifications(row) {
  selectedAttributeName.value = row.name
  AttributeService.getRelevantClassifications(row.id).then(({data}) => {
    relevantClassifications.value = data.data.data
  })
}

onMounted(() => {
  getAttributes(10, 1)
})

</script>

<style lang="scss">
.attribute-management {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;

  .attribute-wrapper {
  padding: 0px 10px 0px 10px;

    .el-table__cell {
      padding: 5px 0px;
      font-size: 12px;
    }
  }

  .filter-box {

    .el-form {
      padding: 10px 15px 5px 15px;

      .el-form-item {
        font-size: 12px;
        height: 30px;
        margin: 0px 12px 0px 0px;
        align-items: center;

        label {
          font-size: 13px;
          height: 30px;
          font-weight: bold;
        }

        .input {
          font-size: 12px;
          height: 30px;
          width: 250px;
        }

        .button-submit {
          font-size: 12px;
          height: 30px;
        }
      }
    }
  }

  .divider {
    margin: 5px 0px 5px 0px;
  }

  .tabs {
    padding: 15px 15px 0px 15px;

    .el-tabs {
      --el-tabs-header-height: 30px;

      .el-tabs__header {
        margin-bottom: 5px;
      }

      .el-tabs__item {
        font-size: 13px;
      }
    }

    .classification-wrapper {
      padding: 0px 10px 0px 10px;

      .el-table__cell {
        padding: 5px 0px;
        font-size: 12px;
      }
    }
    
  }

  .pagination {
    margin-top: auto;
    justify-content: flex-end;
    padding-right: 15px;
    padding-bottom: 10px;
  }
}
</style>