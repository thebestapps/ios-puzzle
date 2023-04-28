import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import menuImg from '../../assets/icons/menu2.png';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

var modalSound = new Sound('button_click_yes.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

export const MainButton = () => {
  const isMuted = useSelector(state => state.muteInfoReducer).isMuted;
  const dispatch = useDispatch();
  const modalOpen = () => {
    if (!isMuted) modalSound.play();
    // console.log('Modal will be shown');
    // modalSound.play((success) => {
    //   if (success) {
    //     console.log("Successfully finished playing");
    //   } else {
    //     console.log("playback failed due to audio decoding errors");
    //   }
    // });
    dispatch({type: 'SHOW_MAIN_MODAL'});
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => modalOpen()}>
      <Image source={menuImg} style={styles.img} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  linearGradient: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  img: {
    marginRight: 5,
  },
});
