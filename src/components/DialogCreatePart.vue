<template>
  <el-dialog
    :title="props.type == 'add' ? '添加部件' : '修改部件'"
    v-model="visible"
    width="800px"
    :before-close="closeDiaglog"
  >
    <el-tabs
      v-model="activeTab"
      type="border-card"
      @tab-change="handleChangeTab"
    >
      <el-tab-pane label="基本属性" name="basic" >
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
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeDiaglog">取 消</el-button>
            <el-button type="primary" @click="submitPartForm">提交</el-button>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="BOM清单" name="bom" v-if="props.type === 'edit'">
        <div class="bom-management">
          <el-button :icon="Plus" @click="handleAddSubItem" size="small">新增子项</el-button>
          <el-button :icon="Position" @click="searchBOMLists" size="small">查看BOM清单</el-button>
          <el-button :icon="Position" @click="searchParent" size="small">查看父项</el-button>
          <el-table
            :data="subitemsData"
            style="width: 100%; margin-top: 20px"
            title="子项"
          >
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column
              prop="subjectMasterId"
              label="编码"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="150"
            ></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="referenceDesignator" label="位号"></el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" :icon="EditPen" @click="handleEditSubitem(scope.row)"/>
                <el-popconfirm
                  title="确定删除该子项吗？"
                  confirm-button-text="Yes"
                  cancel-button-text="No"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  @confirm="handleDeleteSubitem(scope.row)"
                >
                  <template #reference>
                    <el-button type="danger" size="small" :icon="Delete"/>
                  </template>
              </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog :model ="editSubitemVisible" title="编辑子项" width="30%" before-close="handleCloseEditSubitem">
            <el-form :model="subitem" label-width="90px" inline>
              <el-form-item label="数量" prop="quantity">
                <el-input v-model="subitem.quantity" size="small"></el-input>
              </el-form-item>
              <el-form-item label="位号" prop="referenceDesignator">
                <el-input
                  v-model="subitem.referenceDesignator"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="editSubitemVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEditSubitem">提交</el-button>
              </span>
            </template>
          </el-dialog>
          <!-- 对话用于新增BOM子项 -->
          <el-dialog
            title="添加子项"
            v-model="addSubitemVisible"
            width="85%"
            :before-close="handleCloseAddSubitemDialog"
          >
            <div class="Bom-filter-box">
              <el-form :inline="true" :model="filterData">
                <el-radio-group class="query-radio" v-model="queryType">
                  <el-radio :label="1" @click="resetName">编码</el-radio>
                  <el-input
                    v-model="searchById"
                    size="small"
                    :disabled="queryType !== 1"
                    class="input-with-select"
                    style="width: 30%"
                    clearable
                  ></el-input>
                  <el-radio :label="2" @click="resetId">名称</el-radio>
                  <el-input
                    v-model="searchByName"
                    size="small"
                    :disabled="queryType !== 2"
                    class="input-with-select"
                    style="width: 30%"
                    placeholder="通过空格可输入多个关键词"
                    clearable
                  ></el-input>
                </el-radio-group>
                <el-button
                  type="primary"
                  @click="searchPartList"
                  :icon="Search"
                  size="small"
                  >查询</el-button
                >
              </el-form>
            </div>
            <el-divider />
            <div class="partTable">
              <el-table :data="partList" style="width: 100%" max-height="300">
                <el-table-column type="index" width="21" fixed="left" />
                <el-table-column prop="id" label="编码" width="190" fixed />
                <el-table-column prop="name" label="名称" width="120" fixed />
                <el-table-column prop="versionId" label="版本号" width="50" />
                <el-table-column prop="mode" label="装配模式" width="150" />
                <el-table-column prop="typeId" label="分类码" width="200" />
                <el-table-column prop="source" label="来源" width="150" />
                <el-table-column fixed="right" label="操作" width="120">
                  <template #default="scope">
                    <el-popconfirm
                      title="确定添加该子项吗？"
                      confirm-button-text="Yes"
                      cancel-button-text="No"
                      :icon="InfoFilled"
                      icon-color="#626AEF"
                      @confirm="comfirmAddSubitem(scope.row)"
                    >
                      <template #reference>
                        <el-button type="primary" size="small" :icon="Plus"
                          >添加</el-button
                        >
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-divider />
            <div class="addCounts">
              <el-form :model="bomLinkData" inline ref="bomLinkDataRef">
                <el-form-item label="数量" prop="quantity">
                  <el-input
                    v-model="bomLinkData.quantity"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-form-item label="位号" prop="referenceDesignator">
                  <el-input
                    v-model="bomLinkData.referenceDesignator"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <el-dialog
            title="查看父项"
            v-model="parentPartVisible"
            width="50%"
            :before-close="handleCloseParentPartDialog"
          >
            <el-table
              :data="parentPartList"
              style="width: 100%"
              max-height="300"
            >
              <el-table-column type="index" width="30" fixed="left" />
              <el-table-column prop="id" label="编码" width="250" fixed />
              <el-table-column prop="versionId" label="版本号" width="90" />
              <el-table-column prop="name" label="名称" width="120" />
              <el-table-column prop="mode" label="装配模式" width="120" />
            </el-table>
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
          <el-table-column type="index" width="30" fixed="left" />
          <el-table-column prop="id" label="编码" width="250" fixed />
          <el-table-column prop="versionId" label="版本号" width="90" />
          <el-table-column prop="name" label="名称" width="120" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                :icon="View"
                @click="handleGetVersion(scope.row)"
              />
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
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
  Plus,
  Position,
  View,
  EditPen,
  Delete,
  Search,
  InfoFilled
} from "@element-plus/icons-vue";
import {
  PartService,
  ClassificationService,
  BOMService,
} from "@/services/apiServices";

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function, // 添加或修改完后，刷新列表页
});
//关闭整个对话框，先重置所有数据,同时标签页指向"基本属性"
function closeDiaglog(done) {
  visible.value = false;
  // 重置属性表单数据
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
  partFormRef.value.resetFields();
  exAttributes.value = [];
  // 重置BOM清单数据
  subitemsData.value = [];
  // 重置版本管理数据
  partVersionList.value = [];
  // 标签页指向"基本属性"
  activeTab.value = "basic";
  activeName.value = ["1"];
  done();
}


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
      //选择BOM清单时，若子项列表为空，则渲染子项列表
      if(subitemsData.value.length === 0){
        fetchSubitems();
      }
      break;
    case "version":
      //选择版本管理时，若历史版本列表为空，渲染历史版本列表
      if(partVersionList.value.length === 0){
        getHistoryVersionList();
      }
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
        if (classificationId === ""|| res.data.data.parentAttrs.length === 0 ||
           res.data.data.selfAttrs.length === 0
        ) {
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
        if (classificationId === "" || res.data.data.parentAttrs.length === 0 ||
          res.data.data.selfAttrs.length === 0) {
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



// 提交表单
function submitPartForm() {
  partFormRef.value.validate((valid) => {
    if (valid) {
      if (props.type === "add") {
        PartService.createPart(partData.value)
          .then((res) => {
            if (res.data.message === "ok") {
              ElMessage.success("添加成功");
              closeDiaglog();
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
              closeDiaglog();
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
//用于新增子项：查询Part列表
const partList = ref([]);
//用于存储该Part的子项列表
const subitemsData = ref([]);
//子项列表下的单个子项,不是subitemsData的元素,而是其中元素的子集，用于修改数量和位号
const subitem = {
  bomLinkId: "",
  buoId: "",
  quantity: "",
  referenceDesignator: "",
};
//新增子项、编辑子项的弹窗是否显示 (两个弹窗不同！)
const addSubitemVisible = ref(false);
const editSubitemVisible = ref(false);
//新增子项时的查询方式，默认为根据名称查询，查全量
const queryType = ref(2);
const searchById = ref("");
const searchByName = ref("");
//要添加的子项与父项的关联数据，sourceId:父项id targetMasterId:子项masterid
const bomLinkData = ref({
  quantity: null,
  sourceId: "",
  targetMasterId: "",
  referenceDesignator: "",
});
//要添加的子项与父项的关联数据的引用
const bomLinkDataRef = ref(null);
//父项列表的弹窗是否显示
const parentPartVisible = ref(false);
//该Part的父项列表
const parentPartList = ref([]);
//切换查询方式时，重置输入框
const resetName = () => {
  searchByName.value = "";
};
const resetId = () => {
  searchById.value = "";
};
//刷新子项列表
function fetchSubitems() {
  BOMService.getSubitems(partData.value.id)
    .then((res) => {
      subitemsData.value = res.data.data;
    })
    .catch((error) => {
      ElMessage.error("获取子项失败" + error.message);
    });
}
//编辑子项
function handleEditSubitem(row){
  //将选中的子项数据赋值给subitem
  subitem.value.bomLinkId = row.bomLinkId;
  subitem.value.buoId = row.buoId;
  subitem.value.quantity = row.quantity;
  subitem.value.referenceDesignator = row.referenceDesignator;
  //打开编辑子项的对话框
  editSubitemVisible.value = true;
}
//删除子项
function handleDeleteSubitem(row){
  BOMService.deleteBom(row.bomLinkId, row.buoId)
    .then((res) => {
      if(res.data.message === "ok"){
        ElMessage.success("删除成功");
        fetchSubitems();
      }else{
        ElMessage.error("删除失败:" + res.data.message);
      }
    })
}
//添加子项 --提交表单
function comfirmAddSubitem(row) {
  //将选中的Part数据添加到关联数据中
  bomLinkData.value.sourceId = partData.value.id;
  bomLinkData.value.targetMasterId = row.masterId;
  //提交关联数据
  BOMService.createBom(bomLinkData.value)
    .then((res) => {
      if (res.data.message === "ok") {
        ElMessage.success("添加成功");
        //添加成功后重置bombLinkData的数据，同时重新加载Part列表
        bomLinkData.value = {
          quantity: null,
          sourceId: "",
          targetMasterId: "",
          referenceDesignator: "",
        };
        searchPartList();
      } else {
        ElMessage.error("添加失败:" + res.data.message);
      }
    })
    .catch((error) => {
      ElMessage.error("外部错误:" + error.message);
    });
}
//关闭对话框时，重置表单数据,同时刷新该Part的子项列表
function handleCloseAddSubitemDialog(done) {
  partList.value = [];
  queryType.value = 2;
  searchById.value = "";
  searchByName.value = "";
  addSubitemVisible.value = false;
  bomLinkDataRef.value.resetFields();

  done();
}
//查询Part列表
function searchPartList() {
  if (queryType.value === 1) {
    PartService.getPartByIdForBom(searchById.value).then((res) => {
      if (res.data.data === null) {
        partList.value = [];
      } else {
        partList.value = [res.data.data];
      }
    });
  } else {
    PartService.getPartsForBom(partData.value.id,searchByName.value).then((res) => {
      partList.value = res.data.data.data;
    });
  }
}
//点击“新增子项后”，展开对话框并查询Part列表
function handleAddSubItem() {
  addSubitemVisible.value = true;
  searchPartList();
}
//查看BOM清单 ---------todo
function searchBOMLists() {}

//查看父项
function searchParent() {
  BOMService.getParents(partData.value.masterId)
    .then((res) => {
      parentPartList.value = res.data.data;
      parentPartVisible.value = true;
    })
    .catch((error) => {
      ElMessage.error("获取父项失败" + error.message);
    });
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
//向外暴露的方法
defineExpose({ open, closeDiaglog });
</script>

<style lang="scss">
</style>