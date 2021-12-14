<template>
    <!-- Boton de atras -->
    <div v-if="!codeVerificated" class="mt-5 ml-5">
        <q-btn icon="arrow_back" class="" flat round size="lg" @click="goBack" />
    </div>  
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
                <q-input autofocus :ref=" e=>newPasswordInput=e " v-model="newPassword" 
                    @focus="newPasswordFocus"
                    @blur="newPasswordFocus(false)"
                    :type="hideNewPasswordInput ? 'password' : 'text' "
                    label="Nueva contraseña" :error="!!newPasswordError" :error-message="newPasswordError" >
                    <template v-slot:prepend>
                        <q-icon name="lock"
                            :color=" newPasswordColorIcon"
                        />
                    </template>
                    <template  v-slot:append>
                        <q-icon  :name=" hideNewPasswordInput ? 'visibility_off' : 'visibility' "
                                 @click=" hideNewPasswordInput= !hideNewPasswordInput"
                        />
                    </template>
                </q-input>
                <q-input v-model="newPasswordConfirmation" class="mt-16" label="Confirmar nueva contraseña"
                         :ref=" el=>newPasswordConfirmationInput=el "
                         @focus="focusNewPasswordConfirmation"
                         @blur="focusNewPasswordConfirmation(false)"
                         :type=" hideNewPasswordConfirmationInput ? 'password' : 'text' "
                         :error="!!newPasswordConfirmationError"
                         :error-message="newPasswordConfirmationError"
                 >
                    <template v-slot:prepend>
                        <q-icon name="lock"
                                :color="confirNewPasswordIconColor"
                        />
                    </template>
                    <template  v-slot:append>
                        <q-icon  :name=" hideNewPasswordConfirmationInput ? 'visibility_off' : 'visibility' "
                            @click=" hideNewPasswordConfirmationInput= !hideNewPasswordConfirmationInput"
                        />
                    </template>
                </q-input>
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
                

                <q-card-section class="bg-white text-grey-9 q-py-lg">
                    Su contraseña ha sido cambiada exitosamente, inicie sesión nuevamente para continuar
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-primary">
                    <q-btn @click="goToLogin" flat label="Iniciar sesion"  v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- ERROR Message -->
        <error-dialog
            v-if="showErrorDialog"
            :title="titleDialog"
            :message="msgDialog"
            @confirAction="showErrorDialog=false"
        />

    </q-page>
</template>

<script>
import { defineComponent, ref,watch,computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useActions,useGetters,useMutations} from 'src/store'
import ErrorDialog from 'src/components/Dialog/ErrorDialog.vue'
const _awaiter = async (time = 1500) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

export default defineComponent({
    components:{ErrorDialog},
    name: 'ResetPassword',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const sending = ref(false);
        const successMessage=ref(false)
        const focusedInput=ref(null)
        const goToLogin=()=>{
            router.replace({path:'/login'})
        }
        //--------Prueba-----
        const code=ref('')
        //
        //COMPONENTE DE ERROR
        //

        const showErrorDialog= ref(false)
        const titleDialog = ref('')
        const msgDialog=ref('')

        //
        // EMAIL
        //

        const {resetPasswordEmail}=useGetters()
        const email = ref(route.params.email || resetPasswordEmail.value || 'gerardocabrer@fpuna.edu.py');
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
            const {data,error,field}=await generatePasswordCode(email.value)
            sending.value = false;
            if(error ){
                if(error=='No se pudo enviar mail'){ //Error de no poder enviar email
                    showErrorDialog.value=true
                    titleDialog.value='Error al enviar al email'
                    msgDialog.value='No se pudo enviar al email, por favor intentelo mas tarde'
                }else{  //Error de email ingresado no existe
                    emailSended.value = false;
                    emailError.value=error
                }

            }else{
                code.value=data.verification_code
                emailSended.value = true;
            }
            
        };

        //
        // VERIFICATION CODE
        //
        
        const {resetVerificationCode}=useGetters()
        const verificationCode = ref('');
        const codeVerificated = ref(false);
        const {validatePasswordCode} = useActions()
        const verificationCodeError=ref('')
        const {setResetPasswordEmail}= useMutations()
        const dialogCodeVerification=computed(()=>  {
            return (!codeVerificated.value && emailSended.value) ? true : false
        })
        
        console.log('r',resetVerificationCode.value)
        watch(verificationCode,()=>verificationCodeError.value="")
       
       const sendVerficationCode = async () => {
            sending.value = true;
            const {data,error,field}= await validatePasswordCode({email:email.value,code:verificationCode.value})
            if(error && field){
                if(error=="El codigo de verificacion ha expirado"){ //Erro de codigo de verificacion
                    showErrorDialog.value=true
                    titleDialog.value='Codigo de Verificacion'
                    msgDialog.value='El codigo de verificacion ha expirado'
                    //Si hay un error, entoces vuelvo al paso anterior
                    emailSended.value = false; 
                    verificationCode.value=''
                }else  verificationCodeError.value=error  //Error de valor ingresado incorrecto
            }else{
                
                codeVerificated.value = true;
            }
            sending.value = false;
        };

        const changeResetEmail=()=>{
                setResetPasswordEmail({email:"",verificationCode:""})
                emailSended.value=false
                email.value=""
        }

        //
        // NEW PASSWORD
        //

        const newPassword = ref('');
        const {resetPassword}=useActions()
        const newPasswordInput=ref(null)
        const newPasswordError=ref("")
        const hideNewPasswordInput= ref(true)
        const newPasswordFocus=(state=true)=>{
            if(state) focusedInput.value=newPasswordInput.value
            else if(newPasswordInput.value==focusedInput.value) focusedInput.value=null  
        }
        const isNewPasswordFocus=computed(()=>newPasswordInput.value==focusedInput.value)
        const newPasswordColorIcon= computed(()=> newPasswordError.value ? 'negative' : isNewPasswordFocus.value ? 'primary': 'grey-7' )
        watch(newPassword,_=>newPasswordError.value="")

        //
        //CONFIR NEW PASSWORD
        //

        const newPasswordConfirmation = ref('');
        const newPasswordConfirmationInput=ref(null)
        const newPasswordConfirmationError=ref("")
        const hideNewPasswordConfirmationInput=ref(true)
        const focusNewPasswordConfirmation=(state=true)=>{
            if(state)focusedInput.value=newPasswordConfirmationInput.value
            else if(focusedInput.value==newPasswordConfirmationInput.value) focusedInput.value=null
        }
        const isNewPasswordConfirmationFocus=computed(()=> focusedInput.value==newPasswordConfirmationInput.value)
        const confirNewPasswordIconColor= computed(()=> newPasswordConfirmationError.value ? 'negative' : isNewPasswordConfirmationFocus.value ? 'primary': 'grey-7' )
        watch(newPasswordConfirmation,_=>newPasswordConfirmationError.value="")

        const isValidNewPassword = () => {
            if(newPassword.value.length < 5){
                newPasswordError.value= "La longitud de la contraseña debe ser mayor a 5"
                return  false
            }
            if(newPassword.value != newPasswordConfirmation.value){
                newPasswordConfirmationError.value="Las contraseñas no coinciden"
                return false
            }
            return true
        };

        const sendResetPassword = async () => {
            const email=resetPasswordEmail.value
            if(!isValidNewPassword()){
                return
            }
            sending.value = true;
            const {data,error,field}= await resetPassword({email:email,new_password:newPassword.value,confir_new_password:newPasswordConfirmation.value})
            sending.value = false;
            if(error && field){
                console.log(error)
                newPasswordError.value=error[0]
                return
            }
            successMessage.value=true
            
            
        };

        //
        //BOTON DE IR ATRAS
        //

        const goBack=()=>{            
            if(emailSended.value) changeResetEmail(); //Fase 2
            else goToLogin() //Fase 1
        }

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
            goToLogin,
            newPasswordInput,
            newPasswordFocus,
            newPasswordColorIcon,
            newPasswordError,
            hideNewPasswordInput,
            newPasswordConfirmationInput,
            focusNewPasswordConfirmation,
            confirNewPasswordIconColor,
            hideNewPasswordConfirmationInput,
            newPasswordConfirmationError,
            dialogCodeVerification,
            resetVerificationCode,
            showErrorDialog,
            titleDialog,
            msgDialog,
            goBack,

            code
        }
    },
})
</script>

<style scoped>

.back-icon{
    border: 1px solid red;
}
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