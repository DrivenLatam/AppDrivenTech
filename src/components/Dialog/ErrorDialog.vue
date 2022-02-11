
<template>
    <q-dialog v-model="showDialog" persistent full-width position="bottom" >
        <q-card class=" no-padding">
            <div class="row q-gutter-sm dialog-container">
                <div class="col-2 image-container ">
                    <q-icon name="error_outline" class="text-red-6 image" style="font-size: 3em;" />
                </div>
                <div class="col  py-10">
                    <div class="fs-20 text-weight-medium">Error !!</div>
                    <div class=" fs-15 text-grey-9 text-weight-regular">{{message}}</div>
                </div>
                <div class="col-2 close-btn-container px-5" @click="confirAction">
                        <div class="close-btn-text text-grey-8 text-weight-light">
                            CERRAR
                        </div>
                </div>
            </div>
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

.dialog-container{
    min-height: 70px;   
}
.image-container{
    border-left: 10px solid $red-6; 
    position: relative; 
}
.image{
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%   ;
    transform: translate(-50%,-50%);
}

.close-btn-container{
    border-left: 1px solid $grey-5;
    position: relative;
}
.close-btn-text{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>