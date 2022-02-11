

<template>
    <q-header class="header-background">
            <q-toolbar>
                    <q-btn icon="arrow_back" flat round @click="goBack" />
                    <q-toolbar-title class="fs-20 "> {{title}} </q-toolbar-title> 
                    <q-avatar v-if="showAvatar" size="40px" >
                            <img src="imgs/drivenImg.png"/>
                    </q-avatar>
                </q-toolbar>
     </q-header>
</template>
<script>
import { defineComponent,ref,toRefs } from 'vue'

export default defineComponent({

    props:['title','showAvatar'],
    setup(props,{emit}) {
        const {title,message}=toRefs(props)
        const goBack= ()=>{
            emit('onGoBack')
        }
        return {
            goBack
        }
    },
})

</script>

<style lang="scss" scoped>
.header-background{
        background: linear-gradient(to right,$primary, $secondary);
}
</style>