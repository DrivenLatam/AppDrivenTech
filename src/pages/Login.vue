<template>
    <q-page class="flex justify-center items-center bg-white  column px-15">

        <!-- HEADER -->

        <LoginImg :scale="0.8"/>
        <div class="bg-primary m-25 flex justify-center items-center assignment">
            <q-icon name="assignment" color="white" size="16px"/>
        </div>
        <div class="text-h5 text-grey-7 mb-25">Autenticación</div>
        <!-- nickName INPUT -->

        <q-input v-model="nickName" dense autofocus :disable="sendingLogin" :ref="el => nickNameInput=el"   
                label="Usuario" class="full-width mt-32 login-input" 
                @keypress.enter="requestLogin" @focus="focusnickName" @blur="focusnickName(false)"
                :error="!!nickNameError"
                :error-message="nickNameError"
                >
            <template v-slot:prepend>
                <q-icon  name="email" :color="nickNameColorIcon" />
            </template>
        </q-input>
 
        <!-- PASSWORD INPUT -->

        <q-input v-model="password" dense :ref="el => passwordInput=el" :disable="sendingLogin" 
                label="Contraseña" class="full-width mt-8 login-input" :type=" hidePassword ? 'password' : 'text' " 
                @keypress.enter="requestLogin" @focus="focusPassword" @blur="focusPassword(false)"
                :error="!!passwordError"
                :error-message="passwordError" 
                >
            <template v-slot:prepend>
                <q-icon   name="lock" :color="passwordColorIcon" />
            </template>
            <template v-slot:append>
                <q-icon
                    :name=" hidePassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="hidePassword=!hidePassword"
                />
            </template>
        </q-input>
       

        <!-- SERVER ERROR MESSAGE -->

        <div  v-if="genericError" class="q-pa-sm  border-radius-inherit mt-8 br-2 bg-red text-white text-h6 full-width ">{{genericError}}</div>
        <div v-else class="p-4 mt-8 text-white">.</div>

        <!-- SEND LOGIN BUTTON -->

        <q-btn  no-caps
                unelevated 
                rounded 
                text-color="grey-1" 
                class=" bg-secondary text-white full-width fs-16 " 
                @click="requestLogin">
            <div v-if="!sendingLogin">Iniciar sesión</div>
            <q-spinner v-else color="white" size="1em" />
        </q-btn>

        <!-- RESET PASSWORD -->

        <q-btn flat no-caps class="mt-16 underline text-primary px-64 py-4" @click="gotoResetPassword">
            <div>¿Olvidaste tu contraseña?</div>
        </q-btn>
    </q-page>
</template>

<script>
import { defineComponent, ref, nextTick, computed, watch, onMounted } from 'vue'
import { useGetters, useActions } from 'src/store';
import LoginImg from "../components/draws/LoginImg";
import {useRouter} from 'vue-router'
import {
  PushNotifications,
} from '@capacitor/push-notifications';
export default defineComponent({
    name: 'Login',
    components: {LoginImg},
    setup() {
        const router = useRouter()
        const { isLogged } = useGetters();
        const { login } = useActions();
        const focusedInput = ref(null);
        const nickNamePattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const hidePassword=ref(true)
        //
        // USER NAME
        //
        const nickName = ref("");
        const nickNameInput = ref(null);
        const focusnickName = (state = true) => { 
            if (state) focusedInput.value = nickNameInput.value; 
            else if (focusedInput.value === nickNameInput.value) focusedInput.value = null;
        }
        const isnickNameFocus = computed(() => focusedInput.value === nickNameInput.value)
        const nickNameColorIcon= computed(()=>nickNameError.value ? 'negative' : isnickNameFocus.value ? 'primary' :'grey-7' )
        
        watch(nickName, () => loginError.value && (loginError.value.nickName = undefined));
        //
        // PASSWORD
        //
        const password = ref("");
        const passwordInput = ref(null);
        const focusPassword = (state = true) => { 
            if (state) focusedInput.value = passwordInput.value; 
            else if (focusedInput.value === passwordInput.value) focusedInput.value = null;
        }
        const gotoResetPassword = () => {
            router.push({ path: `/login/resetPassword/${nickName.value}` });
        }
        const isPasswordFocus = computed(() => focusedInput.value === passwordInput.value)
        const passwordColorIcon= computed(()=> passwordError.value ? 'negative' : isPasswordFocus.value ? 'primary' :'grey-7' )
        
        watch(password, () => loginError.value && (loginError.value.password = undefined));
        
        //
        // ERROR
        //
        const loginError = ref("");
        const nickNameError = computed(() => loginError.value ? loginError.value.nickName : "")
        const passwordError = computed(() => loginError.value ? loginError.value.password : "")
        const genericError = computed(() => loginError.value ? loginError.value.error : "")
        watch(loginError, () => {
            if (!loginError.value) return;
            if (loginError.value.nickName) nickNameInput.value.focus();
            else if (loginError.value.password) passwordInput.value.focus();
        });

        //
        //TOKEN NOTIFICATIONS
        //

        const tokenNotification=ref('value')

        //Solicitar Permiso
        PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
            PushNotifications.register();
        } else {
            // Show some error
        }
        });
        //Si se tiene el permiso, obtener el token
        PushNotifications.addListener('registration', (token) => {
            tokenNotification.value=token.value
        });
        //Si no se tiene el permiso, enviar un error
        PushNotifications.addListener('registrationError', (error) => {
            tokenNotification.value='error'
        });


        //
        // LOGIN
        //
        const sendingLogin = ref(false);
        const validateLogin = () => {
            
            if (!nickName.value) {
                loginError.value = { nickName: "Ingrese su nombre de usuario" };
                return false;
            }else if ( nickName.value.length<5 ){
                loginError.value = { nickName: "Ingrese un usuario valido" };
                return false;
            }else if (!password.value) {
                loginError.value = { password: "Ingrese su contraseña" };
                return false;
            }else if (password.value.length<5){
                loginError.value = { password: "La longitud de la cadena debe ser mayor que 5" };
                return false;
            }
            
            return true;
        }
        const requestLogin = async () => {
            if (sendingLogin.value) return;
            sendingLogin.value = true;
            loginError.value = null;
            
            if (validateLogin()) {
                const { data, error,field } = await login({ nickname:nickName.value, password:password.value,tokenNotification:tokenNotification.value });
                
                if (error) {
                    if(field=="global") loginError.value={nickName:error[0],password:error[0]}
                    console.log('error')
                    //await nextTick();
                     
                }
                else if (data) {
                   router.replace({path:'/'})
                }
                else loginError.value = { error: "Error al conectar al servidor, vuelva a intentarlo." };
            }
            sendingLogin.value = false;
        }
        //
        // ON CREATE
        //
        onMounted(() => {
            if (isLogged.value) {
                // GO TO NEXT PAGE
                // router.replace({ path: '/' });
            }
        });

        return {
            error: loginError,
            nickName,
            password,
            requestLogin,
            sendingLogin,
            genericError,
            nickNameError,
            passwordError,
            nickNameInput,
            passwordInput,
            focusnickName,
            focusPassword,
            isnickNameFocus,
            isPasswordFocus,
            gotoResetPassword,
            hidePassword,
            nickNameColorIcon,
            passwordColorIcon,
            tokenNotification
        }
        
    },
})
</script>

<style scoped>

.assignment {
    width:26px;
    height:26px;
    border-radius:100px;
}
</style>