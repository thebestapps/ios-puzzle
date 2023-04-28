import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import counterBackImg from '../../../../assets/icons/counter-bar.png';
import mainBoardImg from '../../../../assets/icons/main-board.png';
import sortImg from '../../../../assets/icons/sort-drop.png';
import {PlaySoundFile} from '../../../services/audio';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import numImg8 from '../../../../assets/icons/lock-alt.png';
import numImg9 from '../../../../assets/icons/lock.png';
import numImg1 from '../../../../assets/icons/number-1.png';
import numImg2 from '../../../../assets/icons/number-2.png';
import numImg3 from '../../../../assets/icons/number-3.png';
import numImg4 from '../../../../assets/icons/number-4.png';
import numImg5 from '../../../../assets/icons/number-5.png';
import numImg6 from '../../../../assets/icons/number-6.png';
import numImg7 from '../../../../assets/icons/number-7.png';
import {getUsers} from '../../../helpers/firebase';
import {getToday} from '../../../helpers/getDate';
import Sound from 'react-native-sound';
import * as Animatable from 'react-native-animatable';
const imageArray = [
  numImg1,
  numImg2,
  numImg3,
  numImg4,
  numImg5,
  numImg6,
  numImg7,
  numImg8,
  numImg9,
];

const initVal = 7;
const boardSize =
  Dimensions.get('window').width - (Platform.OS === 'ios' ? 50 : 0);
const unitSize =
  (Dimensions.get('window').width - (Platform.OS === 'ios' ? 50 : 0)) / 7;
const screenHeight = Dimensions.get('window').height;

Sound.setCategory('Playback');

var breakSound = new Sound('tile_break1.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

var levelSound = new Sound('level_up.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

var appearSound = new Sound('tile_appear.wav', Sound.MAIN_BUNDLE, error => {
  console.log('Appear sound');
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

var dropSound = new Sound('tile_drop.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

var overSound = new Sound('game_over.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

export const Board = ({setIsOver}) => {
  const getRand = () => {
    while (1) {
      const val = Math.floor(Math.random() * 7);
      if (val !== 7) {
        return val;
      }
    }
  };
  const [levelCount, setLevelCount] = useState(5);
  const [multiNum, setMultiNum] = useState(1);
  const [nextImg, setNextImg] = useState(10);
  const [tiles, setTiles] = useState([[], [], [], [], [], [], []]);
  const [bAction, setAction] = useState(true);
  const [id, setId] = useState(null);
  // const [isOver, setIsOver] = useState(0);
  const countArry = [1, 1, 1, 1, 1];
  const BLOCK = 10;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const highScoreTotal = useSelector(
    state => state.scoreInfoReducer,
  ).highScoreTotal;
  const highScoreDay = useSelector(state => state.userInfoReducer).highScoreDay;
  const highLevel = useSelector(state => state.scoreInfoReducer).highLevel;
  const userInfo = useSelector(state => state.userInfoReducer).userInfo;
  const userId = useSelector(state => state.userInfoReducer).userId;
  const isMuted = useSelector(state => state.muteInfoReducer).isMuted;

  const currentScore = useSelector(
    state => state.scoreInfoReducer,
  ).currentScore;
  const currentLevel = useSelector(
    state => state.scoreInfoReducer,
  ).currentLevel;
  const isStarted = useSelector(state => state.playInfoReducer).startGame;

  const storeData = async value => {
    console.log('AsyncStored...', value);
    try {
      await AsyncStorage.setItem('highScore', JSON.stringify(value));
    } catch (e) {}
  };

  const storeLevelData = async value => {
    console.log('AsyncStored...', value);
    try {
      await AsyncStorage.setItem('highLevel', JSON.stringify(value));
    } catch (e) {}
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('highScore');
      if (value !== null) {
        dispatch({
          type: 'SET_TOTAL_HIGH_SCORE',
          payload: value,
        });
      } else {
        console.log('Null');
      }
    } catch (e) {}
  };

  const getLevelData = async () => {
    try {
      const value = await AsyncStorage.getItem('highLevel');
      if (value !== null) {
        dispatch({
          type: 'SET_HIGH_LEVEL',
          payload: value,
        });
      } else {
        console.log('Null');
      }
    } catch (e) {}
  };
  useEffect(() => {
    const func = async () => {
      if (isStarted === 0) {
        return;
      }
      await new Promise(r => setTimeout(r, Platform.OS === 'ios' ? 150 : 100));
      let _tiles = [...tiles];
      const bChanged = operateTiles(_tiles);
      if (bChanged) {
        setNextImg(getRand());
        setMultiNum(multiNum + 1);
        // console.log('MultiNum:', multiNum);
        setTiles([..._tiles]);
      } else {
        if (levelCount === 0) {
          setTimeout(() => {
            setLevelCount(5);
            let bEnd = false;
            let cLen = 0;
            [0, 1, 2, 3, 4, 5, 6].map(item => {
              if (_tiles[item].length < 7) {
                if (_tiles[item].length === 6) {
                  cLen++;
                }
                _tiles[item].unshift(8);
              } else {
                bEnd = true;
              }
            });
            console.log('cLen', cLen);
            if (cLen === 7) {
              setTimeout(() => {
                gameEnd();
              }, 500);
            }
            if (bEnd) {
              setTimeout(() => {
                gameEnd();
              }, 500);
            } else {
              levelUp();
            }
            setTiles([..._tiles]);
          }, 1000);
        } else {
          console.log('levelCount', levelCount);
          setAction(false);
        }
      }
    };
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  useEffect(() => {
    getData();
    getLevelData();
    console.log('UserID and UserInfo in PlayBoard', userId, userInfo);
  }, []);

  useEffect(() => {
    console.log('ISSTARTED', isStarted);
    if (isStarted === 1) gameStart();
    if (isStarted === 2) dispatch({type: 'START_GAME'});
  }, [isStarted]);

  useEffect(() => {
    console.log('IDIDIDID>>>', userId);
    if (userId) {
      setId(userId);
    }
  }, [userId]);

  useEffect(() => {
    console.log('BAction', bAction);
    if (bAction && !isMuted) {
      appearSound.play();
    }
  }, [bAction]);
  const submit = maxScore => {
    let cArr = [
      {111: 333},
      {222: 333},
      {333: 333},
      {444: 333},
      {555: 333},
      {666: 333},
      {777: 333},
    ];
    let rArr = userInfo ? userInfo.maxScoreWeek : cArr;
    if (Number(Object.keys(rArr[6])) !== getToday()) {
      rArr.shift();
      rArr.push({[getToday()]: maxScore});
    } else {
      if (Number(Object.values(rArr[6])) < maxScore) {
        rArr[6] = {[getToday()]: maxScore};
      }
      console.log('Compare:::', Number(Object.values(rArr[6])), maxScore);
    }

    console.log('TTT>>', id, userInfo, maxScore);
    if (!id) {
      alert('userID is null', id);
    } else {
      dispatch({type: 'SET_IS_UPDATING', payload: true});
      firestore()
        .collection('users')
        .doc(id)
        .set({
          id: id,
          name: userInfo ? userInfo.name : '',
          avatarImg: userInfo?.avatarImg,
          maxScoreToday: {[getToday()]: Number(maxScore)},
          maxScoreWeek: rArr,
          maxScoreTotal: Math.max(Number(maxScore), userInfo?.maxScoreTotal),
        })
        .then(() => {
          getUsers(dispatch);
        });
    }
  };

  const gameStart = () => {
    dispatch({type: 'CLEAR_LEVEL'});
    dispatch({type: 'CLEAR_CURRENT_SCORE'});
    dispatch({type: 'ADD_SCORE', payload: 0});
    dispatch({type: 'START_GAME'});
    randomStart();
    setMultiNum(1);
  };

  const gameEnd = () => {
    console.log('USER INFO:::', userInfo, userInfo.maxScoreToday);
    if (!isMuted) overSound.play();
    setIsOver(true);
    if (
      Number(Object.keys(userInfo.maxScoreToday)[0]) !== getToday() ||
      currentScore > Number(userInfo.maxScoreToday[getToday()])
    ) {
      if (currentScore > highScoreTotal) {
        storeData(currentScore);
        dispatch({
          type: 'SET_TOTAL_HIGH_SCORE',
          payload: currentScore,
        });
      }
      submit(currentScore);
    }
    if (currentLevel > highLevel) {
      storeLevelData(currentLevel);
      dispatch({
        type: 'SET_HIGH_LEVEL',
        payload: currentLevel,
      });
    }

    dispatch({
      type: 'END_GAME',
    });
    setTimeout(() => {
      navigation.navigate('Start');
      dispatch({type: 'CLEAR_CURRENT_SCORE'});
    }, 4000);
    // dispatch({type: 'SHOW_STATS_MODAL'});
  };

  const addRowScore = () => {
    if (currentLevel < 6) {
      return 10000 + 2000 * (currentLevel - 1);
    } else {
      return 20000 + 5000 * (currentLevel - 6);
    }
  };
  const levelUp = () => {
    if (!isMuted) levelSound.play();
    dispatch({type: 'SET_LEVEL', payload: currentLevel + 1});
    dispatch({
      type: 'SET_CURRENT_SCORE',
      payload: currentScore + addRowScore(),
    });
    dispatch({type: 'ADD_SCORE', payload: addRowScore()});
  };

  const randomStart = () => {
    let _tiles = [[], [], [], [], [], [], []];
    [0, 1, 2, 3, 4, 5, 6, 7].map(item => {
      const randVal = Math.floor(Math.random() * 7);
      _tiles[randVal].push(Math.floor(Math.random() * 7));
    });
    setTiles([..._tiles]);
    setLevelCount(5);
  };

  const connectCnt = (tile, i, j, ii, jj) => {
    const len = 7;
    let ci = i;
    let cj = j;
    let cnt = 0;
    while (ci >= 0 && cj >= 0 && cj < tile[ci].length) {
      ci -= ii;
      cj -= jj;
      cnt++;
    }
    ci = i + ii;
    cj = j + jj;
    while (ci < len && cj < tile[ci].length) {
      ci += ii;
      cj += jj;
      cnt++;
    }
    return cnt - 1;
  };

  const operateStone = (tile, i, j) => {
    console.log('LLL', tile, i, j);
    const len = 7;
    const ii = [1, -1, 0, 0];
    const jj = [0, 0, 1, -1];
    for (let t = 0; t < 4; t++) {
      const ni = i + ii[t];
      const nj = j + jj[t];
      if (ni >= 0 && ni < len && nj >= 0 && nj < len) {
        if (tile[ni][nj] === 8) {
          tile[ni][nj] = 7;
        } else if (tile[ni][nj] === 7) {
          tile[ni][nj] = Math.floor(Math.random() * 7);
        }
      }
    }
  };

  const operateTiles = tile => {
    setAction(true);
    const len = 7;
    let bChanged = false;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < tile[i].length; j++) {
        const rowCnt = connectCnt(tile, i, j, 1, 0);
        const colCnt = connectCnt(tile, i, j, 0, 1);
        if (
          tile[i][j] % BLOCK < 7 &&
          (tile[i][j] % BLOCK === rowCnt || tile[i][j] % BLOCK === colCnt)
        ) {
          bChanged = true;
          tile[i][j] += BLOCK;
          if (tile[i][j] >= BLOCK * 5) {
            console.log('Listening Block...', tile[i][j], BLOCK * 6);
            operateStone(tile, i, j); // Block should be ...
          }
        }
      }
    }
    let score = currentScore;
    let res = 0;
    // console.log('Res1:', res);
    for (let i = 0; i < len; i++) {
      let j = 0;
      while (j < tile[i].length) {
        if (tile[i][j] >= BLOCK * 5) {
          res++;
          tile[i].splice(j, 1);
          if (!isMuted) breakSound.play();
        } else {
          j++;
        }
      }
    }
    // console.log('Res2:', res, (multiNum - 1) / 6);
    if (res > 0) {
      let subVal =
        initVal *
        parseInt((multiNum - 1) / 6 + 1) *
        parseInt((multiNum - 1) / 6 + 1);
      // ((parseInt(multiNum / 6) - 1) * initVal + 1) * initVal +
      // (currentLevel - 1) * initVal;
      dispatch({
        type: 'ADD_SCORE',
        payload: res * subVal,
      });
      score = score + res * subVal;
    }

    dispatch({
      type: 'SET_CURRENT_SCORE',
      payload: score,
    });
    return bChanged;
  };

  const touchCol = e => {
    if (isStarted === 0) {
      return;
    }
    if (!isMuted) dropSound.play();
    let _tiles = [];
    let _changed = false;
    let _colIsFull = 0;
    let _filteredColFull = tiles.filter(item => item?.length === 7);
    setMultiNum(1);

    if (bAction === true) {
      return;
    }

    tiles.map((tilecol, i) => {
      if (i === e) {
        if (tilecol?.length < 7) {
          _tiles.push([...tilecol, nextImg]);
          _changed = true;
          if (_colIsFull === 6 && tiles[i].length === 6) {
            console.log('Listening Channel 1 =>>');
            gameEnd();
          }
        } else {
          _tiles.push([...tilecol]);
          _colIsFull++;
        }
      } else {
        _tiles.push([...tilecol]);
        if (tilecol?.length === 7) {
          _colIsFull++;
        }
      }
    });
    if (_filteredColFull.length === 7 || _colIsFull === 6) {
      gameEnd();
    }

    if (_changed) {
      setAction(true);
      setLevelCount(levelCount - 1);
      setTiles([..._tiles]);
      setNextImg(getRand());
    }
  };

  return (
    <View style={styles.container}>
      {/* counter - 5 */}
      <ImageBackground
        source={counterBackImg}
        resizeMode="stretch"
        style={styles.levelCounter}>
        {countArry.map((item, i) => (
          <View style={styles.sortContainer} key={i}>
            {i < levelCount ? (
              <Image source={sortImg} style={styles.img} />
            ) : (
              <Text />
            )}
          </View>
        ))}
      </ImageBackground>
      {/* PatternNumber */}
      <View style={styles.patternNumber}>
        {!bAction && (
          <Image source={imageArray[nextImg]} style={styles.tileItem} />
        )}
      </View>
      {/* Playing Board */}
      <ImageBackground
        source={mainBoardImg}
        resizeMode="contain"
        style={styles.mainBoard}>
        {bAction && (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              zIndex: 999,
            }}
          />
        )}
        {tiles.map((tilecol, i) => (
          <TouchableOpacity
            onPress={() => touchCol(i)}
            style={styles.touchCol}
            key={i}>
            {tilecol.map((tile, j) => (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: unitSize,
                  height: unitSize,
                }}>
                {/* <Image
                  source={imageArray[tile % BLOCK]}
                  key={j}
                  style={
                    Math.floor(tile / BLOCK) % 3 === 1
                      ? styles.tileItemSmall
                      : Math.floor(tile / BLOCK) % 3 === 2
                      ? styles.tileItemLarge
                      : styles.tileItem
                  }
                  resizeMode="cover"
                /> */}
                {tile > 10 ? <Animatable.Image
                  source={imageArray[tile % BLOCK]}
                  key={j}
                  animation="bounceIn"
                  duration={2000}
                  style={{...styles.tileItem, zIndex: 999}
                    // Math.floor(tile / BLOCK) % 3 === 1
                    //   ? styles.tileItemSmall
                    //   : Math.floor(tile / BLOCK) % 3 === 2
                    //   ? styles.tileItemLarge
                    //   : styles.tileItem
                  }
                  resizeMode="cover"
                /> : <Image
                source={imageArray[tile % BLOCK]}
                key={j}
                style={styles.tileItem
                  // Math.floor(tile / BLOCK) % 3 === 1
                  //   ? styles.tileItemSmall
                  //   : Math.floor(tile / BLOCK) % 3 === 2
                  //   ? styles.tileItemLarge
                  //   : styles.tileItem
                }
                resizeMode="cover"
              />}
                {/* <Text
                  style={{
                    position: 'absolute',
                    left: 10,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '700',
                  }}>
                  {tile}
                </Text> */}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    height: screenHeight,
    zIndex: 30,
  },
  levelCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    width: boardSize + 8,
    marginTop: 10,
  },
  insetShadow: {
    width: '100%',
    height: 26,
    backgroundColor: 'red',
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: (Dimensions.get('window').width - 40) / 5,
  },
  patternNumber: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 30,
  },
  mainBoard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: boardSize + 10,
    height: boardSize + 10,
    overflow: 'hidden',
    zIndex: 20,
  },
  touchCol: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    paddingBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: boardSize + 10,
    width: unitSize,
    zIndex: 50,
  },
  tileItemContain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileItem: {
    width: unitSize + 2,
    height: unitSize + 2,
    marginVertical: -1,
  },
  tileItemSmall: {
    width: unitSize,
    height: unitSize,
    marginTop: 0,
    shadowColor: '#142d2d',
    shadowOffset: {
      width: 5,
      height: 9,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    transform: [
      {
        scaleY: 0.9,
      },
      {
        scaleX: 0.9,
      },
    ],
  },
  tileItemLarge: {
    width: unitSize,
    height: unitSize,
    marginTop: 0,
    shadowColor: '#142d2d',
    shadowOffset: {
      width: 5,
      height: 9,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    transform: [
      {
        scaleY: 1.1,
      },
      {
        scaleX: 1.1,
      },
    ],
  },
  startBtn: {
    backgroundColor: 'green',
    height: 35,
    width: 120,
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  startTxt: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
});
