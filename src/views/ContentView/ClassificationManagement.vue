<template>
  <div class="classification-management">
    <div class="filter-box">
      <el-form :inline="true" :model="filterData">
        <el-form-item label="分类信息查询">
          <el-input class="input" v-model="filterData.classification" placeholder="请输入关键字" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button class="button-submit" type="primary" @click="filterSubmit">查询</el-button>
        </el-form-item>
        <el-form-item style="margin-left: auto;">
          <el-button class="button-submit" type="primary" @click="displayAttributeConnection">查看属性关联</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="button-submit" type="primary" @click="displayClassificationTree">查看分类树</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="button-submit" type="primary" @click="addClassification">新增分类</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider class="divider"/>
    <div class="classification-wrapper">
      <el-table :data="classificationData">
        <el-table-column prop="businessCode" label="分类码"/>
        <el-table-column prop="name" label="分类中文名称"/>
        <el-table-column prop="nameEn" label="分类英文名称"/>
        <el-table-column prop="description" label="分类中文描述"/>
        <el-table-column prop="descriptionEn" label="分类英文描述"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleListAttributes(scope.row)">查看属性</el-button>
            <el-button link type="primary" size="small" @click="handleEditClassification(scope.row)">修改</el-button>
            <el-popconfirm confirm-button-text="yes"
                           cancel-button-text="no"
                           @confirm="handleDeleteClassification(scope.row)"
                           title="确认删除属性吗">
              <template #reference>
                <el-button link type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tab-wrapper">
      <el-tabs model-value="0">
        <el-tab-pane :label="labelText">
          <div class="attribute-wrapper">
            <el-table :data="relevantAttributes">
              <el-table-column prop="name" label="属性中文名称"/>
              <el-table-column prop="nameEn" label="属性英文名称"/>
              <el-table-column prop="description" label="属性中文描述"/>
              <el-table-column prop="descriptionEn" label="属性英文描述"/>
              <el-table-column prop="type" label="数据类型"/>
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

  <el-dialog v-model="addClassificationFormVisible" title="新增分类" style="padding: 20px;">
    <el-form :model="classificationForm" :rules="rules" ref="classificationFormRef" label-width="80px" style="padding: 5px 10px 0px 10px;">
      <el-form-item label="分类码" prop="businessCode">
        <el-input v-model="classificationForm.businessCode"/>
      </el-form-item>
      <el-form-item label="中文名称" prop="name">
        <el-input v-model="classificationForm.name"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="nameEn">
        <el-input v-model="classificationForm.nameEn"/>
      </el-form-item>
      <el-form-item label="中文描述" prop="description">
        <el-input v-model="classificationForm.description" type="textarea"/>
      </el-form-item>
      <el-form-item label="英文描述" prop="descriptionEn">
        <el-input v-model="classificationForm.descriptionEn" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer" style="padding: 5px 10px;">
        <el-button @click="classificationFormCancel">取消</el-button>
        <el-button type="primary" @click="addClassificationSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="editClassificationFormVisible" title="修改分类" style="padding: 20px;">
    <el-form :model="classificationForm" :rules="rules" ref="classificationFormRef" label-width="80px" style="padding: 5px 10px 0px 10px;">
      <el-form-item label="分类码" prop="businessCode">
        <el-input v-model="classificationForm.businessCode" disabled/>
      </el-form-item>
      <el-form-item label="中文名称" prop="name">
        <el-input v-model="classificationForm.name"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="nameEn">
        <el-input v-model="classificationForm.nameEn"/>
      </el-form-item>
      <el-form-item label="中文描述" prop="description">
        <el-input v-model="classificationForm.description" type="textarea"/>
      </el-form-item>
      <el-form-item label="英文描述" prop="descriptionEn">
        <el-input v-model="classificationForm.descriptionEn" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer" style="padding: 5px 10px;">
        <el-button @click="classificationFormCancel">取消</el-button>
        <el-button type="primary" @click="editClassificationSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ClassificationService } from '@/services/apiServices'
import ThePagination from '@/components/ThePagination.vue'
import { ElMessage } from 'element-plus';

const classificationData = ref([])
const filterData = ref({
  classification: ''
})
const page = ref({})
const relevantAttributes = ref([])
const selectedClassificationName = ref('')
const addClassificationFormVisible = ref(false)
const editClassificationFormVisible = ref(false)
const classificationForm = ref({
  businessCode: '',
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: ''
})
const classificationFormRef = ref(null)
const rules = {
  businessCode: [{ required: true, message: '分类码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '中文名称不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '中文描述不能为空', trigger: 'blur' }],
  nameEn: [{ required: true, message: '英文名称不能为空', trigger: 'blur' }],
  descriptionEn: [{ required: true, message: '英文描述不能为空', trigger: 'blur' }]
};

const labelText = computed(() => {
  return !!selectedClassificationName.value ? `分类 <${selectedClassificationName.value}> 的属性信息` : '分类属性信息'
})

function filterSubmit() {
  getClassifications(page.value.pageSize, page.value.curPage)
}

function handlePageChange(curPage, pageSizes) {
  page.value.curPage = curPage
  page.value.pageSize = pageSizes
  getClassifications(pageSizes, curPage)
}

function getClassifications(pageSize, currPage) {
  ClassificationService.getClassifications(pageSize, currPage, filterData.value.classification)
  .then(({data}) => {
    classificationData.value = data.data.data
    page.value.curPage = data.data.page.curPage
    page.value.pageSize = data.data.page.pageSize
  })
  ClassificationService.getClassificationCount(filterData.value.classification).then(({data}) => {
    page.value.totalRows = data.data
  })
}

function handleListAttributes(row) {
  selectedClassificationName.value = row.name
  ClassificationService.getRelevantAttributes(row.id).then(({data}) => {
    relevantAttributes.value = data.data.parentAttrs.concat(data.data.selfAttrs)
  })
}

function addClassification() {
  addClassificationFormVisible.value = true
}

function classificationFormCancel() {
  addClassificationFormVisible.value = false
  editClassificationFormVisible.value = false
  classificationForm.value = {
    businessCode: '',
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: ''
  }
}

function addClassificationSubmit() {
  classificationFormRef.value.validate((valid) => {
    if (valid) {
      ClassificationService.createClassification(classificationForm.value).then(({data}) => {
        classificationFormCancel()
        if (data.code === 200) {
          ElMessage({
            message: '新增成功',
            type: 'success'
          })
          getClassifications(page.value.pageSize, page.value.curPage)
        } else {
          ElMessage({
            message: data.message,
            type: 'error'
          })
        }
      })
    } else {
      return false;
    }
  });
}

function handleDeleteClassification(row) {
  ClassificationService.deleteClassification(row.id).then(({data}) => {
    if (data.code === 200) {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      getClassifications(page.value.pageSize, page.value.curPage)
    } else {
      ElMessage({
        message: data.message,
        type: 'error'
      })
    }
  })
}

function handleEditClassification(row) {
  editClassificationFormVisible.value = true
  classificationForm.value = {
    id: row.id,
    businessCode: row.businessCode,
    name: row.name,
    nameEn: row.nameEn,
    description: row.description,
    descriptionEn: row.descriptionEn
  }
}

function editClassificationSubmit() {
  classificationFormRef.value.validate((valid) => {
    if (valid) {
      ClassificationService.updateClassification(classificationForm.value).then(({data}) => {
        classificationFormCancel()
        if (data.code === 200) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          getClassifications(page.value.pageSize, page.value.curPage)
        } else {
          ElMessage({
            message: data.message,
            type: 'error'
          })
        }
      })
    } else {
      return false;
    }
  });
}

onMounted(() => {
  getClassifications(10, 1)
})
</script>


<style lang="scss">
.classification-management {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;

  .classification-wrapper {
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

    .attribute-wrapper {
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