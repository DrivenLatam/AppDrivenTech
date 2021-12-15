
import { BASE_URL } from '.';
import axios from 'axios';
import { store } from './local.store';
import {handleMessageError} from '.'

export default {
    state(){
        return {
            latitude:'',
            longitude:''
        }
    },
    mutations: {
        setCordinate(state,{latitude,longitude}){
            state.latitude=latitude,
            state.longitude=longitude
        },
    },
    actions: {
        async sendCordinate( { commit }, {latitude,longitude} ) {
            console.log('Latitudee..',latitude)
            const {username,country}=store.get('user')
            const body={
                latitude,
                longitude,
                username,
                country
            }
            try {
                const {data}=await axios.post(BASE_URL+'users/actualLocation/',body)
                return {data}
            } catch (error) {
                console.log('error de Geolocation')
                handleMessageError(error)
                return {error}
            }
        },
    },
    getters:{
        latitude(state,getters){return state.latitude},
        longitude(state,getters){return state.longitude}
    }
}