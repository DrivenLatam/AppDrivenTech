import axios from "axios"

export default {
    state(){
        return{
            test1:"Test"
        }
    },
    mutations:{
        setTest1(state,newTest1){
            state.test1=newTest1
        }
    },
    actions:{
        async getTest1fromserver({commit,getters},params){
            const {data} = await axios.get('url',params)
            commit('setTest1',data)
            return data
        }
    },
    getters:{
        test1(state,getters){
            getters.test2
            return state.test1
        }
    }

}