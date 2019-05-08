import vuex from 'vuex';
import Vue from 'vue';

Vue.use(vuex);

export default new vuex.Store({
    state:{
        count:0
    },
    mutations:{
        increment:(state)=>{
            state.count+=1
        },
        decrement:(state)=>{
            state.count-=1
        }
    },

})
