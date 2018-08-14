<template>
	<div>
		<div class="player">

			<div class="player-controls">
				<div>
					<div v-on:click="seek" class="player-progress" title="Time played : Total time">
						<div :style="{ width: this.percentComplete + '%' }" class="player-seeker"></div>
					</div>
					<div class="player-time">
						<div class="player-time-current">{{ currentTime }}</div>
						<div class="player-time-total">{{ durationTime }}</div>
					</div>
					<div class="artworkContainer">
						<img v-bind:src="artworkUrl">
					</div>
				</div>
				<div>
					<div>
						<a v-on:click.prevent="stop" title="Stop" href="#">
							<img src="../assets/icons/stop_button.svg">
						</a>
					</div>
					<div>
						<a v-on:click.prevent="playing = !playing" title="Play/Pause" href="#">
							<img v-if="!playing" src="../assets/icons/play_button.svg">
							<img v-else src="../assets/icons/pause_button.svg">
						</a>
					</div>

					<div>
						<a v-on:click.prevent="download" href="#">
							<img src="../assets/icons/download_button.svg">
						</a>
					</div>
					<div>
						<a v-on:click.prevent="innerLoop = !innerLoop" href="#">
							<img v-if="!innerLoop" src="../assets/icons/start_loop_button.svg">
							<img v-else src="../assets/icons/stop_loop_button.svg">
						</a>
					</div>
					<div>
						<a v-on:click.prevent="mute" title="Mute" href="#">
							<img v-if="!muted" src="../assets/icons/mute_button.svg">
							<img v-else src="../assets/icons/unmute_button.svg">
						</a>
					</div>
				</div>
			</div>
			<div class="volumeContainer">
				<span>Vol</span>
				<input class="volumeControl slider" v-model.lazy.number="volume" type="range" min="0" max="100" />
			</div>
			<audio v-bind:loop="innerLoop" ref="audiofile" preload="auto" style="display: none;">
				<source v-bind:src="file"></source>
			</audio>
		</div>
	</div>
</template>

<script>

const convertTimeHHMMSS = (val) => {
	let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

	return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

export default {
	name: 'audio-player',
	props: {
		file: {
			type: String,
			default: null
		},
		autoPlay: {
			type: Boolean,
			default: false
		},
		loop: {
			type: Boolean,
			default: false
		},
		artist: {
			type: String,
			default: null
		},
		title: {
			type: String,
			default: null
		},
		artworkUrl: {
			type: String,
			default: null
		}
	},
	data: function() {
		return {
			audio: undefined,
			currentSeconds: 0,
			durationSeconds: 0,
			innerLoop: false,
			loaded: false,
			playing: false,
			previousVolume: 35,
			showVolume: false,
			volume: 100
		}
	},
	computed: {
		currentTime() {
			return convertTimeHHMMSS(this.currentSeconds);
		},
		durationTime() {
			return convertTimeHHMMSS(this.durationSeconds);
		},
		percentComplete() {
			return parseInt(this.currentSeconds / this.durationSeconds * 100);
		},
		muted() {
			return this.volume / 100 === 0;
		}
	},
	watch: {
		playing(value) {
			if (value) { return this.audio.play(); }
			this.audio.pause();
		},
		volume(value) {
			this.showVolume = false;
			this.audio.volume = this.volume / 100;
		}
	},
	methods: {
		download() {
			this.stop();
			window.open(this.file, 'download');
		},
		load() {
			if (this.audio.readyState >= 2) {
				this.loaded = true;
				this.durationSeconds = parseInt(this.audio.duration);
				return this.playing = this.autoPlay;
			}

			throw new Error('Failed to load sound file.');
		},
		mute() {
			if (this.muted) {
				return this.volume = this.previousVolume;
			}

			this.previousVolume = this.volume;
			this.volume = 0;
		},
		seek(e) {
			if (!this.playing || e.target.tagName === 'SPAN') {
				return;
			}

			const el = e.target.getBoundingClientRect();
			const seekPos = (e.clientX - el.left) / el.width;

			this.audio.currentTime = parseInt(this.audio.duration * seekPos);
		},
		stop() {
			this.playing = false;
			this.audio.currentTime = 0;
		},
		update(e) {
			this.currentSeconds = parseInt(this.audio.currentTime);
		}
	},
	created() {
		this.innerLoop = this.loop;
	},
	mounted() {
		this.audio = this.$el.querySelectorAll('audio')[0];
		this.audio.addEventListener('timeupdate', this.update);
		this.audio.addEventListener('loadeddata', this.load);
		this.audio.addEventListener('pause', () => { this.playing = false; });
		this.audio.addEventListener('play', () => { this.playing = true; });
	}
};

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Nunito:400,700');

body {
	font-family: 'Nunito', sans-serif;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
}

$player-background: #F4F4F4;
$player-border-color: darken($player-background,
12%);
$player-link-color: darken($player-background,
75%);
$player-progress-color: $player-border-color;
$player-seeker-color: $player-link-color;
$player-text-color: $player-link-color;

.player-wrapper {
	background-color: $player-background;
	display: flex;
	justify-content: center;
	padding-bottom: 20px;
}

input[type=range].slider {
  -webkit-appearance: none;
  width: 100%;
  margin: 0.9px 0;
}
input[type=range].slider:focus {
  outline: none;
}
input[type=range].slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 9.2px;
  cursor: pointer;
  box-shadow: 0px 0px 0.6px rgba(0, 0, 0, 0.41), 0px 0px 0px rgba(13, 13, 13, 0.41);
  background: rgba(0, 0, 0, 0);
  border-radius: 0px;
  border: 0px solid rgba(0, 0, 0, 0);
}
input[type=range].slider::-webkit-slider-thumb {
  box-shadow: 15px 15px 15px #ffffff, 0px 0px 15px #ffffff;
  border: 0px solid #ffffff;
  height: 11px;
  width: 24px;
  border-radius: 34px;
  background: rgba(0, 0, 0, 0.97);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -0.9px;
}
input[type=range].slider:focus::-webkit-slider-runnable-track {
  background: rgba(13, 13, 13, 0);
}
input[type=range].slider::-moz-range-track {
  width: 100%;
  height: 9.2px;
  cursor: pointer;
  box-shadow: 0px 0px 0.6px rgba(0, 0, 0, 0.41), 0px 0px 0px rgba(13, 13, 13, 0.41);
  background: rgba(0, 0, 0, 0);
  border-radius: 0px;
  border: 0px solid rgba(0, 0, 0, 0);
}
input[type=range].slider::-moz-range-thumb {
  box-shadow: 15px 15px 15px #ffffff, 0px 0px 15px #ffffff;
  border: 0px solid #ffffff;
  height: 11px;
  width: 24px;
  border-radius: 34px;
  background: rgba(0, 0, 0, 0.97);
  cursor: pointer;
}
input[type=range].slider::-ms-track {
  width: 100%;
  height: 9.2px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range].slider::-ms-fill-lower {
  background: rgba(0, 0, 0, 0);
  border: 0px solid rgba(0, 0, 0, 0);
  border-radius: 0px;
  box-shadow: 0px 0px 0.6px rgba(0, 0, 0, 0.41), 0px 0px 0px rgba(13, 13, 13, 0.41);
}
input[type=range].slider::-ms-fill-upper {
  background: rgba(0, 0, 0, 0);
  border: 0px solid rgba(0, 0, 0, 0);
  border-radius: 0px;
  box-shadow: 0px 0px 0.6px rgba(0, 0, 0, 0.41), 0px 0px 0px rgba(13, 13, 13, 0.41);
}
input[type=range].slider::-ms-thumb {
  box-shadow: 15px 15px 15px #ffffff, 0px 0px 15px #ffffff;
  border: 0px solid #ffffff;
  height: 11px;
  width: 24px;
  border-radius: 34px;
  background: rgba(0, 0, 0, 0.97);
  cursor: pointer;
  height: 9.2px;
}
input[type=range].slider:focus::-ms-fill-lower {
  background: rgba(0, 0, 0, 0);
}
input[type=range].slider:focus::-ms-fill-upper {
  background: rgba(13, 13, 13, 0);
}



.artworkContainer {
	width: 200px;
}

.player {
	background-color: white;
	border: 1px solid $player-border-color;
	border-radius: 5px;
	box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
	color: $player-text-color;
	display: inline-block;
	line-height: 1.5625;
	padding: 20px;

	.volumeControl {
		width: 100%;
	}
	.volumeContainer {
		display: flex;

		span {
			padding-right: 10px;
		}
	}
}

.player-controls {
	display: flex;

	>div {
		border-right: 1px solid $player-border-color;

		&:last-child {
			border-right: none;
		}

		a {
			color: $player-link-color;
			display: block;
			line-height: 0;
			padding: 1em;
			text-decoration: none;
		}
	}
}

.player-progress {
	background-color: $player-progress-color;
	cursor: pointer;
	height: 20px;
	min-width: 200px;
	position: relative;

	.player-seeker {
		background-color: $player-seeker-color;
		bottom: 0;
		left: 0;
		position: absolute;
		top: 0;
	}
}

.player-time {
	display: flex; // font-size: 18px;
	justify-content: space-between;

	.player-time-current {
		font-weight: 700;
		padding-left: 5px;
	}

	.player-time-total {
		opacity: 0.5;
		padding-right: 5px;
	}
}
</style>