import { axiosPost, axiosGet } from '@/utils/axios';
import { baseURL, cityGroupURL, cityURL } from '../config'

// 查询卡批次信息
export interface queryCardParams {
    batch_id: number
  }
export async function queryCard(params: queryCardParams) {
	return axiosGet(`${baseURL}/card/query`, params);
}


// 查询卡批次信息
export interface queryKCardParams {
  sku_id: number
}
export async function queryKCard(params: queryKCardParams) {
return axiosGet(`${baseURL}/card/skuBrief`, params);
}

// 创建SKU接口
export interface createSkuParams {
    app_id: number
    third_sku_id?: number,
    name: string,
    description?: string,
    type: number,
    priority: number,
    purchase_notice?: string,
    enable_time: string,
    expire_time: number,
    tag: string,
    initial_stock: number,
    price: number,
    renew_price?: number
    sku_info?: any
    creator: string
  }
export async function createSku(params: createSkuParams) {
	return axiosPost(`${baseURL}/sku/create`, params);
}

// 更新SKU详情
export interface updateSkuDetailParams {
    id?: number,
    name: string,
    description?: string,
    purchase_notice: string,
    priority: number,
    price: number,
    renew_price?: number
    sku_info: any
    stock: number
  }
export const updateSkuDetail = async(params: updateSkuDetailParams) => {
	return axiosPost(`${baseURL}/sku/update`, params);
}

// 查询SKU详情
export interface getSdkInfoParams {
    id?: number,
  }
export const getSdkInfo = async(params: getSdkInfoParams) => {
	return axiosGet(`${baseURL}/sku/detail`, params);
}

// 查询Picasso人群标签列表
export interface TagListParams {
  namespace_type: number
  limit_count: number
  limit_offset: number
}
export async function getTagList(params: TagListParams) {
return axiosGet(`${baseURL}/tag/list`, params);
}

export async function getAllCityGroup() {
  const params = {need_all: true}
	return axiosPost(`${cityGroupURL}/list`, params);
}

export async function getAllCity() {
  const params = {
}
	return axiosGet(`${cityURL}`, params);
}



