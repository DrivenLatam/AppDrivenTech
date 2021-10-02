import { BASE_URL } from '.';

export default {
    state() {
        return {
            user: null, // store.get('user', null); // Get user from local
        }
    },
    mutations: {
        setUser(state, data) {
            state.user = data;
            // store.set('user', data); // TODO: SAVE IN LOCAL
        },
    },
    actions: {
        async login({ commit }, { username, password }) {
            try {
                const { data } = await axios.post(BASE_URL + "login/",
                    { username, password });
                // TODO: SAVE USER // const user = { ...data.user, token: data.token };
                const user = { username, email: username + "@gmail.com", token: '1234' };
                commit('setUser', user);
                return { data: user };
            }
            catch (error) { return { error } }
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