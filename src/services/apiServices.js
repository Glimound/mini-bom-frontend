import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import pinia from "@/stores";
import { getJwtToken } from "@/services/jwtServices";

const controller = new AbortController()
const router = useRouter()
const authStore = useAuthStore(pinia)

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
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
  },
  delete(resource) {
    return axiosClient.delete(resource)
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
  }
}