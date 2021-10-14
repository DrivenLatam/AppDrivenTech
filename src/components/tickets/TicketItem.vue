<template>
    <q-item v-ripple clickable @click="onClickTicket" >
            <q-item-section >
            <q-item-label>#{{ticket.ticket_number}}  {{ticket.subject}} </q-item-label>
            <q-item-label caption lines="2">{{formattedDueDate}}</q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{ticket.status}}</q-item-label>
            </q-item-section>
    </q-item>
</template>
<script>
import { defineComponent, toRefs,computed } from 'vue'
import {useRouter} from 'vue-router'

export default defineComponent({
    props:['ticket'],
    emits:['change'],
    setup(props,{emit}) {
        /*----State--- */
        const {ticket}=toRefs(props)
        const router=useRouter()

        /*---Functions */
        const formattedDueDate=computed(()=>{
            const date=new Date(ticket.value.dueDate)
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} `
        })
        const onClickTicket=()=>{
            router.push({path:`/ticket/${ticket.value.id}`})
        }
        return {ticket,formattedDueDate,onClickTicket}    
    },
})
</script>
