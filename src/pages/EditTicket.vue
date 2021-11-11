<template>
    <q-dialog
            v-model="dialogContainer"
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
                <q-page class="mt-20 pb-100">
                    <div class="container">
                        <div class="col">
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
                        
                        <div v-if="listImg.length>0" class="mt-25">
                            <p class="text-grey-9 fs-20">Images adjuntadas: </p>
                            
                            <q-carousel
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
                                <q-carousel-slide v-for="(img,index) in listImg" :key="index" :img-src="img" :name="index" class="column no-wrap flex-center">
                                              <q-icon @click="removeImgDialog(index)" class="absolute all-pointer-events remove-icon" size="lg" name="remove" color="white">
                                                <q-tooltip>
                                                        Eliminar
                                               </q-tooltip>
                                            </q-icon>
                                 </q-carousel-slide>
                            </q-carousel>
                        </div>
                    </div>
                     <!--Dialog para confirmar si se quiere finalizar un ticket -->
                    <q-dialog v-model="showDialog">
                        <q-card>
                            <q-card-section class="bg-primary text-white fs-20 py-20">
                                {{titleDialog}}
                            </q-card-section>

                            <q-card-section class="bg-white text-grey-9 q-py-lg">
                                {{msgDialog}}
                            </q-card-section>

                            <q-card-actions align="right">
                                 <q-btn v-if="cancelAction" flat label="Cancelar" color="primary" v-close-popup />
                                 <q-btn flat @click="confirAction" label="Ok" color="primary" v-close-popup />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>

                    <q-page-sticky  position="bottom-right" :offset="fabPos">
                                <q-fab
                                    icon="expand_less"
                                    direction="up"
                                    color="primary"
                                    :disable="draggingFab"
                                    v-touch-pan.prevent.mouse="moveFab"
                                >
                                    <q-fab-action @click="finalizateTicket" color="primary" icon="done" label="Finalizar" :disable="draggingFab" />
                                    <q-fab-action @click="saveTicket" color="primary" icon="save" label="Guardar" :disable="draggingFab" />
                                    <q-fab-action  @click="takePicture" color="primary" icon="add_a_photo" label="Foto" :disable="draggingFab" />

                                </q-fab>
                    </q-page-sticky>
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters} from 'src/store'
import { Camera, CameraResultType } from '@capacitor/camera'

export default defineComponent({
    setup() {
        const route=useRoute()
        const router=useRouter()
        //Fab
        const fabPos = ref([35, 18 ])
        const draggingFab = ref(false)
        const moveFab= (ev)=>{
                draggingFab.value = ev.isFirst !== true && ev.isFinal !== true
                fabPos.value = [
                fabPos.value[ 0 ] - ev.delta.x,
                fabPos.value[ 1 ] - ev.delta.y
                ]
        }
        //dialog que contiene a toda la pagina, la pagina en si es un dialog
        const dialogContainer=ref(true)
        
        /*-------Atributos y acciones del dialog ----------------*/
        const showDialog=ref(false)
        const titleDialog=ref('')
        const msgDialog=ref('')
        const confirAction=ref(null)
        const cancelAction=ref(false)

        /*---------- Observation ---------------------*/
        const obeservation=ref('')

        /*------------- Ticket -------------------------- */
        const ticketId=ref(route.params.id)
        const {getTicketById}=useGetters()
        const ticket=computed(()=>{
            return getTicketById.value(ticketId.value)
        })

        //Dialog para guaradar ticket
        const saveTicket=()=>{
             showDialog.value=true
             titleDialog.value='Guardado '
             msgDialog.value='El ticket se guardo exitosamente, podra editarlo mas adelante si lo desea'
             confirAction.value=goBack
             cancelAction.value=false
        }

        //Funcion que se encarga de finalizar un ticket
        const closeTicket=()=>{
            dialogContainer.value=false
            showDialog.value=true
            setTimeout(()=>{
                //router.replace({path:'/'})
                router.replace({path:'/'})
            },200)
        }
        //Dialog de confirmacion para finalizar un ticket
        const finalizateTicket=()=>{
             showDialog.value=true
             titleDialog.value='Finalizar Ticket'
             msgDialog.value='Estas seguro que desea finalizar el ticket'
             confirAction.value=closeTicket
             cancelAction.value=true
        }
        //Volver a la pantalla de atras
        const goBack=()=>{
            dialogContainer.value=false
            setTimeout(()=>{
                //router.replace({path:'/'})
                router.go(-1)
            },200)

        }
        document.addEventListener('backbutton',()=>{
            goBack()
        })

        /*-------------------Images And Camera ---------------------*/

        const listImg=ref(['https://cdn.quasar.dev/img/parallax2.jpg','https://cdn.quasar.dev/img/mountains.jpg','https://cdn.quasar.dev/img/parallax1.jpg'])
        const imageSrc = ref('')
        const imageSelected=ref(null) //variable que guarda el indice de la imagen que se quiere eliminar

        //dialog para confirma la eliminacion de una imagen
        const removeImgDialog=(indexImage)=>{
             imageSelected.value=indexImage
             showDialog.value=true
             titleDialog.value='Eliminar imagen'
             msgDialog.value='Estas seguro que desea eliminar la imagen'
             confirAction.value=removeImg
             cancelAction.value=true
        }

        //funcion que elimina la imagen de la lista
        const removeImg=()=>{
            console.log('Eliminando Imagen con index',imageSelected.value)
            listImg.value=listImg.value.filter((_,index)=>index!=imageSelected.value)
            showDialog.value=true
        }
        const takePicture = async () => {
        
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Uri
            });

            // image.webPath will contain a path that can be set as an image src.
            // You can access the original file using image.path, which can be
            // passed to the Filesystem API to read the raw data of the image,
            // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
            imageSrc.value = image.webPath
            listImg.value.push(image.webPath)
        };
        
        
        
        return{
            ticketId,
            ticket,
            goBack,
            dialogContainer,
            obeservation,
            saveTicket,
            closeTicket,
            fabPos,
            draggingFab,
            moveFab,
            takePicture,
            imageSrc,
            listImg,
            removeImgDialog,
            removeImg,
            finalizateTicket,
            showDialog,
            titleDialog,
            msgDialog,
            confirAction,
            cancelAction,
            slide: ref(0),
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
.remove-icon{
    top: 8px; 
    right: 8px; 
    background-color:rgba(0, 0, 0, 0.5);
    opacity: 0.9;
    border-radius: 50%;
}
 
</style>