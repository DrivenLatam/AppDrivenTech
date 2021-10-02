<template>
    <q-page class="flex justify-center items-center bg-white items-center column px-30">

        <!-- HEADER -->

        <LoginImg :scale="0.8"/>
        <div class="bg-primary m-25 flex justify-center items-center assignment">
            <q-icon name="assignment" color="white" size="16px"/>
        </div>
        <div class="text-h5 text-grey-7 mb-25">Autenticación</div>

        
        <!-- USERNAME INPUT -->

        <q-input v-model="username" dense autofocus :disable="sendingLogin" :ref="el => usernameInput=el"   
                label="Nombre de usuario" class="full-width mt-32 login-input" 
                @keypress.enter="requestLogin" @focus="focusUsername" @blur="focusUsername(false)">
            <template v-slot:append>
                <q-icon name="person" :color="isUsernameFocus?'primary':'grey-7'" />
            </template>
        </q-input>
        <div v-if="usernameError" class="p-4 mt-4 br-2 bg-red text-white full-width text-weight-bold">{{usernameError}}</div>
        <div v-else class="p-4 mt-4 text-white">.</div>

        <!-- PASSWORD INPUT -->

        <q-input v-model="password" dense :ref="el => passwordInput=el" :disable="sendingLogin" 
                label="Contraseña" class="full-width mt-8 login-input" type="password" 
                @keypress.enter="requestLogin" @focus="focusPassword" @blur="focusPassword(false)">
            <template v-slot:append>
                <q-icon name="password" :color="isPasswordFocus?'primary':'grey-7'" />
            </template>
        </q-input>
        <div v-if="passwordError" class="p-4 mt-4 br-2 bg-red text-white full-width text-weight-bold">{{passwordError}}</div>
        <div v-else class="p-4 mt-4 text-white">.</div>

        <!-- SERVER ERROR MESSAGE -->

        <div v-if="genericError" class="p-4 mt-8 br-2 bg-red text-white full-width text-weight-bold">{{genericError}}</div>
        <div v-else class="p-4 mt-8 text-white">.</div>

        <!-- SEND LOGIN BUTTON -->

        <q-btn class="mt-8 bg-primary text-white px-64 py-4" @click="requestLogin">
            <div v-if="!sendingLogin">Iniciar sesión</div>
            <q-spinner v-else color="white" size="1em" />
        </q-btn>
    </q-page>
</template>

<script>
import { defineComponent, ref, nextTick, computed, watch, onMounted } from 'vue'
import { useGetters, useActions } from 'src/store';
import LoginImg from "../components/draws/LoginImg";

export default defineComponent({
    name: 'Login',
    components: {LoginImg},
    setup() {
        const { isLogged } = useGetters();
        const { login } = useActions();
        const focusedInput = ref(null);
        //
        // USER NAME
        //
        const username = ref("");
        const usernameInput = ref(null);
        const focusUsername = (state = true) => { 
            if (state) focusedInput.value = usernameInput.value; 
            else if (focusedInput.value === usernameInput.value) focusedInput.value = null;
        }
        const isUsernameFocus = computed(() => focusedInput.value === usernameInput.value)
        watch(username, () => loginError.value && (loginError.value.username = loginError.value.error = undefined));
        //
        // PASSWORD
        //
        const password = ref("");
        const passwordInput = ref(null);
        const focusPassword = (state = true) => { 
            if (state) focusedInput.value = passwordInput.value; 
            else if (focusedInput.value === passwordInput.value) focusedInput.value = null;
        }
        const isPasswordFocus = computed(() => focusedInput.value === passwordInput.value)
        watch(password, () => loginError.value && (loginError.value.password = loginError.value.error = undefined));
        //
        // ERROR
        //
        const loginError = ref("");
        const usernameError = computed(() => loginError.value ? loginError.value.username : "")
        const passwordError = computed(() => loginError.value ? loginError.value.password : "")
        const genericError = computed(() => loginError.value ? loginError.value.error : "")
        watch(loginError, () => {
            if (!loginError.value) return;
            if (loginError.value.username) usernameInput.value.focus();
            else if (loginError.value.password) passwordInput.value.focus();
        });
        //
        // LOGIN
        //
        const sendingLogin = ref(false);
        const validateLogin = () => {
            if (!username.value) {
                loginError.value = { username: "Ingrese su nombre de usuario" };
                return false;
            }
            if (!password.value) {
                loginError.value = { password: "Ingrese su contraseña" };
                return false;
            }
            return true;
        }
        const requestLogin = async () => {
            if (sendingLogin.value) return;
            sendingLogin.value = true;
            loginError.value = null;
            
            if (validateLogin()) {
                const { data, error } = await login({ username, password });
                
                if (error) {
                    await nextTick();
                    loginError.value = error;
                }
                else if (data) {
                    // TODO: GO TO NEXT PAGE
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
            username,
            password,
            requestLogin,
            sendingLogin,
            genericError,
            usernameError,
            passwordError,
            usernameInput,
            passwordInput,
            focusUsername,
            focusPassword,
            isUsernameFocus,
            isPasswordFocus,
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