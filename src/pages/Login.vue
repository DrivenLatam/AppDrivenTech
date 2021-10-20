<template>
    <q-page class="flex justify-center items-center bg-white items-center column px-30">

        <!-- HEADER -->

        <LoginImg :scale="0.8"/>
        <div class="bg-primary m-25 flex justify-center items-center assignment">
            <q-icon name="assignment" color="white" size="16px"/>
        </div>
        <div class="text-h5 text-grey-7 mb-25">Autenticación</div>

        
        <!-- email INPUT -->

        <q-input v-model="email" dense autofocus :disable="sendingLogin" :ref="el => emailInput=el"   
                label="Email" class="full-width mt-32 login-input" 
                @keypress.enter="requestLogin" @focus="focusEmail" @blur="focusEmail(false)"
                :error="!!emailError"
                :error-message="emailError"
                >
            <template v-slot:prepend>
                <q-icon  name="email" :color="emailColorIcon" />
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

        <q-btn class="mt- bg-primary text-white  px-64 py-4" @click="requestLogin">
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

export default defineComponent({
    name: 'Login',
    components: {LoginImg},
    setup() {
        const router = useRouter()
        const { isLogged } = useGetters();
        const { login } = useActions();
        const focusedInput = ref(null);
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const hidePassword=ref(true)
        //
        // USER NAME
        //
        const email = ref("");
        const emailInput = ref(null);
        const focusEmail = (state = true) => { 
            if (state) focusedInput.value = emailInput.value; 
            else if (focusedInput.value === emailInput.value) focusedInput.value = null;
        }
        const isEmailFocus = computed(() => focusedInput.value === emailInput.value)
        const emailColorIcon= computed(()=>emailError.value ? 'negative' : isEmailFocus.value ? 'primary' :'grey-7' )
        
        watch(email, () => loginError.value && (loginError.value.email = undefined));
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
            router.push({ path: `/login/resetPassword/${email.value}` });
        }
        const isPasswordFocus = computed(() => focusedInput.value === passwordInput.value)
        const passwordColorIcon= computed(()=> passwordError.value ? 'negative' : isPasswordFocus.value ? 'primary' :'grey-7' )
        
        watch(password, () => loginError.value && (loginError.value.password = undefined));
        
        //
        // ERROR
        //
        const loginError = ref("");
        const emailError = computed(() => loginError.value ? loginError.value.email : "")
        const passwordError = computed(() => loginError.value ? loginError.value.password : "")
        const genericError = computed(() => loginError.value ? loginError.value.error : "")
        watch(loginError, () => {
            if (!loginError.value) return;
            if (loginError.value.email) emailInput.value.focus();
            else if (loginError.value.password) passwordInput.value.focus();
        });
        //
        // LOGIN
        //
        const sendingLogin = ref(false);
        const validateLogin = () => {
            
            if (!email.value) {
                loginError.value = { email: "Ingrese su nombre de usuario" };
                return false;
            }else if ( email.value.length<5 || !emailPattern.test(email.value )){
                loginError.value = { email: "Ingrese un email valido" };
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
                const { data, error,field } = await login({ email:email.value, password:password.value });
                
                if (error) {
                    if(field=="global") loginError.value={email:error,password:error}
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
            email,
            password,
            requestLogin,
            sendingLogin,
            genericError,
            emailError,
            passwordError,
            emailInput,
            passwordInput,
            focusEmail,
            focusPassword,
            isEmailFocus,
            isPasswordFocus,
            gotoResetPassword,
            hidePassword,
            emailColorIcon,
            passwordColorIcon
        }
        
    },
})
</script>

<style scoped>
.login-input {
    min-width: 340px;
}
.assignment {
    width:26px;
    height:26px;
    border-radius:100px;
}
</style>