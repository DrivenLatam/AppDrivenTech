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
            <q-btn fab @click="addTicket"  icon="add" color="secondary" />
    </q-page-sticky>
  </q-page>

  <!-- CHILDRENS -->

  <router-view />

</template>

<script>
import { defineComponent, ref } from 'vue';
import TicketList from 'src/components/tickets/TicketList.vue'
import UserOptions from 'src/components/session/UserOptions.vue'
import TicketDetail from './tickets/TicketDetail.vue'
import {useRouter} from 'vue-router' 
import { Geolocation } from '@capacitor/geolocation';
import {useActions} from 'src/store'

import { Plugins } from '@capacitor/core';
//import { BackgroundTask } from '@robingenz/capacitor-background-task';
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
    // LOCATION
    //
    const cordinates=ref('')
    const watchID=ref('')

    /*get location  */
    const getCurrentPosition = async () => {
        const position = await Geolocation.getCurrentPosition();
        return position
    };
  
    //
    //WATCH 
    //
    const {sendCordinate} =useActions()
    //console.log('UseActions',JSON.stringify(useActions()))
    const watchPosition= async()=> {
      console.log("Creating watch")
      const options={
        enableHighAccuracy: true,
        timeout: 1000
      }
      try {
          watchID.value= await Geolocation.watchPosition(options, (position, err) => {
          const {data,error}= sendCordinate(position.coords)
        });
      } catch (e) {
        console.error(e);
      }
    }
    watchPosition()

    /*Limpiar watch */
    const clearWatch=()=> {
      console.log("Clearing watch")
      if ( watchID.value != null) {
        Geolocation.clearWatch({ id: watchID.value });
      }
    }
    /*
    //
    //BACKGROUND TASK
    //
    
    const { App } = Plugins;
    /*create a background task */
    /*
    App.addListener('appStateChange', async (state) => {
      if (!state.isActive) {
        let taskId = BackgroundTask.beforeExit( async () => {
          //clearWatch()
          await sendCordinatesBackground()  
          finishBackgroundTask(taskId)
        });
      }
  });
  */
  /* */
  const finishBackgroundTask=(taskId)=>{
      console.log("Finishing task")
      BackgroundTask.finish({
            taskId,
      });
  }
  /* */
  /*
  const sendCordinatesBackground=async ()=>{
        const {coords}= await getCurrentPosition()
        console.log("cords",coords)
        const {data,error}=await sendCordinate(coords)
        console.log("data",data)
  }
  */
    return {
      search,
      addTicket,
      cordinates,
      watchID
    }
  },
})
</script>
