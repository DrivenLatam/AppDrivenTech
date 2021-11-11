import { store } from 'quasar/wrappers';
import { createStore, useStore } from 'vuex';
import sessionStore from './session.store';
import ticketsStore from './tickets.store';

import { computed } from 'vue';

export const BASE_URL = "https://b3e5-186-2-207-58.ngrok.io/"
//export const BASE_URL = "http://localhost:8000/";
//export const BASE_URL = "https://jesusroman.live/";

export const handleMessageError=(error)=>{
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    return { error:error.response.data.error, field:error.response.data.field }
    //console.log(error.response.status);
    //console.log(error.response.headers);
  } else if (error.request) {
    //
    // The request was made but no response was received
    console.log('Request:',error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }

}
// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      sessionStore,
      ticketsStore
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})

export const useState = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.state).map(
      key => [key, computed(() => store.state[key])]
    )
  )
}

export const useGetters = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.getters).map(
      getter => [getter, computed(() => store.getters[getter])]
    )
  )
}

export const useMutations = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store._mutations).map(
      mutation => [mutation, value => store.commit(mutation, value)]
    )
  )
}

export const useActions = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store._actions).map(
      action => [action, value => store.dispatch(action, value)]
    )
  )
}