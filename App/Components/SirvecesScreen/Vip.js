import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {addVip} from '../../api';

import styles from '../../styles';
import HeaderComponent from '../HeaderComponent';
import ShadowButton from '../ShadowButton';
import ServiceComp from './ServiceComp';

const Vip = ({navigation, route}) => {
  const modalToastRef = React.useRef();
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);

  const [choosed, setChoosed] = useState('1 день');
  const [ChoosedBalance, setChoosedBalance] = useState('100 ед');
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const {alias} = route.params;

  const goBack = useCallback(() => navigation.goBack(), [alias]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );

    return () => backHandler.remove();
  }, []);

  const graphicksData = [
    {firstText: '1 день', thirdText: '100 ед.'},
    {firstText: '2 дня', secondText: '150', thirdText: '200 ед.'},
    {firstText: '3 дня', secondText: '250', thirdText: '300 ед.'},
    {firstText: '4 дня', secondText: '450', thirdText: '400 ед.'},
    {firstText: '5 дней', secondText: '550', thirdText: '500 ед.'},
    {firstText: '6 дней', secondText: '650', thirdText: '600 ед.'},
    {firstText: '7 дней', secondText: '750', thirdText: '700 ед.'},
    {firstText: '8 дней', secondText: '850', thirdText: '800 ед.'},
    {firstText: '9 дней', secondText: '950', thirdText: '900 ед.'},
    {firstText: '10 дней', secondText: '1250', thirdText: '1000 ед.'},
  ];

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            zIndex: isVisible ? 1000 : -1000,
          }}>
          <Toast
            ref={modalToastRef}
            bottomOffset={140}
            style={{
              position: 'relative',
              zIndex: 1000,
              opacity: isVisible ? 1 : 0,
            }}
          />
        </View>
        {Platform.OS !== 'ios' && (
          <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
        )}
        <HeaderComponent
          arrow={true}
          title="VIP объявление"
          navigation={{goBack}}
        />
        <View style={styles.ph20}>
          <Text style={{marginTop: 20, fontSize: 16, fontWeight: '900'}}>
            VIP объявление
          </Text>
          <Text
            style={{
              color: '#3C3C3C',
              fontSize: 12,
              marginTop: 15,
              lineHeight: 21,
            }}>
            {`•   Размещается на главной странице вверху перед всеми обычными объявлениями;
•   Отображается вверху в разделе Авто;
•   Отображается вверху на страницах, соответствующих марке и модели Вашего авто;
•   Количество просмотров увеличивается в несколько раз; 
•   Продажа совершается гораздо быстрее.`}
          </Text>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              height: 1,
              marginTop: 20,
              marginBottom: 30,
            }}
          />
          {/* ---------------------------- */}
          <Text style={{fontSize: 16, marginBottom: 30}}>
            Выберите период действий услуги
          </Text>
          {graphicksData.map((item, key) => (
            <View
              key={key}
              style={{
                borderBottomColor: '#D9D9D9',
                borderBottomWidth: key === 5 ? 0 : 1,
                paddingBottom: 5,
                paddingTop: 15,
              }}>
              <ServiceComp
                press={() => {
                  setChoosed(item.firstText);
                  setChoosedBalance(item.thirdText.toUpperCase());
                }}
                state={choosed === item.firstText ? true : false}
                firstText={item.firstText}
                secondText={item.secondText}
                thirdText={item.thirdText}
                ml={key === 0 ? 151 : 232}
              />
            </View>
          ))}
          {/* ------------ Start Balance ------------ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 54,
            }}>
            <Text style={{fontSize: 16}}>Текущий баланс</Text>
            <Text
              style={{
                color: '#EA4F3D',
                fontSize: 16,
              }}>{`${state.user?.user_data?.balance} ед`}</Text>
          </View>
          {ChoosedBalance > state.user?.user_data?.balance && (
            <Text style={{color: '#FF5C5C', marginTop: 15}}>
              Недостаточно средств на балансе
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Balance')}
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', marginTop: 15},
            ]}>
            <View style={styles.fdRow}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../../assets/VipReplenishIcon.png')}
              />
              <Text style={{color: '#EA4F3D', marginLeft: 8}}>
                Пополнить баланс
              </Text>
            </View>
            <Image
              style={{width: 24, height: 24}}
              source={require('../../assets/VipRedArrow.png')}
            />
          </TouchableOpacity>
          <View style={{marginVertical: 30}} />
          <ShadowButton
            width="90%"
            text={`Оплатить ${ChoosedBalance}`}
            Press={() => {
              if (state.user?.user_data?.balance > ChoosedBalance) {
                setLoading(true);
                dispatch(
                  addVip(
                    {
                      days: choosed.split(' ')[0],
                      alias,
                    },
                    res => {
                      setLoading(false);
                      if (res) {
                        setVisible(true);
                        setTimeout(() => setVisible(false), 3000);
                        modalToastRef.current.show({
                          text1: res.message,
                          type: 'success',
                          position: 'bottom',
                          visibilityTime: 2000,
                          style: {
                            zIndex: 10000,
                          },
                        });
                        setTimeout(goBack, 2000);
                      }
                    },
                  ),
                );
              } else {
                setVisible(true);
                setTimeout(() => setVisible(false), 3000);
                modalToastRef.current.show({
                  text1: 'Недостаточно денег',
                  type: 'error',
                  position: 'bottom',
                  visibilityTime: 2000,
                  style: {
                    zIndex: 10000,
                  },
                });
              }
            }}
            isLoading={isLoading}
          />
          <View style={{marginVertical: 40}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Vip;
