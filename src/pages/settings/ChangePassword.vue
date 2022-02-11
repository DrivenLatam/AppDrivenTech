
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
                        <q-toolbar-title class="fs-20">Cambiar Contraseña</q-toolbar-title> 
                        
                    </q-toolbar>
                </q-header>

                <q-page-container>
                    <q-page class="flex  bg-white  column ">
                        <div class="current-password-container q-mt-lg  ">
                            <p class="text-h6">Contraseña actual</p>
                            <p class="text-grey-8 q-mb-md">Ingrese la contraseña actual </p>
                            <q-input v-model="currentPassword" outlined 
                                autofocus
                                label="Contraseña actual" 
                                @focus="focusCurrentPasword"
                                @blur="focusCurrentPasword(false)" 
                                :ref="el=>currentPasswordInput=el"
                                :error="!!currentPasswordError" 
                                :error-message="currentPasswordError"
                                :type=" hideCurrentPassword ? 'password' : 'text' "
                                :disable="isSendingRequest"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="lock"
                                    :color=" currentPasswordColorIcon "
                                    
                                    />
                                </template>
                                <template v-slot:append>
                                    <q-icon
                                        :name=" hideCurrentPassword ? 'visibility_off' : 'visibility' "
                                        @click=" hideCurrentPassword=!hideCurrentPassword"
                                    />
                                    
                                </template>
                            </q-input>
                        </div>
 
                        <div class="new-password-container" style="padding-bottom:45px;">
                                <p class="text-h6">Nueva contraseña</p>
                                <p class="text-grey-8 q-mb-md">Ingrese una nueva contraseña para tu cuenta</p>
                                <q-input v-model="newPassword" outlined  class="q-mb-md" 
                                    label="Nueva contraseña"
                                    @focus="focusNewPassword"
                                    @blur="focusNewPassword(false)"
                                    :ref="el=>newPasswordInput=el"
                                    :error="!!newPasswordError"
                                    :error-message="newPasswordError"
                                    :type=" hideNewPassword?'password':'text' "
                                    :disable="isSendingRequest"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="lock"
                                            :color=" newPasswordColorIcon"
                                            
                                        />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon 
                                            :name=" hideNewPassword ? 'visibility_off' : 'visibility' "
                                            @click="hideNewPassword = !hideNewPassword"
                                        />
                                    </template>
                                </q-input>
                                <q-input v-model="confirNewPassword" outlined  
                                    label="Confirmar nueva contraseña"
                                    @focus="focusConfirNewPassword"
                                    @blur="focusConfirNewPassword(false)"
                                    :ref="el=>confirNewPasswordInput=el"
                                    :error="!!confirNewPasswordError"
                                    :error-message="confirNewPasswordError"
                                    :type=" hideConfirNewPassword ? 'password' : 'text' "
                                    :disable="isSendingRequest"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="lock"
                                            :color="confirNewPasswordColorIcon"
                                        />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon 
                                            :name=" hideConfirNewPassword ? 'visibility_off' : 'visibility' "
                                            @click="hideConfirNewPassword = !hideConfirNewPassword"
                                        />
                                    </template>
                                </q-input>
                        </div>
                        
                        <!--CHANGE PASSWORD BUTTOM -->
                        <btn @click="changePassword" mx="1rem" label="Cambiar contraseña" :loading="isSendingRequest" />

                        <!-- CONFIRMATION Message-->
                        <!-- DIALOGS-->
                        <!-- SUCCESDIALOG-->
                        <succes-dialog   v-if="successDialog" @confirAction="logOut"
                                         title="Contraseña actualizada"
                                         message="Inicie sesión nuevamente para continuar" />

                        <!-- ERRORDIALOG-->
                        <error-dialog   v-if="errorDialog" 
                                        title="Error" @confirAction="errorDialog=false"
                                       message="No se pudo cambiar la contraseña, intentelo mas tarde" />

                       
                    </q-page>
                </q-page-container>
            </q-layout>
        </q-dialog>
</template>

<script>
import { defineComponent,ref,computed,watch } from 'vue'
import {useRouter} from 'vue-router'
import {useActions} from "src/store"
import {store} from 'src/store/local.store'
import Btn from 'src/components/Btn.vue'
import ErrorDialog from 'src/components/Dialog/ErrorDialog.vue'
import SuccesDialog from 'src/components/Dialog/SuccesDialog.vue'
export default defineComponent({
    components:{
        Btn,ErrorDialog,SuccesDialog
    },
    setup() {
        /* Globals */
        const focusedInput=ref(null)
        const isSendingRequest=ref(false)
        const router=useRouter()
        const {changePasswordServer}= useActions()
        const successDialog=ref(false)
        const errorDialog=ref(false)
        const dialog=ref(true)
        /* Current Password */
        const currentPassword=ref("")
        const currentPasswordInput=ref(null)
        const currentPasswordError=ref("")
        const hideCurrentPassword=ref(true)
        const focusCurrentPasword=(state=true)=>{
            if (state) focusedInput.value = currentPasswordInput.value; 
            else if (focusedInput.value === currentPasswordInput.value) focusedInput.value = null;
        }
        const isCurrentPasswordFocus= computed(()=> focusedInput.value === currentPasswordInput.value )
        const currentPasswordColorIcon=computed( ()=> currentPasswordError.value ? 'negative' : isCurrentPasswordFocus.value ? 'primary':'grey-7' )
        watch(currentPassword, _=>currentPasswordError.value="")
        
        /* NEW PASSWORD */
        const newPassword=ref("")
        const newPasswordInput=ref(null)
        const newPasswordError=ref("")
        const hideNewPassword=ref(true)

        const focusNewPassword=(state=true)=>{
            if (state) focusedInput.value = newPasswordInput.value; 
            else if (focusedInput.value === newPasswordInput.value) focusedInput.value = null;
        }
        const isNewPasswordFocus= computed(()=> focusedInput.value === newPasswordInput.value )
        const newPasswordColorIcon=computed( ()=> newPasswordError.value ? 'negative' : isNewPasswordFocus.value ? 'primary':'grey-7' )

        watch(newPassword,_=>newPasswordError.value="")

        /*Confir New Password */
        const confirNewPassword=ref("")
        const confirNewPasswordInput=ref(null)
        const confirNewPasswordError=ref("")
        const hideConfirNewPassword=ref(true)

        const focusConfirNewPassword=(state=true)=>{
            if(state) focusedInput.value=confirNewPasswordInput.value
            else if(focusedInput.value === confirNewPasswordInput.value) focusedInput.value=null
        }
        const isConfirNewPasswordFocus=computed(()=>focusedInput.value===confirNewPasswordInput.value)
        const confirNewPasswordColorIcon=computed( ()=> confirNewPasswordError.value ? 'negative' : isConfirNewPasswordFocus.value ? 'primary':'grey-7' )

        watch(confirNewPassword,_=>confirNewPasswordError.value="")

        /* CHANGE PASSWORD */
        const validateField=()=>{
                
                if(!currentPassword.value){
                    currentPasswordError.value="La contraseña actual no puede quedar vacia"
                    currentPasswordInput.value.focus()
                    return false
                }else if(!newPassword.value){
                    newPasswordError.value="La nueva contraseña no puede quedar vacia"
                    newPasswordInput.value.focus()
                    return false
                }else if(newPassword.value.length<5){
                    newPasswordError.value="La contraseña debe tener al menos 5 caracteres"
                    newPasswordInput.value.focus()
                    return false
                }
                else if(!confirNewPassword.value){
                    confirNewPasswordError.value="La confirmacion de contraseña no puede quedar vacia"
                    confirNewPasswordInput.value.focus()
                    return false
                }
                else if(newPassword.value!==confirNewPassword.value){
                    confirNewPasswordError.value="La constraseña no coincide"
                    confirNewPasswordInput.value.focus()
                    return false
                }else if(newPassword.value==currentPassword.value){
                    newPasswordError.value="La nueva contraseña no puede ser igual que la anterior"
                    newPasswordInput.value.focus()
                    return false
                }
            return true
        }     
        
        //Hacer un request al servidor para cambiar la contraseña
        const changePassword= async()=>{
             if(validateField()){
                 isSendingRequest.value=true
                 const {data,error,field}= await changePasswordServer({
                                current_password:currentPassword.value,
                                new_password:newPassword.value,
                                confir_new_password:confirNewPassword.value})
                 console.log(data)
                 isSendingRequest.value=false
                 if(data){
                    successDialog.value=true
                 }
                 else if(error){
                    if(field=="current_password"){
                        currentPasswordError.value=error[0]
                        currentPasswordInput.value.focus()
                    }
                 }
             }
        };
        
        const {logout}=useActions()
        const logOut=async ()=>{
             // TODO: ELIMIAR DATOS DEL LOCAL STORAGE, DEL STORE, Y REDIRIGIR A LA PÁGINA DE LOGIN
            const {data,error}=await logout()
            router.replace({path:'/login'})

        }
        const goBack=()=>{
            dialog.value=false
            setTimeout(_=>router.go(-1),200)    
            
        };
        return{
            currentPassword,
            currentPasswordInput,
            isCurrentPasswordFocus,
            currentPasswordError,
            focusCurrentPasword,   
            hideCurrentPassword,
            currentPasswordColorIcon,

            newPassword,
            newPasswordInput,
            newPasswordError,
            isNewPasswordFocus,
            focusNewPassword,
            hideNewPassword,
            newPasswordColorIcon,

            confirNewPassword,
            confirNewPasswordInput,
            confirNewPasswordError,
            focusConfirNewPassword,
            isConfirNewPasswordFocus,
            hideConfirNewPassword,
            confirNewPasswordColorIcon,

            successDialog,
            errorDialog,
            isSendingRequest,
            changePassword,
            goBack,
            focusCurrentPasword,
            logOut,
            dialog
        }
    },
})
</script>



<style lang="scss" scoped>

.current-password-container,.new-password-container{
    margin: 0px 1rem ;
    border-radius: 5px;
}
.header-background{
    background: linear-gradient(to right,$primary, $secondary);
}
</style>