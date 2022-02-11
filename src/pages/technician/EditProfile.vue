<template>
    <q-dialog
            v-model="dialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
    >   
    <q-layout view="hHh lpR fFf" class="bg-white">
            <q-header  class="header-background">
                <q-toolbar>
                    <q-btn icon="arrow_back" flat round @click="goBack" />
                    <q-toolbar-title class="fs-20">Editar Perfil</q-toolbar-title> 
                </q-toolbar>
            </q-header>

            <q-page-container >
                <q-page >
                    <q-scroll-area  style="height: calc(100vh - 115px); max-width: 100%;"> 
                        <!-- TECHNICIAN IMAGE SECTION -->
                        <div class="profile-image-container column justify-center items-center">
                            <q-avatar class="" size="8rem" >
                                <img class="" src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg">
                            </q-avatar>
                            <p class="mt-5 profile-image-username ">Editar foto </p>
                        </div>
                        <!-- INPUTS -->

                                <!-- NICKNAME INPUT -->
                            <q-input v-model="nickName" outlined :disable="sendingUpdate" 
                                    label="Nombre usuario" class="input " >
                                <template v-slot:prepend>
                                    <q-icon  name="person"  />
                                </template>
                            </q-input>
                            <!-- EMAIL INPUT -->
                            <q-input v-model="email"  outlined :disable="sendingUpdate"  
                                    label="Correo electronico" class="input " >
                                <template v-slot:prepend>
                                    <q-icon  name="email"  />
                                </template>
                            </q-input>

                            <!-- ADDRESS INPUT -->
                            <q-input v-model="address"  autogrow outlined :disable="sendingUpdate"  
                                    label="Direccion" class="input " >
                                <template v-slot:prepend>
                                    <q-icon  name="home"  />
                                </template>
                            </q-input>
                            
                            <!-- BIRTHDAY INPUT -->
                           
                            <q-input outlined v-model="birthday" @click="showBirthdayDate=true" label="Fecha Nacimiento"  class="input ">
                                <template v-slot:prepend>
                                    <q-icon name="event" class="date_range">
                                        <q-popup-proxy v-model="showBirthdayDate" ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="birthday" minimal mask="DD/MM/YYYY" >
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>

                            <!-- TELEPHONE  INPUT -->
                            <q-input v-model="phoneNumber"     outlined :disable="sendingUpdate"  
                                    label="Telefono" class="input " >
                                <template v-slot:prepend>
                                    <q-icon  name="phone"  />
                                </template>
                            </q-input>

                            <!-- COUNTRY INPUT -->
                            <q-select  outlined :disable="sendingUpdate" 
                                    v-model="country"  label="Pais" class="input " 
                                    :options= "[{ label: 'Paraguay', value: 'PY' }, { label: 'Uruguay', value: 'UY' }] "
                                    >
                                <template v-slot:prepend>
                                    <q-icon  name="flag"  />
                                </template>
                            </q-select>
                            <!-- FULL NAME  INPUT -->
                            <q-input v-model="fullName"     outlined :disable="sendingUpdate"  
                                    label="Nombre y Apellido" class="input " >
                                    <template v-slot:prepend>
                                        <q-icon  name="contact_page"  />
                                    </template>
                            </q-input>

                            <!-- DNI INPUT -->
                            <q-input v-model="dni"     outlined :disable="sendingUpdate"  
                                    label="Cedula" class="input " >
                                    <template v-slot:prepend>
                                        <q-icon  name="perm_identity"  />
                                    </template>
                            </q-input>
                        </q-scroll-area>
                       
                        <!--DIALOG -->
                        <!-- SUCCES -->
                        <succes-dialog v-if="succesDialog"
                                       title="Actualizado" 
                                       message="Se actualizaron los datos correctamente"
                                       @confirAction="goBack"
                                        />
                        <!-- ERROR-->
                        <error-dialog   v-if="errorDialog"
                                        title="Error" 
                                        message="No se pudieron actualizar los datos, intentelo mas tarde"
                                        @confirAction="errorDialog=false"
                                        />
                        <!--SAVE BUTTOM -->
                        <btn mx="1rem"  label="Guardar" @click="saveProfile" :loading="sendingUpdate"/>  
                </q-page>
            </q-page-container>
        </q-layout>
    </q-dialog>
</template>

<script>
import { defineComponent,ref,computed } from 'vue'
import {useRouter} from 'vue-router'
import {useActions, useGetters} from 'src/store'
import Btn from "src/components/Btn.vue"
import SuccesDialog from 'src/components/Dialog/SuccesDialog.vue'
import ErrorDialog from 'src/components/Dialog/ErrorDialog.vue'
export default defineComponent({
    components:{
        Btn,SuccesDialog,ErrorDialog
    },
    setup() {
        //
        //----------GLOBAL-------------
        //
        
        //dialog
        const dialog=ref(true)
        const succesDialog=ref(false)
        const errorDialog=ref(false)
        // Router
        const router=useRouter()

        //
        //TECHNICIAN
        //
        const {user}=useGetters()
        const {updateTechnicianToServer} =useActions()
        const sendingUpdate=ref(false)
        //Update technician profile data in the server
        const saveProfile= async()=>{
            sendingUpdate.value=true
            if(!isValidated) return
            
            const {data,error}=await updateTechnicianToServer()
            sendingUpdate.value=false
            if(data){
                console.log("Actualizado")
                succesDialog.value=true
            }else{
                errorDialog.value=true
            }
        }
        //Validate if technician's data is ok before send an request in the server
        const isValidated=()=>{
            return true
        }
        //
        //------------INPUTS--------------
        //

        //
        //  NICKNAME
        //
        const nickName=ref(user.value.nickname)

        //
        //  EMAIL
        //
        const email=ref(user.value.email)

        //
        //  PHONE
        //
        const phoneNumber=ref(user.value.phone_number)

        //
        //  FULL NAME
        //
        const fullName=ref(user.value.first_name + user.value.last_name)

        
        //
        //  DNI
        //
        const dni=ref(user.value.nro_ci)

        
        //
        //  COUNTRY     
        //
        const getCountry=computed( _=>user.value.country=="PY" ? "Paraguay" : "Uruguay" )
        const country=ref(getCountry.value)
       
        //
        //  ADDRESS     
        //
        const address=ref("")

        //
        //  BIRTHDAY     
        //
        const birthday=ref("")

        
        //go back to previus page
        const goBack = ()=>{
                dialog.value=false
                setTimeout(_=>router.go(-1),200)     
        }   

        return {
            goBack,
            dialog,
            nickName,
            email,
            phoneNumber,
            dni,
            fullName,
            country,
            address,
            birthday,
            saveProfile,
            sendingUpdate,
            succesDialog,
            errorDialog,
            showBirthdayDate:ref(false)

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

.profile-image-username{
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    letter-spacing:1px;
    color: #404041;
   
}
.header-background{
    background: linear-gradient(to right,$primary, $secondary);
}

.input{
    width: 86%;
    margin: 10px 7%;
}

</style>