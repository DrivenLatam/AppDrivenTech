<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >
        <q-layout view="hHh lpR fFf" class="bg-white">
            
            <custom-header title="Detalles tickets" @onGoBack="goBack" />
            <q-page-container>
                <q-page style="padding-bottom:70px">
                    <div class="mx-15 q-mt-lg">
                        <!--Primera Seccion -->
                        <div class=" row section shadow-1 q-mt-md">
                            <div class="col">
                                <div class="row justify-between">
                                    <p class="text-value text-value__bold  q-my-sm q-py">#{{ticket.ticket_number}}</p>
                                    <div class="text-bold mt-5 " ><q-badge  :color="ticketStatusColor " class="text-value text-white py-6 "  :label="ticket.status" /></div>
                                </div>
                                <p class=" text-value  q-my-sm">{{ticket.subject}}</p>
                                <div class="text-label q-my-sm"> Prioridad <q-badge outline class=" ml-5 text-value" color="black" :label="ticket.priority" /></div>
                            </div>
                        </div>
                        

                        <!--Segunda Seccion -->
                        <div class="section shadow-1 q-mt-md">   
                            <input-text label="Cliente" class="my-5" :value="ticket.contact.name" />
                            <input-text label="Producto" :value="ticket.product_name" />
                            <input-text label="Vencimiento" :value="formattedDate" />
                            <input-text label="Descripción" :value="ticket.description" />
                        </div>
                        

                        <!-- Cuarta seccion, para ver las fotos de un ticket-->
                        <div class="section shadow-1 q-mt-md">
                            <p class="text-label">Imágenes subidas</p>
                            <div v-if="ticketImages" class="q-mt-md">
                                <q-carousel
                                    v-if="ticketImages.length>0"
                                    v-model="slide"
                                    transition-prev="jump-right"
                                    transition-next="jump-left"
                                    swipeable
                                    animated
                                    control-color="primary"
                                    navigation
                                    control-type="regular"
                                    arrows
                                    height="300px"
                                    class="text-white shadow-1 rounded-borders"
                                >
                                    <q-carousel-slide v-for="(img,index) in ticketImages" 
                                                :key="index" 
                                                :img-src="'data:image/gif;base64,'+ img.image_base64"  
                                                :name="index" 
                                                class="column no-wrap flex-center uncropped-image">       
                                    </q-carousel-slide>
                                </q-carousel>
                                <div v-else  class="text-caption fs-13  image-text-container">
                                    <p v-if="ticket.status=='Abierto'" >
                                        El ticket aún no tiene imágenes adjuntas, puede agregarlo haciendo click  
                                        <span @click="goToEditTicket" class="underline text-primary text-bold"> aquí</span>
                                    </p>
                                    <p v-else class="text-center">
                                        El ticket no tiene imágenes adjuntas
                                    </p>
                                </div> 
                            </div>
                                <q-card v-else class="q-mt-md my-card column justify-center items-center ">
                                    <q-spinner
                                        color="primary"
                                        size="3em"
                                    />
                                    <p class="text-weight-light fs-15 mt-5" >Cargando imágenes</p>
                                </q-card>
                            </div>
                            <!--GO TO EDIT TICKET BUTTOM -->
                            <btn 
                                mx="15px"
                                v-if="ticket.status == 'Abierto'" 
                                label="Editar Ticket" @click="goToEditTicket" />
                    </div>
                    
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters,useActions,useMutations} from 'src/store'
import Edit from 'src/components/tickets/Edit.vue'
import Btn from 'src/components/Btn.vue'
import CustomHeader from 'src/components/CustomHeader.vue'
import InputText from 'src/components/InputText.vue'
export default defineComponent({
    components:{
        Edit,CustomHeader,Btn,InputText
     },
    setup() {
        const route=useRoute()
        const router=useRouter()
        const dialog= ref(true)
        const ticketId=ref(route.params.id)
        const {getTicketById}=useGetters()
        const imgDriven=ref("imgs/drivenImg.png")
        const slide=ref(true)
        //Ticket
        const {getTicketImages}=useActions()
        const {updateTicket}=useMutations()
        const ticket=computed(()=>{
            return getTicketById.value(ticketId.value)
        })
        //Ticket atributes
        const ticketStatusColor=computed(()=> ticket.value.status=='Abierto' ? 'positive' : ticket.value.status=='Cerrado' ? 'primary' : 'warning' )
        const hasMobileContact=computed(()=>(ticket.value.contact.mobile!='Sin Informacion') ? true : false )
        const hasUrlDirection=computed(()=>(ticket.value.cf.cf_direccion_url!='Sin Informacion') ? true : false )
       // Imagenes del ticket
       const ticketImages=ref(null)
       const loadImageTickets=async()=>{    
           const {data,error}= await getTicketImages({ticketId:ticketId.value})
           if(data){
                //console.log("imageees",data)
                ticketImages.value=data
                updateTicket( {
                        ticketID:ticket.value.id,
                        ticketUpdated:{images:data.length,...ticket.value}
                        }
                    )
                slide.value=0
           }else{
               console.log("error..")
           }
       }
       

       loadImageTickets()

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
            const date=new Date(ticket.value.dueDate)
            if (date=='Invalid Date') return 'Sin Informacion'
            else return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} `
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
            goToEditTicket,
            slide,
            ticketImages
            }
    },
})
</script>
<style lang="scss" scoped>
.container{
    margin:0px 20px 0px;
}
p{
    margin: 5px 0px;
}
.link{
    text-decoration: underline;
    color: $blue;
}
.my-card{
  width: 100%;
  height:300px;
}
.uncropped-image {
  background-size: contain;  /* don't crop the image  */
  background-repeat: no-repeat;  /* only show the image one time  */
  background-color: white;  /* color to fill empty space with  */
}

/*SECTION STYLES */
.section{
    padding: 10px;
}

/* TEXT STYLES */
.text-value {
    font-size: 1rem;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.8);
}

.text-label {
  color: #000;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 0.9rem;
}
.text-value__bold{
    color: #000;
    font-weight: bold;
}

/*IMAGE CONTAINER */
.image-text-container{
    background-color: rgba(33, 33, 33, 0.025);
    padding: 10px;
}
</style>