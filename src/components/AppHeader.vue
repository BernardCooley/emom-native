<template>
  <div class="headerContainer">
    <h3 class="headerTitle">{{pageTitle}}</h3>
    <transition name="fade">
    <div v-if="!menuDisplayed">
      <button class="toggleButton" v-on:click="openMenu">
        <img src="../assets/icons/hamburger_menu_icon.svg">
      </button>
    </div>
    </transition>
  </div>
</template>

<script>
import SlideMenu from "../components/SlideMenu";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    SlideMenu
  },
  name: "app-header",
  methods: {
    ...mapMutations(["TOGGLE_MENU", "UPDATE_PAGE_TITLE"]),
    openMenu: function() {
      this.$store.commit("TOGGLE_MENU", true);
    },
    closeMenu: function() {
      this.$store.commit("TOGGLE_MENU", false);
    },
  },
  computed: {
    ...mapState(["menuDisplayed", "pageTitle"])
  },
  created() {
    this.$store.commit("UPDATE_PAGE_TITLE", this.$route.name);
  },
  watch: {
    $route(to, from) {
      this.$store.commit("UPDATE_PAGE_TITLE", this.$route.name);
    }
  }
};
</script>

<style>
.headerContainer {
  z-index: 2;
  height: 50px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  contain: content;
  background-color: #488aff;
}

.toggleButton img {
  background-color: transparent;
  padding-right: 8px;
}

.toggleButton {
  background-color: transparent;
  outline: none;
}

.toggleButton.close {
  font-size: 18px;
  padding-top: 8px;
}

.headerTitle {
  color: white;
  padding-left: 15px;
  margin-top: 13px;
}
</style>
