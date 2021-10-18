
<template>
        <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header elevated class="bg-white text-black">
            <q-toolbar>
                <q-btn icon="arrow_back" flat round @click="goBack" />
            </q-toolbar>
            </q-header>

            <q-page-container>
                <q-page class="flex  bg-white  column ">
                    <p class="text-h6 text-weight-bold q-ml-lg q-mt-lg">Cambiar Contraseña</p>
                    <div class="current-password-container q-mx-lg shadow-3">
                        <q-input v-model="currentPassword" dense 
                            label="Contraseña actual" 
                            @focus="focusCurrentPasword"
                            @blur="focusCurrentPasword(false)" 
                            :ref="el=>currentPasswordInput=el"
                            :error="!!currentPasswordError" 
                            :error-message="currentPasswordError"
                        >
                            <template v-slot:append>
                                <q-icon name="password" 
                                 :color=" isCurrentPasswordFocus?'primary':'grey-7' "
                                  v-if="!currentPasswordError"
                                />
                            </template>
                        </q-input>
                    </div>
                    <div class="new-password-container q-ma-lg shadow-3 ">
                            <q-input v-model="newPassword" dense  class="q-mb-md" 
                                label="Nueva contraseña"
                                @focus="focusNewPassword"
                                @blur="focusNewPassword(false)"
                                :ref="el=>newPasswordInput=el"
                                :error="!!newPasswordError"
                                :error-message="newPasswordError"
                            >
                                <template v-slot:append>
                                    <q-icon name="password" 
                                    :color="isNewPasswordFocus? 'primary' : 'grey-7' "
                                     v-if= "!newPasswordError"
                                    />
                                </template>
                            </q-input>
                            <q-input v-model="confirNewPassword" dense  
                                label="Confirmar nueva contraseña"
                                @focus="focusConfirNewPassword"
                                @blur="focusConfirNewPassword(false)"
                                :ref="el=>confirNewPasswordInput=el"
                                :error="!!confirNewPasswordError"
                                :error-message="confirNewPasswordError"
                              >
                                <template v-slot:append>
                                    <q-icon name="password"
                                        :color="isConfirNewPasswordFocus?'primary' :'grey-7' "
                                        v-if="!confirNewPasswordError"
                                     />
                                </template>
                            </q-input>
                    </div>
                    <q-btn class="self-center mt-20 px-64 py-5  q-mx-lg" no-caps color="primary" 
                     @click="changePassword">
                        <div v-if="!isSendingRequest"> Cambiar contraseña</div>
                        <div v-else >Enviando solicitud  <q-spinner color="white" size="1em" /></div>
                        
                    </q-btn>
                </q-page>
            </q-page-container>
        </q-layout>
</template>

<script>
import { defineComponent,ref,computed,watch } from 'vue'
import {useRouter} from 'vue-router'

export default defineComponent({
    setup() {

        const focusedInput=ref(null)
        const isSendingRequest=ref(false)
        const router=useRouter()
        /* Current Password */
        const currentPassword=ref("")
        const currentPasswordInput=ref(null)
        const currentPasswordError=ref("")

        const focusCurrentPasword=(state=true)=>{
            console.log('LLAMANDO')
            if (state) focusedInput.value = currentPasswordInput.value; 
            else if (focusedInput.value === currentPasswordInput.value) focusedInput.value = null;
        }
        const isCurrentPasswordFocus= computed(()=> focusedInput.value === currentPasswordInput.value )

        watch(currentPassword,_=>currentPasswordError.value="")
        
        /* NEW PASSWORD */
        const newPassword=ref("")
        const newPasswordInput=ref(null)
        const newPasswordError=ref("")

        const focusNewPassword=(state=true)=>{
            if (state) focusedInput.value = newPasswordInput.value; 
            else if (focusedInput.value === newPasswordInput.value) focusedInput.value = null;
        }
        const isNewPasswordFocus= computed(()=> focusedInput.value === newPasswordInput.value )

        watch(newPassword,_=>newPasswordError.value="")

        /*Confir New Password */
        const confirNewPassword=ref("")
        const confirNewPasswordInput=ref(null)
        const confirNewPasswordError=ref("")

        const focusConfirNewPassword=(state=true)=>{
            if(state) focusedInput.value=confirNewPasswordInput.value
            else if(focusedInput.value === confirNewPasswordInput.value) focusedInput.value=null
        }
        const isConfirNewPasswordFocus=computed(()=>focusedInput.value===confirNewPasswordInput.value)

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
                }else if(!confirNewPassword.value){
                    confirNewPasswordError.value="La confirmacion de contraseña no puede quedar vacia"
                    confirNewPasswordInput.value.focus()
                    return false
                }else if(newPassword.value!==confirNewPassword.value){
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
        const changePassword=()=>{
             if(validateField()){
                 isSendingRequest.value=true
                 setTimeout(()=>{
                     isSendingRequest.value=false
                 },1000)
                 console.log("Todo Ok")
             }
        };

        const goBack=()=>{
            router.go(-1)
        };
        return{
            currentPassword,
            currentPasswordInput,
            isCurrentPasswordFocus,
            currentPasswordError,
            focusCurrentPasword,

            newPassword,
            newPasswordInput,
            newPasswordError,
            isNewPasswordFocus,
            focusNewPassword,

            confirNewPassword,
            confirNewPasswordInput,
            confirNewPasswordError,
            focusConfirNewPassword,
            isConfirNewPasswordFocus,

            isSendingRequest,
            changePassword,
            goBack,
            focusCurrentPasword
        }
    },
})
</script>



<style>
.current-password-container,.new-password-container{
    background-color: #fcfcfc;
    padding: 20px ;
    border-radius: 5px;
}
</style>