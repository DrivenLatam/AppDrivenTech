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
            <q-input :disable="emailSended" autofocus v-model="email" label="Email" />
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
                <div v-if="!codeVerificated" class="mt-8 text-grey-8 mb-32">Ingresa el código de 4 dígitos que recibiste en tu correo electrónico.</div>
                <q-input :disable="codeVerificated" autofocus v-model="verificationCode" label="Código de verificación" />
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
    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
        //
        // EMAIL
        //
        const email = ref(route.params.email || 'luis@drivenlab.com');
        const emailSended = ref(false);
        const sendEmail = async () => {
            sending.value = true;
            await _awaiter(); // TODO: ENVIAR EMAIL AL CORREO ELECTRÓNICO INGRESADO
            sending.value = false;
            emailSended.value = true;
        };
        //
        // VERIFICATION CODE
        //
        const verificationCode = ref('1234');
        const codeVerificated = ref(false);
        const sendVerficationCode = async () => {
            sending.value = true;
            await _awaiter(); // VALIDAR QUE EL CÓDIGO DE VERIFICACIÓN INGRESADO SEA CORRECTO
            // SI ES CORRECTO, EJECUTAR LAS DOS LÍNEAS DE ABAJO, SINO, MOSTRAR UN ERROR
            sending.value = false;
            codeVerificated.value = true;
        };
        //
        // NEW PASSWORD
        //
        const newPassword = ref('');
        const newPasswordConfirmation = ref('');
        const isValidNewPassword = () => {
            return newPassword.value.length > 8 && newPassword.value === newPasswordConfirmation.value;
        };
        const sendResetPassword = async () => {
            sending.value = true;
            await _awaiter(); // TODO: CAMBIAR CONTRASEÑA EN EL SERVIDOR Y REDIRIGIR AL LÓGIN
            sending.value = false;
            router.replace({ path: '/login' });
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