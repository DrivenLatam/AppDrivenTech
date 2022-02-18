<template>
  <router-view />
</template>
<script>
import { defineComponent, ref, toRefs,onMounted } from 'vue';
import {useGetters,useActions, useMutations} from 'src/store'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'App',
  setup(){
    const router = useRouter()
    const { isLogged } = useGetters()
    const { getTicketsFromServer } = useActions()
    const { setLoadingTicket } = useMutations()
    const verifyLogin= async () => {
      // Si no está logeado, redirige al login
      if (!isLogged.value) router.replace({path:'/login'})
      // Si está logeado, obtiene los tickets del servidor
      else {
        setLoadingTicket(true)
        const { data, error } = await getTicketsFromServer()
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
