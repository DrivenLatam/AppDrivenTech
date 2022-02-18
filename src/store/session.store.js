import { BASE_URL } from '.';
import axios from 'axios';
import { store } from './local.store';
import {handleMessageError} from '.'

export default {
    state() {
        return {
            user: store.get('user', null),
            resetPasswordEmail:store.get('resetPasswordEmail',""),
            resetVerificationCode:store.get('resetVerificationCode',""),
           
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
        async login({ commit }, { nickname, password,tokenNotification }) {
            try {
                console.log('Token Notification',tokenNotification)
                const { data } = await axios.post(BASE_URL + "users/login/",
                    { nickname:nickname, password,tokenFB:tokenNotification });
                const user = { ...data.user, token: data.access_token,tokenFB:tokenNotification };
                commit('setUser', user);
                return { data: user };
            }
            catch (_error) { 
                const {error,field}=handleMessageError(_error)
                return {error,field}
            }
        },

        async logout({ commit }) { 
            const {tokenFB}=store.get("user")
            //commit('setUser', null)
            
            try {
                const {data}= await axios.delete(BASE_URL+'users/logout/',{params:{tokenFB}})
                store.clear()
                return {data:'Ok'}
            } catch (error) {
                console.log('Eror del logout')
                handleMessageError(error)
                return error
            }
             
        
        },

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

        async generatePasswordCode({commit},{email,phoneNumber}){
            try{
                let resource=   email ? 'users/password/generateCode/' : 'users/password/generatePhoneCode/'
                const {data}= await axios.get(BASE_URL+resource,{params:{email,phone_number:phoneNumber}})
                commit('setResetPasswordEmail',{email:email || phoneNumber ,verificationCode:data.verification_code})
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