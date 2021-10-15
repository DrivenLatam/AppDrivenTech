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
                    <q-list class="mt-25">
                            <q-item class="item-detail">
                                <q-item-section avatar top>
                                <q-avatar icon="description" color="primary" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                <q-item-label class="text-subtitle1" lines="1">Descripcion</q-item-label>
                                <q-item-label class="text-grey-8 text-caption" >{{ticket.subject}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                </q-item-section>
                            </q-item>
                            
                            <q-item class="item-detail" >
                                <q-item-section avatar top>
                                <q-avatar icon="priority_high" color="primary" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                <q-item-label class="text-subtitle1"  lines="1">Prioridad</q-item-label>
                                <q-item-label class="text-grey-8 text-caption">{{ticket.priority}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                </q-item-section>
                            </q-item>
                            

                            <q-item class="item-detail">
                                <q-item-section avatar top>
                                <q-avatar icon="phone" color="primary" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                <q-item-label class="text-subtitle1"   lines="1">Numero de Contacto</q-item-label>
                                <q-item-label class="text-grey-8 text-caption">{{ticket.mobile_contact ? ticket.mobile_contact : "Sin Informacion"}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                </q-item-section>
                            </q-item>  
                            
                            <q-item class="item-detail">
                                <q-item-section avatar top>
                                <q-avatar icon="schedule" color="primary" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                <q-item-label class="text-subtitle1" lines="1">Fecha de Vencimiento</q-item-label>
                                <q-item-label class="text-grey-8 text-caption">{{formattedDate}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                </q-item-section>
                            </q-item>
                            

                            <q-item class="item-detail">
                                <q-item-section avatar top>
                                <q-avatar icon="label" color="primary" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                <q-item-label class="text-subtitle1"   lines="1">Estado del Ticket</q-item-label>
                                <q-item-label class="text-grey-8 text-caption">{{ticket.status}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                </q-item-section>
                            </q-item>   
                            
                    </q-list>
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
        const formattedDate=computed(()=>{
            const date=new Date(ticket.value.dueDate)
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} `
        })
        return{ticketId,ticket,goBack,dialog,formattedDate}
    },
})
</script>
<style scoped>
.item-detail{
    margin-top: 5   px;
}
.title-detail{
    margin:5px;
    padding-bottom: 0px;
}
</style>