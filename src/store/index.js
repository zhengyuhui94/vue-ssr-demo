import Vue from 'vue';
import Vuex from 'vuex';
import {fetchItem} from '../api';

Vue.use(Vuex);

export function createStore(){
    return new Vuex.Store({
        state: {
            items: {},
            homeText: ''
        },
        mutations: {
            setItem(state, {id, item}){
                Vue.set(state.items, id, item);
            },
            setHomeText(state, homeText){
                state.homeText = homeText;
            }
        },
        actions: {
            fetchItem({commit}, id){
                return fetchItem(true).then(item => {
                    commit('setItem', {id, item});
                });
            },
            fetchHomeText({commit}, homeText){
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(homeText);
                        reject();
                    }, 1000);
                }).then(res => {
                    commit('setHomeText', res);
                    return res;
                })
                
            }
        }
    });
}