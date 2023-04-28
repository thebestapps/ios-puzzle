import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import statsImg from '../../assets/icons/stats.png';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

var modalSound = new Sound('button_click_yes.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

export const StatsButton = () => {
  const dispatch = useDispatch();
  const modalOpen = () => {
    modalSound.play();
    dispatch({type: 'SHOW_STATS_MODAL'});
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => modalOpen()}>
      <Image source={statsImg} style={styles.img} />
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
});
