<template>
    <q-page-sticky expand 
                   :style="`margin-left:${mx}; margin-right:${mx};`" 
                   position="bottom" :offset="[0, 15]">
            <q-btn 
                class="full-width btn fs-16" 
                color="primary" :label="label" 
                no-caps
                unelevated 
                rounded 
                text-color="grey-1"
                :loading="loading"
                
            /> 
    </q-page-sticky>
</template>
<script>
import { defineComponent,toRefs } from 'vue'

export default defineComponent({

    props:["label","loading","mx"],
    setup(props) {
        const {mx}=toRefs(props)
        console.log("mx",mx.value)
    },
})
</script>
<style lang="scss" scoped>

</style>
