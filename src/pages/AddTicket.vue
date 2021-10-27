<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >
        <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header elevated class="bg-white text-black">
            <q-toolbar>
                <q-btn icon="arrow_back" flat round @click="goBack" />
            </q-toolbar>
            </q-header>

            <q-page-container>
                <q-page>
                    <p>Agregar Ticket</p>
                </q-page>
            </q-page-container>
            
        </q-layout>
    </q-dialog>
</template>
<script>

import { defineComponent,ref,computed } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useGetters} from 'src/store'

export default defineComponent({
    setup() {
        const route=useRoute()
        const router=useRouter()
        const dialog= ref(true)

        const goBack=()=>{
            dialog.value=false
            setTimeout(()=>{
                router.go(-1)
            },200)

        }
        document.addEventListener('backbutton',()=>{
            console.log('Test')
            goBack()
        })
        
        return{goBack,dialog}
    },
})
</script>
<style scoped>
.item-detail{
    margin-top: 5   px;
}
.title-detail{
    margin:5px;
    padding-bottom: 0px;
}
</style>