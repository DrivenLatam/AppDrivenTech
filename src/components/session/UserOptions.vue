<template>
    <q-btn icon="person" round flat>
        <q-menu>
            <q-list>
                <q-item clickable v-ripple @click="refresh">
                    <q-item-section avatar><q-icon name="sync" /></q-item-section>
                    <q-item-section>Refrescar tickets</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple @click="logout">
                    <q-item-section avatar><q-icon name="logout" /></q-item-section>
                    <q-item-section>Cerrar sesión</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script>
import { defineComponent } from 'vue'
import {store} from 'src/store/local.store'
import {useRouter} from 'vue-router'
import {useActions} from 'src/store'
export default defineComponent({
    setup() {
        const {getTicketsFromServer}=useActions()
        const router=useRouter()

        const logout = () => {
            // TODO: ELIMIAR DATOS DEL LOCAL STORAGE, DEL STORE, Y REDIRIGIR A LA PÁGINA DE LOGIN
            store.set("user",null)
            router.replace({path:'/login'})
        }
        const refresh = async () => {
            // TODO: RECARGAR TICKETS DESDE EL SERVIDOR
            await getTicketsFromServer()
        }

        return {
            logout,
            refresh
        }
    },
})
</script>
