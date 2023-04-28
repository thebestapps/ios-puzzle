import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import closeImg from '../../../assets/icons/close.png';
import backImg from '../../../assets/icons/modal-background.png';
import m_btn_bg from '../../../assets/icons/m_btn_bg.png';

const screenWidth = Dimensions.get('window').width;
export const ConfirmHomeModal = () => {
  const navigation = useNavigation();
  const isConfirmHomeModalVisible = useSelector(
    state => state.modalInfoReducer,
  ).isConfirmHomeModalVisible;

  const dispatch = useDispatch();
  return (
    <Modal
      isVisible={isConfirmHomeModalVisible}
      statusBarTranslucent
      animationInTiming={1000}
      animationOutTiming={1000}
      onBackdropPress={() => dispatch({type: 'CLOSE_CONFIRM_HOME_MODAL'})}
      style={styles.container}>
      <ImageBackground
        source={backImg}
        resizeMode="stretch"
        style={styles.backgroundContainer}>
        <Text style={styles.confirmText}>Do you want to go back to Home?</Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => dispatch({type: 'CLOSE_CONFIRM_HOME_MODAL'})}>
          <Image source={closeImg} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.replace('Start');
            dispatch({type: 'END_GAME'});
            dispatch({type: 'CLOSE_CONFIRM_HOME_MODAL'});
          }}>
          <Image source={m_btn_bg} style={{position: 'absolute'}} />
          <Text style={styles.confirmText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch({type: 'SHOW_MAIN_MODAL'})}>
          <Image source={m_btn_bg} style={{position: 'absolute'}} />
          <Text style={styles.confirmText}>No</Text>
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
    top: 30,
    right: 40,
  },
  confirmText: {
    color: '#fff',
    fontSize: 20,
    width: '80%',
    fontWeight: '700',
    marginRight: 0,
    textAlign: 'center',
    fontFamily: 'Quicksand',
    lineHeight: 25,
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
