<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >
        <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header elevated class="bg-white text-black">
            <q-toolbar>
                <q-btn icon="arrow_back" flat round @click="goBack" />
            </q-toolbar>
            </q-header>

            <q-page-container>
                <q-page>
                    <div>Detalle Ticket {{ticket}}</div>
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
    
 
</template>
<script>

import { defineComponent,ref,computed } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters} from 'src/store'

export default defineComponent({
    setup() {
        const route=useRoute()
        const router=useRouter()
        const dialog= ref(true)
        const ticketId=ref(route.params.id)
        const {getTicketById}=useGetters()
        const ticket=computed(()=>{
            return getTicketById.value(ticketId.value)
        })
        const goBack=()=>{
            dialog.value=false
            setTimeout(()=>{
                router.go(-1)
            },200)

        }

        return{ticketId,ticket,goBack,dialog}
    },
})
</script>
