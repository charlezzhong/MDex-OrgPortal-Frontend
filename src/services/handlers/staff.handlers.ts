import { Pagination } from "@/types/general";
import { DELETE, GET, PATCH, POST } from "../api";
import { urls } from "../uri";

export const fetchStaffs = async(params:Pagination, organizationID: string) => {
    const {offset=0, perpage=10} = params
    try {
        const res = await GET(urls.staff.fetchMembers+ `?organizationID=${organizationID}&limit=${perpage}&offset=${offset}`)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}
export const updateStaffs = async(data:any, id:string) => {
    try {
        const res = await PATCH(urls.staff.update+ `/${id}`, data)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}
export const createStaffs = async(data:any) => {
    try {
        const res = await POST(urls.staff.create,data)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}
export const deleteStaff = async(id:string) => {
    try {
        const res = await DELETE(urls.staff.delete + `/${id}`)
        return res
    } catch (error) {
        //console.log(error)
        throw error
    }
}