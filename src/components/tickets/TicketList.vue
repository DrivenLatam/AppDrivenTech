<template>     
    <q-spinner
        v-if="loading"
        color="primary "
        size="3em"
        class="full-width"
    />

    <q-pull-to-refresh v-else @refresh="onrefresh">
        <!-- LIST HEADER -->
        <div class="row items-center mb-16 px-8 justify-between text-grey-8 ">
        <!-- FILTER INFO -->
            <div class="px-8 ">
                {{tickets.length}} {{tickets.length === 1 ? 'ticket' : 'tickets'}}
                {{!search ? '' : tickets.length === 1 ? 'filtrado' : 'filtrados'}}
            </div>
            
            <!-- FILTER OPTIONS -->
            <div>
                <q-btn flat round dense icon="filter_alt">
                    <q-menu>
                        <q-list>
                            <q-item-label header>Mostrar</q-item-label>
                            <q-item clickable v-ripple @click="statusFilter=''">
                                <q-item-section avatar><q-icon :name="statusFilter===''?'check':''" /></q-item-section>
                                <q-item-section>Todos</q-item-section>
                            </q-item>
                            <q-item clickable v-ripple @click="statusFilter='Abierto'">
                                <q-item-section avatar><q-icon :name="statusFilter==='Abierto'?'check':''" /></q-item-section>
                                <q-item-section>Abiertos</q-item-section>
                            </q-item>
                            <q-item clickable v-ripple  @click="statusFilter='Cerrado'">
                                <q-item-section avatar><q-icon :name="statusFilter==='Cerrado'?'check':''" /></q-item-section>
                                <q-item-section>Cerrados</q-item-section>
                            </q-item>
                            <q-item clickable v-ripple  @click="statusFilter='Pendiente'">
                                <q-item-section avatar><q-icon :name="statusFilter==='Pendiente'?'check':''" /></q-item-section>
                                <q-item-section>Pendientes</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>
        </div>
        <!-- LIST BODY -->
        <q-list class="full-width">
            <div v-for="ticket of tickets" :key="ticket.id">
                <ticket-item :ticket="ticket"/>
                <q-separator spaced inset />   
            </div>
        </q-list>
    </q-pull-to-refresh>
</template>

<script>
import { defineComponent, ref, toRefs, computed } from 'vue';
import {useGetters,useActions,useMutations} from 'src/store'

import TicketItem from './TicketItem.vue'

export default defineComponent({
    name:'TicketList',
    components:{ TicketItem },
    props: ['search'],
    setup(props) {
        const { search } = toRefs(props);
        const { loadingTicket } = useGetters()
        const {setLoadingTicket}=useMutations()
        const { getTicketsFromServer } = useActions()
        const { tickets } = useGetters()
        const statusFilter = ref('');

        const loadTickets=async()=>{
            const {data,error} = await getTicketsFromServer()
        }
        const loadTicketsOnStart= async ()=>{
            if(loadingTicket.value){
                await loadTickets()
                setLoadingTicket(false)
            }
        }
        loadTicketsOnStart()
        
        const onrefresh= async(done)=>{
            await loadTickets()
            done()
        }
        const filterTickets = computed(() => {
            const _searchFilter = search.value ? 
                tickets.value.filter(ticket => 
                    `#${ticket.ticket_number} ${ticket.subject.toLowerCase()}`.includes(search.value.toLowerCase())) : 
                tickets.value;
            const _statusFilter = statusFilter.value ? 
                _searchFilter.filter(ticket => ticket.status === statusFilter.value) : 
                _searchFilter;

            return _statusFilter;
        })
        
        return {
            tickets: filterTickets,
            loading: loadingTicket,
            onrefresh,
            search,
            statusFilter
        }
    },
})
</script>

<style scoped>
.fixed{
    position: fixed;
}
</style>
