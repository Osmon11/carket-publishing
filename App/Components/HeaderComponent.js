import React, {Component} from 'react';
import {Platform} from 'react-native';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import IMAGE from '../assets/SVG';
import {setData} from '../Store';
import styles from '../styles';

export default function HeaderComponent({
  favorit,
  arrow,
  autos,
  navigation,
  title,
  token,
  setFavoritPress,
  favoritPress,
}) {
  const dispatch = useDispatch();
  const Body = () => (
    <View
      onPress={() => {
        return Boolean(autos)
          ? navigation.navigate('Autos')
          : navigation.goBack();
      }}
      style={[
        styles.HeaderComponentBlock,
        {
          justifyContent: favorit ? 'space-between' : 'flex-start',
        },
      ]}>
      {arrow && (
        <TouchableOpacity
          onPress={() => {
            return Boolean(autos)
              ? navigation.navigate('Autos')
              : navigation.goBack();
          }}
          style={{marginRight: 15, width: 25}}>
          {IMAGE.ArrowLeft}
        </TouchableOpacity>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{width: '90%'}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            return Boolean(autos)
              ? navigation.navigate('Autos')
              : navigation.goBack();
          }}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{color: 'white', fontSize: 16}}>
            {title}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {favorit && (
        <TouchableOpacity
          style={{marginLeft: 10}}
          onPress={() => {
            if (Boolean(token)) {
              setFavoritPress(!favoritPress);
            } else {
              dispatch(setData({goBack: true}));
              navigation.navigate('Login');
            }
          }}>
          <View style={{marginTop: 2}}>
            {favoritPress ? IMAGE.AutoFavoritIcon : IMAGE.AutoUnFavoritIcon}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
  return Platform.OS === 'ios' ? (
    <Body />
  ) : (
    <SafeAreaView>
      <Body />
    </SafeAreaView>
  );
}
