import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import pinia from "@/stores";
import { getJwtToken } from "@/services/jwtServices";

const controller = new AbortController()
const router = useRouter()
const authStore = useAuthStore(pinia)

const axiosClient = axios.create({
  baseURL: 'http://47.120.31.100:14532/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.request.use((config) => {
  if (authStore.authenticated) {
    config.headers.Authorization = `${getJwtToken()}`
  } else if (!config.url.startsWith('/user/')) {
    config.signal = controller.signal
    controller.abort()
    router.push('/login')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  if (response.data.code === 50000) {
    response.signal = controller.signal
    controller.abort()
    authStore.logout()
    router.push('/login')
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export const ApiService = {
  get(resource) {
    return axiosClient.get(resource)
  },
  query(resource, params) {
    return axiosClient.get(resource, params)
  },
  post(resource, data) {
    return axiosClient.post(resource, data)
  },
  put(resource, data) {
    return axiosClient.put(resource, data)
  }
}

export const UserService = {
  getCodeRegister(params) {
    return ApiService.post('/user/register', params)
  },
  register(params) {
    return ApiService.post('/user/register_verify', params)
  },
  getCodeLogin(params) {
    return ApiService.post('/user/login', params)
  },
  login(params) {
    return ApiService.post('/user/login_verify', params)
  },
}

export const AttributeService = {
  getAttributes(pageSize, currPage, keyword) {
    return ApiService.query(`/attr/query/${pageSize}/${currPage}`, {
      params: {
        keyword: keyword
      }
    })
  },
  getAttributeCount(keyword) {
    return ApiService.query(`/attr/count`, {
      params: {
        keyword: keyword
      }
    })
  },
  getRelevantClassifications(id) {
    return ApiService.query(`/attr/related_type/999/1`, {
      params: {
        id: id
      }
    })
  },
  createAttribute(body) {
    return ApiService.post('/attr/create', body)
  },
  deleteAttribute(id) {
    return ApiService.query('/attr/del', {
      params: {
        id: id
      }
    })
  },
  updateAttribute(body) {
    return ApiService.post('/attr/modify', body)
  }
}

export const ClassificationService = {
  getClassifications(pageSize, currPage, keyword) {
    return ApiService.query(`/type/query/${pageSize}/${currPage}`, {
      params: {
        keyword: keyword
      }
    })
  },
  getClassificationCount(keyword) {
    return ApiService.query('/type/count', {
      params: {
        keyword: keyword
      }
    })
  },
  getRelevantAttributes(id) {
    return ApiService.query('/type/attr', {
      params: {
        id: id
      }
    })
  },
  createClassification(body) {
    return ApiService.post('/type/create', body)
  },
  deleteClassification(id) {
    return ApiService.query('/type/delete', {
      params: {
        id: id
      }
    })
  },
  updateClassification(body) {
    return ApiService.post('/type/update', body)
  },
  getTreeRoots() {
    return ApiService.get('/type/tree/roots')
  },
  getNodeChildren(id) {
    return ApiService.query('/type/tree/children', {
      params: {
        id: id
      }
    })
  }
}

export const PartService = {
  //根据关键词查询Part列表，关键词为""时查询所有Part
  getParts(keyword,pageSize,currPage){
    return ApiService.query(`/part/find/keyword/${pageSize}/${currPage}`,{
      params:{
        keyword:keyword
      }
    })
  },
  //根据关键词查询Part列表(得到的是不在此Part并查集中的Part，防止父子项嵌套),用于新增子项
  getPartsForBom(id,keyword){
    return ApiService.query(`/part/find/not_related`,{
      params:{
        id:id,
        keyword:keyword
      }
    })
  },
  //根据Part ID查询Part
  getPartById(id){
    return ApiService.query('/part/find/id',{
      params:{
        id:id
      }
    })
  },
  //根据Part ID查询Part,用于新增子项
  getPartByIdForBom(id){
    return ApiService.query('/part/find/id/not_related_id',{
      params:{
        id:id
      }
    })
  },
  //创建Part
  createPart(data){
    return ApiService.post('/part/create',data)
  },
  //修改Part
  modifyPart(data){
    return ApiService.post('/part/modify',data)
  },
  //删除Part
  deletePart(id){
    return ApiService.query('/part/delete',{
      params:{
        id:id
      }
    })
  },
  //查询Part的历史版本列表
  getHistoryVersionList(masterId){
    return ApiService.query('/part/history/list',{
      params:{
        id:masterId
      }
    })
  },
  //查询Part的指定历史版本
  getPartVersionDetail(masterId,versionId){
    return ApiService.query('/part/history/get',{
      params:{
        id:masterId,
        versionId:versionId
      }
    })
  },
  //删除Part的最新版本
  deletePartVersion(masterId,version){
    return ApiService.query('/part/history/del',{
      params:{
        masterId:masterId,
        version:version
      }
    })
  }
}

export const BOMService = {
  //创建子项
  createBom(data){
    return ApiService.post('/bom/subject/link',data)
  },
  //查看子项列表
  getSubitems(id){
    return ApiService.query(`/bom/subject/show`,{
      params:{
        id:id
      }
    })
  },
  //修改子项
  modifyBom(data){
    return ApiService.post('/bom/modify',data)
  },
  //删除子项
  deleteBom(bomLinkId,buoId){
    return ApiService.query('/bom/unlink',{
      params:{
        bomLinkId:bomLinkId,
        buoId:buoId
      }
    })
  },
  //查看父项
  getParents(masterId){
    return ApiService.query('/bom/subject/parent',{
      params:{
        masterId:masterId
      }
    })
  },
}