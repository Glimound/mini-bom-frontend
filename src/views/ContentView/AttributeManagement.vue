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
      <el-form-item style="margin-left: auto;">
        <el-button class="button-submit" type="primary" @click="addAttribute">新增属性</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-divider class="divider"/>
    <div class="attribute-wrapper">
      <el-table :data="attributeData">
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
    <div class="tab-wrapper">
      <el-tabs model-value="0">
        <el-tab-pane :label="labelText">
          <div class="classification-wrapper">
            <el-table :data="relevantClassifications">
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

  <el-dialog v-model="addAttributeFormVisible" title="新增属性" style="padding: 20px;">
    <el-form :model="addAttributeForm" :rules="rules" ref="addAttributeFormRef" label-width="80px" style="padding: 5px 10px 0px 10px;">
      <el-form-item label="中文名称" prop="name">
        <el-input v-model="addAttributeForm.name"/>
      </el-form-item>
      <el-form-item label="中文描述" prop="description">
        <el-input v-model="addAttributeForm.description" type="textarea"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="nameEn">
        <el-input v-model="addAttributeForm.nameEn"/>
      </el-form-item>
      <el-form-item label="英文描述" prop="descriptionEn">
        <el-input v-model="addAttributeForm.descriptionEn" type="textarea"/>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="addAttributeForm.type" placeholder="选择属性类型">
          <el-option label="TEXT" value="TEXT" />
          <el-option label="INTEGER" value="INTEGER" />
          <el-option label="DECIMAL" value="DECIMAL" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="addAttributeForm.type == 'DECIMAL'" label="精度" prop="precision">
        <el-input v-model="addAttributeForm.precision" placeholder="1~30" type="number" min="1" max="30"/>
      </el-form-item>
      <el-form-item v-if="addAttributeForm.type == 'TEXT'" label="长度" prop="length">
        <el-input v-model="addAttributeForm.length" placeholder="1~30" type="number" min="1" max="30"/>
      </el-form-item>
      <el-form-item label="属性状态" prop="disabledFlag">
        <el-radio-group v-model="addAttributeForm.disabledFlag">
          <el-radio :label="true">有效</el-radio>
          <el-radio :label="false">无效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer" style="padding: 5px 10px;">
        <el-button @click="addAttributeCancel">取消</el-button>
        <el-button type="primary" @click="addAttributeSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { AttributeService } from '@/services/apiServices'
import ThePagination from '@/components/ThePagination.vue'
import { ElMessage } from 'element-plus';

const attributeData = ref([])
const filterData = ref({
  attribute: ''
})
const page = ref({})
const relevantClassifications = ref([])
const selectedAttributeName = ref('')
const addAttributeFormVisible = ref(false)
const addAttributeForm = ref({
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  type: '',
  disabledFlag: false,
  precision: 1,
  length: 1
})
const addAttributeFormRef = ref(null)
const rules = {
  name: [{ required: true, message: '中文名称不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '中文描述不能为空', trigger: 'blur' }],
  nameEn: [{ required: true, message: '英文名称不能为空', trigger: 'blur' }],
  descriptionEn: [{ required: true, message: '英文描述不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  precision: [{ required: true, message: '精度不能为空', trigger: 'blur' }],
  length: [{ required: true, message: '长度不能为空', trigger: 'blur' }],
  disabledFlag: [{ required: true, message: '属性状态不能为空', trigger: 'change' }]
};

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
    page.value.curPage = data.data.page.curPage
    page.value.pageSize = data.data.page.pageSize
  })
  AttributeService.getAttributeCount(filterData.value.attribute).then(({data}) => {
    page.value.totalRows = data.data
  })
}

function handleListClassifications(row) {
  selectedAttributeName.value = row.name
  AttributeService.getRelevantClassifications(row.id).then(({data}) => {
    relevantClassifications.value = data.data.data
  })
}

function addAttribute() {
  addAttributeFormVisible.value = true
}

function addAttributeCancel() {
  addAttributeFormVisible.value = false
  addAttributeForm.value = {
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    type: '',
    disabledFlag: false,
    precision: 1,
    length: 1
  }
}

function addAttributeSubmit() {
  addAttributeFormRef.value.validate((valid) => {
    if (valid) {
      let obj = {
        name: addAttributeForm.value.name,
        nameEn: addAttributeForm.value.nameEn,
        description: addAttributeForm.value.description,
        descriptionEn: addAttributeForm.value.descriptionEn,
        type: addAttributeForm.value.type,
        disabledFlag: addAttributeForm.value.disabledFlag,
        constraint: {
          type: addAttributeForm.value.type,
          precision: +addAttributeForm.value.precision,
          length: +addAttributeForm.value.length
        }
      }
      if (obj.type === 'TEXT') {
        delete obj.constraint.precision
      } else if (obj.type === 'DECIMAL') {
        delete obj.constraint.length
      } else {
        delete obj.constraint.precision
        delete obj.constraint.length
      }
      AttributeService.createAttribute(obj).then(() => {
        addAttributeFormVisible.value = false
        getAttributes(page.value.pageSize, page.value.curPage)
        ElMessage({
          message: '新增成功',
          type: 'success'
        })
      })
    } else {
      return false;
    }
  });
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
  height: calc((100% - 115px) * 0.7);
    
    .el-table {
      height: 100%;
    }

    .el-table__cell {
      padding: 5px 0px;
      font-size: 12px;
    }
  }

  .filter-box {

    .el-form {
      padding: 10px 15px 5px 15px;
      display: flex;

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
          height: 28px;
          width: 250px;
        }

        .button-submit {
          font-size: 12px;
          height: 28px;
        }
      }
    }
  }

  .divider {
    margin: 5px 0px 5px 0px;
  }

  .tab-wrapper {
    padding: 15px 15px 0px 15px;
    height: calc((100% - 115px) * 0.3);

    .el-tabs {
      --el-tabs-header-height: 30px;
      height: 100%;

      .el-tabs__header {
        margin-bottom: 5px;
      }

      .el-tabs__content {
        height: calc(100% - 35px);
      }

      .el-tabs__item {
        font-size: 13px;
      }

      .el-tab-pane {
        height: 100%;
      }
    }

    .classification-wrapper {
      padding: 0px 10px 0px 10px;
      height: 100%;

      .el-table {
        height: 100%;
      }

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