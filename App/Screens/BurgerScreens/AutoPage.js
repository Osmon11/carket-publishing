import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  BackHandler,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Card} from 'react-native-shadow-cards';

import SwiperComponent from './SwiperComponent';
import FavoritesComponent from '../../Components/FavoritesComponent';
import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
import {load, noData} from '../../Components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToFavorites,
  deleteFromFavorites,
  getCar,
  getCarsFiltered,
  getComments,
  getService,
  getSparePart,
} from '../../api';
import {Linking} from 'react-native';
import {getSimbol} from '../Home/HomeAds';
import ShadowButton from '../../Components/ShadowButton';
import {setData} from '../../Store';
import {Platform} from 'react-native';

const AutoPage = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    favorites,
    favoritesArr,
    spareParts,
    services,
    cars,
    isNoData,
    totalCounts,
    token,
    carsFiltered,
    adsPageHistory,
    shouldUpdateAdsHistory,
    sparePartsWithCategory,
    country,
    comments,
    options,
    media,
    exterior,
    owners,
  } = useSelector(store => store.appReducer);
  const toast = useRef();
  const flatList = useRef();
  const modalToastRef = useRef();
  // ----------- AllStatusModal Visible -----------
  const [AllStatusModal, setAllStatusModal] = useState({open: false, id: 0});
  const [isVisible, setVisible] = useState(false);
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const [height, setheight] = useState(window.height);
  const {alias, salon, sparePart, service, isOwnCar, justCreated, refresh} =
    route.params;
  let isCar = !sparePart && !service;
  const [aliasState, setAliasState] = useState(alias);
  const [currentAd, setCurrentAd] = useState('');
  const [page, setPage] = useState(0);
  const [carsFilteredState, setCarsFilteredState] = useState([]);
  const [showPhoneNumber, setPhoneNumberShow] = useState(false);
  const [isCurrentAdLoading, setCurrentAdLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const goBack = useCallback(() => {
    if (adsPageHistory.length <= 1) {
      dispatch(setData({adsPageHistory: [], shouldUpdateAdsHistory: false}));
      setCurrentAd('');
      setAliasState('');
      if (Boolean(justCreated)) {
        navigation.navigate('Профиль');
      } else {
        navigation.goBack();
      }
    } else {
      setCurrentAdLoading(true);
      let newHistory = adsPageHistory;
      newHistory.splice(adsPageHistory.indexOf(aliasState), 1);
      dispatch(setData({adsPageHistory: newHistory}));
      setAliasState(newHistory[newHistory.length - 1]);
    }
    return true;
  }, [adsPageHistory, justCreated, aliasState]);
  useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
        setheight(height);
      } else {
        setwidth(width);
        setheight(height);
      }
      setwidth(width);
      setheight(height);
    });
  }, []);
  useEffect(() => {
    if (adsPageHistory.indexOf(alias) === -1 && shouldUpdateAdsHistory) {
      setCurrentAdLoading(true);
      setAliasState(alias);
      dispatch(setData({adsPageHistory: [alias]}));
      dispatch(
        getComments({
          alias,
          category: sparePart ? 'parts' : service ? 'services' : 'cars',
        }),
      );
    }
  }, [alias, aliasState, adsPageHistory, shouldUpdateAdsHistory]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );

    return () => backHandler.remove();
  }, [adsPageHistory, justCreated, aliasState]);
  useEffect(() => {
    if (sparePart && Boolean(aliasState) && !Boolean(spareParts[aliasState])) {
      setCurrentAdLoading(true);
      setCurrentAd('');
      dispatch(getSparePart({alias: aliasState}));
    }
    if (service && Boolean(aliasState) && !Boolean(services[aliasState])) {
      setCurrentAdLoading(true);
      setCurrentAd('');
      dispatch(
        getService({alias: aliasState}, () => {
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
            goBack();
          }, 3000);
          toast.current.show({
            text1: 'Услуга не найдена',
            visibilityTime: 2000,
            type: 'error',
            position: 'top',
          });
        }),
      );
    }
    if (isCar && Boolean(aliasState) && !Boolean(cars[aliasState])) {
      setCurrentAdLoading(true);
      setCurrentAd('');
      dispatch(getCar(aliasState, country));
    }
    if (!Boolean(currentAd) || currentAd.alias !== aliasState) {
      if (sparePart && Boolean(spareParts[aliasState])) {
        setCurrentAd(spareParts[aliasState]);
        setCurrentAdLoading(false);
      }
      if (service && Boolean(services[aliasState])) {
        setCurrentAd(services[aliasState]);
        setCurrentAdLoading(false);
      }
      if (isCar && Boolean(cars[aliasState])) {
        setCurrentAd(cars[aliasState]);
        setCurrentAdLoading(false);
        flatList.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
        if (
          carsFilteredState.filter(car => car.alias === aliasState).length > 0
        ) {
          setCarsFilteredState(
            carsFilteredState.filter(car => car.alias !== aliasState),
          );
        } else {
          setCarsFilteredState([]);
          getData(0, cars[aliasState]);
        }
      }
    }
  }, [
    spareParts,
    services,
    cars,
    currentAd,
    sparePart,
    service,
    isCar,
    aliasState,
    carsFiltered,
  ]);
  useEffect(() => {
    if (Boolean(carsFiltered[aliasState])) {
      setCarsFilteredState(carsFiltered[aliasState]);
    }
  }, [carsFiltered, aliasState]);

  const getData = useCallback((page, ad) => {
    setLoading(true);
    dispatch(
      getCarsFiltered(
        {
          page: page.toString(),
          country,
          brand: ad.brand,
          model: ad.model,
        },
        () => setLoading(false),
        ad.alias,
        page === 0 ? [] : carsFilteredState,
      ),
    );
  });
  const toggleFavorites = () => {
    const {cars, parts, services} = favorites;
    if (
      favoritesArr.length > 0 &&
      favoritesArr.filter(item => item.alias === aliasState).length !== 0
    ) {
      let favorites = {
        cars: isCar ? cars.filter(car => car.alias !== aliasState) : cars,
        parts: sparePart
          ? parts.filter(part => part.alias !== aliasState)
          : parts,
        services: service
          ? services.filter(service => service.alias !== aliasState)
          : services,
      };

      dispatch(
        setData({
          favorites,
          favoritesArr: [
            ...favorites.cars,
            ...favorites.parts,
            ...favorites.services,
          ],
        }),
      );
      dispatch(
        deleteFromFavorites({alias: aliasState}, () => {
          setVisible(true);
          setTimeout(() => setVisible(false), 3000);
          toast.current.show({
            text1: 'Успешно удалено',
            visibilityTime: 2000,
            type: 'success',
            position: 'top',
          });
        }),
      );
    } else {
      if (isCar) {
        cars.push(currentAd);
      }
      if (sparePart) {
        parts.push(currentAd);
      }
      if (service) {
        services.push(currentAd);
      }
      dispatch(
        setData({
          favorites: {
            cars,
            parts,
            services,
          },
          favoritesArr: [...cars, ...parts, ...services],
        }),
      );
      dispatch(
        addToFavorites(
          {
            alias: aliasState,
            category: sparePart ? 'parts' : service ? 'services' : 'cars',
          },
          () => {
            setVisible(true);
            setTimeout(() => setVisible(false), 3000);
            toast.current.show({
              text1: 'Успешно добавлено',
              visibilityTime: 2000,
              type: 'success',
              position: 'top',
            });
          },
        ),
      );
    }
  };
  const FastSaleData = [
    {
      img: require('../../assets/Vip.png'),
      text: 'Сделать VIP',
      click: () =>
        !Boolean(currentAd.car_tarrif_vips_expire)
          ? navigation.navigate('Vip', {alias: aliasState})
          : modalToastRef.current.show({
              text1: 'Уже подключено!',
              type: 'error',
              position: 'top',
              visibilityTime: 1000,
              style: {
                zIndex: 10000,
              },
            }),
    },
    {
      img: require('../../assets/Color.png'),
      text: 'Выделить цветом',
      click: () =>
        !Boolean(currentAd.car_tarrif_highlights)
          ? navigation.navigate('ColorScreen', {
              alias: aliasState,
            })
          : modalToastRef.current.show({
              text1: 'Уже подключено!',
              type: 'error',
              position: 'top',
              visibilityTime: 1000,
              style: {
                zIndex: 10000,
              },
            }),
    },
    {
      img: require('../../assets/AutoUp.png'),
      text: 'Авто UP',
      click: () =>
        navigation.navigate('AutoUp', {
          alias: aliasState,
        }),
    },
  ];
  const getPartCategoryName = id => {
    let filtered = sparePartsWithCategory.filter(item => {
      return item.value === id;
    });
    return filtered.length > 0 ? filtered[0].name : 'Не найдено';
  };
  const Header = () => (
    <>
      {Platform.OS !== 'ios' && (
        <>
          <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
        </>
      )}
      <Toast style={{zIndex: 10000, opacity: isVisible ? 1 : 0}} ref={toast} />
      <HeaderComponent
        arrow={true}
        title={`${
          sparePart
            ? 'Автозапчасти • '
            : service
            ? 'Автоуслуги • '
            : 'Легковые • '
        }${
          Boolean(currentAd.title) && !isCurrentAdLoading
            ? currentAd.title.replace(/\s/g, ' ')
            : Boolean(currentAd.name) && !isCurrentAdLoading
            ? currentAd.name.replace(/\s/g, ' ')
            : '~'
        }`}
        navigation={{
          goBack,
          navigate: (routeName, params = {}) => {
            setCurrentAd('');
            navigation.navigate(routeName, params);
          },
        }}
        token={Boolean(token)}
        favorit={true}
        favoritPress={
          Boolean(token) &&
          favoritesArr.length > 0 &&
          favoritesArr.filter(item => item.alias === aliasState).length !== 0
        }
        setFavoritPress={toggleFavorites}
      />
      {/* ----- Start Swiper Modal ----- */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={AllStatusModal.open}
        onRequestClose={() => setAllStatusModal({open: false})}>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              height: height * 1.5,
              minHeight: 500,
              flex: 1,
            }}
            activeOpacity={1}
            onPress={() => setAllStatusModal({open: false})}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 30,
                marginHorizontal: 10,
                marginVertical: height / 5,
                minHeight: 471,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 18, color: '#0D0D0D', marginBottom: 15}}>
                {AllStatusModal.id === 0
                  ? 'Выделить цветом'
                  : AllStatusModal.id === 1
                  ? 'VIP объявление'
                  : 'Автоподнятие'}
              </Text>
              <Image
                style={{width: 275, height: 240}}
                source={
                  AllStatusModal.id === 0
                    ? require('../../assets/QuicklyPopUpSimple.png')
                    : AllStatusModal.id === 1
                    ? require('../../assets/VipPopUpSimple.png')
                    : require('../../assets/TopPopUpSimple.png')
                }
              />
              <Text style={{lineHeight: 21, marginTop: 20}}>
                {AllStatusModal.id === 0
                  ? `- Отличная возможность выделить объявление среди других - в
            результатах поиска оно будет привлекать больше внимания
            пользователей.`
                  : AllStatusModal.id === 1
                  ? `- ваше объявление будет размещено в VIP блоке на самом верху списка;
- просмотры объявления и звонки увеличиваются в 10 раз;
- продажа совершается гораздо быстрее;
- отсутствие конкурентов на вашем объявлении;
- отсутствие рекламы среди фото вашего объявления.
              `
                  : `- Объявление будет автоматически подниматься вверх в заданное время
            дня.`}
              </Text>
              {AllStatusModal.id === 1 && (
                <Image
                  style={{width: 259, height: 75}}
                  source={require('../../assets/Vipx10.png')}
                />
              )}
              {Boolean(isOwnCar) && (
                <Text
                  onPress={() => {
                    setAllStatusModal({open: false, id: 0});
                    if (
                      AllStatusModal.id === 1 &&
                      !Boolean(currentAd.car_tarrif_vips_expire)
                    ) {
                      navigation.navigate('Vip', {
                        alias: aliasState,
                      });
                    } else if (
                      AllStatusModal.id === 0 &&
                      !Boolean(currentAd.car_tarrif_highlights)
                    ) {
                      navigation.navigate('ColorScreen', {
                        alias: aliasState,
                      });
                    } else if (AllStatusModal.id === 2) {
                      navigation.navigate('AutoUp', {
                        alias: aliasState,
                      });
                    }
                  }}
                  style={{fontSize: 16, color: '#EA4F3D', marginTop: 30}}>
                  {AllStatusModal.id === 0
                    ? 'Подключить “Выделить”'
                    : AllStatusModal.id === 1
                    ? 'Подключить “VIP”'
                    : 'Подключить “AutoUp”'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {!isCurrentAdLoading && Boolean(currentAd) ? (
        <>
          <SwiperComponent
            page={page}
            ad={currentAd}
            isLoading={isLoading}
            isCurrentAdLoading={isCurrentAdLoading}
          />
          {isCar && (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                activeOpacity={1}
                onPress={() => {
                  setAllStatusModal({open: true, id: 0});
                }}>
                <Image
                  style={{width: 26, height: 26}}
                  source={require('../../assets/Color.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                activeOpacity={1}
                onPress={() => {
                  setAllStatusModal({open: true, id: 1});
                }}>
                <Image
                  style={{width: 26, height: 26, marginHorizontal: 10}}
                  source={require('../../assets/Vip.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                activeOpacity={1}
                onPress={() => {
                  setAllStatusModal({open: true, id: 2});
                }}>
                <Image
                  style={{width: 26, height: 26}}
                  source={require('../../assets/AutoUp.png')}
                />
              </TouchableOpacity>
            </View>
          )}
          {/* -------- */}
          <View style={[{paddingHorizontal: 15}]}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '33%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 16, height: 16, marginRight: 6}}
                  source={require('../../assets/View.png')}
                />
                <Text style={{color: '#818181', fontSize: 10}}>
                  {`Просмотров\n${currentAd.view}`}
                </Text>
              </View>
              <View
                style={{
                  width: '33%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 16, height: 16, marginRight: 6}}
                  source={require('../../assets/added.png')}
                />
                <Text
                  style={{
                    color: '#818181',
                    fontSize: 10,
                  }}>{`Добавлено\n${currentAd.date_text}`}</Text>
              </View>
              {Boolean(currentAd.upped_at_text) &&
                parseInt(currentAd.upped_at_text.split(' ')[0]) > 0 && (
                  <View
                    style={{
                      width: '33%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{width: 16, height: 16, marginRight: 6}}
                      source={require('../../assets/last.png')}
                    />
                    <Text style={{color: '#818181', fontSize: 10}}>
                      {`Поднято\n${currentAd.upped_at_text}`}
                    </Text>
                  </View>
                )}
            </View>
            {/* ------------------------------ */}
            <Text style={{marginTop: 17.5}}>
              {`${
                sparePart
                  ? 'Автозапчасти • '
                  : service
                  ? 'Автоуслуги • '
                  : 'Продажа • '
              } ${
                Boolean(currentAd.title) && !isCurrentAdLoading
                  ? currentAd.title
                  : Boolean(currentAd.name) && !isCurrentAdLoading
                  ? currentAd.name
                  : '~'
              }`}
            </Text>
            {isCar && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                  }}>
                  {parseInt(currentAd.price) !== 0
                    ? `${currentAd.price}${getSimbol[country]}`
                    : 'Договорная'}
                </Text>
                {Boolean(currentAd.secondary_price) && (
                  <Text style={{color: '#818181', marginLeft: 8}}>
                    {`≈ ${currentAd.secondary_price} ⊆`}
                  </Text>
                )}
              </View>
            )}
            {/* ---------- Start About ---------- */}
            <View
              style={{
                alignSelf: 'center',
              }}>
              {service && Boolean(currentAd.category_name) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 8,
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={{width: '50%', fontSize: 12}}>Кетегория</Text>
                  <Text
                    style={{
                      width: '50%',
                      color: '#818181',
                      fontSize: 12,
                    }}>
                    {currentAd.category_name}
                  </Text>
                </View>
              )}
              {!service && (
                <>
                  {Boolean(sparePart) && (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                          marginBottom: 8,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{width: '50%', fontSize: 12}}>Цена</Text>
                        <Text
                          style={{
                            width: '50%',

                            color: '#818181',
                            fontSize: 12,
                          }}>
                          {Boolean(currentAd.price)
                            ? `${currentAd.price}$`
                            : 'Договорная'}
                        </Text>
                      </View>
                      {Boolean(parseInt(currentAd.category)) && (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                            alignSelf: 'flex-start',
                          }}>
                          <Text style={{width: '50%', fontSize: 12}}>
                            Кетегория
                          </Text>
                          <Text
                            style={{
                              width: '50%',

                              color: '#818181',
                              fontSize: 12,
                            }}>
                            {getPartCategoryName(currentAd.category)}
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{width: '50%', fontSize: 12}}>Марка</Text>
                        <Text
                          style={{
                            width: '50%',

                            color: '#818181',
                            fontSize: 12,
                          }}>
                          {currentAd.part_brand}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{width: '50%', fontSize: 12}}>Модель</Text>
                        <Text
                          style={{
                            width: '50%',

                            color: '#818181',
                            fontSize: 12,
                          }}>
                          {currentAd.part_model}
                        </Text>
                      </View>
                    </>
                  )}

                  {Boolean(currentAd.car_status) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>
                        Состояние
                      </Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_status}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.owner_alias) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Владелец</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {
                          owners.filter(
                            item => item.alias === currentAd.owner_alias,
                          )[0].name
                        }
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.region) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Область</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.region}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.town) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Город</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.town}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.c_condition) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>
                        Состояние
                      </Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.c_condition}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.year) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>
                        Год выпуска
                      </Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.year}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.mileage) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Пробег</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {`${currentAd.mileage} км`}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_carcase) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Кузов</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_carcase}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.color_name) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Цвет</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.color_name}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_fuel) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>
                        Двигатель
                      </Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_fuel}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_transmission) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Коробка</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_transmission}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_drive) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Привод</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_drive}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_steering) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Руль</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_steering}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_custom) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>Таможня</Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_custom}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.sts) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>
                        Свидетельство о регистрации (СТС)
                      </Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.sts}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.vin) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12, width: '50%'}}>
                        Vin или номер кузова
                      </Text>
                      <Text
                        style={{
                          width: '50%',
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.vin}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.exterior) && (
                    <>
                      <View
                        style={{
                          height: 1,
                          marginTop: 15,
                          backgroundColor: '#f2f1f6',
                        }}
                      />
                      <Text style={{fontSize: 18, marginVertical: 18}}>
                        Внешний вид
                      </Text>
                      <View style={styless.container}>
                        {currentAd.exterior.split(',').map((id, index) => {
                          let target = exterior.filter(
                            item => item.id === id,
                          )[0];
                          return (
                            Boolean(target) && (
                              <Text key={index} style={styless.tag}>
                                {target.name}
                              </Text>
                            )
                          );
                        })}
                      </View>
                    </>
                  )}
                  {Boolean(currentAd.options) && (
                    <>
                      <View
                        style={{
                          height: 1,
                          marginTop: 15,
                          backgroundColor: '#f2f1f6',
                        }}
                      />
                      <Text style={{fontSize: 18, marginVertical: 18}}>
                        Опции
                      </Text>
                      <View style={styless.container}>
                        {currentAd.options.split(',').map((id, index) => {
                          let target = options.filter(
                            item => item.id === id,
                          )[0];
                          return (
                            Boolean(target) && (
                              <Text key={index} style={styless.tag}>
                                {target.name}
                              </Text>
                            )
                          );
                        })}
                      </View>
                    </>
                  )}
                  {Boolean(currentAd.media) && (
                    <>
                      <View
                        style={{
                          height: 1,
                          marginTop: 15,
                          backgroundColor: '#f2f1f6',
                        }}
                      />
                      <Text style={{fontSize: 18, marginVertical: 18}}>
                        Медиа
                      </Text>
                      <View style={styless.container}>
                        {currentAd.media.split(',').map((id, index) => {
                          let target = media.filter(item => item.id === id)[0];
                          return (
                            Boolean(target) && (
                              <Text key={index} style={styless.tag}>
                                {target.name}
                              </Text>
                            )
                          );
                        })}
                      </View>
                    </>
                  )}
                </>
              )}
              <Text style={{fontSize: 18, marginTop: 20}}>
                Описание от продавца
              </Text>
              {Boolean(currentAd.description) && (
                <Text
                  style={{
                    marginTop: 15,
                    marginBottom: 20,
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#818181',
                  }}>
                  {currentAd.description}
                </Text>
              )}

              {Boolean(salon) ? (
                //  ----- Shadow Card -----
                <Card
                  elevation={Platform.OS === 'ios' ? 2 : 15}
                  style={{
                    width: width - 30,
                    flexDirection: 'row',
                    marginTop: 34,
                    borderRadius: 10,
                    minHeight: 142,
                    paddingHorizontal: 35,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode="cover"
                    style={{width: 100, height: 92, alignSelf: 'center'}}
                    source={{
                      uri: `https://carket.kg/img/salons/photo/${salon.photo}`,
                    }}
                  />
                  <View style={{alignSelf: 'center', marginLeft: 43}}>
                    <Text style={{fontSize: 16}}>{salon.name}</Text>
                    <Text style={{fontSize: 12, marginVertical: 5}}>
                      {`${salon.all_advice} объявления`}
                    </Text>
                    <Text
                      style={{fontSize: 10, color: '#747474', marginBottom: 5}}>
                      Телефон отдела продаж
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPhoneNumberShow(true);
                        Linking.openURL(`tel:${salon.phone.split(',')[0]}`);
                      }}>
                      <Text style={{color: '#EA4F3D'}}>
                        {showPhoneNumber
                          ? salon.phone.split(',')[0]
                          : 'Показать номер'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ) : (
                // {/* ----- End Shadow Card ----- */}
                // {/* ---- Ava ---- */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 65, height: 65}}
                    source={require('../../assets/Ava.png')}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 18}}>{currentAd.user_name}</Text>
                    <Text
                      style={{fontSize: 12, color: '#636363', marginTop: 10}}>
                      {Boolean(currentAd.region) ? currentAd.region : '~'}
                    </Text>
                  </View>
                </View>
              )}

              {/* ----- Row Container ----- */}
              <Card
                elevation={Platform.OS === 'ios' ? 3 : 10}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: '#EA4F3D',
                  minHeight: 68,
                  width: width - 30,
                  alignSelf: 'center',
                  marginTop: 40,
                  marginBottom: isCar ? 40 : 100,
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                <Toast ref={modalToastRef} topOffset={5} />
                {/* --------------------- */}
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setData({updateComments: true}));
                    navigation.navigate('Comments', {
                      alias: aliasState,
                      sparePart: sparePart,
                      service: service,
                      car: isCar,
                    });
                  }}
                  style={styless.arrowContainerView}>
                  <Image
                    style={styless.arrowContainer}
                    source={require('../../assets/CommentIcon.png')}
                  />
                  <Text style={styless.arrowContainerText}>
                    {Boolean(comments[aliasState]) &&
                    comments[aliasState].length > 0 &&
                    Array.isArray(comments[aliasState])
                      ? `Комментарии (${comments[aliasState].length})`
                      : 'Нет комментариев'}
                  </Text>
                </TouchableOpacity>
                {/* --------------------- */}
                <View style={styless.arrowLine} />
                <TouchableOpacity
                  onPress={() =>
                    modalToastRef.current.show({
                      text1: 'Скопировано!',
                      type: 'success',
                      position: 'top',
                      visibilityTime: 1000,
                      style: {
                        zIndex: 10000,
                      },
                    })
                  }
                  style={styless.arrowContainerView}>
                  <Image
                    style={styless.arrowContainer}
                    source={require('../../assets/CopyLink.png')}
                  />
                  <Text style={styless.arrowContainerText}>
                    Скопироват ссылку
                  </Text>
                </TouchableOpacity>
                {/* --------------------- */}
                <View style={styless.arrowLine} />
                {/* --------------------- */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('WriteToUs')}
                  style={styless.arrowContainerView}>
                  <Image
                    style={styless.arrowContainer}
                    source={require('../../assets/ComplainIcon.png')}
                  />
                  <Text style={styless.arrowContainerText}>Пожаловаться</Text>
                </TouchableOpacity>
                {/* --------------------- */}
              </Card>
              {/* ---------- Start Fasat Sale ---------- */}
              {Boolean(isOwnCar) && isCar && (
                <>
                  <Text
                    style={{
                      fontSize: 18,
                      alignSelf: 'flex-start',
                      marginBottom: 20,
                    }}>
                    Быстрая продажа
                  </Text>
                  <View style={{alignSelf: 'flex-start'}}>
                    {FastSaleData.map((item, key) => (
                      <TouchableOpacity
                        onPress={item.click}
                        key={key}
                        style={[styles.fdRow, {marginBottom: 10}]}>
                        <Image
                          style={{width: 26, height: 26}}
                          source={item.img}
                        />
                        <Text
                          style={{
                            marginLeft: 25,
                            color: '#686868',
                            fontSize: 16,
                          }}>
                          {item.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              {/* ---------- End Fast Sale ---------- */}
            </View>
            {/* ---------- End About ---------- */}
          </View>
        </>
      ) : (
        <View style={{marginTop: 20}}>{load}</View>
      )}
    </>
  );

  return (
    <SafeAreaView>
      <FlatList
        ref={flatList}
        showsVerticalScrollIndicator={false}
        data={
          !isCurrentAdLoading && Boolean(currentAd) && isCar
            ? carsFilteredState
            : []
        }
        keyExtractor={car => car.alias.toString()}
        renderItem={({item, index}) => (
          <>
            <FavoritesComponent
              navigation={navigation}
              imgStyle={{marginHorizontal: -20}}
              car={item}
              country={country}
              salon={false}
              isOwnCar={false}
              isAutoPage={newAlias => {
                setCurrentAdLoading(true);
                dispatch(
                  setData({
                    adsPageHistory: [
                      ...adsPageHistory.filter(item => item !== newAlias),
                      newAlias,
                    ],
                  }),
                );
                dispatch(
                  getComments({
                    alias: newAlias,
                    category: sparePart
                      ? 'parts'
                      : service
                      ? 'services'
                      : 'cars',
                  }),
                );
                setAliasState(newAlias);
              }}
            />
            {carsFilteredState.length !== index + 1 && (
              <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
            )}
            {carsFilteredState.length === index + 1 && (
              <View style={{height: 50}} />
            )}
          </>
        )}
        ListHeaderComponent={() => <Header />}
        ListFooterComponent={
          isLoading &&
          !isCurrentAdLoading && (
            <View style={{marginTop: 10, marginBottom: 100}}>{load}</View>
          )
        }
        ListEmptyComponent={
          isNoData &&
          !isLoading &&
          !isCurrentAdLoading && (
            <View style={{marginBottom: 100}}>{noData}</View>
          )
        }
        onEndReached={() => {
          if (
            totalCounts.foundTheSamecars > carsFilteredState.length + 1 &&
            !isLoading
          ) {
            setLoading(true);
            getData(page, currentAd);
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0}
      />

      {Boolean(currentAd) && !isCurrentAdLoading && (
        <ShadowButton
          width={width - 40}
          text="ПОЗВОНИТЬ"
          Press={() =>
            Linking.openURL(
              `tel:${
                Boolean(currentAd.phone)
                  ? `+${currentAd.phone}`
                  : currentAd.login
              }`,
            )
          }
          fixed
        />
      )}
    </SafeAreaView>
  );
};

export default AutoPage;

const styless = StyleSheet.create({
  arrow: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  arrowContainer: {width: 24, height: 24},
  arrowContainerView: {justifyContent: 'center', alignItems: 'center'},
  arrowContainerText: {
    fontSize: 10,
    color: 'white',
    marginTop: 8,
    alignSelf: 'center',
  },
  arrowLine: {
    width: 1,
    height: 48,
    backgroundColor: 'white',
    marginHorizontal: -15,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tag: {
    color: '#818181',
    backgroundColor: '#ebecf0',
    borderRadius: 5,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginVertical: 2,
    marginRight: 4,
  },
});
