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
        async updateTechnicianToServer({commit,getters}){
                const {username,country}=store.get("user")
                const params={username,country}
                try {
                    //const {data} = await axios.patch(BASE_URL+"techncian/",{params:{username,country}})
                    //commit('setTechnician',data)
                    //return {data}
                    return new Promise((resolve,reject)=>{
                        setTimeout(()=>resolve({data:true}),1000)
                    })
                    
                    
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