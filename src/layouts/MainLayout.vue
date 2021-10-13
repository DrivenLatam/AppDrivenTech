<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer bordered class="bg-transparent">
      <q-toolbar class="bg-transparent flex flex-center">
        <q-tabs v-model="tab" dense class="text-grey-6 full-width" align="justify" 
          active-color="primary" indicator-color="transparent"
        >
          <q-tab name="home" icon="home" label="Inicio" />
          <q-tab name="calendar" icon="event_available" label="Calendario" />
          <q-tab name="movies" icon="movie" label="Movies" />
        </q-tabs>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const tab = ref('home');
    return {
      tab,
    }
  }
})
</script>
