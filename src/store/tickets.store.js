import axios from "axios"

export default {
    state(){
        return { 
            tickets:[
                {'id':1,'subject':'Mantenimiento','status':'Abierto'},
                {'id':2,'subject':'Limpieza','status':'Abierto'},
                {'id':3,'subject':'Instalacion de Camara','status':'Abierto'}
            ],
        }
    },
    mutations:{
        addTicket(state,newTicket){
            state.tickets.push(newTicket)
        },
        setTickets(state,tickets){
            state.tickets=tickets
        }
    },
    actions:{
        getTicketsFromServer({commit,getters}){
        }
    },
    getters:{
        tickets(state,getters){
            return state.tickets
        }
    }
}