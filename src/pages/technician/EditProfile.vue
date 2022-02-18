<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >   
    <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header  class="header-background">
                <q-toolbar>
                    <q-btn icon="arrow_back" flat round @click="goBack" />
                    <q-toolbar-title class="fs-20">Editar Perfil</q-toolbar-title> 
                </q-toolbar>
            </q-header>

            <q-page-container >
                <q-page >
                    <q-scroll-area  style="height: calc(100vh - 115px); max-width: 100%;"> 
                        <!-- TECHNICIAN IMAGE SECTION -->
                        <div class=" profile-image-container column justify-center items-center">
                            <div style="position:relative;">
                                <q-avatar class="" size="10rem" >
                                    <img fit="contain"  
                                        v-if="profileImageSrc" 
                                        :src="profileImageSrc" />
                                    <img v-else class="" src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg">
                                </q-avatar>
                                <q-icon @click="takePicture"
                                        class="phone-camera-icon" size="md"
                                        name="photo_camera" color="white"/>
                            </div>
                            
                        </div>
                        <!-- INPUTS -->

                                <!-- NICKNAME INPUT -->
                            <q-input autofocus v-model="nickName" outlined :disable="sendingUpdate" 
                                    label="Nombre usuario" 
                                    :class=" ['input', nickNameError &&  'message-input-error'] "
                                    :ref="el=>nickNameInput=el"
                                    @focus="focusNickName"
                                    @blur="focusNickName(false)"
                                    :error="!!nickNameError"
                                    :error-message="nickNameError"
                                    maxlength="70"
                                     >
                                <template v-slot:prepend>
                                    <q-icon  name="person" :color="nickNameIconColor"  />
                                </template>
                            </q-input>
                            <!-- EMAIL INPUT -->
                            <q-input v-model="email"  outlined :disable="sendingUpdate"  
                                    label="Correo electronico"
                                    :class=" ['input', emailError &&  'message-input-error'] "
                                    :ref="el=>emailInput=el"
                                    @focus="focusEmail"
                                    @blur="focusEmail(false)"
                                    :error="!!emailError"
                                    :error-message="emailError"
                                     >
                                <template v-slot:prepend>
                                    <q-icon  name="email" :color="emailIconColor" />
                                </template>
                            </q-input>

                            <!-- ADDRESS INPUT -->
                            <q-input v-model="address"  autogrow outlined :disable="sendingUpdate"  
                                    label="Direccion" 
                                    :class=" ['input', addressError &&  'message-input-error'] "
                                    :ref="el=>addressInput=el"
                                    @focus="focusAddress"
                                    @blur="focusAddress(false)"
                                    :error="!!addressError"
                                    :error-message="addressError"
                                     >
                                <template v-slot:prepend>
                                    <q-icon  name="home" :color="addressIconColor" />
                                </template>
                            </q-input>
                            
                            <!-- BIRTHDAY INPUT -->
                           
                            <q-input outlined v-model="birthday" @click="showBirthdayDate=true"
                                     label="Fecha Nacimiento"  
                                     :class=" ['input', birthdayError &&  'message-input-error'] "
                                     :disable="sendingUpdate"
                                     :ref="el=>birthdayInput=el"
                                     @focus="focusBirthday"
                                     @blur="focusBirthday(false)"
                                     :error="!!birthdayError"
                                     :error-message="birthdayError"
                                     >
                                <template v-slot:prepend>
                                    <q-icon name="event" class="date_range" :color="birthdayIconColor" >
                                        <q-popup-proxy v-model="showBirthdayDate" ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="birthday" minimal mask="DD/MM/YYYY" >
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>

                            <!-- TELEPHONE  INPUT -->
                            <q-input v-model="phoneNumber"     outlined :disable="sendingUpdate"  
                                    :ref="el=>phoneInput=el"
                                    @focus="focusPhone"
                                    @blur="focusPhone(false)"
                                    :error="!!phoneError"
                                    :error-message="phoneError"
                                    label="Telefono" 
                                    :class=" ['input', phoneError &&  'message-input-error'] "
                                    maxlength="17"
                                    type="number"
                                     >
                                <template v-slot:prepend>
                                    <q-icon  name="phone" :color="phoneIconColor"  />
                                </template>
                            </q-input>
                            <!--
                             COUNTRY INPUT 
                            <q-select  outlined :disable="sendingUpdate" 
                                    v-model="country"  label="Pais" class="input " 
                                    :options= "[{ label: 'Paraguay', value: 'PY' }, { label: 'Uruguay', value: 'UY' }] "
                                    >
                                <template v-slot:prepend>
                                    <q-icon  name="flag"  />
                                </template>
                            </q-select>
                            -->
                            <!-- FIRTS AND LAST NAME-->
                            <div class="row no-wrap input justify-between" >
                                <q-input v-model="firstName" autogrow style="margin-right:4px;" outlined :disable="sendingUpdate"  
                                    label="Nombre "
                                    :ref="el=>firstNameInput=el"
                                    @focus="focusFirstName"
                                    @blur="focusFirstName(false)"
                                    :error="!!firstNameError"
                                    :error-message="firstNameError"
                                    :class=" [firstNameError &&  'message-input-error'] "
                                      >
                                    <template v-slot:prepend>
                                        <q-icon  name="contact_page" :color="firstNameIconColor"  />
                                    </template>
                                </q-input>
                                <q-input v-model="lastName"   autogrow  outlined :disable="sendingUpdate"  
                                        label="Apellido" 
                                        :ref="el=>lastNameInput=el"
                                        @focus="focusLastName"
                                        @blur="focusLastName(false)"
                                        :error="!!lastNameError"
                                        :error-message="lastNameError"
                                        :class=" [lastNameError &&  'message-input-error'] "
                                         >
                                    <template v-slot:prepend>
                                        <q-icon  name="contact_page" :color="lastNameIconColor"  />
                                    </template>
                                </q-input>
                            </div>
                            <!-- DNI INPUT -->
                            <q-input v-model="dni"     outlined :disable="sendingUpdate"  
                                    label="Cedula" 
                                    :class=" ['input', dniError &&  'message-input-error'] "
                                    :ref="el=>dniInput=el"
                                    @focus="focusDni"
                                    @blur="focusDni(false)"
                                    :error="!!dniError"
                                    :error-message="dniError"
                                    maxlength="40"
                                    type="number"
                                     >
                                    <template v-slot:prepend>
                                        <q-icon  name="perm_identity"  :color="dniIconColor" />
                                    </template>
                            </q-input>
                        </q-scroll-area>
                       
                        <!--DIALOG -->
                        <!-- SUCCES -->
                        <succes-dialog v-if="succesDialog"
                                       title="Actualizado" 
                                       message="Se actualizaron los datos correctamente"
                                       @confirAction="goBack"
                                        />
                        <!-- ERROR-->
                        <error-dialog   v-if="errorDialog"
                                        title="Error" 
                                        message="No se pudieron actualizar los datos, intentelo mas tarde"
                                        @confirAction="errorDialog=false"
                                        />

                        
                        <!--SAVE BUTTOM -->
                        <btn mx="1.3rem"  label="Guardar" @click="saveProfile" :loading="sendingUpdate"/>  
                </q-page>
            </q-page-container>
        </q-layout>
    </q-dialog>
</template>

<script>
import { defineComponent,ref,computed,watch } from 'vue'
import {useRouter} from 'vue-router'
import {useActions, useGetters} from 'src/store'

import { Camera, CameraResultType } from '@capacitor/camera'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';

import Btn from "src/components/Btn.vue"
import SuccesDialog from 'src/components/Dialog/SuccesDialog.vue'
import ErrorDialog from 'src/components/Dialog/ErrorDialog.vue'
export default defineComponent({
    components:{
        Btn,SuccesDialog,ErrorDialog
    },
    setup() {
        //
        //----------GLOBAL-------------
        //
        const focusedInput=ref(null)
        //dialog
        const dialog=ref(true)
        const succesDialog=ref(false)
        const errorDialog=ref(false)
        // Router
        const router=useRouter()

        //
        //TECHNICIAN
        //
        const {user}=useGetters()
        const {updateTechnicianToServer} =useActions()
        const sendingUpdate=ref(false)
        //Update technician profile data in the server
        const saveProfile= async()=>{
            sendingUpdate.value=true
            const technician={
                    nickname:nickName.value, email:email.value, phone_number:phoneNumber.value,
                    first_name:firstName.value, last_name:lastName.value,  nro_ci:dni.value
            }
            //console.log("technician....",technician)
            if(!isValidated()){
                sendingUpdate.value=false
                return
            }
            
            const {data,error}=await updateTechnicianToServer(technician)
            sendingUpdate.value=false
            if(data){
                console.log("Actualizado")
                succesDialog.value=true
            }else{
                errorDialog.value=true
            }
        }
        //Validate if technician's data is ok before send an request in the server
        const isValidated=()=>{
            console.log("email",email.value)
            if(!email.value) {
                emailError.value = "Este campo no puede quedar vacio" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }
            if(!emailPattern.test(email.value)) {
                emailError.value = "Ingrese un correo electronico valido" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }
            if(!nickName.value) {
                nickNameError.value = "Este campo no puede quedar vacio" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }  
            if(!firstName.value) {
                firstNameError.value = "Este campo no puede quedar vacio" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }
            if(!lastName.value) {
                lastNameError.value = "Este campo no puede quedar vacio" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }
            if(!dni.value) {
                dniError.value = "Este campo no puede quedar vacio" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }
            if(!phoneNumber.value) {
                phoneError.value = "Este campo no puede quedar vacio" //TO-DO: validar que el email no sea repetido en el servidor
                return false
            }       
            return true
        }
        //
        //------------INPUTS--------------
        //

        //
        //PROFILE IMAGE
        //

        //take a picture from the phone
        const profileImage=ref("")
        const profileImageSrc=ref("")
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
            profileImageSrc.value = image.webPath
            profileImage.value=image
        };

        // 
        //  NICKNAME
        //
        const nickName=ref(user.value.nickname)
        const nickNameInput=ref(null)
        const focusNickName=(state=true)=>{
            if(state) focusedInput.value=nickNameInput.value
            else if(focusedInput.value==nickNameInput.value)focusedInput.value=null
        }
        const nickNameIconColor=computed(()=> nickNameError.value? 'negative': focusedInput.value==nickNameInput.value ? 'primary' : 'grey-8')
        const nickNameError=ref('')
        watch(nickName,()=>nickNameError.value="")

        //
        //  EMAIL
        //
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const email=ref(user.value.email)
        const emailInput=ref(null)
        const focusEmail=(state=true)=>{
            if(state) focusedInput.value=emailInput.value
            else if(focusedInput.value==emailInput.value)focusedInput.value=null
        }
        const emailIconColor=computed(()=> emailError.value? 'negative': focusedInput.value==emailInput.value ? 'primary' : 'grey-8')
        const emailError=ref('')
        watch(email,()=>emailError.value="")
        //
        //  PHONE
        //
        const phoneNumber=ref(user.value.phone_number)
        const phoneInput=ref(null)
        const focusPhone=(state=true)=>{
            if(state) focusedInput.value=phoneInput.value
            else if(focusedInput.value==phoneInput.value)focusedInput.value=null
        }
        const phoneIconColor=computed(()=> phoneError.value? 'negative': focusedInput.value==phoneInput.value ? 'primary' : 'grey-8')
        const phoneError=ref('')
        watch(phoneNumber,()=>phoneError.value="")
        //
        //  FIRST NAME
        //
        const firstName=ref(user.value.first_name )
        const firstNameInput=ref(null)
        const focusFirstName=(state=true)=>{
            if(state) focusedInput.value=firstNameInput.value
            else if(focusedInput.value==firstNameInput.value)focusedInput.value=null
        }
        const firstNameIconColor=computed(()=> firstNameError.value? 'negative': focusedInput.value==firstNameInput.value ? 'primary' : 'grey-8')
        const firstNameError=ref('')
        watch(firstName,()=>firstNameError.value="")
        //
        //  LAST NAME
        //
        const lastName=ref( user.value.last_name)
        const lastNameInput=ref(null)
        const focusLastName=(state=true)=>{
            if(state) focusedInput.value=lastNameInput.value
            else if(focusedInput.value==lastNameInput.value)focusedInput.value=null
        }
        const lastNameIconColor=computed(()=> lastNameError.value? 'negative': focusedInput.value==lastNameInput.value ? 'primary' : 'grey-8')
        const lastNameError=ref('')
        watch(lastName,()=>lastNameError.value="")
        //
        //  DNI
        //
        const dni=ref(user.value.nro_ci)
        const dniInput=ref(null)
        const focusDni=(state=true)=>{
            if(state) focusedInput.value=dniInput.value
            else if(focusedInput.value==dniInput.value)focusedInput.value=null
        }
        const dniIconColor=computed(()=> dniError.value? 'negative': focusedInput.value==dniInput.value ? 'primary' : 'grey-8')
        const dniError=ref('')
        watch(dni,()=>dniError.value="")
        
        /*
        //
        //  COUNTRY     
        //
        const getCountry=computed( _=>user.value.country=="PY" ?  {label:"Paraguay",value:"PY"} : {label:"Uruguay",value:"UY"} )
        const country=ref(getCountry.value)
       */
        //
        //  ADDRESS     
        //
        const address=ref("")
        const addressInput=ref(null)
        const focusAddress=(state=true)=>{
            if(state) focusedInput.value=addressInput.value
            else if(focusedInput.value==addressInput.value)focusedInput.value=null
        }
        const addressIconColor=computed(()=> addressError.value? 'negative': focusedInput.value==addressInput.value ? 'primary' : 'grey-8')
        const addressError=ref('')
        watch(address,()=>addressError.value="")
        //
        //  BIRTHDAY     
        //
        const birthday=ref("")
        const birthdayInput=ref(null)
        const focusBirthday=(state=true)=>{
            if(state) focusedInput.value=birthdayInput.value
            else if(focusedInput.value==birthdayInput.value)focusedInput.value=null
        }
        const birthdayIconColor=computed(()=> birthdayError.value? 'negative': focusedInput.value==birthdayInput.value ? 'primary' : 'grey-8')
        const birthdayError=ref('')
        watch(birthday,()=>birthdayError.value="")
        
        //go back to previus page
        const goBack = ()=>{
                dialog.value=false
                setTimeout(_=>router.go(-1),200)     
        }   

        return {
            goBack,
            dialog,

            nickName,
            nickNameInput,
            focusNickName,
            nickNameIconColor,
            nickNameError,

            email,
            emailInput,
            focusEmail,
            emailIconColor,
            emailError,

            phoneNumber,
            phoneInput,
            focusPhone,
            phoneIconColor,
            phoneError,

            dni,
            dniInput,
            focusDni,
            dniIconColor,
            dniError,

            firstName,
            firstNameInput,
            focusFirstName,
            firstNameIconColor,
            firstNameError,
            
            lastName,
            lastNameInput,
            focusLastName,
            lastNameIconColor,
            lastNameError,
            
            address,
            addressInput,
            focusAddress,
            addressIconColor,
            addressError,

            birthday,
            birthdayInput,
            focusBirthday,
            birthdayIconColor,
            birthdayError,

            saveProfile,
            sendingUpdate,
            succesDialog,
            errorDialog,
            showBirthdayDate:ref(false),
            takePicture,
            profileImageSrc

        }
    },
})
</script>
<style  lang="scss" scoped>
*{
    margin: 0px;
    padding: 0px;
}
.profile-image-container{
    height: 30vh;
    width: 100%;
    background: linear-gradient(to right,$primary, $secondary);
    
} 
.phone-camera-icon{
   bottom:0px;
   right: -10px;
   position: absolute;
   border-radius: 50%;
   background: rgba($blue-grey-10,1);
   padding: 7px;
}

.profile-image-username{
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    letter-spacing:1px;
    color: #404041;
   
}
.header-background{
    background: linear-gradient(to right,$primary, $secondary);
}

.input{
    margin: 10px 1.3rem;
}

.message-input-error{
    margin-bottom: 35px;
}

</style>