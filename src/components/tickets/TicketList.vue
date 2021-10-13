<template>
    <q-list>
      <div v-for="ticket of tickets" :key="ticket.id">
          <ticket-item :ticket="ticket"/>
        <q-separator spaced inset />   
      </div>
    </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import {useGetters} from 'src/store'
import TicketItem from './TicketItem.vue'

export default defineComponent({
    name:'TicketList',
    components:{
        TicketItem
    },
    setup() {
        const {tickets}=useGetters()
        return {tickets}
    },
})
</script>
