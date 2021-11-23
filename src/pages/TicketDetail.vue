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
                    <q-toolbar-title class="fs-30 text-weight-regular">Driven</q-toolbar-title> 
                    <q-avatar size="40px" >
                            <img src="imgs/drivenImg.png"/>
                    </q-avatar>
                    
                </q-toolbar>
            </q-header>

            <q-page-container>
                <q-page>
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <p class="fs-18 text-bold q-my-sm q-py">#{{ticket.ticket_number}}</p>
                                <p class=" text-weight-light  fs-16 q-my-sm">{{ticket.subject}}</p>
                                <p class="text-weight-medium fs-15 q-my-sm">Estado: <span :class="ticketStatusColor" class="text-weight-light fs-15"> {{ticket.status}}</span></p>
                                <p class="text-weight-medium fs-15 q-my-sm">Prioridad: <span  class="text-weight-light fs-15"> {{ticket.priority}}</span></p>
                            </div>
                            
                        </div>
                        <q-separator class="q-mt-md" color="primary" />
                        <div class="q-mt-md">   
                            <p class="text-weight-medium fs-15 q-my-sm">Descripcion:</p>
                            <p class="text-weight-light fs-15 ">{{ticket.description}}</p>
                        </div>
                        <q-separator class="q-mt-md" color="primary" />
                        <div class="pb-30">
                            <div class="row q-col-gutter-x-sm q-mt-sm">
                                <div class="col-auto text-weight-medium  fs-15">
                                        Cliente
                                </div>
                                <div class="col text-weight-light  fs-15">
                                        <label class="float-right">{{ticket.contact.name}}</label>
                                </div>
                            </div>
                            <div class="row q-col-gutter-x-sm q-mt-sm">
                                <div class="col-auto text-weight-medium  fs-15">
                                        Nombre del Producto
                                </div>
                                <div class="col text-weight-light  fs-15">
                                        <label class="float-right">{{ticket.product_name}}</label>
                                </div>
                            </div>
                            <div class="row q-col-gutter-x-sm q-mt-sm">
                                <div class="col-auto text-weight-medium  fs-15">
                                        Vencimiento
                                </div>
                                <div class="col text-weight-light  fs-15">
                                        <label class="float-right">{{formattedDate}}</label>
                                </div>
                            </div>
                            <div class="row q-col-gutter-x-sm q-mt-sm">
                                <div class="col-auto text-weight-medium  fs-15">
                                        Contacto
                                </div>
                                <div class="col text-weight-light  fs-15">
                                        <label :class="hasMobileContact ? 'link' : '' " class="float-right"   >{{ticket.contact.mobile}}</label>
                                </div>
                            </div>
                            <div class="row q-col-gutter-x-sm q-mt-sm">
                                <div class="col-auto text-weight-medium  fs-15">
                                        Ubicacion
                                </div>
                                <div class="col text-weight-light  fs-15">
                                        <label :class=" hasUrlDirection ? 'link' : '' " class="float-right">{{hasUrlDirection ? 'Abrir en Maps' : 'Sin Informacion' }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center mt-20 mb-20">
                            <q-btn @click="goToEditTicket" class="py-5 px-50" color="primary" label="Editar" />
                        </div>
                        
                    </div>
                    
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters} from 'src/store'
import Edit from 'src/components/tickets/Edit.vue'
export default defineComponent({
    components:{
        Edit
     },
    setup() {
        const route=useRoute()
        const router=useRouter()
        const dialog= ref(true)
        const ticketId=ref(route.params.id)
        const {getTicketById}=useGetters()
        const imgDriven=ref("imgs/drivenImg.png")
        //Ticket
        const ticket=computed(()=>{
            return getTicketById.value(ticketId.value)
        })
        //Ticket atributes
        const ticketStatusColor=computed(()=> ticket.value.status=='Abierto' ? 'text-positive' : ticket.value.status=='Cerrado' ? 'text-dark' : 'text-warning' )
        const hasMobileContact=computed(()=>(ticket.value.contact.mobile!='Sin Informacion') ? true : false )
        const hasUrlDirection=computed(()=>(ticket.value.cf.cf_direccion_url!='Sin Informacion') ? true : false )
       
       const goBack=()=>{
            dialog.value=false
            setTimeout(()=>{
                router.go(-1)
            },200)

        }
        const goToEditTicket=()=>{
            router.push({path:`/edit/${ticketId.value}`})
        }
        document.addEventListener('backbutton',()=>{
            console.log('Test')
            goBack()
        })
        const formattedDate=computed(()=>{
            const date=new Date(ticket.value.cf.cf_fecha_hora)
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} `
        })
        return{
            ticketId,
            ticket,
            goBack,
            dialog,
            formattedDate,
            imgDriven,
            ticketStatusColor,
            hasMobileContact,
            hasUrlDirection,
            goToEditTicket
            }
    },
})
</script>
<style lang="scss" scoped>
.container{
    margin:5px 20px 0px;
}
p{
    margin: 5px 0px;
}
.link{
    text-decoration: underline;
    color: $blue;
}
</style>