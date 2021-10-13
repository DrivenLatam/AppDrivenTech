<template>
  <router-view />
</template>
<script>
import { defineComponent, ref, toRefs,onMounted } from 'vue';
import {useGetters} from 'src/store'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'App',
  setup(){
      const {isLogged}=useGetters()
      const router=useRouter()
      const verifyLogin=()=>{
            if (!isLogged.value){
                router.replace({path:'/login'})
            }
      }
      verifyLogin()
      
      return {}
  },
  
})
</script>
