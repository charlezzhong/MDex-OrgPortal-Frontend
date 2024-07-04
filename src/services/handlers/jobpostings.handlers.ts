import { Pagination } from "@/types/general";
import { DELETE, GET, PATCH, POST } from "../api";
import { urls } from "../uri";

export const fetchJobs = async(params:Pagination, organizationID: string) => {
    const {offset=0, perpage=10} = params
    try {
        const res = await GET(urls.jobpostings.fetchMembers+ `?organizationID=${organizationID}&limit=${perpage}&offset=${offset}`)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}
export const updateJobs = async(data:any, id:string) => {
    try {
        const res = await PATCH(urls.jobpostings.update+ `/${id}`, data)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}
export const createJobs = async(data:any) => {
    try {
        const res = await POST(urls.jobpostings.create,data)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}
export const deleteJobs = async(id:string) => {
    try {
        const res = await DELETE(urls.jobpostings.delete + `/${id}`)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}