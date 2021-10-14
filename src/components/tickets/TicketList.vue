<template>
        <q-spinner
                v-if="loading"
                color="primary "
                size="3em"
                class="full-width"
            />
        <q-pull-to-refresh 
        v-else
        @refresh="onrefresh">
        <q-list  class="full-width">
                <div v-for="ticket of tickets" :key="ticket.id">
                    <ticket-item :ticket="ticket"/>
                    <q-separator spaced inset />   
                </div>
        </q-list>
        </q-pull-to-refresh>
</template>

<script>
import { defineComponent,ref } from 'vue'
import {useGetters,useActions} from 'src/store'

import TicketItem from './TicketItem.vue'

export default defineComponent({
    name:'TicketList',
    components:{
        TicketItem
    },
    setup() {
        const {loadingTicket}=useGetters()
        const {getTicketsFromServer}=useActions()
        const loadTickets=async()=>{
                const {data,error}=await getTicketsFromServer()
                console.log('tickets',data)
        }
        const onrefresh= async(done)=>{
                await loadTickets()
                done()
        }
        const {tickets}=useGetters()
        
        return {tickets,loading:loadingTicket,onrefresh}
    },
})
</script>
