import axios from "axios"
import { BASE_URL } from "."
import {store} from "./local.store"
import { handleMessageError } from "."
export default {
    state(){
        return { 
            tickets:[],
            loadingTicket:true
        }
    },
    mutations:{
        addTicket(state,newTicket){
            state.tickets.push(newTicket)
        },
        setTickets(state,tickets){
            state.tickets=tickets
        },
        setLoadingTicket(state,value){
            state.loadingTicket=value
        }
    },
    actions:{
        async getTicketsFromServer({commit,getters}){
                const {username,country}=store.get("user")
                const params={username,country}
                try {
                    const {data} = await axios.get(BASE_URL+"tickets/",{params:{username,country}})
                    commit('setTickets',data)
                    return {data}
                } catch (error) {
                    handleMessageError(error)
                    return {error}
                }
        },
        async editTicket({commit,getters},{listImg,observation}){
            const formdata = new FormData();
            console.log('.....',listImg)
            const config={
                headers:{'Content-Type':'multipart/form-data'}
            }
            try {
                formdata.append('image',listImg[0].path)
                formdata.append('ob',observation)
                const {data} = await axios.put(BASE_URL+"tickets/edit",formdata,config)
                console.log(data)
                return {data}
            } catch (error) {
                handleMessageError(error)
                return {error}
            }
        }

    },
    getters:{
        tickets(state,getters){
            return state.tickets
        },
        getTicketById(state,getters){
            return (id)=>{
                return state.tickets.find((ticket)=>ticket.id===id)
            }
        },
        loadingTicket(state,getters){
            return state.loadingTicket
        }
    }
}