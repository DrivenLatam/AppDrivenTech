<template>
    <p>jaja</p>
</template>

<script>
import { defineComponent,ref, toRefs,computed } from 'vue'
import {useRouter} from 'vue-router'

export default defineComponent({
    name:'Edit',
    setup() {
        console.log('Se llama')
        return {
            secondDialog: ref(true)

        }    
    },
})
</script>
