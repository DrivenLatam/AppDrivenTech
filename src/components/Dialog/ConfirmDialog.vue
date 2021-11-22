<template>
    <!--Dialog para confirmar si se quiere finalizar un ticket -->
        <q-dialog v-model="showDialog" :persistent="persistentDialog" >
            <q-card>
                <q-card-section class="bg-primary text-white fs-20 py-20">
                    {{title}}
                </q-card-section>

                <q-card-section class="bg-white text-grey-9 q-py-lg">
                    {{message}}
                </q-card-section>

                <q-card-actions align="right">
                        <q-btn flat @click="cancelAction" label="Cancelar" color="primary" v-close-popup />
                        <q-btn flat @click="confirAction" :label="label" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
</template>
<script>
import { defineComponent,ref,toRefs } from 'vue'

export default defineComponent({

    props:['title','message','label'],
    setup(props,{emit}) {

        const {title,message,label}=toRefs(props)
        
        const confirAction= ()=>{
            emit('confirAction')
        }
        const cancelAction=()=>{
            emit('cancelAction')
        }
       
        return {
            showDialog:ref(true),
            persistentDialog:ref(true),
            confirAction,
            cancelAction
        }
    },
})

</script>
