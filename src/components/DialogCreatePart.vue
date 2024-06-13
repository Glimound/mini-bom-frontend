<template>
  <el-dialog
    :title="props.type == 'add' ? '添加部件' : '修改部件'"
    v-model="state.visible"
    width="600px"
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本属性" name="1">
        <el-form :model="state.partData" label-width="120px">
          <el-form-item label="产品" prop="product" required>
            <el-input
              v-model="state.partData.product"
              placeholder="如笔记本电脑"
            ></el-input>
          </el-form-item>
          <el-form-item label="部件名称" prop="partName" required>
            <el-input
              v-model="state.partData.partName"
            ></el-input>
          </el-form-item>
          <el-form-item label="默认单位" prop="defaultUnit" required>
            <el-select v-model="state.partData.defaultUnit" placeholder="请选择">
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
            <el-select v-model="state.partData.source" placeholder="请选择来源">
                <!-- 制造/购买 -->
                <el-option label="制造" value="1"></el-option>
                <el-option label="购买" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装配模式" prop="assemblyMode" required>
            <el-select v-model="state.partData.assemblyMode" placeholder="请选择装配模式">
              <!--  装配part/零件part -->
                <el-option label="装配part" value="装配part"></el-option>
                <el-option label="零件part" value="零件part"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类" prop="classification">
            <el-input v-model="state.partData.classification"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="扩展属性" name="2">
        <el-form :model="state.partData" label-width="120px">
            <!-- todo: 分类代码应直接通过分类获取 -->
          <el-form-item label="分类代码" prop="classificationCode">
            <el-input
              v-model="state.partData.classificationCode"
              placeholder="请输入分类代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="state.partData.brand" placeholder="请输入品牌"></el-input>
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input v-model="state.partData.model" placeholder="请输入型号"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
//import axios from "@/utils/axios";
import { ElMessage } from "element-plus";

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function // 添加或修改完后，刷新列表页
});

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
    defaultUnit: "",
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