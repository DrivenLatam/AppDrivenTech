<template>
    <q-item v-ripple clickable  >
            <q-item-section >
            <q-item-label>{{ticket.subject}} </q-item-label>
            <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{ticket.status}}</q-item-label>
            </q-item-section>
    </q-item>
</template>
<script>
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
    props:['ticket'],
    emits:['change'],
    setup(props,{emit}) {
        const {ticket}=toRefs(props)

        return {ticket}
    },
})
</script>
