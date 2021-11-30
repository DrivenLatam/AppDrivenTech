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
                      
                    </div>
                

                    <q-page-sticky  position="bottom-right" :offset="fabPos">
                                <q-fab
                                    icon="expand_less"
                                    direction="up"
                                    color="primary"
                                    :disable="draggingFab"
                                    v-touch-pan.prevent.mouse="moveFab"
                                >
                                   <!-- <q-fab-action @click="dialogFinalizateTicket" color="primary" icon="done" label="Finalizar" :disable="draggingFab" /> -->
                                    <q-fab-action @click="uploadImage" color="primary" icon="update" label="Actualizar" :disable="draggingFab" />
                                    <q-fab-action v-if="listImg.length==0"  @click="takePicture" color="primary" icon="add_a_photo" label="Foto" :disable="draggingFab" />

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
            const {data,error}=await finalizateTicket()
            //---------Aca validar que el ticket tenga obeservacion y que almenos el usuario adjunto una imagen al servidor
            if(data){
                //Funcion a llamar cuando se apriete ok en el dialog
                const okDialog=()=>{
                    dialogContainer.value=false
                    showConfirDialog.value=false
                    setTimeout(()=>{
                        router.replace({path:'/'})
                    },200)
                }
                succesDialog('Finalizado','El ticket se pudo finalizar con exito',okDialog)
            }else{
                showConfirDialog.value=false
                errorDialog('Error','No se pudo finalizar el ticket, intentelo mas tarde')
            } 
        }
        //Actualizar un ticket en el servidor
        const uploadImage= async()=>{
            
            let fileBase64= await readFilePath(listImg.value[0])
            const params={
                file:fileBase64,
                //file:model.value,
                ticketId:ticketId.value,
                fileName: `TICKET ${ticket.value.ticket_number}`
            }
            const {data,error}=await uploadImageTicket(params)
            if(data) succesDialog('Actualizado','El ticket se actualizo con exito')
            else errorDialog('Error','No se pudo actualizar el ticket, intentelo mas tarde')
            
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
    
        document.addEventListener('backbutton',()=>{
            goBack()
        })

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
            console.log('Eliminando Imagen con index',imageSelected.value)
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

</style>