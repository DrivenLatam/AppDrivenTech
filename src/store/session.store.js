import { BASE_URL } from '.';
import axios from 'axios';
import { store } from './local.store';
import {handleMessageError} from '.'

export default {
    state() {
        return {
            user: store.get('user', null)
        }
    },
    mutations: {
        setUser(state, data) {
            state.user = data;
            store.set('user', data); 
        },
    },
    actions: {
        async login({ commit }, { email, password }) {
            try {
                console.log('login')
                const { data } = await axios.post(BASE_URL + "users/login/",
                    { email, password });
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
        }
    },
    getters: {
        user(state) { return state.user },
        isLogged(state) { return !!state.user },
        token(state) { return state.user.token },
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