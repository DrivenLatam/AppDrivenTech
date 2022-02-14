<template>
    <q-dialog
            v-model="dialogContainer"
            persistent
            maximized
            
    >
        <q-layout view="hHh lpR fFf" class="bg-white">
            <custom-header title="Editar ticket" @onGoBack="goBack"/>

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
                        <div class="image-container  rounded-borders" v-if="listImg.length>0" >
                            <div  class="" v-for="(img,index) in listImg" :key="index">
                                <q-img style="height: 60vh;"
                                fit="fill" 
                                class="rounded-borders "
                                :src="img.webPath" />
                                
                                <q-icon @click="removeImgDialog(index)" class="remove-icon" size="lg" name="remove" color="white">
                                    <q-tooltip> Eliminar</q-tooltip>
                                </q-icon>
                            </div>
                            
                        </div>
                         <!--UPLOAD IMAGE SECTION -->
                        <div v-else class="image-container border-dashed rounded-borders column justify-center items-center">
                            <q-icon  @click="takePicture"  name="upload" size="5.5rem" color="primary" class="mb-20"/>
                            <div class="text-center px-45 mb-40">
                                <p class="text-label">Agregar imagenes aquí</p>
                                <p class="text-value">Selecciona la imagen que se adjuntara al ticket </p>
                            </div>
                            <q-btn   @click="takePicture" outline rounded size="0.8rem" color="secondary" label="Seleccionar imagen" />
                        </div>
                        <btn v-if="listImg.length>0" label="Subir imagen" @click="uploadImage" mx="1.5rem" />
                        <btn v-else label="Finalizar ticket" mx="1.5rem" @click="dialogFinalizateTicket" />
                    </div>
                    

                   

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
import CustomHeader from 'src/components/CustomHeader.vue'
import Btn from 'src/components/Btn.vue'
export default defineComponent({
    components:{ ConfirmDialog,ErrorDialog,SuccesDialog,CustomHeader,Btn },
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
    margin: 0px 1.5rem;
    height: 60vh;
    position: relative;
}
p{
    margin: 5px 0px;
}
.link{
    text-decoration: underline;
    color: $blue;
}
.remove-icon{
    top: 10px; 
    right: 25px; 
    background-color:$primary;
    opacity: 0.9;
    border-radius: 50%;
    position: absolute;
}
.uncropped-image {
  background-size: contain;  /* don't crop the image  */
  background-repeat: no-repeat;  /* only show the image one time  */
  background-color: white;  /* color to fill empty space with  */
}

/* IMAGE UPLOAD STYLES*/
.image-text-container{
    background-color: rgba(33, 33, 33, 0.025);
    padding: 10px;
}

.image-container{
    background-color: rgba(33, 33, 33,0.025);
    height: 60vh;
    
}   
.border-groove{
    border : 1px groove rgba(0, 0, 0, 0.5);
}
.border-dashed{
    border : 2px dashed rgba(0, 0, 0, 0.6);
}
.rounded-borders{
    border-radius:10px;
}

/* TEXT STYLES */
.text-value {
    font-size: 0.9rem;
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
  font-size: 1.2rem;
}
.text-value__bold{
    color: #000;
    font-weight: bold;
}
</style>