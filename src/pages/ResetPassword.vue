<template>
    <q-page class="flex justify-center bg-white items-center column">
        <!-- PAHSES -->
        <div class="fs-50 full-width text-center row justify-center items-center mt-24" style="height:160px">
            <!-- F1 ICON -->
            <div class="flex flex-center"
                :class="emailSended ? 'title-number--checked bg-primary text-white' : 'title-number'"
            >
                <q-icon v-if="emailSended" name="check" />
                <div v-else class="text-grey-8">1</div>
            </div>
            <!-- F2 ICON -->
            <div v-if="emailSended" class="flex flex-center mx-16"
                :class="codeVerificated ? 'title-number--checked bg-primary text-white' : 'title-number'"
            >
                <q-icon v-if="codeVerificated" name="check" />
                <div v-else class="text-grey-8">2</div>
            </div>
            <!-- F3 ICON -->
            <div v-if="codeVerificated" class="title-number flex flex-center">
                3
            </div>
        </div>
        <!-- PHASE 1 -->
        <div v-if="!emailSended" class="full-width column px-30 py-16" :class="emailSended ? 'bg-grey-2' : 'grow-1'">
            <div v-if="!emailSended" class="text-h5 text-grey-9">Recuperar contraseña</div>
            <div v-if="!emailSended" class="mt-8 text-grey-8 mb-32">Ingresa tu dirección de correo electrónico, te enviaremos un código de verificación para que puedas continuar con la recuperación de tu contraseña.</div>
            <q-input :disable="emailSended" autofocus v-model="email" label="Email" 
                :error="!! emailError"  :error-message="emailError"/>
            <q-btn v-if="!emailSended" no-caps class="mt-16" :color="email ? 'primary' : 'grey-8'" @click="sendEmail">
                <div v-if="!sending" class="row">
                    <div class="mr-10">Enviar código a recuperación</div>
                    <q-icon name="send" />
                </div>
                <div v-else class="row">
                    <div class="mr-10">Enviando</div>
                    <q-spinner color="white" size="1em" />
                </div>
            </q-btn>
        </div>
        <!-- PHASE 2 -->
        <div v-if="emailSended && !codeVerificated" class="full-width column" :class="codeVerificated ? 'bg-grey-2' : 'grow-1'">
            <div class="px-30 py-16 column">
                <div v-if="!codeVerificated" class="text-h5 text-grey-9">Ingresar código de verificación</div>
                <div v-if="!codeVerificated" class="mt-8 text-grey-8 mb-32">Ingresa el código de 4 dígitos que recibiste en el correo electrónico <strong>{{email}} </strong>.</div>
                <q-input :disable="codeVerificated" autofocus v-model="verificationCode" label="Código de verificación" 
                    :error="!!verificationCodeError" :error-message="verificationCodeError"
                />
                <q-btn v-if="!codeVerificated" no-caps class="mt-16" :color="verificationCode.length === 4 ? 'primary' : 'grey-8'" @click="sendVerficationCode">
                    <div v-if="!sending" class="row">
                        <div class="mr-10">Enviar verificación</div>
                        <q-icon name="send" />
                    </div>
                    <div v-else class="row">
                        <div class="mr-10">Enviando</div>
                        <q-spinner color="white" size="1em" />
                    </div>
                </q-btn>
                <q-btn @click="changeResetEmail" flat dense no-caps class="mt-20 underline" color="grey-8">
                    Cambiar correo electrónico
                    
                </q-btn>
            </div>
        </div>
        <!-- PHASE 3 -->
        <div v-if="codeVerificated" class="mt-16 full-width grow-1">
            <div class="px-30 mt-16 column">
                <div class="text-h5 text-grey-9">Nueva contraseña</div>
                <div class="mt-8 text-grey-8 mb-32">Ingresa una nueva contraseña para tu cuenta.</div>
                <q-input autofocus v-model="newPassword" label="Nueva contraseña" />
                <q-input v-model="newPasswordConfirmation" class="mt-16" label="Confirmar nueva contraseña" />
                <q-btn no-caps class="mt-16" :color="isValidNewPassword ? 'primary' : 'grey-8'" @click="sendResetPassword">
                    <div v-if="!sending" class="row">
                        <div class="mr-10">Guardar nueva contraseña</div>
                        <q-icon name="send" />
                    </div>
                    <div v-else class="row">
                        <div class="mr-10">Enviando</div>
                        <q-spinner color="white" size="1em" />
                    </div>
                </q-btn>
            </div>
        </div>
        <!-- CONFIRMATION Message-->
        <q-dialog  v-model="successMessage" persistent transition-show="scale" transition-hide="scale">
            <q-card class="bg-primary text-white" style="width: 300px">
                

                <q-card-section class="bg-white text-grey-9">
                    Su contraseña ha sido cambiada exitosamente, inicie sesion nuevamente para continuar
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-primary">
                    <q-btn @click="goToLogin" flat label="Iniciar sesion"  v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        
    </q-page>
</template>

<script>
import { defineComponent, ref,watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useActions,useGetters,useMutations} from 'src/store'
const _awaiter = async (time = 1500) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

export default defineComponent({
    name: 'ResetPassword',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const sending = ref(false);
        const successMessage=ref(false)
        const goToLogin=()=>{
            router.replace({path:'/login'})
        }

        //
        // EMAIL
        //
        const {resetPasswordEmail}=useGetters()
        const email = ref(route.params.email || resetPasswordEmail.value || 'marcos@gmail.com');
        const emailSended = ref(!!resetPasswordEmail.value);
        const {generatePasswordCode}=useActions()
        const emailError=ref('')

        watch(email,()=>emailError.value="")

        const sendEmail = async () => {

            if(!email.value){
                emailError.value="Ingrese el email"

                return
            }
            sending.value = true;
            const {data,error}=await generatePasswordCode(email.value)
            sending.value = false;
            if(error){
                emailSended.value = false;
                emailError.value="El email no existe"
            }else{
                emailSended.value = true;
            }
            
        };
        //
        // VERIFICATION CODE
        //
        const verificationCode = ref('1234');
        const codeVerificated = ref(false);
        const {validatePasswordCode} = useActions()
        const verificationCodeError=ref('')
        const {setResetPasswordEmail}= useMutations()

        watch(verificationCode,()=>verificationCodeError.value="")
        const sendVerficationCode = async () => {
            sending.value = true;
            const {data,error}= await validatePasswordCode({email:email.value,code:verificationCode.value})
            if(error){
                verificationCodeError.value="Codigo de verificacion Invalido"
            }else{
                codeVerificated.value = true;
            }
            sending.value = false;
        };

        const changeResetEmail=()=>{
                setResetPasswordEmail("")
                emailSended.value=false
                email.value=""
        }
        //
        // NEW PASSWORD
        //
        const newPassword = ref('');
        const newPasswordConfirmation = ref('');
        const {resetPassword}=useActions()
        const isValidNewPassword = () => {
            return newPassword.value.length > 8 && newPassword.value === newPasswordConfirmation.value;
        };
        const sendResetPassword = async () => {
            const email=resetPasswordEmail.value
            sending.value = true;
            const {data,error}= await resetPassword({email:email,new_password:newPassword.value,confir_new_password:newPasswordConfirmation.value})
            if(!error){
                console.log('No hay error')
                sending.value = false;
                successMessage.value=true
            }
            
        };

        return {
            email,
            sending,
            emailSended,
            codeVerificated,
            verificationCode,
            newPassword,
            newPasswordConfirmation,
            sendEmail,
            sendVerficationCode,
            isValidNewPassword,
            sendResetPassword,
            emailError,
            verificationCodeError,
            changeResetEmail,
            successMessage,
            goToLogin
        }
    },
})
</script>

<style scoped>
.title-number {
    border: 2px dashed #222;
    width: 90px;
    height: 90px;
    border-radius: 200px;
    box-shadow: 2px 2px 4px 2px #0002;
}
.title-number--checked {
    width: 90px;
    height: 90px;
    border-radius: 200px;
    box-shadow: 2px 2px 4px 2px #0002;
}
</style>