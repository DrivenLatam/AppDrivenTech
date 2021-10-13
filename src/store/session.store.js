import { BASE_URL } from '.';
import axios from 'axios';
import { store } from './local.store';

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
            catch (error) { 
                console.log('error',error.response)
                return { error } }
        },
        logout({ commit }) { commit('setUser', null) },
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