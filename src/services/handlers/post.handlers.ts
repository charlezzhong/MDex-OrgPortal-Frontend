import { GET, POST, PUT } from "../api"
import { urls } from "../uri"

export const createPost = async(data:any)=>{
    try {
        const res = await POST(urls.post.create, data)
        return res
    } catch (error) {
        throw error        
    }
}

export const updatePost = async(data:any, id:string)=>{
    try {
        const res = await PUT(`${urls.post.create}/${id}`, data)
        return res
    } catch (error) {
        throw error        
    }
}

export const fetchPosts = async (id:string, {offset = 0, limit= 10, category= 'upcoming'}:any) => {
    try {
        const res = await GET(urls.post.getPost+`/${id}?offset=${offset}&limit=${limit}&category=${category}`)    
        return res     
    } catch (error) {
        throw error
    }
}

export const fetchPost = async (id:string) => {
    try {
        const res:any = await GET(urls.post.getSinglePost+`/${id}`)    
        return res || null     
    } catch (error) {
        //console.log(error)
        return null
    }
}

export const fetchRsvpsForPost = async (id:string) => {
    try {
        const res:any = await GET(urls.post.getRsvps+`/${id}`)    
        return res || null     
    } catch (error) {
        //console.log(error)
        return null
    }
}

export const fetchPostSaves = async (postId: string) => {
    try {
      const res = await GET(`/api/v2/posts/post/${postId}/saves`);
      return res;
    } catch (error) {
      throw error;
    }
  }