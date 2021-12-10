<template>
    <!--Dialog para confirmar si se quiere finalizar un ticket -->
        <q-dialog v-model="showDialog" persistent full-width position="bottom" >
            <q-card class="bg-red-4 section no-padding">
                <q-card-section class="bg-red-5 text-white py-20 px-15 ">
                    <div class="fs-22 text-weight-bold">
                        <div>Error !!</div>
                        <div class="btn-close"><q-btn flat icon="close" @click="confirAction"   v-close-popup /> </div>
                    </div>
                    <div class="text-body2">
                         {{message}}
                    </div>
                </q-card-section>

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
<style lang="scss" scoped>
.btn-close{ 
    position: absolute;
    right: 1px;
    top: 5px;
    
}
.section{
        position: relative;

}
</style>