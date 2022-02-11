<template>
    <q-dialog
            v-model="dialogContainer"
            persistent
            maximized
            
    >
        <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header bordered class="bg-white text-black">
            <q-toolbar>
                    <q-btn icon="arrow_back" flat round @click="goBack" />
                    <q-toolbar-title class="fs-20 ">Editar Ticket</q-toolbar-title> 
                    <q-avatar size="40px" >
                            <img src="imgs/drivenImg.png"/>
                    </q-avatar>
                    
                </q-toolbar>
            </q-header>

            <q-page-container>
                <q-page class="q-mt-lg pb-100">
                    <div class="q-mt-md  column justify-center items-center " v-if="loading"  > <!--Hace que aparezca centrado -->
                        <q-spinner   
                            color="primary"
                            size="3em"
                        />
                        <p class="text-grey-8  fs-14 mt-5" >{{loadingMessage}}</p>
                    </div>
                    <div v-else class="container">
                        <!--
                        <div class="col">
                            <p class="text-grey-8  q-mb-md">En esta sección podra editar la observación y agregar fotos al ticket.</p> 
                        </div>
                        -->
                       
                         <q-input   
                            autogrow
                            label="Observación" 
                            class="mt-20"
                            outlined
                            v-model="obeservation"
                        >
                        </q-input>
                        <p class="text-label">Imagen seleccionada</p>
                        <div v-if="listImg.length>0" class="mt-25">
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
                                <q-carousel-slide v-for="(img,index) in listImg" :key="index" 
                                            :img-src="img.webPath"  

                                            :name="index" class="column no-wrap flex-center uncropped-image">
                                              <q-icon @click="removeImgDialog(index)" class="absolute all-pointer-events remove-icon" size="lg" name="remove" color="white">
                                                <q-tooltip>
                                                        Eliminar
                                               </q-tooltip>
                                            </q-icon>
                                 </q-carousel-slide>
                            </q-carousel>
                        </div>
                        <div class="text-caption fs-13 image-text-container text-center" 
                            v-else > Aún no se adjunto una imagen
                        </div>
                    </div>
                    <!-- Boton de FAB -->
                    <q-page-sticky  position="bottom-right" :offset="fabPos">
                                <q-fab
                                    icon="expand_less"
                                    direction="up"
                                    color="secondary"
                                    :disable="draggingFab"
                                    v-touch-pan.prevent.mouse="moveFab"
                                >
                                    <q-fab-action @click="dialogFinalizateTicket" color="secondary" icon="done" label="Finalizar" :disable="draggingFab" /> 
                                    <q-fab-action @click="uploadImage" color="secondary" icon="update" label="Actualizar" :disable="draggingFab" />
                                    <q-fab-action v-if="listImg.length==0"  @click="takePicture" color="secondary" icon="add_a_photo" label="Foto" :disable="draggingFab" />

                                </q-fab>
                    </q-page-sticky>
                    <!-- Dialog para confirmar finalizar un ticket -->
                    <confirm-dialog  v-if="showConfirDialog" 
                                      @confirAction="confirAction"  
                                      @cancelAction="showConfirDialog=false"
                                      :title="titleDialog"
                                      :message="msgDialog"
                                      :label="label"
                    />
                  
                    <!-- Dialog para mesaje de Error -->
                    <error-dialog
                            v-if="showErrorDialog"
                            :title="titleDialog"
                            :message="msgDialog"
                            @confirAction="showErrorDialog=false"
                    />
                    <!-- Dialog para confirmacion Exitosa -->
                    <succes-dialog
                        v-if="showSuccesDialog"
                        :title="titleDialog"
                        :message="msgDialog"
                        @confirAction="confirAction"
                    />
                    
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters,useActions} from 'src/store'
import { Camera, CameraResultType } from '@capacitor/camera'


import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';

import ConfirmDialog from 'src/components/Dialog/ConfirmDialog.vue'
import ErrorDialog from 'src/components/Dialog/ErrorDialog.vue'
import SuccesDialog from 'src/components/Dialog/SuccesDialog.vue'

export default defineComponent({
    components:{ ConfirmDialog,ErrorDialog,SuccesDialog },
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
        const fileBase64=ref("")
        const loading=ref(false) //para mostrar spinner cuando se finaliza o actualiza un ticket
        const loadingMessage=ref("")
        //dialog que contiene a toda la pagina, la pagina en si es un dialog
        const dialogContainer=ref(true)
        /*-------Atributos y acciones del dialog ----------------*/
        const showConfirDialog=ref(false)
        const showErrorDialog=ref(false)
        const showSuccesDialog=ref(false)
        const titleDialog=ref('')
        const msgDialog=ref('')
        const confirAction=ref(null)
        const label=ref('')


        //-----
        const goBackText=ref("")
        //Dialog para mensajes de confirmacion
        const succesDialog=(title,message,okAction=goBack)=>{
             showSuccesDialog.value=true
             titleDialog.value=title
             msgDialog.value=message
             confirAction.value=okAction
             
        }
        //Dialog para mensajes de error
        const errorDialog=(title,message)=>{
             showErrorDialog.value=true
             titleDialog.value=title
             msgDialog.value=message
        }
        //Dialog para confirmar si finalizamos un ticket
        const dialogFinalizateTicket=()=>{
            showConfirDialog.value=true
            titleDialog.value="Finalizar Ticket"
            msgDialog.value="Estas seguro que desea finalizar el ticket?"
            label.value="Finalizar"
            confirAction.value=closeTicket
        }

        /*---------- Observation ---------------------*/
        const obeservation=ref('')
        /*------------- Ticket -------------------------- */
        const ticketId=ref(route.params.id)
        const {getTicketById}=useGetters()
        const {uploadImageTicket}=useActions()
        const {finalizateTicket}=useActions()
        const ticket=computed(()=>{
            return getTicketById.value(ticketId.value)
        })
        
        //Funcion que se encarga de finalizar un ticket en el servidor
        const closeTicket=async()=>{
            if(!ticket.value.images ){ //si el ticket aun no tiene imagenes adjuntas, no se puede finalizar
                    errorDialog("Sin imágenes","El ticket no puede finalizarse sin imágenes subidas")
                    showConfirDialog.value=false
                    return
            }
            loading.value=true
            loadingMessage.value="Finalizando ticket"
            const {data,error}=await finalizateTicket({ticketId:ticketId.value})
            if(data){
                //Funcion a llamar cuando se apriete ok en el dialog
                const okDialog=()=>{
                    dialogContainer.value=false
                    showConfirDialog.value=false
                    setTimeout(()=>{
                        router.replace({path:'/'})
                    },200)
                }
                loading.value=false
                loadingMessage.value=""
                succesDialog('Finalizado','El ticket se finalizo con éxito',okDialog)
            }else{
                showConfirDialog.value=false
                loading.value=false
                loadingMessage.value=""
                errorDialog('Error','No se pudo finalizar el ticket, inténtelo mas tarde')
            } 
            
        }
        //Actualizar un ticket en el servidor
        const uploadImage= async()=>{
            if(!listImg.value.length){
                    errorDialog("Sin imágenes","Adjunte una imagen para actualizar el ticket")
                    showConfirDialog.value=false
                    return
            }
            //Mensaje del spinner
            loading.value=true
            loadingMessage.value="Actualizando ticket"

            let fileBase64= await readFilePath(listImg.value[0])
            const params={
                file:fileBase64,
                ticketId:ticketId.value,
                fileName: `TICKET ${ticket.value.ticket_number}`
            } 
            const {data,error}=await uploadImageTicket(params)
            if(data){
                loading.value=false
                loadingMessage.value=""
                succesDialog('Actualizado','El ticket se actualizo con éxito') 
            }
            else {
                loading.value=false
                loadingMessage.value=""
                errorDialog('Error','No se pudo actualizar el ticket, inténtelo mas tarde')
            }
        }

        const readFilePath = async (image) => {
            // Here's an example of reading a file with a full file path. Use this to
            // read binary data (base64 encoded) from plugins that return File URIs, such as
            // the Camera.
            const contents = await Filesystem.readFile({
                path: image.path
            });
            if(contents) return contents.data
            else return image.path
            
        };
        //Volver a la pantalla de atras
        const goBack= async()=>{
            dialogContainer.value=false
            setTimeout(()=>{
                //router.replace({path:'/'})
                router.go(-1)
            },200)   
        }

        App.addListener("backButton",({canGoBack})=>{
            goBackText.value="saliiir" + str(canGoBack)
            setTimeout(()=>{
                goBackText.value="saliiir" + str(canGoBack)
                window.history.back()
            },3000)
        })
        
        App.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active?', isActive);
        });
        

        /*-------------------Images And Camera ---------------------*/

        //const listImg=ref(['https://cdn.quasar.dev/img/parallax2.jpg','https://cdn.quasar.dev/img/mountains.jpg','https://cdn.quasar.dev/img/parallax1.jpg'])
        const listImg=ref([])
        const imageSrc = ref('')
        const imageSelected=ref(null) //variable que guarda el indice de la imagen que se quiere eliminar

        //dialog para confirma la eliminacion de una imagen
        const removeImgDialog=(indexImage)=>{
             imageSelected.value=indexImage
             showConfirDialog.value=true
             titleDialog.value='Eliminar imagen'
             msgDialog.value='Estas seguro que desea eliminar la imagen'
             label.value="Eliminar"
             confirAction.value=removeImg
             
        }

        //funcion que elimina la imagen de la lista
        const removeImg=()=>{
            listImg.value=listImg.value.filter((_,index)=>index!=imageSelected.value)
            showConfirDialog.value=false
        }

        //Funcion que toma una imagen desde el telefono
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
            
            listImg.value.push(image)
        };
        
        
        
        return{
            ticketId,
            ticket,
            goBack,
            dialogContainer,
            obeservation,
            uploadImage,
            closeTicket,
            fabPos,
            draggingFab,
            moveFab,
            takePicture,
            imageSrc,
            listImg,
            removeImgDialog,
            removeImg,
            titleDialog,
            msgDialog,
            confirAction,
          
            slide: ref(0),
            dialogFinalizateTicket,
            showConfirDialog,
            showErrorDialog,
            showSuccesDialog,
            label,
            loading,
            loadingMessage,

            goBackText

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
.uncropped-image {
  background-size: contain;  /* don't crop the image  */
  background-repeat: no-repeat;  /* only show the image one time  */
  background-color: white;  /* color to fill empty space with  */
}

/* TEXT STYLES */
.text-label {
  color: #000;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 0.9rem;
}

/*IMAGE CONTAINER */
.image-text-container{
    background-color: rgba(33, 33, 33, 0.025);
    padding: 10px;
}

</style>