import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Sound from 'react-native-sound';
import {useDispatch, useSelector} from 'react-redux';
import closeImg from '../../../assets/icons/close.png';
import continueImg from '../../../assets/icons/continue.png';
import menuImg from '../../../assets/icons/menu3.png';
import backImg from '../../../assets/icons/modal-background.png';
import musicImg from '../../../assets/icons/music.png';
import muteImg from '../../../assets/icons/mute.png';
import restartImg from '../../../assets/icons/restart.png';

const screenWidth = Dimensions.get('window').width;

Sound.setCategory('Playback');

var modalSound = new Sound('button_click_yes.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

export const MenuModal = () => {
  // const [isMuted, setIsMuted] = useState(false);
  const isMuted = useSelector(state => state.muteInfoReducer).isMuted;
  const modalVisible = useSelector(
    state => state.modalInfoReducer,
  ).isMainModalVisible;

  const dispatch = useDispatch();
  const onClose = () => {
    if (!isMuted) modalSound.play();
    dispatch({type: 'CLOSE_MAIN_MODAL'});
  };
  return (
    <Modal
      isVisible={modalVisible}
      statusBarTranslucent
      animationInTiming={1000}
      animationOutTiming={1000}
      onBackdropPress={() => onClose()}
      style={styles.container}>
      <ImageBackground
        source={backImg}
        resizeMode="stretch"
        style={styles.backgroundContainer}>
        <Text style={styles.score}>Paused</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => onClose()}>
          <Image source={closeImg} />
        </TouchableOpacity>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch({type: 'SHOW_CONFIRM_HOME_MODAL'});
            }}>
            <Image source={menuImg} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch({type: 'SET_MUTE', payload: !isMuted})}>
            <Image source={isMuted ? muteImg : musicImg} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch({type: 'SHOW_CONFIRM_MODAL'});
            }}>
            <Image source={restartImg} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch({type: 'CLOSE_MAIN_MODAL'})}>
          <Image source={continueImg} />
        </TouchableOpacity>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 60,
    width: screenWidth,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 50,
  },
  score: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Quicksand',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  // Additional styles
  bannerContainer: {
    backgroundColor: '#d9d9d9',
    height: 150,
    borderRadius: 6,
    justifyContent: 'center',
    width: 290,
  },
  bannerText: {
    fontSize: 18,
    color: '#fff',
    letterSpacing: -1.03,
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 294,
  },
});
