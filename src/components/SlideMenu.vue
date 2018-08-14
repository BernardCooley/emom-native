<template>
  <!--<ion-card>-->
  <transition name="slide-fade">
    <div class="slideMenuContainer" v-if="menuDisplayed" v-on-clickaway="away">
      <router-link class="routerLink" to="/music">
        <ion-button class="menuButton" v-on:click="closeMenu">Music</ion-button>
      </router-link>
      <router-link class="routerLink" to="/add-track">
        <ion-button class="menuButton" v-on:click="closeMenu">Add Track</ion-button>
      </router-link>
      <router-link class="routerLink" to="/account">
        <ion-button class="menuButton" v-on:click="closeMenu">Account</ion-button>
      </router-link>
      <ion-button class="menuButton logoutButton" v-if="isLoggedIn" v-on:click="logout">Logout</ion-button>
    </div>
  </transition>
  <!--</ion-card>-->
</template>

<script>
import { mapState, mapMutations } from "vuex";
import firebase from "firebase";
import { directive as onClickaway } from 'vue-clickaway';

export default {
  directives: {
    onClickaway: onClickaway,
  },
  name: "slide-menu",
  data() {
    return { activeItem: '' }
  },
  methods: {
    ...mapMutations([
      'UPDATE_ISLOGGED_IN',
      'TOGGLE_MENU'
    ]),
    logout: function() {
      firebase
        .auth().signOut().then(() => {
          this.$store.commit('UPDATE_ISLOGGED_IN', false);
          this.$store.commit('TOGGLE_MENU', false);
          this.$router.push("/login");
        });
    },
    closeMenu: function() {
      this.$store.commit("TOGGLE_MENU", false);
    },
    away: function() {
      this.$store.commit("TOGGLE_MENU", false);
    }
  },
  computed: {
    ...mapState(['menuDisplayed', 'isLoggedIn', 'pageTitle'])
  },
};
</script>

<style>
.toggleButton {
  float: right;
  background-color: transparent;
  color: white;
  border: none;
  box-shadow: none;
  height: 20px;
  margin-bottom: 10px;
}

.menuButton {
  width: 100%;
  /*height: 30px;*/
  border-radius: 0;
  padding: 0;
  margin: 0;
  font-size: 1em;
  background-color: #F4F4F4;
  outline: none;
  color: black;
}

.slideMenuContainer {
  width: 50%;
  position: fixed;
  z-index: 3;
  right: 0;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
  0 3px 1px -2px rgba(0, 0, 0, .2),
  0 1px 5px 0 rgba(0, 0, 0, .12);
}

.routerLink {
  height: 50px;
}

.logoutButton {
  background-color: #488aff;
  color: white;
}

.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(100px);
  opacity: 0;
}
</style>
