<template>
  <el-dialog
    :title="props.type == 'add' ? '添加部件' : '修改部件'"
    v-model="state.visible"
    width="700px"
  >
    <el-tabs v-model="activeTab" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="基本属性" name="basic">
        <el-collapse v-model="activeName">
          <el-collapse-item title="基本属性" name="1">
            <el-form :model="state.partData" label-width="120px">
              <el-form-item label="产品" prop="product" required>
                <el-input
                  v-model="state.partData.product"
                  placeholder="如笔记本电脑"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="部件名称" prop="partName" required>
                <el-input
                  v-model="state.partData.partName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="默认单位" prop="defaultUnit" required>
                <el-select
                  v-model="state.partData.defaultUnit"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="item in defaultUnitOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="来源" prop="source" required>
                <el-select
                  v-model="state.partData.source"
                  placeholder="请选择来源"
                  size="small"
                >
                  <!-- 制造/购买 -->
                  <el-option label="制造" value="1"></el-option>
                  <el-option label="购买" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="装配模式" prop="assemblyMode" required>
                <el-select
                  v-model="state.partData.assemblyMode"
                  placeholder="请选择装配模式"
                  size="small"
                >
                  <!--  装配part/零件part -->
                  <el-option label="装配part" value="装配part"></el-option>
                  <el-option label="零件part" value="零件part"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="classification">
                <el-input
                  v-model="state.partData.classification"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <!-- 此栏扩展属性用于创建部件 -->
          <el-collapse-item
            title="扩展属性"
            name="2"
            v-if="props.type == 'add'"
          >
            <el-form :model="state.partData" label-width="120px">
              <!-- 拓展属性应直接通过分类获取 -->
              <el-form-item label="分类代码" prop="classificationCode">
                <el-input
                  v-model="state.partData.classificationCode"
                  placeholder="请输入分类代码"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-input
                  v-model="state.partData.brand"
                  placeholder="请输入品牌"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="型号" prop="model">
                <el-input
                  v-model="state.partData.model"
                  placeholder="请输入型号"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <!-- 此栏扩展属性用于编辑部件 -->
          <el-collapse-item
            title="扩展属性"
            name="3"
            v-if="props.type !== 'add'"
          >
            <el-form :model="state.partData" label-width="120px">
              <!-- 小类代码，PART类型，适用产品说明，对外名称，对外英文名称 -->
              <el-form-item label="小类代码" prop="smallClassCode">
                <el-input
                  v-model="state.partData.smallClassCode"
                  placeholder="请输入小类代码"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="PART类型" prop="partType" required>
                <el-input
                  v-model="state.partData.partType"
                  placeholder="请输入PART类型"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="适用产品说明"
                prop="productDescription"
                required
              >
                <el-input
                  v-model="state.partData.productDescription"
                  placeholder="请输入适用产品说明"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="对外名称" prop="externalName" required>
                <el-input
                  v-model="state.partData.externalName"
                  placeholder="请输入对外名称"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="对外英文名称"
                prop="externalEnglishName"
                required
              >
                <el-input
                  v-model="state.partData.externalEnglishName"
                  placeholder="请输入对外英文名称"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="BOM清单" name="bom" v-if="props.type === 'add'">
        <div class="bom-management">
          <el-button :icon="Plus" @click="handleAddSubItem" size="small"
            >新增子项</el-button>
          <el-button :icon="Position" @click="searchBOMLists" size="small"
            >查看BOM清单</el-button>
          <el-button :icon="Position" @click="searchParent" size="small"
          >查看父项</el-button>
          <el-table :data="bomData" style="width: 100%; margin-top: 20px" title="子项">
            <el-table-column
              type="index"
              width="30"
            ></el-table-column>
            <el-table-column
              prop="code"
              label="编码"
              width="50"
            ></el-table-column>
            <el-table-column prop="name" label="名称" width="150"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="positionId" label ="位号"></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  :icon="EditPen"
                  @click="handleEditItem(row)"
                  v-if="!row.isParent"
                >
                  修改
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDeleteItem(row)"
                  v-if="!row.isParent"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 模态框用于新增或修改BOM子项 -->
          <el-dialog
            title="BOM子项"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleCloseDialog"
          >
            <el-form :model="bomItemForm" label-width="100px">
              <el-form-item label="位号">
                <el-input v-model="bomItemForm.partNumber"></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="bomItemForm.name"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input
                  v-model.number="bomItemForm.quantity"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitItem"
                  >确定</el-button
                >
              </span>
            </template>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="版本管理" name="version" v-if="props.type === 'edit'">
        <el-form :model="state.partData" label-width="120px">
          <el-form-item label="版本" prop="version">
            <el-input
              v-model="state.partData.version"
              placeholder="请输入版本"
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitPartForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {Plus,Position} from "@element-plus/icons-vue";

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function, // 添加或修改完后，刷新列表页
});

//默认打开后标签页为基本属性
const activeTab = ref("basic");
//默认显示 基本属性标签页 下的 基本属性面板
const activeName = ref(["1"]);
//默认单位的枚举值
const defaultUnitOptions = [
  {
    value: "PCS",
    label: "PCS",
  },
  {
    value: "SITE",
    label: "SITE",
  },
  {
    value: "SET",
    label: "SET",
  },
  {
    value: "M",
    label: "M",
  },
  {
    value: "EACH",
    label: "EACH",
  },
  {
    value: "HOP",
    label: "HOP",
  },
  {
    value: "M*M",
    label: "M*M",
  },
  {
    value: "TRP",
    label: "TRP",
  },
  {
    value: "MON",
    label: "MON",
  },
  {
    value: "KG",
    label: "KG",
  },
];

const formRef = ref(null);
const route = useRoute();
const state = reactive({
  visible: false,
  partData: {
    product: "",
    partName: "",
    defaultUnit: "PCS",
    source: "",
    assemblyMode: "",
    classification: "",
    classificationCode: "",
    brand: "",
    model: "",
  },
});

// 开启弹窗 todo:确定接口后再完成
const open = (id) => {
  state.visible = true;
  if (id) {
    state.id = id;
    // 如果是有 id 传入，证明是修改模式
    getDetail(id);
  } else {
  }
};
/*
// todo:确定接口后再完成
// 获取详情
const getDetail = (id) => {
  axios.get(`/categories/${id}`).then((res) => {
    state.ruleForm = {
      name: res.categoryName,
      rank: res.categoryRank,
    };
    state.parentId = res.parentId;
    state.categoryLevel = res.categoryLevel;
  });
};
// 关闭弹窗
const close = () => {
  state.visible = false;
};


const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (props.type == "add") {
        // 添加方法
        axios
          .post("/categories", {
            categoryLevel: state.categoryLevel,
            parentId: state.parentId,
            categoryName: state.ruleForm.name,
            categoryRank: state.ruleForm.rank,
          })
          .then(() => {
            ElMessage.success("添加成功");
            state.visible = false;
            // 接口回调之后，运行重新获取列表方法 reload
            if (props.reload) props.reload();
          });
      } else {
        // 修改方法
        axios
          .put("/categories", {
            categoryId: state.id,
            categoryLevel: state.categoryLevel,
            parentId: state.categoryLevel,
            categoryName: state.ruleForm.name,
            categoryRank: state.ruleForm.rank,
          })
          .then(() => {
            ElMessage.success("修改成功");
            state.visible = false;
            // 接口回调之后，运行重新获取列表方法 reload
            if (props.reload) props.reload();
          });
      }
    }
  });
};*/
defineExpose({ open, close });
</script>