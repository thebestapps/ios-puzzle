// simple wrapper over react-native-sound
import Sound from "react-native-sound";

Sound.setCategory('Playback');
export const PlaySoundFile = (soundFile) => {
    console.log("Start Sound!")
    var mySound = new Sound(`${soundFile}.wav`, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Error loading sound: ' + error);
        return;
      } else {
        mySound.play(success => {
          if (success) {
            console.log('Sound playing');
          } else {
            console.log('Issue playing file');
          }
        });
      }
    });
    mySound.setVolume(1);
    mySound.release();
  };