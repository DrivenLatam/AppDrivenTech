<template> 
    <div v-if="loading" class="flex justify-center items-center">
        <q-spinner
        color="primary"
        size="3em"
        :thickness="2"
    />
    </div>      
    <div v-else > 
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
        <!-- -->
        <q-scroll-area  style="height: calc(100vh - 160px); max-width: 100%;"> 
            <q-pull-to-refresh   @refresh="onrefresh" > 
            <div class="full-width pb-60">
                    <div v-for="ticket of tickets" :key="ticket.id">
                        <ticket-item :ticket="ticket"/>
                        <q-separator spaced inset />   
                    </div>
            </div>
            </q-pull-to-refresh>
        </q-scroll-area>
    </div>
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
        const refresh=ref(false)
        const statusFilter = ref('');
        const ticketError=ref("E")

        const loadTickets=async()=>{
            console.log("loadingticket")
            const {data,error} = await getTicketsFromServer()
            if(error){
                ticketError.value=JSON.stringify(error.message)  
            }else{
                ticketError.value="No hay error"
            }
           
        }
        const loadTicketsOnStart= async ()=>{
            if(tickets.value.length==0){
                setLoadingTicket(true)
                await loadTickets()
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

        const infoScroll=(info)=>{
                const {verticalPercentage}=info
                console.log(verticalPercentage)
                refresh.value = verticalPercentage==0 ? false : true
        }
        
        return {
            tickets: filterTickets,
            loading: loadingTicket,
            onrefresh,
            search,
            statusFilter,
            infoScroll,
            refresh,
            ticketError
        }
    },
})
</script>

<style scoped>
.fixed{
    position: fixed;
}
</style>
