import axios from "axios"
import { urls } from "../uri"

export const updateRsvp = async (data:any, id:string ) => {
    try {
        const res = await axios.put(`${urls.rsvp.index}/${id}`, data)
        return res
    } catch (error) {
        throw error        
    }
}