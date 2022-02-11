<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >
        <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header class="header-background">
                <q-toolbar>
                    <q-btn icon="arrow_back" flat round @click="goBack" />
                    <q-toolbar-title class="fs-20 ">Crear Ticket</q-toolbar-title> 
                    
                    
                </q-toolbar>
            </q-header>
            <q-page-container>
                <q-page class="pb-20 q-mt-lg" style="margin-left: 1rem; margin-right:1rem ">
                    <div>
                        
                        <!-- <p class="text-grey-8 q-mb-md ">Complete los siguientes campos para crear un nuevo ticket, los campos con asterisco (*) son obligatorios. </p> -->
                        <div style="padding-bottom:45px" >
                            <q-input   
                                autofocus
                                outlined
                                label="Asunto(*)" 
                                class="mb-5"
                                v-model="ticketName"
                                :ref=" el=>ticketNameInput=el"
                                @focus="focusTicketName"
                                @blur="focusTicketName(false)"
                                :error="!!ticketNameError"
                                :error-message="ticketNameError"
                                :disable="loading"
                            >
                                <template v-slot:prepend>
                                        <q-icon :color="ticketNameIconColor" size="xs" name="subject"/>
                                </template>
                            </q-input>

                            <q-input   
                                autogrow
                                label="Descripción(*)" 
                                outlined
                                class="mb-5"
                                v-model="ticketDescription"
                                :ref="el=>ticketDescriptionInput=el"
                                @focus="focusTicketDescription"
                                @blur="focusTicketDescription(false)"
                                :error="!!ticketDescriptionError"
                                :error-message="ticketDescriptionError"
                                :disable="loading"
                            >
                                <template v-slot:prepend>
                                        <q-icon :color="ticketDescriptionIconColor" size="xs" name="description"/>
                                </template>
                            </q-input>

                            <!-- Nombre del Cliente-->
                            <q-input   
                                label="Seleccionar cliente(*)"   
                                outlined
                                class="mb-5"
                                v-model="ticketClient.name"
                                :ref="el=>ticketClientInput=el"
                                @focus="focusTicketClient"
                                @blur="focusTicketClient(false)"
                                :error="!!ticketClientError"
                                :error-message="ticketClientError"
                                @click="showListClient=true"
                                :disable="loading"
                            >
                                <template v-slot:prepend>
                                        <q-icon :color="ticketClientIconColor" size="xs" name="person"/>
                                </template>
                            </q-input>
                            
                            <!-- Vencimiento Fecha y Hora-->
                            <q-input outlined  v-model="ticketDueDate" 
                                    label="Fecha y hora de vencimiento" 
                                    class="mb-5"
                                    :ref="el=>ticketDueDateInput=el"
                                    @focus="focusTicketDueDate"
                                    @blur="focusTicketDueDate(false)"
                                    :error="!!ticketDueDateError"
                                    :error-message="ticketDueDateError"
                                    @click="showTicketDueDate=true"
                                    :disable="loading"
                                    >
                                <template v-slot:prepend>
                                    <q-icon :color="ticketDueDateIconColor" size="xs" name="event" class="cursor-pointer">
                                    <q-popup-proxy v-model="showTicketDueDate" transition-show="scale" transition-hide="scale">
                                        <q-date 
                                            v-model="ticketDueDate" 
                                            mask="DD/MM/YYYY HH:mm"
                                            
                                            >
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                        </q-date>
                                    </q-popup-proxy>
                                    </q-icon>
                                </template>

                                <template v-slot:append>
                                    <q-icon :color="ticketDueDateIconColor" size="xs" name="access_time" class="cursor-pointer">
                                    <q-popup-proxy  transition-show="scale" transition-hide="scale">
                                        <q-time v-model="ticketDueDate" mask="DD/MM/YYYY HH:mm" format24h>
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                        </q-time>
                                    </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>

                            <!-- Nombre del Producto-->
                            <q-input   
                                label="Nombre del producto(*)"  
                                outlined 
                                autogrow
                                class="mb-5"
                                v-model="ticketProduct.productName"
                                :ref="el=>ticketProductNameInput=el"
                                @focus="focusTicketProductName"
                                @blur="focusTicketProductName(false)"
                                @click="showListProducts=true"
                                :error="!!ticketProductError"
                                :error-message="ticketProductError"
                                :disable="loading"
                            >
                                <template v-slot:prepend>
                                        <q-icon :color="ticketProductNameIconColor" size="xs" name="inventory_2"/>
                                </template>
                            </q-input>

                            <!--Prioridar del ticket-->
                            <q-select 
                                    outlined  v-model="ticketPriority" 
                                    color="primary"  :options="['Alta','Media','Baja']" 
                                    label="Prioridad"
                                    :ref="el=>ticketPriorityInput=el"
                                    @focus="focusTicketPriority"
                                    @blur="focusTicketPriority(false)"
                                    :disable="loading"
                            >
                                <template v-slot:prepend>
                                        <q-icon :color="ticketPriorityIconColor" size="xs" name="priority_high" />
                                </template>
                            </q-select>
                           
                             <!--CREATE TICKET BUTTOM  
                            <div class="flex justify-center mt-20">

                                <q-btn no-caps @click="createTicket" class="py-5 px-50" color="primary" label="Crear Ticket" />
                            </div>
                              -->
                        </div>
                            
                      
                        <btn mx="1rem" @click="createTicket" label="Crear ticket" :loading="loading"  />  
                        
                       <!--Modales de mensajes de error y confirmacion -->
                        <succes-dialog 
                            v-if="successMessage"
                            title="Creado" 
                            message="El ticket se creó exitosamente" 
                            @confirAction="goBack" 

                        />

                        <error-dialog
                            v-if="errorMessage"
                            title="Error"
                            message="No se pudo crear el ticket, intentelo mas tarde"
                            @confirAction="errorMessage=false"
                        />
                    </div>
                    <!-- Componente para seleccionar el cliente -->
                    <contatcs 
                        v-if="showListClient" 
                        @hide-dialog="showListClient=false"
                        @client-selected="(e)=>ticketClient=e"
                    />

                    <!-- Componente para seleccionar el producto -->
                    <products 
                        v-if="showListProducts" 
                        @hide-dialog="showListProducts=false"
                        @client-selected="(e)=>ticketProduct=e"
                    />
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed,watch } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters,useActions} from 'src/store'
import SuccesDialog from 'src/components/Dialog/SuccesDialog.vue'
import ErrorDialog from 'src/components/Dialog/ErrorDialog.vue'
import Contatcs from 'src/components/tickets/Contacts.vue'
import Products from 'src/components/tickets/Products.vue'
import Btn from "src/components/Btn.vue"


export default defineComponent({
    components:{ SuccesDialog,ErrorDialog,Contatcs,Products,Btn },
    setup() {
        const route=useRoute()
        const router=useRouter()
        const dialog= ref(true)
        const focusedInput=ref(null)
        const successMessage=ref(false)
        const errorMessage=ref(false)
        const loading=ref(false)
        //---- getter, actions 
        const {addTicket}=useActions()
        const {user}=useGetters()

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
        const ticketClient=ref("")
        const showListClient=ref(false)
        const ticketClientInput=ref(null)
        const focusTicketClient=(state=true)=>{ 
                if(state) focusedInput.value=ticketClientInput.value 
                else if( focusedInput.value==ticketClientInput.value) focusedInput.value=null
        }
        const ticketClientIconColor=computed(()=> ticketClientError.value ? 'negative': focusedInput.value==ticketClientInput.value ? 'primary' : 'grey-8')
        const ticketClientError=ref('')
        watch(ticketClient,()=>ticketClientError.value="")
       


        //ticketProductName
        const ticketProduct=ref('')
        const showListProducts=ref(false)
        const ticketProductNameInput=ref(null)
        const focusTicketProductName=(state=true)=>{
                if(state)focusedInput.value=ticketProductNameInput.value
                else if(focusedInput.value==ticketProductNameInput.value) focusedInput.value=null
        }
        const ticketProductNameIconColor=computed(()=> ticketProductError.value ? 'negative': focusedInput.value==ticketProductNameInput.value ? 'primary' : 'grey-8')
        const ticketProductError=ref('')
        watch(ticketProduct,()=>ticketProductError.value="")


       //ticketDueDate
        const todayDate=ref(null) //fecha que sirve para validar la fecha seleccionada por el tecnico
        const ticketDueDate=ref(null)
        const ticketDueDateInput=ref('')
        const showTicketDueDate=ref(false)
        const focusTicketDueDate=(state=true)=>{
                if(state)focusedInput.value=ticketDueDateInput.value
                else if(focusedInput.value==ticketDueDateInput.value) focusedInput.value=null
        }
        const ticketDueDateIconColor=computed(()=> ticketDueDateError.value? 'negative': focusedInput.value==ticketDueDateInput.value ? 'primary' : 'grey-8')
        const ticketDueDateError=ref('')
        watch(ticketDueDate,()=>ticketDueDateError.value="")

        //verifica si la fecha ingresada es valida
        const validateDate=()=>{
            return new Date(parseDate(ticketDueDate.value)).getTime()>= new Date(parseDate(todayDate.value)).getTime()
        }
        //funcion que hace un formato de la fecha de la manera que el user entienda mejor
        const formattedDate=(currentDate=new Date())=>{
            const date=currentDate
            return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`
        }
        ticketDueDate.value=formattedDate()
        todayDate.value=formattedDate()

        const parseDate=(date)=>{
                const newDate=date.split(" ")[0].split("/").reverse().join("-") //obtenemos la fecha en el formato YYYY-MM-DD
                const time=date.split(" ")[1] //El time no  cambia
                return new Date(`${newDate} ${time}`).toISOString() 
        }
        
        
        //ticketPriority
        const ticketPriority=ref('Alta')
        const ticketPriorityInput=ref(null)
        const focusTicketPriority=(state=true)=>{
                if(state)focusedInput.value=ticketPriorityInput.value
                else if(focusedInput.value==ticketPriorityInput.value) focusedInput.value=null
        }
        const ticketPriorityIconColor=computed(()=> focusedInput.value==ticketPriorityInput.value ? 'primary' : 'grey-8')

        /*--------------------Crear ticket--------------------------*/

        const validateFields=()=>{
            if(!ticketName.value) {ticketNameError.value="Este campo no puede quedar vacio";return false}
            if(!ticketDescription.value){ticketDescriptionError.value= "Este campo no puede quedar vacio"; return false}
            if(!ticketClient.value){ticketClientError.value="Este campo no puede quedar vacio";return false}
            if(!validateDate()){ticketDueDateError.value="Fecha incorrecta, ingrese una fecha mayor o igual a la de hoy"; return false}
            if(!ticketProduct.value){ticketProductError.value="Este campo no puede quedar vacio";return false}

            return true
        }
        const createTicket=async()=>{
            loading.value=true 
           
            //validar campos con funcion validateField
            if(!validateFields()) {
                loading.value=false
                return
            }
            
            const body={
                subject:ticketName.value,
                description:ticketDescription.value,
                contactId:ticketClient.value.id,
                productId:ticketProduct.value.id,
                dueDate:parseDate(ticketDueDate.value), 
                priority:ticketPriority.value,
                country: user.value.country 
            }
            //console.log(body)
            const {data,error}=await addTicket({body})
            console.log('Crear ticket data',data)
            if(data){
                loading.value=false
                successMessage.value=true
            }else{
                loading.value=false
                errorMessage.value=true
            }
            
            
        }
        const goBack=()=>{
            dialog.value=false
            successMessage.value=false
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
            showListClient,
           
            ticketProduct,
            ticketProductNameInput,
            focusTicketProductName,
            ticketProductNameIconColor,
            showListProducts,

            ticketDueDate,
            ticketDueDateInput,
            focusTicketDueDate,
            ticketDueDateIconColor,
            ticketDueDateError,
            showTicketDueDate,

            ticketPriority,
            ticketPriorityInput,
            focusTicketPriority,
            ticketPriorityIconColor,
            ticketProductError,

            createTicket,
            successMessage,
            errorMessage,
            loading,
            }
    },
})
</script>
<style lang="scss" scoped>
.item-detail{
    margin-top: 5   px;
}
.title-detail{
    margin:5px;
    padding-bottom: 0px;
}
.header-background{
    background: linear-gradient(to right,$primary, $secondary);
}
</style>