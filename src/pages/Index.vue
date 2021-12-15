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
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
            <q-btn fab @click="addTicket"  icon="add" color="primary" />
    </q-page-sticky>
  </q-page>

  <!-- CHILDRENS -->

  <router-view />

</template>

<script>
import { defineComponent, ref } from 'vue';
import TicketList from 'src/components/tickets/TicketList.vue'
import UserOptions from 'src/components/session/UserOptions.vue'
import TicketDetail from './TicketDetail.vue'
import {useRouter} from 'vue-router' 
import { Geolocation } from '@capacitor/geolocation';
import {useActions} from 'src/store'
export default defineComponent({
  name: 'PageIndex',
  components:{
    TicketList,
    UserOptions,
    TicketDetail
  },
  setup() {
    const search = ref('');
    const router=useRouter()
    const addTicket=()=>{
        router.push({path:'/add'})
    }

    //
    // Ubicacion
    //
    const cordinates=ref('')
    const watchID=ref('')

    /*Optener ubicacion  */
    const getCurrentPosition = async () => {
    const position = await Geolocation.getCurrentPosition();
        console.log('Current position:', JSON.stringify(position));
        cordinates.value=position.coords

    };
  

    /*Crear watch */
    const {sendCordinate} =useActions()
    console.log('UseActions',JSON.stringify(useActions()))
    const watchPosition= async()=> {
      const options={
        enableHighAccuracy: true,
        timeout: 30000
      }
      try {
          watchID.value= await Geolocation.watchPosition(options, (position, err) => {
          console.log('sendCordinate',sendCordinate)
          const {data,error}=sendCordinate(position.coords)
          cordinates.value=position.coords;
        });
      } catch (e) {
        console.error(e);
      }
    }
    watchPosition()

    /*Limpiar watch */
    const clearWatch=()=> {
      if (this.watchId != null) {
        Geolocation.clearWatch({ id: this.watchId });
      }
    }

    return {
      search,
      addTicket,
      cordinates,
      watchID
    }
  },
})
</script>
