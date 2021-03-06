import axios from "axios"
import { BASE_URL } from "."
import {store} from "./local.store"
import { handleMessageError } from "."
export default {
    state(){
        return { 
            tickets:[],
            loadingTicket:false,
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
        updateTicket(state,{ticketID,ticketUpdated}){
            const ticketIndex=state.tickets.findIndex(ticket=>ticket.id==ticketID)
            state.tickets[ticketIndex]=ticketUpdated
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
                console.log("Getting tickets")
                try {
                    const {data} = await axios.get(BASE_URL+"tickets/",{params:{username,country}})
                    commit('setTickets',data)
                    
                    return {data}
                } catch (error) {
                    handleMessageError(error)
                    return {error}
                }finally{
                    commit('setLoadingTicket',false)
                }
        },
        //envia una foto de un ticket al servidor
        async uploadImageTicket({commit,getters},{file,ticketId,fileName}){
            const {username,country}=store.get("user")
            const params={username,country}
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
                formdata.append('fileName',fileName)
                const {data} = await axios.post(BASE_URL+"tickets/file",formdata,config)
                console.log(data)
                return {data}
            } catch (error) {
                handleMessageError(error)
                return {error}
            }
        },

        //finaliza un ticket al servidor
        async finalizateTicket({commit,getters},{ticketId}){
            const {country}=store.get("user")
            try {
                const {data} = await axios.patch(BASE_URL+"tickets/finish",{ticketId,country})
                console.log('finalizarTicket',data)
                return {data}
            } catch (error) {
                console.log('FinalizateTicketErrorr')
                handleMessageError(error)
                return {error}
            }
        },

        //agregar un ticket al servidor
        async addTicket({commit,getters},{body}){
            //console.log('DueData',body)
            const {username,country}=store.get("user")
            body.username=username
            try {

                const {data} = await axios.post(BASE_URL+"tickets2/",body)
                console.log('data de crearr',data)
                return {data}
            } catch (error) {
                console.log('error de crear')
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
        },

        //Obtiene las images del ticket
        async getTicketImages({commit,getters},{ticketId}){
            const {country}=store.get("user")
            try {
                const {data}= await axios.get(BASE_URL+"tickets/getfile",{params:{ticketId,country}})
                return {data}
            } catch (error) {
                console.log("Error al obtener imagenes")
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