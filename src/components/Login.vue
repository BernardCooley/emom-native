<template>
  <div class="loginContainer">
    <ion-page>

      <ion-content class="content">
        <div class="pageContainer">
          <ion-list>
            <ion-item>
              <ion-label for="email">Email</ion-label>
              <ion-input type="text" id="email" v-bind:value="user.email.value" v-on:input="user.email.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in user.email.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-item>
              <ion-label for="password">Password</ion-label>
              <ion-input type="password" id="password" v-bind:value="user.password.value" v-on:input="user.password.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in user.password.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-button v-on:click="login">Log In</ion-button>
          </ion-list>
        </div>
      </ion-content>
    </ion-page>
  </div>
</template>

<script>
import db from "../firestore/firebaseInit";
import firebase from "firebase";
import { mapMutations } from "vuex";

export default {
  name: "login",
  data: function() {
    return {
      user: {
        email: {
          value: null,
          errors: []
        },
        password: {
          value: null,
          errors: []
        }
      },
      errorsBool: null,
      userID: null,
      loginMessage: null
    };
  },
  methods: {
    ...mapMutations(["UPDATE_ISLOGGED_IN"]),
    validation: function(e) {
      this.errorsBool = false;
      this.user.email.errors = [];
      this.user.password.errors = [];

      if (!this.user.email.value) {
        this.user.email.errors.push("Email required.");
      }

      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(this.user.email.value)) {
        this.user.email.errors.push("Invalid email format.");
      }

      if (!this.user.password.value) {
        this.user.password.errors.push("Password required.");
      }

      for (var x in this.user) {
        if (this.user[x].errors.length > 0) {
          this.errorsBool = true;
        }
      }
    },
    login: function() {
      this.validation();
      if (!this.errorsBool) {
        console.log("Logging in.....");

        firebase
          .auth()
          .signInWithEmailAndPassword(
          this.user.email.value,
          this.user.password.value
          )
          .then(data => {
            this.$store.commit("UPDATE_ISLOGGED_IN", true);
            this.$router.push("/music");
          });
      }
    }
  }
};
</script>

<style>
.transparent {
  background-color: transparent;
}

.pageContainer {
  padding-top: 50px;
}
</style>
