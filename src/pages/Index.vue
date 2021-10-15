<template>
  <!-- PAGE HEADER -->
  
    <q-header class="bg-white text-grey-8 px-16 pt-16">
    <q-toolbar>
      <q-input v-model="search" outlined rounded class="full-width" placeholder="Buscar tickets">
        <template v-slot:prepend>
          <q-icon class="px-8" name="search"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn v-if="search" rounded dense flat class="px-8" @click="search=''" icon="close" />
          <UserOptions v-else />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
  
  

  <!-- TICKET LIST -->

  <q-page class="flex p-18">
    <ticket-list :search="search" class="full-width" />
  </q-page>

  <!-- CHILDRENS -->

  <router-view />

</template>

<script>
import { defineComponent, ref } from 'vue';
import TicketList from 'src/components/tickets/TicketList.vue'
import UserOptions from 'src/components/session/UserOptions.vue'

export default defineComponent({
  name: 'PageIndex',
  components:{
    TicketList,
    UserOptions
  },
  setup() {
    const search = ref('');

    return {
      search
    }
  },
})
</script>
