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
            <q-input v-model="search"  type="search" hint="Buscar por nombre o codigo de producto">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
            <q-pull-to-refresh @refresh="refreshProducts"  >
                <div  v-if="productListFiltered.length>0">
                    <q-item v-for="(product,index) in productListFiltered" :key="index" 
                        @click="selectProduct(index)"
                        clickable v-ripple>
                        <q-item-section>
                            <q-item-label>{{product.productName}}</q-item-label>
                            <q-item-label caption>{{product.productCode}}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
                <div class="text-grey-8 fs-13 pa-5 bg-blue-1 px-8 py-8" v-else > No se encontraron coincidencias, quiza el producto no existe o deberia 
                            <span @click="getProductsFromServer" class="underline text-primary text-bold"> actualizar</span> la lista </div>
            </q-pull-to-refresh>
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

        /*----------Products ---------*/
        const productList=ref(null)
        const productListFiltered=ref(null)
        const {getProducts}=useActions()
        const {user,products}= useGetters()

        //obtener los contactos del servidor
        const getProductsFromServer=async()=>{
            loading.value=true
            search.value=""
            const {data,error}= await getProducts({country:user.value.country})
            if(data) {
                productList.value=data
                productListFiltered.value=data
                loading.value=false
            }else {
                loading.value=false
            }
        }

        //lanza un evento con el cliente seleccionado
        const selectProduct=(index)=>{
            //console.log("---",productListFiltered.value[index])
            const product={
                ... productListFiltered.value[index]
            }
            emit('hide-dialog')
            emit("client-selected",product)
        }

        //obtiene la lista de contactos del servidor
        const refreshProducts=async(done)=>{
            const {data,error}= await getProducts({country:user.value.country})
            if(data) {
                productList.value=data
                productListFiltered.value=data
            }
            search.value=""
            done()
        }

        /*----------Search----------*/
        const search=ref("")     

        //filtrar la lista de contactos cada vez que escribe algo en el buscador
        const filterProducts=()=>{ 
            if(search.value.length>0) {
                    productListFiltered.value=productList.value.filter((product)=>{
                    return product.productName.toLowerCase().includes(search.value.toLowerCase()) 
                })
            } else productListFiltered.value= productList.value
        }
        watch(search,filterProducts)

        //Al cargar la pagina
        if(products.value){
            productList.value=products.value
            productListFiltered.value=products.value
        }else getProductsFromServer()

        return {
            fixed:ref(true),
            search,
            productList,
            productListFiltered,
            loading,
            hideDialog,
            selectProduct,
            refreshProducts,
            getProductsFromServer
        }
    },
})
</script>
