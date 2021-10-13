<template>
  <!-- PAGE HEADER -->
  <q-header class="bg-transparent text-grey-8 p-16">
    <q-toolbar>
      <q-input v-model="search" outlined rounded class="full-width" placeholder="Buscar ticket">
        <template v-slot:prepend>
          <q-icon class="px-8" name="search"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn rounded dense flat class="px-8" v-if="search" @click="search=''" icon="close" />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>

  <!-- PAGE BODY -->

  <q-page class="flex p-18">
    <ticket-list />
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import TicketList from 'src/components/tickets/TicketList.vue'
export default defineComponent({
  name: 'PageIndex',
  components:{
    TicketList
  },
  setup() {
    const search = ref('');

    return {
      search
    }
  },
})
</script>
