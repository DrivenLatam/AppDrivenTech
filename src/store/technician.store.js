import axios from "axios"
import { BASE_URL } from "."
import {store} from "./local.store"
import { handleMessageError } from "."
export default {
    state(){
        return { 
            technician:store.get("user",null),
        }
    },
    mutations:{
       
    },
    actions:{
        //send an  PATCH request to server for update technician data
        async updateTechnicianToServer({commit,getters},technician){
                const {pk,token,tokenFB}=store.get("user")
                const params={pk}
                console.log("technician",technician,"pk",pk)
                try {
                    const {data} = await axios.patch(BASE_URL+"users/edit/",technician,{params:{pk}})
                    commit('setUser',{...data,token,tokenFB})

                    return {data}   
                } catch (error) {
                    handleMessageError(error)
                    return {error}
                }
        } 
    },
    getters:{
        technician(state,getters){
            return state.technician
        }
    }
}