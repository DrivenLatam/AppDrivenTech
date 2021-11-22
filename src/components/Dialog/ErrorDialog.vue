<template>
    <!--Dialog para confirmar si se quiere finalizar un ticket -->
        <q-dialog v-model="showDialog" persistent full-width >
            <q-card>
                <q-card-section class="bg-negative text-white fs-20 py-10">
                    {{title}}
                </q-card-section>

                <q-card-section class="bg-white text-grey-9 q-py-sm">
                    {{message}}
                </q-card-section>

                <q-card-actions align="right">
                        <q-btn @click="confirAction" flat  label="Ok" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
</template>
<script>
import { defineComponent,ref,toRefs } from 'vue'

export default defineComponent({

    props:['title','message'],
    setup(props,{emit}) {
        const {title,message}=toRefs(props)
        const confirAction= ()=>{
            emit('confirAction')
        }
        return {
            showDialog:ref(true),
            persistentDialog:ref(true),
            confirAction
        }
    },
})

</script>
