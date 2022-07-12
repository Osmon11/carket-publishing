import React, {useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';

import styles from '../../styles';
import IMAGE from '../../assets/SVG';
import Filter from '../../Components/Filter';
import HomeAds from './HomeAds';
import {useDispatch, useSelector} from 'react-redux';
import {setData} from '../../Store';
import {
  appAxios,
  getExterior,
  getFavorites,
  getMedia,
  getOptions,
  getOwners,
  getServicesWithCategory,
  getSparePartsWithCategory,
  getUserCars,
  getUserData,
  getUserServices,
  getUserSpareParts,
} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import allroad from '../../assets/allroad.png';
import sedan from '../../assets/sedan.png';
import hatchback from '../../assets/hatchback.png';
import liftback from '../../assets/liftback.png';
import wagon from '../../assets/wagon.png';
import minivan from '../../assets/minivan.png';
import coupe from '../../assets/coupe.png';
import pickup from '../../assets/pickup.png';
import cabrio from '../../assets/cabrio.png';
import van from '../../assets/van.png';

const HomePage = ({navigation, scrollToTop, setScrollState}) => {
  const dispatch = useDispatch();
  const {
    country,
    options,
    media,
    exterior,
    owners,
    sparePartsWithCategory,
    servicesWithCategory,
  } = useSelector(store => store.appReducer);
  const [Item, setItem] = useState(0);
  let getID = {
    kg: 0,
    ru: 2,
    kz: 3,
  };

  React.useEffect(() => {
    // Получение всех Опций
    if (!Boolean(options)) {
      dispatch(getOptions());
    }
    // Получение всех Медиа
    if (!Boolean(media)) {
      dispatch(getMedia());
    }
    // Получение всех Внешних вид
    if (!Boolean(exterior)) {
      dispatch(getExterior());
    }
    // Получение всех Владельцев
    if (!Boolean(owners)) {
      dispatch(getOwners());
    }

    // Получение всех Автозапчастей c Категорией
    if (!Boolean(sparePartsWithCategory)) {
      dispatch(getSparePartsWithCategory());
    }
    // Получение всех Услуг c Категорией
    if (!Boolean(servicesWithCategory)) {
      dispatch(getServicesWithCategory());
    }
    async function checkStorageToken() {
      let carketToken = await AsyncStorage.getItem('carketToken');
      if (carketToken) {
        appAxios.defaults.headers['X-API-KEY'] = `Basic ${carketToken}`;
        dispatch(getUserData());
        dispatch(getFavorites());
        dispatch(getUserCars({page: '0'}));
        dispatch(getUserSpareParts({page: '0'}));
        dispatch(getUserServices({page: '0'}));
        dispatch(setData({token: carketToken}));
      }
    }
    checkStorageToken();
    // запрашиваем разрешение на запись внешнему хранилищу
    const checkAndroidPermission = async () => {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
    };
    if (Platform.OS !== 'ios') {
      checkAndroidPermission();
    }
  }, []);
  React.useEffect(() => {
    if (Item !== getID[country]) {
      return country === 'ru' ? setItem(2) : setItem(3);
    }
  }, [country]);

  const Cars = [
    {
      img: allroad,
      text: 'Внедорожник',
      alias: 'vnedorozhnik',
    },
    {
      img: sedan,
      text: 'Седан',
      alias: 'sedan',
    },
    {
      img: liftback,
      text: 'Лифтбэк',
      alias: 'hetchbek-liftbek',
    },
    {
      img: wagon,
      text: 'Универсал',
      alias: 'universal',
    },
    {
      img: minivan,
      text: 'Минивэн',
      alias: 'miniven',
    },
    {
      img: coupe,
      text: 'Купе',
      alias: 'kupe',
    },
    {
      img: pickup,
      text: 'Пикап',
      alias: 'pikap',
    },
    {
      img: cabrio,
      text: 'Кабриолет',
      alias: 'kabriolet',
    },
    {
      img: van,
      text: 'Фургон',
      alias: 'furgon',
    },
  ];
  const listTab = [
    {id: 0, name: 'Легковые', country: 'kg'},
    {id: 1, name: 'Автозапчасти'},
    {id: 2, name: 'Автосалоны'},
    {id: 3, name: 'Услуги'},
    {id: 4, name: 'Авто  в России', country: 'ru'},
    {id: 5, name: 'Авто  в Казахстане', country: 'kz'},
  ];

  const HeaderPureComponent = React.useCallback(() => {
    return (
      <View style={[styles.headerBlock, {paddingBottom: 15}]}>
        <TouchableOpacity
          style={{width: 20, height: 20}}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          {IMAGE.BurgerIcon}
        </TouchableOpacity>
        <View>{IMAGE.LogoIcon}</View>
        <TouchableOpacity
          style={{width: 20, height: 20}}
          onPress={() => {
            dispatch(
              setData({
                brandForFilter: '',
                modelForFilter: '',
                searchPageParams: {
                  isSparePart: false,
                  isService: false,
                  isCar: true,
                },
              }),
            );
            navigation.navigate('Search');
          }}>
          {IMAGE.SearchIcon}
        </TouchableOpacity>
      </View>
    );
  }, []);
  const Header = () => {
    return (
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="#E5E5E5" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: 15}}>
          <Filter
            Item={Item}
            setItem={newItem => {
              let data = {
                showParamsResult: false,
                carcaseForFilter: '',
                brandForFilter: '',
                modelForFilter: '',
                regionForFilter: '',
                townForFilter: '',
              };
              if (newItem.country) {
                data.country = newItem.country;
              }
              dispatch(setData(data));
              setItem(newItem.id);
              if (newItem.id === 2) {
                return navigation.navigate('Autos');
              }
              dispatch(
                setData({
                  bottomNavStateIsSparePart: newItem.id === 1,
                  searchPageParams: {
                    isSparePart: newItem.id === 1,
                    isService: newItem.id === 3,
                    isCar: newItem.id !== 1 && newItem.id !== 3,
                  },
                }),
              );
              navigation.navigate(newItem.id === 1 ? 'Запчасти' : 'Search');
            }}
            data={listTab}
          />
          {/* ----- Start Body(Кузов) ----- */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Cars.map((car, key) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    setData({
                      params: {},
                      carcaseForFilter: car,
                      brandForFilter: '',
                      modelForFilter: '',
                      regionForFilter: '',
                      townForFilter: '',
                      bottomNavStateIsSparePart: false,
                      showParamsResult: false,
                      country: 'kg',
                      searchPageParams: {
                        isSparePart: false,
                        isService: false,
                        isCar: true,
                      },
                    }),
                  );
                  navigation.navigate('Search');
                }}
                style={[
                  styles.center,
                  {
                    width: 128,
                    height: 100,
                    marginRight:
                      car.text === 'Фургон' || car.text === 'Внедорожник'
                        ? 10
                        : 5,
                  },
                ]}
                key={key}>
                <Image
                  style={{width: 121, height: 68, resizeMode: 'cover'}}
                  source={car.img}
                />
                <Text style={{marginTop: 17}}>{car.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* ----- End Body(Кузов) ----- */}
        </ScrollView>
        {/* ----- Start Parametrs ----- */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            dispatch(
              setData({
                showParamsResult: false,
                carcaseForFilter: '',
                brandForFilter: '',
                modelForFilter: '',
                regionForFilter: '',
                townForFilter: '',
                country: 'kg',
              }),
            );
            navigation.navigate('Parametrs', {
              sort_column: 'date',
              sort_value: 'desc',
            });
          }}
          style={styles.HomeParametrs}>
          <Text>Параметры</Text>
          <Image
            style={{width: 20, height: 20}}
            source={require('../../assets/FilterIcon.png')}
          />
        </TouchableOpacity>
        {/* ----- End Parametrs ----- */}
      </View>
    );
  };
  return (
    <>
      <SafeAreaView>
        {/* ----- Start Header ----- */}
        <HeaderPureComponent />
        {/* ----- End Header ----- */}
        {/* ----- Start Body ----- */}
        <HomeAds
          navigation={navigation}
          Item={Item}
          header={Header}
          scrollToTop={scrollToTop}
          setScrollState={setScrollState}
        />
        {/* ----- End Body ----- */}
      </SafeAreaView>
    </>
  );
};

export default HomePage;
