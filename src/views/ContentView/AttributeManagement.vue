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
      <el-table :data="data" height="300">
        <el-table-column prop="name" label="属性中文名称"/>
        <el-table-column prop="nameEn" label="属性英文名称"/>
        <el-table-column prop="description" label="中文描述"/>
        <el-table-column prop="descriptionEn" label="英文描述"/>
        <el-table-column prop="type" label="数据类型"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default>
          <el-button link type="primary" size="small">查看分类</el-button>
          <el-button link type="primary" size="small">修改</el-button>
          <el-button link type="primary" size="small">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tabs">
      <el-tabs model-value="0">
        <el-tab-pane label="属性所属分类">
          <div class="classification-wrapper">
            <el-table :data="relavantClassifications" height="150">
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
      :totalPages="page.totalPages"
      :totalRows="page.totalRows"
      @pageChange="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ThePagination from '@/components/ThePagination.vue'

const data = ref([
  {
    "name": "宽度",
    "nameEn": "width",
    "description": "宽度",
    "descriptionEn": "",
    "type": "DECIMAL",
    "id": "637301175967817728"
  },
  {
    "name": "长度",
    "nameEn": "length",
    "description": "长度",
    "descriptionEn": "",
    "type": "DECIMAL",
    "id": "637301329592586240"
  },
  {
    "name": "原磊0号",
    "nameEn": "yuanlei0",
    "description": "原磊0号",
    "descriptionEn": "",
    "type": "STRING",
    "id": "642028235311292416"
  },
  {
    "name": "原磊33代",
    "nameEn": "yuanlei33TH",
    "description": "TEXT",
    "descriptionEn": "yuanlei 33dai",
    "type": "TEXT",
    "id": "642033171155656704"
  },
  {
    "name": "原磊2022代",
    "nameEn": "yuanlei2022TH",
    "description": "原磊2022代",
    "descriptionEn": "yuanlei 2022dai",
    "type": "DECIMAL",
    "id": "642142120597000192"
  },
  {
    "name": "原磊2024代",
    "nameEn": "yuanlei2024TH",
    "description": "原磊2024代",
    "descriptionEn": "yuanlei 2024dai",
    "type": "DECIMAL",
    "id": "642148800646877184"
  },
  {
    "name": "原磊2025代",
    "nameEn": "yuanlei2025TH",
    "description": "原磊2025代",
    "descriptionEn": "yuanlei 2025dai",
    "type": "DECIMAL",
    "id": "642383106149457920"
  },
  {
    "name": "原磊2027代",
    "nameEn": "yuanlei2027TH",
    "description": "原磊2027代",
    "descriptionEn": "yuanlei 2027dai",
    "type": "DECIMAL",
    "id": "642391135259467776"
  },
  {
    "name": "原磊2028代",
    "nameEn": "yuanlei2028TH",
    "description": "原磊2028代",
    "descriptionEn": "yuanlei 2028dai",
    "type": "DECIMAL",
    "id": "642398004661194752"
  }
])
const filterData = ref({
  atrribute: ''
})
const page = ref({
  curPage: 1,
  pageSize: 10,
  totalPages: 10,
  totalRows: 100
})
const relavantClassifications = ref([
  {
    "id": "12",
    "name": "原神13_02",
    "nameEn": "yuanshen13_02",
    "description": "原？",
    "descriptionEn": "yuan!",
    "businessCode": "12310"
  },
  {
    "id": "642018725628747776",
    "name": "原神11",
    "nameEn": "yuanshen11",
    "description": "原？",
    "descriptionEn": "yuan!",
    "businessCode": "12311"
  },
  {
    "id": "13",
    "name": "原神13",
    "nameEn": "yuanshen13",
    "description": "原？",
    "descriptionEn": "yuan!",
    "businessCode": "12313"
  },
  {
    "id": "642322405070475264",
    "name": "原神13_01",
    "nameEn": "yuanshen13_01",
    "description": "原？",
    "descriptionEn": "yuan!",
    "businessCode": "12313_01"
  },
  {
    "id": "642328635298029568",
    "name": "原神13_01_01",
    "nameEn": "yuanshen13_01_01",
    "description": "原？",
    "descriptionEn": "yuan!",
    "businessCode": "12313_01_01"
  }
])

function handlePageChange(curPage, pageSizes) {
  // axois call
  // change page
  page.value.curPage = curPage
  page.value.pageSize = pageSizes
}
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