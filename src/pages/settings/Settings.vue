<template>
    <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header class="header-background">
                <q-toolbar >
                    <q-btn icon="arrow_back" flat round @click="goBack" />
                    <q-toolbar-title class="fs-20 text-medium">Configuración</q-toolbar-title> 
                </q-toolbar>
            </q-header>
            <q-page-container class="">
                <q-page style="padding-bottom:20px">
                    <!-- TECHNICIAN IMAGE SECTION -->
                    <div class="profile-image-container column justify-center">
                        <q-item class="ml-10">
                            <q-item-section class="item-section" top avatar>
                                <q-avatar class="" size="4rem" >
                                    <img class="" src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg">
                                </q-avatar>
                            </q-item-section>
                            <q-item-section class="item-section">
                                <q-item-label class=" text-blue-grey-10 text-weight-medium text-h6" >{{user.nickname}}</q-item-label>
                                <q-item-label class=" text-caption  text-grey-1"  lines="2">{{user.email}}.</q-item-label>
                            </q-item-section>
                            <q-item-section clickable v-ripple @click="goToEditProfile"  side >
                                <q-icon class="edit-icon" name="edit" size="xs" color="blue-grey-1" />
                            </q-item-section>
                        </q-item>
                    </div>

                    <!--SETTINGS OPTIONS -->

                    <q-list  padding class="setting-container" >
                        <q-item-label  class="text-weight-bold fs-17 ">Opciones</q-item-label>
                        <!-- SHOW PROFILE OPTION -->
                        <q-item clickable v-ripple @click="goToProfilePage">
                            <q-item-section>
                                <q-item-label>Ver perfil</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon name="chevron_right" size="md" color="grey-9" />
                            </q-item-section>
                        </q-item>
                        <q-separator />
                        <!-- CHANGE PASSWORD OPTION -->    
                        <q-item clickable v-ripple @click="goToChangePasswordPage">
                            <q-item-section>
                                <q-item-label>Cambiar contraseña</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon name="chevron_right" size="md" color="grey-9" />
                            </q-item-section>
                        </q-item>
                        <q-separator />

                        <!-- LOG OUT OPTION --> 
                        <q-item clickable v-ripple @click="logout">
                            <q-item-section>
                                <q-item-label>Cerrar sesión</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon name="logout"  color="grey-9" />
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </q-list>
                </q-page>
            </q-page-container>
        </q-layout>
        
        <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import {useRouter} from 'vue-router'
import {useActions,useGetters} from 'src/store'
export default defineComponent({
    components:{
         
    },
    setup() {

        //
        // Router
        //
        const router=useRouter()

        //
        //TECHNICIAN
        //
        const {user}=useGetters()

        //go to edit technician profile page
        const goToEditProfile=()=>router.push({path:"/technician/profile/edit"})

        //go back to previus page
        const goBack = ()=> router.go(-1)
    
        //go to edit technician profile page
        const goToProfilePage=()=> router.push({path:'/technician/profile'})

        //go to ChangePassword page
        const goToChangePasswordPage=()=> router.push({path:"/change/password"})

        //logOut 
        const {logout:logoutServer}=useActions()
        const logout = async () => {
            // TODO: ELIMIAR DATOS DEL LOCAL STORAGE, DEL STORE, Y REDIRIGIR A LA PÁGINA DE LOGIN
            const {data,error}= await logoutServer()
            router.replace({path:'/login'})
        }

        return{
            goBack,
            goToProfilePage,
            goToChangePasswordPage,
            user,
            logout,
            goToEditProfile
            
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
    height: 15vh;
    background: linear-gradient(to right,$primary, $secondary);
 
} 

.header-background{
    background: linear-gradient(to right,$primary, $secondary);
}
.item-section{
    margin-left: 10px;
}
.setting-container{
    margin: 10px 1rem;
}
.edit-icon{
    
    padding: 8px;
    margin-right:10px ;
    border-radius: 50%;
    background: rgba($blue-grey-10,1);
}
</style>
