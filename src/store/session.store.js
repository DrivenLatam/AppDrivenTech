import { BASE_URL } from '.';
import axios from 'axios';
import { store } from './local.store';
import {handleMessageError} from '.'

export default {
    state() {
        return {
            user: store.get('user', null),
            resetPasswordEmail:store.get('resetPasswordEmail',""),
            resetVerificationCode:store.get('resetVerificationCode',"")
        }
    },
    mutations: {
        setUser(state, data) {
            state.user = data;
            store.set('user', data); 
        },
        setResetPasswordEmail(state,{email,verificationCode}){
            console.log(email,verificationCode)
            state.resetPasswordEmail=email
            store.set('resetPasswordEmail',email)
            store.set('resetVerificationCode',verificationCode)
        }
    },
    actions: {
        async login({ commit }, { email, password,tokenNotification }) {
            try {
                console.log('Token Notification',tokenNotification)
                const { data } = await axios.post(BASE_URL + "users/login/",
                    { email, password,tokenNotification });
                const user = { ...data.user, token: data.access_token };
                commit('setUser', user);
                return { data: user };
            }
            catch (_error) { 
                const {error,field}=handleMessageError(_error)
                return {error,field}
            }
        },

        logout({ commit }) { commit('setUser', null) },

        async changePasswordServer({commit},{current_password,new_password,confir_new_password}){
            try {
                console.log("ChangePassword")
                const {email}=store.get("user")
                const {data}= await axios.put(BASE_URL+"users/password/",{email,current_password,new_password,confir_new_password})
                return {data}
            } catch (_error) {
                const {error,field}=handleMessageError(_error)
                return {error,field}
            }
        },

        async generatePasswordCode({commit},email){
            try{
                const {data}= await axios.get(BASE_URL+'users/password/generateCode/',{params:{email}})
                //console.log('data...',data.verification_code)
                commit('setResetPasswordEmail',{email:email,verificationCode:data.verification_code})
                return {data}
            }catch(_error){
                const {error,field}=handleMessageError(_error)
                console.log('error',error)
                return {error,field}
            }
        },

        async validatePasswordCode({commit},{email,code}){
            console.log(email,code)
            try{
                const {data}= await axios.get(BASE_URL+'users/password/verificateCode/',{params:{email,code}})
                console.log('data',data)
                return {data}
            }catch(_error){
                const {error,field}=handleMessageError(_error)
                return {error,field}
            }
        },

        async resetPassword({commit},{email,new_password,confir_new_password}){
            console.log(email,new_password,confir_new_password)
            try {
                const {data}= await axios.put(BASE_URL+"users/password/reset/",{email,new_password,confir_new_password})
                commit('setResetPasswordEmail',"")
                return {data}
            } catch (_error) {
                const {error,field}=handleMessageError(_error)
                return {error,field}
            }
        },
    },
    getters: {
        user(state) { return state.user },
        isLogged(state) { return !!state.user },
        token(state) { return state.user.token },
        resetPasswordEmail(state){return state.resetPasswordEmail},
        resetVerificationCode(state){return state.resetVerificationCode},
        authHeader(state) {
            const { token } = state.user;
            return {
                headers: token ? {
                    'Authorization': `token ${token}`
                } : {}
            };
        },
    }
}