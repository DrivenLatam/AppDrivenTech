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
                <q-page class="mt-30 mx-20">
                    <p class="text-h5 text-grey-8-9">Crea un nuevo Ticket</p>
                    <p class="text-grey-8-8 q-mb-md">Complete los siguientes campos para crear un nuevo ticket, los campos con asterisco (*) son obligatorios </p>
                    <div class="mb-20">
                        <q-input   
                            autofocus
                            dense
                            label="Nombre(*)" 
                            class="mb-20"
                            v-model="ticketName"
                            :ref=" el=>ticketNameInput=el"
                            @focus="focusTicketName"
                            @blur="focusTicketName(false)"
                            :error="!!ticketNameError"
                            :error-message="ticketNameError"
                        >
                            <template v-slot:prepend>
                                    <q-icon :color="ticketNameIconColor" size="xs" name="subject"/>
                            </template>
                        </q-input>

                        <q-input   
                            autogrow
                            label="Descripcion(*)" 
                            dense
                            class="mb-20"
                            v-model="ticketDescription"
                            :ref="el=>ticketDescriptionInput=el"
                            @focus="focusTicketDescription"
                            @blur="focusTicketDescription(false)"
                            :error="!!ticketDescriptionError"
                            :error-message="ticketDescriptionError"
                        >
                            <template v-slot:prepend>
                                    <q-icon :color="ticketDescriptionIconColor" size="xs" name="description"/>
                            </template>
                        </q-input>

                        <!-- Nombre del Cliente-->
                        <q-input   
                            label="Cliente(*)"   
                            dense
                            class="mb-20"
                            v-model="ticketClient"
                            :ref="el=>ticketClientInput=el"
                            @focus="focusTicketClient"
                            @blur="focusTicketClient(false)"
                            :error="!!ticketClientError"
                            :error-message="ticketClientError"
                        >
                            <template v-slot:prepend>
                                    <q-icon :color="ticketClientIconColor" size="xs" name="person"/>
                            </template>
                        </q-input>

                         <!-- Nombre del Producto-->
                        <q-input   
                            label="Nombre del Producto"  
                            dense 
                            class="mb-20"
                            v-model="ticketProductName"
                            :ref="el=>ticketProductNameInput=el"
                            @focus="focusTicketProductName"
                            @blur="focusTicketProductName(false)"
                        >
                            <template v-slot:prepend>
                                    <q-icon :color="ticketProductNameIconColor" size="xs" name="inventory_2"/>
                            </template>
                        </q-input>


                        
                        <!-- Vencimiento Fecha y Hora-->
                        <q-input dense  v-model="ticketDueDate" 
                                label="Fecha y Hora de Vencimiento" 
                                class="mb-20"
                                :ref="el=>ticketDueDateInput=el"
                                @focus="focusTicketDueDate"
                                @blur="focusTicketDueDate(false)"
                                >
                            <template v-slot:prepend>
                                <q-icon :color="ticketDueDateIconColor" size="xs" name="event" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="ticketDueDate" mask="DD-YYYY-MM HH:mm">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>

                            <template v-slot:append>
                                <q-icon :color="ticketDueDateIconColor" size="xs" name="access_time" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-time v-model="ticketDueDate" mask="YYYY-MM-DD HH:mm" format24h>
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-time>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                         <q-select 
                                dense  v-model="ticketPriority" 
                                color="primary"  :options="['Alta','Media','Baja']" 
                                label="Prioridad"
                                :ref="el=>ticketPriorityInput=el"
                                @focus="focusTicketPriority"
                                @blur="focusTicketPriority(false)"
                        >
                                <template v-slot:prepend>
                                        <q-icon :color="ticketPriorityIconColor" size="xs" name="priority_high" />
                                </template>
                        </q-select>
                        <div class="flex justify-center mt-20">
                            <q-btn @click="createTicket" class="py-5 px-50" color="primary" label="Crear Ticket" />
                        </div>
                    </div>
                    <q-dialog  v-model="successMessage" persistent transition-show="scale" transition-hide="scale">
                        <q-card class="bg-primary text-white" style="width: 300px">
                            
                            <q-card-section class="bg-primary text-white fs-20 py-20">
                                Ticket creado exitosamente
                            </q-card-section>
                            <q-card-section class="bg-white text-grey-9 q-py-lg">
                                Esto es solo un simulacro el ticket aun no se carga en Zoho, pero en la brevedad ya podra ver su ticket creado en su lista de tickets
                            </q-card-section>

                            <q-card-actions align="right" class="bg-white text-primary">
                                <q-btn @click="goBack" flat label="Ok"  v-close-popup />
                            </q-card-actions>
                            
                        </q-card>
                    </q-dialog>
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed,watch } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters} from 'src/store'

export default defineComponent({
    setup() {
        const route=useRoute()
        const router=useRouter()
        const dialog= ref(true)
        const focusedInput=ref(null)
        const successMessage=ref(false)

        //TicketName
        const ticketName=ref('')
        const ticketNameInput=ref(null)
        const focusTicketName=(state=true)=>{
            if(state) focusedInput.value=ticketNameInput.value
            else if(focusedInput.value==ticketNameInput.value)focusedInput.value=null
        }
        const ticketNameIconColor=computed(()=> ticketNameError.value? 'negative': focusedInput.value==ticketNameInput.value ? 'primary' : 'grey-8')
        const ticketNameError=ref('')
        watch(ticketName,()=>ticketNameError.value="")
        //ticketDescription
        const ticketDescription=ref('')
        const ticketDescriptionInput=ref(null)
        const focusTicketDescription=(state=true)=>{
                if(state)focusedInput.value=ticketDescriptionInput.value
                else if(focusedInput.value==ticketDescriptionInput.value) focusedInput.value=null
        }
        const ticketDescriptionIconColor=computed(()=>ticketDescriptionError.value ? 'negative': focusedInput.value==ticketDescriptionInput.value ? 'primary' : 'grey-8')
        const ticketDescriptionError=ref('')
        watch(ticketDescription,()=>ticketDescriptionError.value="")
      
      //ticketClient
        const ticketClient=ref('')
        const ticketClientInput=ref(null)
        const focusTicketClient=(state=true)=>{
                if(state)focusedInput.value=ticketClientInput.value
                else if(focusedInput.value==ticketClientInput.value) focusedInput.value=null
        }
        const ticketClientIconColor=computed(()=> ticketClientError.value ? 'negative': focusedInput.value==ticketClientInput.value ? 'primary' : 'grey-8')
        const ticketClientError=ref('')
        watch(ticketClient,()=>ticketClientError.value="")

        //ticketProductName
        const ticketProductName=ref('')
        const ticketProductNameInput=ref(null)
        const focusTicketProductName=(state=true)=>{
                if(state)focusedInput.value=ticketProductNameInput.value
                else if(focusedInput.value==ticketProductNameInput.value) focusedInput.value=null
        }
        const ticketProductNameIconColor=computed(()=> focusedInput.value==ticketProductNameInput.value ? 'primary' : 'grey-8')
       
       //ticketDueDate
        
        const ticketDueDateInput=ref('')
        const focusTicketDueDate=(state=true)=>{
                if(state)focusedInput.value=ticketDueDateInput.value
                else if(focusedInput.value==ticketDueDateInput.value) focusedInput.value=null
        }
        const ticketDueDateIconColor=computed(()=> focusedInput.value==ticketDueDateInput.value ? 'primary' : 'grey-8')
        const formattedDate=(_)=>{
            const date=new Date()
            console.log(date)
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} `
        }
        const ticketDueDate=ref(formattedDate())
        //ticketPriority
        const ticketPriority=ref('Alta')
        const ticketPriorityInput=ref(null)
        const focusTicketPriority=(state=true)=>{
                if(state)focusedInput.value=ticketPriorityInput.value
                else if(focusedInput.value==ticketPriorityInput.value) focusedInput.value=null
        }
        const ticketPriorityIconColor=computed(()=> focusedInput.value==ticketPriorityInput.value ? 'primary' : 'grey-8')


        const validateFields=()=>{
            if(!ticketName.value) {ticketNameError.value="Este campo no puede quedar vacio";return false}
            if(!ticketDescription.value){ticketDescriptionError.value= "Este campo no puede quedar vacio"; return false}
            if(!ticketClient.value){ticketClientError.value="Este campo no puede quedar vacio";return false}
            return true
        }
        const createTicket=()=>{
            successMessage.value=validateFields()
            //Enviar datos al servidor
        }
        const goBack=()=>{
            dialog.value=false
            setTimeout(()=>{
                router.go(-1)
            },200)

        }
        document.addEventListener('backbutton',()=>{
            console.log('Test')
            goBack()
        })
        
        return{
            goBack,
            dialog,

            ticketName,
            ticketNameInput,
            focusTicketName,
            ticketNameIconColor,
            ticketNameError,

            ticketDescription,
            ticketDescriptionInput,
            focusTicketDescription,
            ticketDescriptionIconColor,
            ticketDescriptionError,

            ticketClient,
            ticketClientInput,
            focusTicketClient,
            ticketClientIconColor,
            ticketClientError,

            ticketProductName,
            ticketProductNameInput,
            focusTicketProductName,
            ticketProductNameIconColor,

            ticketDueDate,
            ticketDueDateInput,
            focusTicketDueDate,
            ticketDueDateIconColor,

            ticketPriority,
            ticketPriorityInput,
            focusTicketPriority,
            ticketPriorityIconColor,

            createTicket,
            successMessage
            }
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