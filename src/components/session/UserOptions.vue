<template>
    <q-btn icon="person" round flat>
        <q-menu>
            <q-list>
                <q-item clickable v-ripple @click="refresh">
                    <q-item-section avatar><q-icon name="sync" /></q-item-section>
                    <q-item-section>Refrescar tickets</q-item-section>
                </q-item>
                <q-separator />
                
                
                <q-item clickable v-ripple @click="goToSettingsPage">
                    <q-item-section avatar><q-icon name="settings" /></q-item-section>
                    <q-item-section>Configuración</q-item-section>
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
import {useMutations} from 'src/store'
export default defineComponent({
    setup() {
        const {getTicketsFromServer}=useActions()
        const router=useRouter()
        
        const {logout:logoutServer}=useActions()
    

        const {setLoadingTicket}= useMutations()
        const refresh = async () => {
            // TODO: RECARGAR TICKETS DESDE EL SERVIDOR
            setLoadingTicket(true)
            await getTicketsFromServer()
        }

        
        

        const goToSettingsPage=()=> router.push({path:'/settings'})
        

        return {
            
            refresh,            
            goToSettingsPage
        }
    },
})
</script>
