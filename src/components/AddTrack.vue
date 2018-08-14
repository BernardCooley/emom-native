<template>
  <div class="addTrackContainer">
    <ion-page>
      <ion-content class="content">
        <div class="pageContainer">
          <ion-list>
            <ion-item>
              <ion-label for="artist">Artist</ion-label>
              <ion-input type="text" id="artist" v-bind:value="track.artist.value" v-on:input="track.artist.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in track.artist.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-item>
              <ion-label for="trackTitle">Title</ion-label>
              <ion-input type="text" id="trackTitle" v-bind:value="track.title.value" v-on:input="track.title.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in track.title.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-item>
              <ion-label for="trackUrl">Track Url</ion-label>
              <ion-input type="text" id="trackUrl" v-bind:value="track.trackUrl.value" v-on:input="track.trackUrl.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in track.trackUrl.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-item>
              <ion-label for="artworkUrl">Artwork Url (optional)</ion-label>
              <ion-input type="text" id="artworkUrl" v-bind:value="track.artworkUrl.value" v-on:input="track.artworkUrl.value = $event.target.value"></ion-input>
              <div v-for="(errorMessage) in track.artworkUrl.errors" v-bind:data="errorMessage" v-bind:key="errorMessage.index">
                <span class="validationMessage">{{errorMessage}}</span>
              </div>
            </ion-item>

            <ion-button v-on:click="addTrack">Add Track</ion-button>
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
  name: "add-track",
  data: function() {
    return {
      track: {
        artist: { value: null, errors: [] },
        title: {value: null, errors: [] },
        trackUrl: {value: null, errors: [] },
        artworkUrl: {value: null, errors: [] }
      },
      errorsBool: null,
      userID: null,
      addTrackMessage: null
    };
  },
  methods: {
    validation: function(e) {
      this.errorsBool = false;
      this.track.artist.errors = [];
      this.track.title.errors = [];
      this.track.trackUrl.errors = [];
      this.track.artworkUrl.errors = [];

      if (!this.track.artist.value) {
        this.track.artist.errors.push("Artist name required.");
      }

      if (!this.track.title.value) {
        this.track.title.errors.push("Track title required.");
      }

      if (!this.track.trackUrl.value) {
        this.track.trackUrl.errors.push("Track Url required.");
      }

      for (var x in this.track) {
        if (this.track[x].errors.length > 0) {
          this.errorsBool = true;
        }
      }
    },
    addTrack: function() {
      this.validation();
      if (!this.errorsBool) {
        db
          .collection("tracks")
          .add({
            artist: this.track.artist.value,
            title: this.track.title.value,
            trackUrl: this.track.trackUrl.value,
            artworkUrl: this.track.artworkUrl.value
          })
          .then(data => {
            if (data.id) {
              this.addTrackMessage = "Track added successfully";
              this.$router.push("/music");
              this.addTrackMessage = null;
            }
          })
          .catch(error => console.log(err));
      }
    }
  }
};
</script>

<style>
.validationMessage {
  color: red;
  text-align: center;
}

.native-input:active,
.native-input:focus {
  outline: none;
}
</style>
