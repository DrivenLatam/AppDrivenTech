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
      const {isLogged}=useGetters()
      const router=useRouter()
      const {getTicketsFromServer}=useActions()
      const {setLoadingTicket}=useMutations()
      const loadTickets=async()=>{
                const {data,error}=await getTicketsFromServer()
                console.log('tickets',data)
                setLoadingTicket(false)
      }
      const verifyLogin=()=>{
            if (!isLogged.value){
                router.replace({path:'/login'})
            }else loadTickets()
      }
      verifyLogin()
      
      return {}
  },
  
})
</script>
