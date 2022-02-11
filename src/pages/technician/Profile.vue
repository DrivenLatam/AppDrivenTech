<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >   
        <q-layout view="hHh lpR fFf" class="bg-white">
                <q-header class="header-background">
                    <q-toolbar >
                        <q-btn icon="arrow_back" flat round @click="goBack" />
                        <q-toolbar-title class="fs-20 text-medium">Perfil</q-toolbar-title> 
                    </q-toolbar>
                </q-header>
                <q-page-container class="">
                    <q-page style="padding-bottom:20px">
                        <!-- TECHNICIAN IMAGE SECTION -->
                        
                        <div class="profile-image-container column justify-center items-center">
                            <q-avatar class="" size="8rem" >
                                <img class="" src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg">
                            </q-avatar>
                            <p class="mt-5 profile-image-username ">{{user.nickname}}</p>
                        </div>
                        <!--TECHINICIAN INFORMATION SECTION -->
                        <div class="profile-data-container column justify-evenly  ">
                            <input-text label="Nombre Completo" :value="`${user.first_name} ${user.last_name}`"/>
                            <input-text label="Correo" :value="user.email"/>
                            <input-text label="Direccion" value="Sin información"/>
                            <input-text label="Cedula" :value="user.nro_ci"/>
                            <input-text label="Fecha Nacimiento" value="Sin información"/>
                            <input-text label="Telefono" :value="user.phone_number"/>
                            <input-text label="País" :value="getCountry"/>
                        </div>
                        
                        <!--EDIT PROFILE BTN-->
                        <q-page-sticky position="bottom-right" :offset="[20, 20]">
                            <q-btn fab @click="goToEditProfile"  icon="edit" color="secondary" />
                        </q-page-sticky>
                    </q-page>
                </q-page-container>
        </q-layout>
    </q-dialog>  
    <router-view />

</template>

<script>
import { defineComponent,computed,ref } from 'vue'
import {useRouter} from 'vue-router'
import InputText from 'src/components/InputText.vue'
import {useGetters} from 'src/store'
export default defineComponent({
    components:{
          InputText  
    },
    setup() {
        //
        //GLOBAL
        //
        const dialog=ref(true)
        //
        // Router
        //
        const router=useRouter()

        //
        //TECHNICIAN
        //
        const {user}=useGetters()
        //get technician country  fully 
        const getCountry=computed( _=>user.value.country=="PY" ? "Paraguay" : "Uruguay" )
        //go back to previus page
        const goBack = ()=>{
            dialog.value=false
            setTimeout(_=>router.go(-1),200)    
        }
        //go to edit technician profile page
        const goToEditProfile=()=>router.push({path:"/technician/profile/edit"})
                
        return{
            goBack,
            goToEditProfile,
            user,
            getCountry,
            dialog
        }
    },
})
</script>
<style  lang="scss" scoped>
*{
    margin: 0px;
    padding: 0px;
}
.profile-image-container{
    height: 30vh;
    width: 100%;
    background: linear-gradient(to right,$primary, $secondary);
 
} 
.profile-data-container{
    margin: 0px 1.3rem;
}

.profile-image-username{
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 1.3rem;
    letter-spacing:1px;
    color: $grey-1;
   
}
.header-background{
    background: linear-gradient(to right,$primary, $secondary);
}
</style>