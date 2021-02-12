import { axiosPost, axiosGet } from '@/utils/axios';
import { baseURL, cityGroupURL, cityURL } from '../config'

// 查询SKU列表
export interface getSkuListParams {
    id?: number,
    type?: number,
    time?: string,
    status?: number,
    audit_status?: number,
    tags?: string,
    creator?: string,
    page?: number,
    inner_name?: any,
    limit?: number,
    start_time: any,
    end_time: any
  }
export async function getSkuList(params: getSkuListParams) {
	return axiosGet(`${baseURL}/sku/list`, params);
}

// 申请上架
export interface skuApplyParams {
    id: any
  }
export async function skuApply(params: skuApplyParams) {
	return axiosPost(`${baseURL}/sku/apply`, params);
}

// 审核上架
export interface skuApproveParams {
	id: number,
	auditor: string,
	audit_status: number
  }
export async function skuApprove(params: skuApproveParams) {
	return axiosPost(`${baseURL}/sku/approve`, params);
}

// 立即下架
export interface skuOffParams {
	id: any,
  }
export async function skuStop(params: skuOffParams) {
	return axiosPost(`${baseURL}/sku/stop`, params);
}


