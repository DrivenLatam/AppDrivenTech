<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            
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
                            <p class="text-h5 text-grey-8-9">Editar el Ticket</p>
                            <p class="text-grey-8-8 q-mb-md">En esta seccion podra agregar observacion y fotos a un ticket, presione el boton Finalizar cuando desea terminar con el trabajo</p>
                            
                        </div>
                        <q-separator class="q-mt-md" color="primary" />
                         <q-input   
                            autogrow
                            label="Observacion" 
                            class="mt-20"
                            outlined
                            v-model="obeservation"
                        >
                        </q-input>
                        <div class="flex justify-center my-40">
                            <q-btn 
                                rounded
                                size="lg"
                                icon="add_a_photo"
                                color="primary"
                            />
                        </div>
                        <div class="row justify-evenly  mt-20">
                             <div ><q-btn  @click="saveTicket" class="py-5 px-30" color="primary" label="Guardar" /></div>
                             <div ><q-btn @click="finalizationAlert=true" class="py-5 px-30" color="primary" label="Finalizar" /></div>
                        </div>
                    </div>


                    <!--Dialog para confirmar cuando se guarda un ticket -->
                    <q-dialog  v-model="saveDialog" persistent transition-show="scale" transition-hide="scale">
                        <q-card class="bg-primary text-white" style="width: 300px">  
                            <q-card-section class="bg-primary text-white fs-20 py-20">
                                Guardado exitosamente
                            </q-card-section>
                            <q-card-section class="bg-white text-grey-9 q-py-lg">
                                El ticket se guardo exitosamente, podra volver a editarlo mas adelante si lo desea
                            </q-card-section>

                            <q-card-actions align="right" class="bg-white text-primary">
                                <q-btn @click="goBack" flat label="Ok"  v-close-popup />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>

                    <!--Dialog para confirmar si se quiere finalizar un ticket -->
                    <q-dialog v-model="finalizationAlert">
                        <q-card>
                            <q-card-section class="bg-primary text-white fs-20 py-20">
                                Confirmar finalizacion
                            </q-card-section>

                            <q-card-section class="bg-white text-grey-9 q-py-lg">
                                Una vez que finalices el ticket, ya no podra editarlo mas
                            </q-card-section>

                            <q-card-actions align="right">
                                 <q-btn flat label="Cancelar" color="primary" v-close-popup />
                                 <q-btn flat @click="closeTicket" label="Finalizar" color="primary" v-close-popup />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
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
        const saveDialog=ref(false)
        const finalizationAlert=ref(false)

        /*Observatio */
        const obeservation=ref('')

        //Ticket
        const ticket=computed(()=>{
            return getTicketById.value(ticketId.value)
        })
        const saveTicket=()=>{
            saveDialog.value=true
        }
        const closeTicket=()=>{
            dialog.value=false
            setTimeout(()=>{
                //router.replace({path:'/'})
                router.replace({path:'/'})
            },200)
        }

        const goBack=()=>{
            dialog.value=false
            setTimeout(()=>{
                //router.replace({path:'/'})
                router.go(-1)
            },200)

        }
        document.addEventListener('backbutton',()=>{
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
            obeservation,
            saveDialog,
            saveTicket,
            finalizationAlert,
            closeTicket
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