import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Card} from 'react-native-shadow-cards';

import IMAGE from '../assets/SVG';
const kzAuto = require('../assets/kz_auto.png');
const ruAuto = require('../assets/ru_auto.png');
const autoSalon = require('../assets/salon_auto.png');
const businessProfile = require('../assets/bussiness_profile.png');
import styles from '../styles';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {setData} from '../Store';
// ************************************************************************

const DrawerContent = props => {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      {...props}
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        // paddingTop: 75,
      }}>
      {/* <View>{IMAGE.LogoIcon}</View> */}

      {/* Start Screens */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Autos');
        }}
        style={[styles.BurgerText, {marginTop: 20}]}>
        <Image
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            resizeMode: 'contain',
          }}
          source={autoSalon}
        />
        <Text>Автосалоны</Text>
      </TouchableOpacity>
      {/* ----------- */}
      <TouchableOpacity
        onPress={() => {
          dispatch(
            setData({
              params: {},
              sparePartForFilter: '',
              showParamsResult: false,
              bottomNavStateIsSparePart: false,
              carcaseForFilter: '',
              brandForFilter: '',
              modelForFilter: '',
              regionForFilter: '',
              townForFilter: '',
              serviceForFilter: '',
              country: 'ru',
              searchPageParams: {
                isSparePart: false,
                isService: false,
                isCar: true,
              },
            }),
          );
          props.navigation.navigate('Search');
        }}
        style={styles.BurgerText}>
        <Image
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            resizeMode: 'contain',
          }}
          source={ruAuto}
        />
        <Text>Авто в России</Text>
      </TouchableOpacity>
      {/* ----------- */}
      <TouchableOpacity
        onPress={() => {
          dispatch(
            setData({
              params: {},
              sparePartForFilter: '',
              showParamsResult: false,
              bottomNavStateIsSparePart: false,
              carcaseForFilter: '',
              brandForFilter: '',
              modelForFilter: '',
              regionForFilter: '',
              townForFilter: '',
              serviceForFilter: '',
              country: 'kz',
              searchPageParams: {
                isSparePart: false,
                isService: false,
                isCar: true,
              },
            }),
          );
          props.navigation.navigate('Search');
        }}
        style={styles.BurgerText}>
        <Image
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            resizeMode: 'contain',
          }}
          source={kzAuto}
        />
        <Text>Авто в Казахстане</Text>
      </TouchableOpacity>
      {/* ----------- */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('CreateBusinessProfile');
        }}
        style={styles.BurgerText}>
        <Image
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            resizeMode: 'contain',
          }}
          source={businessProfile}
        />
        <Text>Бизнес Профиль</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Добавить');
        }}
        style={[styles.BurgerText, {borderBottomWidth: 0}]}>
        <Image
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            resizeMode: 'contain',
          }}
          source={require('../assets/added.png')}
        />
        <Text style={{color: '#000'}}>Добавить объявление</Text>
      </TouchableOpacity>

      {/* End Screens */}

      {/* Start Social Network */}
      <View style={styles.socialIconsBlock}>
        {/* --- Whats App --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 1 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.WhatsappIcon}
          </TouchableOpacity>
        </Card>
        {/* --- Instagram --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 1 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.InstagramIcon}
          </TouchableOpacity>
        </Card>
        {/* --- YouTube --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 1 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.YouTubeIcon}
          </TouchableOpacity>
        </Card>
        {/* --- Facebook --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 1 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.FacebookIcon}
          </TouchableOpacity>
        </Card>
      </View>
      <View style={{marginVertical: 70}} />
      {/* End Social Network */}
    </DrawerContentScrollView>
  );
};
export default DrawerContent;
