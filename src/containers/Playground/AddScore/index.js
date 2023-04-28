import React from 'react';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

export const AddedScore = addedScore => {
    
  return (
    <View>
      <Animatable.Text
        animation="fadeInUp"
        iterationCount={1}
        direction="alternate"
        easing="linear"
        duration={1000}
        style={styles.addedScore}>
        + $ {addedScore}
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  addedScore: {
    position: 'absolute',
    left: 140,
    top: 35,
    fontSize: 26,
    fontWeight: '700',
    color: '#11eeff55',
    fontFamily: 'Quicksand',
    zIndex: 999,
  },
});
