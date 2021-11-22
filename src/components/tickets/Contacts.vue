<template>
  <div class="">
    
    <q-dialog v-model="fixed" full-width  @hide="hideDialog">
        <q-spinner
            color="primary"
            size="3em"
            v-if="loading"
        />
      <q-card  v-else> 
        <q-card-section>
          <div class="text-h6">Lista de clientes</div>
            <q-input v-model="search"  type="search" hint="Buscar por cliente o empresa">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
            <q-item v-for="(contact,index) in contactListFilter" :key="index" 
                @click="selectContact(index)"
                clickable v-ripple>
                <q-item-section>
                    <q-item-label>{{contact.name.split("-")[0]}}</q-item-label>
                    <q-item-label caption>{{contact.name.split("-")[1]}}</q-item-label>
                </q-item-section>
            </q-item>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent,ref,watch } from 'vue'
import {useActions,useGetters} from "src/store"
export default defineComponent({
    setup(props,{emit}) {
        
        const loading=ref(false)
        
        const hideDialog=()=>{
                emit('hide-dialog')
        }

        /*----------Contacts ---------*/
        const contactsList=ref(null)
        const contactListFilter=ref(null)
        const {getContacts}=useActions()
        const {user,contacts}= useGetters()

        //obtener los contactos del servidor
        const getContactsServer=async()=>{
            loading.value=true
            const {data,error}= await getContacts({country:user.value.country})
            if(data) {
                contactsList.value=data
                contactListFilter.value=data
                loading.value=false
            }else {
                loading.value=false
            }
        }
        //lanza un evento con el cliente seleccionado
        const selectContact=(index)=>{
            const client={
                name:contactListFilter.value[index].name.split("-")[0], //obtenemos el nombre del contacto
                company:contactListFilter.value[index].name.split("-")[1], //obtenemos la empresa del contacto
                id:contactListFilter.value[index].id, 
                accountId:contactListFilter.value[index].accountId
            }
            emit('hide-dialog')
            emit("client-selected",client)
        }
        /*----------Search----------*/
        const search=ref("")     

        //filtrar la lista de contactos cada vez que escribe algo en el buscador
        const filterContacts=()=>{ 
            if(search.value.length>0) {
                    contactListFilter.value=contactsList.value.filter((contact)=>{
                    return contact.name.toLowerCase().includes(search.value.toLowerCase()) 
                })
            } else contactListFilter.value= contactsList.value
        }
        watch(search,filterContacts)

        //Al cargar la pagina
        if(contacts.value){
            console.log(".....")
            contactsList.value=contacts.value
            contactListFilter.value=contacts.value
        }else getContactsServer()

        return {
            fixed:ref(true),
            search,
            contactsList,
            contactListFilter,
            loading,
            hideDialog,
            selectContact
        }
    },
})
</script>
