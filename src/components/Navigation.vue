<template>
    <div class="navigationContainer">
        <div class="navigationItemsContainer">
            <ion-button class="navigationButton" v-if="!isLoggedIn" v-on:click="login">Login</ion-button>
            <ion-button class="navigationButton" v-if="!isLoggedIn" v-on:click="register">Register</ion-button>
        </div>
    </div>
</template>

<script>
import firebase from "firebase"
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'navigation',
    created() {
        if(firebase.auth().currentUser) {
            this.$store.commit('UPDATE_ISLOGGED_IN', true)
            this.$store.commit('UPDATE_LOGGED_IN_USER', firebase.auth().currentUser.email)
        }else {
            this.$store.commit('UPDATE_ISLOGGED_IN', false)
        }
    },
    methods: {
        login: function() {
            this.$router.push('/login')
        },
        register: function() {
            this.$router.push('/register')
        }
    },
    computed: {
        ...mapState([
            'isLoggedIn'
        ])
    }
}
</script>

<style>
.navigationContainer {
    height: 50px;
    z-index: 2;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.navigationItemsContainer {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: Roboto, "Helvetica Neue", sans-serif;
    display: flex;
}

.navigationButton {
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 0;
    margin: 0;
    font-size: 1em;
}
</style>
