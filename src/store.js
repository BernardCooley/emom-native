import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoggedIn: false,
        loggedInUser: null,
        menuDisplayed: false,
        pageTitle: null
    },
    mutations: {
        UPDATE_ISLOGGED_IN: (state, value) => {
            state.isLoggedIn = value
        },
        UPDATE_LOGGED_IN_USER: (state, value) => {
            state.loggedInUser = value
        },
        TOGGLE_MENU: (state, value) => {
            state.menuDisplayed = value
        },
        UPDATE_PAGE_TITLE: (state, value) => {
            state.pageTitle = value
        }
    },
    actions: {

    }
}) 