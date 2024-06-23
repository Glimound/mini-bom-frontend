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
            <el-popconfirm confirm-button-text="是"
                           cancel-button-text="否"
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
            <el-table :data="relevantSelfAttributes">
              <el-table-column prop="name" label="属性中文名称"/>
              <el-table-column prop="nameEn" label="属性英文名称"/>
              <el-table-column prop="description" label="属性中文描述"/>
              <el-table-column prop="descriptionEn" label="属性英文描述"/>
              <el-table-column prop="type" label="数据类型"/>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="labelTextParent">
          <div class="attribute-wrapper">
            <el-table :data="relevantParentAttributes">
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

  <el-dialog v-model="addClassificationFormVisible" title="新增分类" style="padding: 35px;" :show-close="false" :fullscreen="true">
    <el-form :model="classificationForm" :rules="rules" ref="classificationFormRef" label-width="100px" style="padding: 5px 10px 0px 10px;">
      <div class="form-row">
        <div class="form-column">
          <el-form-item label="分类码" prop="businessCode">
            <el-input v-model="classificationForm.businessCode"/>
          </el-form-item>
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="classificationForm.name"/>
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="classificationForm.description" type="textarea"/>
          </el-form-item>
          <el-form-item label="属性状态" prop="disableFlag">
            <el-radio-group v-model="classificationForm.disableFlag">
              <el-radio :value="false">有效</el-radio>
              <el-radio :value="true">无效</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="form-column">
          <el-form-item label="分类父节点" prop="parentNodeId">
            <el-select
              v-model="classificationForm.parentNodeId"
              filterable
              remote
              placeholder="输入分类关键词以进行搜索"
              :remote-method="searchClassifications"
              :loading="searchClassificationsLoading"
              @change="loadParentAttributes"
            >
              <el-option
                v-for="item in searchClassificationsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="classificationForm.nameEn"/>
          </el-form-item>
          <el-form-item label="英文描述" prop="descriptionEn">
            <el-input v-model="classificationForm.descriptionEn" type="textarea"/>
          </el-form-item>
        </div>
      </div>
      <el-divider class="divider"/>
      <div class="edit-attributes-wrapper">
        <div>
          <p>属性信息</p>
          <el-divider direction="vertical" />
          <el-button type="primary" @click="editingRelevantAttributes=true">新增</el-button>
          <span v-if="editingRelevantAttributes">
            <el-select
              v-model="searchAttributesInput"
              filterable
              remote
              placeholder="输入属性关键词以进行搜索"
              :remote-method="searchAttributes"
              :loading="searchAttributesLoading"
              style="width: 300px; margin: 0px 10px;"
            >
              <el-option
                v-for="item in searchAttributesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button @click="addRelevantAttributes">确认</el-button>
          </span>
          <el-divider direction="vertical" />
          <el-button @click="deleteRevelantAttributes">删除</el-button>
        </div>
      </div>
    </el-form>
    <el-table
      :data="editRelevantAttributesData"
      :row-class-name="tableRowClassName"
      @selection-change="attributeSelectionChange"
      ref="editingAttributesTableRef"
    >
      <el-table-column type="selection" :selectable="attributeSelectable"/>
      <el-table-column prop="name" label="属性中文名称"/>
      <el-table-column prop="nameEn" label="属性英文名称"/>
      <el-table-column prop="description" label="属性中文描述"/>
      <el-table-column prop="descriptionEn" label="属性英文描述"/>
      <el-table-column prop="type" label="数据类型"/>
      <el-table-column prop="stateDesc" label="说明"/>
    </el-table>
    <template #footer>
      <div class="dialog-footer" style="padding: 5px 10px;">
        <el-button @click="classificationFormCancel">取消</el-button>
        <el-button type="primary" @click="addClassificationSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="editClassificationFormVisible" title="修改分类" style="padding: 35px;" :show-close="false" :fullscreen="true">
    <el-form :model="classificationForm" :rules="rules" ref="classificationFormRef" label-width="100px" style="padding: 5px 10px 0px 10px;">
      <div class="form-row">
        <div class="form-column">
          <el-form-item label="分类码" prop="businessCode">
            <el-input v-model="classificationForm.businessCode" disabled/>
          </el-form-item>
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="classificationForm.name"/>
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="classificationForm.description" type="textarea"/>
          </el-form-item>
          
        </div>
        <div class="form-column">
          <el-form-item label="属性状态" prop="disableFlag">
            <el-radio-group v-model="classificationForm.disableFlag">
              <el-radio :value="false">有效</el-radio>
              <el-radio :value="true">无效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="classificationForm.nameEn"/>
          </el-form-item>
          <el-form-item label="英文描述" prop="descriptionEn">
            <el-input v-model="classificationForm.descriptionEn" type="textarea"/>
          </el-form-item>
        </div>
      </div>
      <el-divider class="divider"/>
      <div class="edit-attributes-wrapper">
        <div>
          <p>属性信息</p>
          <el-divider direction="vertical" />
          <el-button type="primary" @click="editingRelevantAttributes=true">新增</el-button>
          <span v-if="editingRelevantAttributes">
            <el-select
              v-model="searchAttributesInput"
              filterable
              remote
              placeholder="输入属性关键词以进行搜索"
              :remote-method="searchAttributes"
              :loading="searchAttributesLoading"
              style="width: 300px; margin: 0px 10px;"
            >
              <el-option
                v-for="item in searchAttributesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button @click="addRelevantAttributes">确认</el-button>
          </span>
          <el-divider direction="vertical" />
          <el-button @click="deleteRevelantAttributes">删除</el-button>
        </div>
      </div>
    </el-form>
    <el-table
      :data="editRelevantAttributesData"
      :row-class-name="tableRowClassName"
      @selection-change="attributeSelectionChange"
      ref="editingAttributesTableRef"
    >
      <el-table-column type="selection" :selectable="attributeSelectable" width="50"/>
      <el-table-column prop="name" label="属性中文名称"/>
      <el-table-column prop="nameEn" label="属性英文名称"/>
      <el-table-column prop="description" label="属性中文描述"/>
      <el-table-column prop="descriptionEn" label="属性英文描述"/>
      <el-table-column prop="type" label="数据类型"/>
      <el-table-column prop="stateDesc" label="说明"/>
    </el-table>
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
import { AttributeService, ClassificationService } from '@/services/apiServices'
import ThePagination from '@/components/ThePagination.vue'
import { ElMessage } from 'element-plus';

const classificationData = ref([])
const filterData = ref({
  classification: ''
})
const page = ref({})
const relevantSelfAttributes = ref([])
const relevantParentAttributes = ref([])
const selectedClassificationName = ref('')
const addClassificationFormVisible = ref(false)
const editClassificationFormVisible = ref(false)
const classificationForm = ref({
  businessCode: '',
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  disableFlag: false,
  parentNodeId: ''
})
const classificationFormRef = ref(null)
const editRelevantAttributesData = ref([])
const deleteAttrIds = ref([])
const addAttrIds = ref([])
const editingAttributesTableRef = ref(null)
const editingRelevantAttributes = ref(false)
const selectedAttributes = ref([])
const searchAttributesInput = ref('')
const searchAttributesLoading = ref(false)
const searchAttributesOptions = ref([])
const searchClassificationsLoading = ref(false)
const searchClassificationsOptions = ref([])
const rules = {
  businessCode: [{ required: true, message: '分类码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '中文名称不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '中文描述不能为空', trigger: 'blur' }],
  nameEn: [{ required: true, message: '英文名称不能为空', trigger: 'blur' }],
  descriptionEn: [{ required: true, message: '英文描述不能为空', trigger: 'blur' }],
  disableFlag: [{ required: true, message: '属性状态不能为空', trigger: 'change' }]
};

const labelText = computed(() => {
  return !!selectedClassificationName.value ? `分类 <${selectedClassificationName.value}> 的属性信息` : '分类属性信息'
})

const labelTextParent = computed(() => {
  return !!selectedClassificationName.value ? `分类 <${selectedClassificationName.value}> 从父节点继承的属性信息` : '分类从父节点继承的属性信息'
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
    relevantSelfAttributes.value = data.data.selfAttrs
    relevantParentAttributes.value = data.data.parentAttrs
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
    descriptionEn: '',
    disableFlag: false,
    parentNodeId: ''
  }
  editRelevantAttributesData.value = []
  deleteAttrIds.value = []
  addAttrIds.value = []
  editingRelevantAttributes.value = false
}

function addClassificationSubmit() {
  classificationFormRef.value.validate((valid) => {
    if (valid) {
      let newClassificationForm = classificationForm.value
      newClassificationForm.attrIds = addAttrIds.value
      ClassificationService.createClassification(newClassificationForm).then(({data}) => {
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
    descriptionEn: row.descriptionEn,
    disableFlag: row.disableFlag,
    parentNodeId: ''
  }
  ClassificationService.getRelevantAttributes(row.id).then(({data}) => {
    let arr = []
    arr = arr.concat(data.data.parentAttrs)
    arr.forEach(item => {
      item.state = 'immutable',
      item.stateDesc = '<继承自父节点>'
    });
    arr = arr.concat(data.data.selfAttrs)
    editRelevantAttributesData.value = arr
  })
    
}

function editClassificationSubmit() {
  classificationFormRef.value.validate((valid) => {
    if (valid) {
      let newClassificationForm = classificationForm.value
      delete newClassificationForm.parentNodeId
      delete newClassificationForm.businessCode
      newClassificationForm.addAttrIds = addAttrIds.value
      newClassificationForm.deleteAttrIds = deleteAttrIds.value
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

function searchAttributes(query) {
  if (query !== '') {
    searchAttributesLoading.value = true
    // get attributes by id
    AttributeService.getAttributes(999, 1, query).then(({data}) => {
      let attributes = data.data.data
      // remove attributes in current classifications
      attributes = attributes.filter((item) => {
        return !editRelevantAttributesData.value.some((attr) => {
          return attr.id === item.id
        })
      })
      // remove attributes in already added attributes
      attributes = attributes.filter((item) => {
        return !addAttrIds.value.includes(item.id)
      })
      searchAttributesOptions.value = attributes.map((item) => {
        return {
          value: item.id,
          label: `${item.name} - ${item.nameEn}`,
          data: {
            id: item.id,
            name: item.name,
            nameEn: item.nameEn,
            description: item.description,
            descriptionEn: item.descriptionEn,
            type: item.type
          }
        }
      })
      searchAttributesLoading.value = false
    })
  } else {
    searchAttributesOptions.value = []
  }
}

function searchClassifications(query) {
  if (query !== '') {
    searchClassificationsLoading.value = true
    // get classifictions by id
    ClassificationService.getClassifications(999, 1, query).then(({data}) => {
      searchClassificationsOptions.value = data.data.data.map((item) => {
        return {
          value: item.id,
          label: `${item.name} - ${item.nameEn}`
        }
      })
      searchClassificationsLoading.value = false
    })
  } else {
    searchClassificationsOptions.value = []
  }
}

function loadParentAttributes() {
  ClassificationService.getRelevantAttributes(classificationForm.value.parentNodeId).then(({data}) => {
    let arr = []
    arr = arr.concat(data.data.parentAttrs)
    arr = arr.concat(data.data.selfAttrs)
    arr.forEach(item => {
      item.state = 'immutable',
      item.stateDesc = '<继承自父节点>'
    });
    editRelevantAttributesData.value = arr
  })
}

function addRelevantAttributes() {
  let selectedAttr = searchAttributesOptions.value.find((item) => {
    return item.value === searchAttributesInput.value
  })
  if (selectedAttr) {
    selectedAttr.data.state = 'add'
    selectedAttr.data.stateDesc = '<新增属性>'
    editRelevantAttributesData.value.push(selectedAttr.data)
    addAttrIds.value.push(selectedAttr.data.id)
    searchAttributesInput.value = ''
    searchAttributesOptions.value = []
    editingRelevantAttributes.value = false
  }
}

function deleteRevelantAttributes() {
  selectedAttributes.value.forEach(item => {
    if (addAttrIds.value.includes(item.id)) {
      addAttrIds.value = addAttrIds.value.filter((id) => {
        return id !== item.id
      })
      editRelevantAttributesData.value = editRelevantAttributesData.value.filter((attr) => {
        return attr.id !== item.id
      })
    } else if (!deleteAttrIds.value.includes(item.id)) {
      item.state = 'delete'
      item.stateDesc = '<删除属性>'
      deleteAttrIds.value.push(item.id)
    }
  })
  selectedAttributes.value = []
  editingAttributesTableRef.value.clearSelection()
}

function attributeSelectionChange(value) {
  selectedAttributes.value = value
}

function attributeSelectable(row) {
  return row.state !== 'immutable'
}

function tableRowClassName({row}) {
  if (row.state === 'immutable') {
    return 'immutable-row'
  } else if (row.state === 'add') {
    return 'add-row'
  } else if (row.state === 'delete') {
    return 'delete-row'
  } else {
    return ''
  }
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

.el-dialog {
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
  }

  .form-column {
    flex: 1;
    min-width: 300px;
  }

  .divider {
    margin: 5px 0px 5px 0px;
  }

  .edit-attributes-wrapper {
    padding: 5px 0px;
    display: flex;
    align-items: center;

    p {
      display: inline;
      font-size: 16px;
      color: #303133;
    }

    .el-divider {
      height: 30px;
      margin: 0px 10px;
    }
  }

  .el-table {
    padding: 0px 20px;
    width: 100%;
    flex-grow: 1;
    
    .add-row {
      --el-table-tr-bg-color: #E8F5E9;
    }

    .delete-row {
      --el-table-tr-bg-color: #FDEDEC;
    }

    .immutable-row {
      --el-table-tr-bg-color: #F5F5F5;
    }
  }
}

</style>