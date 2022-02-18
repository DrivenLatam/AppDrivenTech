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
        setTechnician(state,technician){
            state.tickets=technician
            store.set("user",technician)
        }       
    },
    actions:{
        //send an  PATCH request to server for update technician data
        async updateTechnicianToServer({commit,getters},technician){
                const {pk}=store.get("user")
                const params={pk}
                console.log("technician",technician,"pk",pk)
                try {
                    const {data} = await axios.patch(BASE_URL+"users/edit/",technician,{params:{pk}})
                    commit('setTechnician',data)
                    commit('setUser',data)
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