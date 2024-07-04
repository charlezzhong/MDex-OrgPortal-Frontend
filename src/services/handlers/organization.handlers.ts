import { GET, PATCH, POST } from "../api";
import { urls } from "../uri";

export const createOrganization = async (data: any) => {
    try {
        const res = await POST(urls.organization.create, data);
        return res
    } catch (error) {
        return error
    }
}
export const updateOrganization = async (data: any,id:string) => {
    try {
        const res = await PATCH(urls.organization.update + `/${id}`, data);
        return res
    } catch (error) {
        return error
    }
}

export const getAnalytics = async (id:string) => {
    try {
        const res = await GET(urls.organization.getAnalytics + `/${id}`);
        return res
    } catch (error) {
        return error
    }
}