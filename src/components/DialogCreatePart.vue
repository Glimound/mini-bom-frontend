<template>
  <el-dialog
    :title="props.type == 'add' ? '添加部件' : '修改部件'"
    v-model="visible"
    width="700px"
  >
    <el-tabs
      v-model="activeTab"
      type="border-card"
      @tab-change="handleChangeTab"
    >
      <el-tab-pane label="基本属性" name="basic">
        <el-collapse v-model="activeName">
          <el-collapse-item title="基本属性" name="1">
            <el-form :model="partData" label-width="120px" ref="partFormRef">
              <el-form-item label="产品">
                <el-text>笔记本电脑</el-text>
              </el-form-item>
              <el-form-item label="部件名称" prop="name" required>
                <el-input v-model="partData.name" size="small"></el-input>
              </el-form-item>
              <el-form-item label="默认单位" prop="defaultUnit" required>
                <el-select
                  v-model="partData.defaultUnit"
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
                  v-model="partData.source"
                  placeholder="请选择来源"
                  size="small"
                >
                  <!-- Make|Buy|Buy_SingleSource -->
                  <el-option label="Make" value="Make"></el-option>
                  <el-option label="Buy" value="Buy"></el-option>
                  <el-option
                    label="Buy_SingleSource"
                    value="Buy_SingleSource"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="装配模式" prop="partType" required>
                <el-select
                  v-model="partData.partType"
                  placeholder="请选择装配模式"
                  size="small"
                >
                  <!--  Separable|Inseparable|Part -->
                  <el-option label="Separable" value="Separable"></el-option>
                  <el-option
                    label="Inseparable"
                    value="Inseparable"
                  ></el-option>
                  <el-option label="Part" value="Part"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="classificationId" required>
                <el-input
                  v-model="partData.classificationId"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="扩展属性" name="2">
            <el-form :model="partData.attrMap" label-width="120px">
              <!-- 动态生成的表单项 -->
              <el-form-item
                v-for="item in exAttributes"
                :key="item.id"
                :label="item.name"
                :prop="item.nameEn"
                required
              >
                <el-input
                  v-model="partData.attrMap[item.nameEn]"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="BOM清单" name="bom" v-if="props.type === 'edit'">
        <div class="bom-management">
          <el-button :icon="Plus" @click="handleAddSubItem" size="small"
          >新增子项
          </el-button
          >
          <el-button :icon="Position" @click="searchBOMLists" size="small"
          >查看BOM清单
          </el-button
          >
          <el-button :icon="Position" @click="searchParent" size="small"
          >查看父项
          </el-button
          >
          <el-table
            :data="bomData"
            style="width: 100%; margin-top: 20px"
            title="子项"
          >
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column
              prop="code"
              label="编码"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="150"
            ></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="positionId" label="位号"></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  :icon="EditPen"
                  @click="handleEditSubitem(row)"
                >
                  修改
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDeleteSubitem(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 模态框用于新增或修改BOM子项 -->
          <el-dialog
            title="添加子项"
            v-model="addSubitemVisible"
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
        <el-table
          class="partVersion"
          :data="partVersionList"
          style="width: 100%"
        >
          <!-- 序号，编码（点击编码可以查看详细信息），版本号，名称，操作（删除）-->
          <el-table-column
            type="index"
            width="30"
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="id"
            label="编码"
            width="250"
            fixed
          ></el-table-column>
          <el-table-column
            prop="versionId"
            label="版本号"
            width="90"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="120"
          ></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                :icon="View"
                @click="handleGetVersion(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
                @click="handleDeleteVersion(scope.row)"
                v-if="scope.$index === 0"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="版本详情"
          v-model="PartVersionDetailVisible"
          width="30%"
        >
          <el-form :model="partVersionDetail" label-width="70px">
            <el-form-item label="id">
              <el-text>{{ partVersionDetail.id }}</el-text>
            </el-form-item>
            <el-form-item label="名称">
              <el-text>{{ partVersionDetail.name }}</el-text>
            </el-form-item>
            <el-form-item label="装配模式">
              <el-text>{{ partVersionDetail.mode }}</el-text>
            </el-form-item>
            <el-form-item label="分类">
              <el-text>{{ partVersionDetail.typeId }}</el-text>
            </el-form-item>
            <el-form-item label="版本号">
              <el-text>{{ partVersionDetail.versionId }}</el-text>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitPartForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref, watch, onMounted} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {Plus, Position, View, Delete} from "@element-plus/icons-vue";
import {PartService, ClassificationService} from "@/services/apiServices";

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function, // 添加或修改完后，刷新列表页
});
//指向part表单的引用
const partFormRef = ref(null);
//默认打开后标签页为基本属性
const activeTab = ref("basic");

//切换标签页
function handleChangeTab(tab) {
  switch (tab) {
    case "basic":
      break;
    case "bom":
      break;
    case "version":
      getHistoryVersionList();
      break;
    default:
      break;
  }
}

//默认显示 基本属性标签页 下的 基本属性面板
const activeName = ref(["1"]);

/**
 *增加/删除Part

 */
//默认单位的枚举值
// Mm3|capacitance|resistance|Workload|Currency|
//Percent|Mil|ElectricalPotential|M|volume|Weight|Length|area|Kg|Mm2|Pcs|H|D|WW|WmK
const defaultUnitOptions = [
  {value: "Mm3", label: "Mm3"},
  {value: "capacitance", label: "capacitance"},
  {value: "resistance", label: "resistance"},
  {value: "Workload", label: "Workload"},
  {value: "Currency", label: "Currency"},
  {value: "Percent", label: "Percent"},
  {value: "Mil", label: "Mil"},
  {value: "ElectricalPotential", label: "ElectricalPotential"},
  {value: "M", label: "M"},
  {value: "volume", label: "volume"},
  {value: "Weight", label: "Weight"},
  {value: "Length", label: "Length"},
  {value: "area", label: "area"},
  {value: "Kg", label: "Kg"},
  {value: "Mm2", label: "Mm2"},
  {value: "Pcs", label: "Pcs"},
  {value: "H", label: "H"},
  {value: "D", label: "D"},
  {value: "WW", label: "WW"},
  {value: "WmK", label: "WmK"},
];

const route = useRoute();
//弹窗是否显示
const visible = ref(false);
//表单数据
const partData = ref({
  id: "",
  masterId: "",
  name: "",
  defaultUnit: "Pcs",
  source: "",
  partType: "",
  classificationId: "",
  versionId: "",
  attrMap: {},
});
//用于存储动态生成的表单项模板 扩展属性
const exAttributes = ref([]);

// 获取分类码对应的属性，并动态生成表单项
function fetchAttributes(classificationId) {
  // 如果处于编辑模式,则获取当前部件的属性
  if (props.type === "edit") {
    ClassificationService.getRelevantAttributes(classificationId)
      .then((res) => {
        if (classificationId === "") {
          return;
        }
        const {parentAttrs, selfAttrs} = res.data.data;
        const allAttrs = [...parentAttrs, ...selfAttrs];
        exAttributes.value = allAttrs.map((attr) => ({
          ...attr,
          value: partData.value.attrMap[attr.nameEn],
        }));
      })
      .catch((error) => {
        ElMessage.error("编辑错误" + error.message);
      });
  } else {
    ClassificationService.getRelevantAttributes(classificationId)
      .then((res) => {
        if (classificationId === "") {
          return;
        }
        const {parentAttrs, selfAttrs} = res.data.data;
        // 合并父类属性和自己的属性
        const allAttrs = [...parentAttrs, ...selfAttrs];
        // 动态生成表单项
        exAttributes.value = allAttrs.map((attr) => ({
          ...attr,
          value: "", // 初始化表单项的值为空字符串
        }));
        // 同步更新partData.attrMap
        /*
    reduce 函数接收一个累加器 acc（初始为空对象 {}）和当前元素 curr。
    对于 allAttrs 中的每个属性对象，reduce 函数设置累加器 acc 的一个新属性，
    其键为当前属性对象的 nameEn 属性值，值为空字符串 ''。
    这样，partData.attrMap 将包含与 allAttrs 中每个属性对应的键值对，
    键是属性的英文名称，值是空字符串，表示该属性的输入框初始值为空。
    */
        partData.value.attrMap = allAttrs.reduce((acc, curr) => {
          acc[curr.nameEn] = "";
          return acc;
        }, {});
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
  }
}

// 监听分类码的变化，重新获取属性并更新表单项
//{"att1": , "att2":,}
//["att1": ,"att2": ]
watch(
  () => partData.value.classificationId,
  (newclassificationId) => {
    fetchAttributes(newclassificationId);
  },
  {
    deep: true,
  }
);

// 开启弹窗
const open = (id) => {
  visible.value = true;
  if (id) {
    // 如果是有 id 传入，证明是修改模式
    getDetail(id);
  } else {
    // 如果没有 id 传入，证明是添加模式
    //重置表单数据
    partData.value = {
      id: "",
      masterId: "",
      name: "",
      defaultUnit: "Pcs",
      source: "",
      partType: "",
      classificationId: "",
      versionId: "",
      attrMap: {},
    };
  }
};

function getDetail(id) {
  PartService.getPartById(id).then((res) => {
    partData.value.id = res.data.data.id;
    partData.value.masterId = res.data.data.masterId;
    partData.value.name = res.data.data.name;
    partData.value.source = res.data.data.source;
    partData.value.versionId = res.data.data.versionId;
    partData.value.partType = res.data.data.mode;
    partData.value.classificationId = res.data.data.typeId;
    partData.value.attrMap = res.data.data.attrMap;
  });
}

// 关闭弹窗
const close = () => {
  visible.value = false;
  // 重置表单数据
  partData.value = {
    id: "",
    masterId: "",
    name: "",
    defaultUnit: "Pcs",
    source: "",
    partType: "",
    classificationId: "",
    versionId: "",
    attrMap: {},
  };
  exAttributes.value = [];
  partVersionList.value = [];
};

// 提交表单
function submitPartForm() {
  partFormRef.value.validate((valid) => {
    if (valid) {
      if (props.type === "add") {
        PartService.createPart(partData.value)
          .then((res) => {
            if (res.data.message === "ok") {
              ElMessage.success("添加成功");
              close();
              props.reload();
            } else {
              ElMessage.error("添加失败:" + res.data.message);
            }
          })
          .catch((error) => {
            ElMessage.error("外部失败:" + error.message);
          });
      } else {
        PartService.modifyPart(partData.value)
          .then((res) => {
            if (res.data.message === "ok") {
              ElMessage.success("修改成功");
              close();
              props.reload();
            } else {
              ElMessage.error("修改失败:" + res.data.message);
            }
          })
          .catch((error) => {
            ElMessage.error("外部失败:" + error.message);
          });
      }
    } else {
      return false;
    }
  });
}


/**
 * BOM清单相关

 */
//用于存储BOM清单数据
const bomData = ref([]);

function handleAddSubItem() {
}

/**
 * 版本管理相关
 */
//历史版本列表
const partVersionList = ref([]);
const partVersionDetail = ref({});
//版本详情弹窗是否显示
const PartVersionDetailVisible = ref(false);

//获取历史版本列表
function getHistoryVersionList() {
  PartService.getHistoryVersionList(partData.value.masterId)
    .then((res) => {
      partVersionList.value = res.data.data;
    })
    .catch((error) => {
      ElMessage.error("获取版本列表失败" + error.message);
    });
}

//查看某个历史版本详情
function handleGetVersion(row) {
  PartService.getPartVersionDetail(partData.value.masterId, row.versionId)
    .then((res) => {
      PartVersionDetailVisible.value = true;
      partVersionDetail.value = res.data.data;
    })
    .catch((error) => {
      ElMessage.error("获取版本详情失败: " + error.message);
    });
};

function handleDeleteVersion(row) {
  let version = row.versionId.split(".")[0];
  PartService.deletePartVersion(partData.value.masterId, version)
    .then((res) => {
      getHistoryVersionList();
      ElMessage.success("删除成功");
    })
    .catch((error) => {
      ElMessage.error("删除失败: " + error.message);
    });
}

defineExpose({open, close});

</script>

<style lang="scss">
</style>