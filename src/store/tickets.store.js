import axios from "axios"
import { BASE_URL } from "."
import {store} from "./local.store"
import { handleMessageError } from "."
export default {
    state(){
        return { 
            tickets:[],
            loadingTicket:true,
            contacts:store.get("contacts",null),
            products:store.get("products",null)
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
        },
        setContacts(state,contacts){
            state.contacts=contacts
            store.set("contacts",contacts)
        },
        setProducts(state,products){
            state.prodcutos=products
            store.set("products",products)
        }
    },
    actions:{
        //Obtiene todos los ticket del servidor
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
        //envia una foto de un ticket al servidor
        async uploadImageTicket({commit,getters},{file,ticketId,country}){
            const formdata = new FormData();
            
            const config={
                headers:{'Content-Type':'multipart/form-data'}
            }
            try {
                console.log('...FFF',file)
                //formdata.append('file',file.webPath)
                formdata.append('file',file)
                formdata.append('ticketId',ticketId)
                formdata.append('country',country)
                const {data} = await axios.post(BASE_URL+"tickets/file",formdata,config)
                console.log(data)
                return {data}
            } catch (error) {
                handleMessageError(error)
                return {error}
            }
        },
        //edita un ticket al servidor
        async finalizateTicket({commit,getters}){
            try {
                const {data} = await axios.put(BASE_URL+"tickets/finalizate")
                
                return {data}
            } catch (error) {
                handleMessageError(error)
                return {error}
            }
        },
        //agregar un ticket al servidor
        async addTicket({commit,getters},{body}){
            //console.log('DueData',body)
            try {

                const {data} = await axios.post(BASE_URL+"tickets2/",body)
                //console.log('data',data)
                return {data}
            } catch (error) {
                handleMessageError(error)
                return {error}
            }
        },
        //Obtine la lista de contactos, recibe como parametro el pais(PY o UY)
        async getContacts({commit,getters},{country}){
            try {
                const {data}=await axios.get(BASE_URL+"contacts",{params:{country}})
                commit("setContacts",data)
                //console.log("dataa",data)
                return {data}
            } catch (error) {
                handleMessageError(error)
                return {error}
            }
        },

        //Obtine la lista de prodcutos, recibe como parametro el pais(PY o UY)
        async getProducts({commit,getters},{country}){
            try {
                const {data}=await axios.get(BASE_URL+"products",{params:{country}})
                commit("setProducts",data)
                //console.log("prductos",data)
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
        },
        contacts(state,getters){
            return state.contacts
        },
        products(state,getters){
            return state.products
        }
    }
}