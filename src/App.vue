<template>
  <router-view />
</template>
<script>
import { defineComponent, ref, toRefs,onMounted } from 'vue';
import {useGetters,useActions, useMutations} from 'src/store'
import {useRouter} from 'vue-router'
import axios from "axios"

export default defineComponent({
  name: 'App',
  setup(){

    const router = useRouter()
    const { isLogged,user } = useGetters()
    const { getTicketsFromServer } = useActions()
    const { setLoadingTicket } = useMutations()
    
    // REQUEST INTERCEPTOR THAT ATTACH AUTHENTICATION HEADER TO EVERY REQUEST 
    const authInterceptor=()=>{    
        console.log("adding interceptor")
        axios.interceptors.request.use(function (config) {
            if(user.value) config.headers.common['Authorization'] = `Token ${user.value.token}`;
            return config;
          }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
    }
    authInterceptor()

    const verifyLogin= async () => {
      // Si no está logeado, redirige al login
      if (!isLogged.value) router.replace({path:'/login'})
      // Si está logeado, obtiene los tickets del servidor
      else {
        console.log("getting ticket from APP.VUE")
        setLoadingTicket(true)
        const { data, error } = await getTicketsFromServer()
        if(error)console.log("error in APP.VUE",error)
        else console.log("No Error")
        //console.log("Obteniendo tickets del servidor en el App.vue",data)
        // TODO: SI HAY ERROR, MOSTRAR MENSAJE, SINO, setLoadingTicket(false)
        //setLoadingTicket(false)
      }
    }
    verifyLogin()
    
    return { }
  },
  
})
</script>
