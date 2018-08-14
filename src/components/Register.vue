<template>
  <div class="registerContainer">
    <ion-page>
      <ion-content class="content">
        <div class="pageContainer">
          <ion-list>
            <ion-item>

              <ion-label for="artistName">Artist name</ion-label>
              <ion-input type="text" id="artistName" v-bind:value="user.artistName.value" v-on:input="user.artistName.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in user.artistName.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-item>
              <ion-label for="email">Email</ion-label>
              <ion-input type="email" id="email" v-bind:value="user.email.value" v-on:input="user.email.value = $event.target.value"></ion-input>
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

            <ion-item>
              <ion-label for="passwordConfirm">Confirm password</ion-label>
              <ion-input type="password" id="passwordConfirm" v-bind:value="user.passwordConfirm.value" v-on:input="user.passwordConfirm.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in user.passwordConfirm.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-button v-on:click="register">Register</ion-button>

            <span>{{registerMessage}}</span>
          </ion-list>
        </div>
      </ion-content>
    </ion-page>
  </div>
</template>

<script>
import db from "../firestore/firebaseInit";
import firebase from "firebase";

export default {
  name: 'register',
  data: function() {
    return {
      user: {
        artistName: {
          value: "",
          errors: []
        },
        email: {
          value: "",
          errors: []
        },
        password: {
          value: "",
          errors: []
        },
        passwordConfirm: {
          value: "",
          errors: []
        }
      },
      errorsBool: null,
      userID: null,
      registerMessage: null
    };
  },
  methods: {
    validation: function(e) {
      this.errorsBool = false;
      this.user.artistName.errors = [];
      this.user.email.errors = [];
      this.user.password.errors = [];
      this.user.passwordConfirm.errors = [];

      if (!this.user.artistName.value) {
        this.user.artistName.errors.push("Artist name required.");
      }
      if (!this.user.email.value) {
        this.user.email.errors.push("Email required.");
      }

      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(this.user.email.value)) {
        this.user.email.errors.push("Invalid email format.");
      }

      if (this.user.password.value.length < 6) {
        this.user.password.errors.push("Minimum 6 characters.");
      }

      if (!this.user.password.value) {
        this.user.password.errors.push("Password required.");
      }

      if (this.user.password.value != this.user.passwordConfirm.value) {
        this.user.passwordConfirm.errors.push("Password does not match.");
      }

      if (!this.user.passwordConfirm.value) {
        this.user.passwordConfirm.errors.push(
          "Password confirmation required."
        );
      }

      for (var x in this.user) {
        if (this.user[x].errors.length > 0) {
          this.errorsBool = true;
        }
      }
    },
    register: function(e) {
      this.validation();
      if (!this.errorsBool) {
        console.log("registering.....");
        this.registerUser();
        e.preventDefault()
      }
    },
    registerUser: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
        this.user.email.value,
        this.user.password.value
        )
        .then(data => {
          this.createUserAccount(data.user.uid);
        })
    },
    createUserAccount: function(userID) {
      db
        .collection("users")
        .add({
          userID: userID,
          artistName: this.user.artistName.value
        })
        .then(data => {
          if (data.id) {
            this.registerMessage = "Registration successful";
            this.$router.push("/music");
            this.registerMessage = null
          }
        })
        .catch(error => console.log(err));
    }
  }
};
</script>

<style>
.validationMessage {
  color: red;
  text-align: center;
}
</style>
