import React, {useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {ConfirmModal} from '../Modal/confirmModal';
import {MenuModal} from '../Modal/menuModal';
import {StatsModal} from '../Modal/statsModal';
import {Board} from './Board';
import {Footer} from './Footer';
import {HeaderSection} from './Header';
import {ConfirmHomeModal} from '../Modal/confirmHomeModal';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
const screenHeight = Dimensions.get('window').height;
const boardSize =
  Dimensions.get('window').width - (Platform.OS === 'ios' ? 50 : 0);
const Playground = () => {
  const [isOver, setIsOver] = useState(false);
  const currentScore = useSelector(
    state => state.scoreInfoReducer,
  ).currentScore;
  return (
    <View style={styles.container}>
      <HeaderSection />
      <Board setIsOver={setIsOver}/>
      <Footer />
      <MenuModal />
      <StatsModal />
      <ConfirmModal />
      <ConfirmHomeModal />
      {isOver && (
        <Animatable.View style={styles.isover}>
          <Text style={styles.overTxt}>GAME OVER</Text>
          <Text style={{...styles.overTxt, color: '#10daef'}}>
            {currentScore}
          </Text>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#262626',
    paddingHorizontal: 20,
    height: screenHeight,
  },
  isover: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: screenHeight,
    backgroundColor: 'rgba(126,129,129, 0.8)',
    // backgroundColor: 'red',
    top: 0,
    width: boardSize,
    zIndex: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overTxt: {
    fontSize: 55,
    color: '#fff',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 10,
  },
});

export default Playground;
