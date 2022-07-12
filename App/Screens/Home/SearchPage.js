import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  RefreshControl,
  BackHandler,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {useDispatch, useSelector} from 'react-redux';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

import GoBack from '../../Components/GoBack';
import IMAGE from '../../assets/SVG';
import styles from '../../styles';
import FavoritesComponent from '../../Components/FavoritesComponent';
import CheckboxComponent from '../../Components/CheckboxComponent';
import {load, noData} from '../../Components/Loader';
import {
  getCarsFiltered,
  getServicesFiltered,
  getSparePartsFiltered,
} from '../../api';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';
import {Platform} from 'react-native';

const SearchPage = ({navigation, route, scrollToTop, setScrollState}) => {
  const flatList = React.useRef();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const {
    bottomNavStateIsSparePart,
    sparePartsFiltered,
    sparePartForFilter,
    showParamsResult,
    carcaseForFilter,
    servicesFiltered,
    serviceForFilter,
    brandForFilter,
    modelForFilter,
    regionForFilter,
    townForFilter,
    searchResult,
    totalCounts,
    country,
    params,
    searchPageParams,
  } = useSelector(store => store.appReducer);
  console.log(searchPageParams);
  const {isSparePart, isService, isCar} = searchPageParams;
  // --------------------------------------
  const [text, setText] = useState('Марка');
  const [isLoading, setLoading] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const [data, setResultData] = useState([]);
  // ---------- Start Actual ----------
  const [refreshing, setRefreshing] = useState(false);
  const [ActualShow, setActualShow] = useState(false);
  const [filterBy, setFilterBy] = useState('Дате размещения');
  const [sort_column, setSortColumn] = useState('');
  const [sort_value, setSortValue] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (Boolean(route.params?.cleanBrandForFilter)) {
          dispatch(
            setData({
              bottomNavStateIsSparePart: false,
              showParamsResult: false,
              carcaseForFilter: '',
              brandForFilter: '',
              modelForFilter: '',
              regionForFilter: '',
              townForFilter: '',
              serviceForFilter: '',
            }),
          );
          setText('Марка');
        }
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (scrollToTop) {
      flatList.current.scrollToOffset({animated: true, offset: 0});
      setScrollState(false);
    }
  }, [scrollToTop]);
  useEffect(() => {
    if (showParamsResult) {
      setLoading(true);
      setText(
        brandForFilter !== ''
          ? `${brandForFilter.name}${
              modelForFilter !== '' ? `, ${modelForFilter.name}` : ''
            }`
          : 'Марка',
      );
    }
    if (
      isCar &&
      !bottomNavStateIsSparePart &&
      !showParamsResult &&
      !isLoading
    ) {
      setLoading(true);
      if (!Boolean(route.params?.cleanBrandForFilter)) {
        setText(brandForFilter !== '' ? brandForFilter.name : 'Марка');
      } else {
        setText('Марка');
      }
      getData('0');
      setPage(1);
    }
    if (Boolean(isSparePart) && bottomNavStateIsSparePart && !isLoading) {
      if (!Boolean(route.params?.cleanBrandForFilter)) {
        setText(
          brandForFilter !== ''
            ? `${brandForFilter.name}${
                modelForFilter !== '' ? `, ${modelForFilter.name}` : ''
              }`
            : 'Марка',
        );
      } else {
        setText('Марка');
      }
      setLoading(true);
      dispatch(
        getSparePartsFiltered(
          {
            page: '0',
            brand: brandForFilter.alias,
            model: modelForFilter.alias,
            region: regionForFilter.id,
            town: townForFilter.id,
            category: sparePartForFilter.value,
            sort_column,
            sort_value,
          },
          () => {
            setLoading(false);
            setRefreshing(false);
          },
        ),
      );
      setPage(1);
    }
    if (isService && !bottomNavStateIsSparePart && !isLoading) {
      if (!Boolean(route.params?.cleanBrandForFilter)) {
        setText(
          serviceForFilter !== '' ? serviceForFilter.name : 'Выберите раздел',
        );
      } else {
        setText('Марка');
      }
      setLoading(true);
      dispatch(
        getServicesFiltered(
          {
            page: '0',
            region: regionForFilter.id,
            town: townForFilter.id,
            category: serviceForFilter.value,
            sort_column,
            sort_value,
          },
          () => {
            setLoading(false);
            setRefreshing(false);
          },
        ),
      );
      setPage(1);
    }
  }, [
    carcaseForFilter,
    brandForFilter,
    modelForFilter,
    regionForFilter,
    townForFilter,
    serviceForFilter,
    sparePartForFilter,
    bottomNavStateIsSparePart,
    country,
    sort_column,
    sort_value,
    refreshing,
  ]);
  useEffect(() => {
    if (isCar && !bottomNavStateIsSparePart && showParamsResult && !isLoading) {
      setLoading(true);
      if (!Boolean(route.params?.cleanBrandForFilter)) {
        setText(brandForFilter !== '' ? brandForFilter.name : 'Марка');
      } else {
        setText('Марка');
      }
      getData('0');
      setPage(1);
    }
  }, [
    carcaseForFilter,
    brandForFilter,
    modelForFilter,
    regionForFilter,
    townForFilter,
    serviceForFilter,
    sparePartForFilter,
    bottomNavStateIsSparePart,
    country,
    sort_column,
    sort_value,
    showParamsResult,
    refreshing,
  ]);
  const getData = React.useCallback(pageCount => {
    setLoading(true);
    setNoData(false);
    let requestData = {
      ...params,
      page: pageCount,
      brand: brandForFilter.alias,
      model: modelForFilter.alias,
      region: regionForFilter.id,
      town: townForFilter.id,
      sort_column,
      sort_value,
      country,
    };
    requestData.carcase =
      country === 'kg' && carcaseForFilter !== '' ? carcaseForFilter.alias : '';
    dispatch(
      getCarsFiltered(
        requestData,
        () => {
          setLoading(false);
          setRefreshing(false);
        },
        false,
      ),
    );
  });
  useEffect(() => {
    if (!isLoading && Boolean(isCar) && Boolean(searchResult)) {
      setResultData(searchResult);
    }
    if (!isLoading && Boolean(isSparePart) && Boolean(sparePartsFiltered)) {
      setResultData(sparePartsFiltered);
    }
    if (!isLoading && Boolean(isService) && Boolean(servicesFiltered)) {
      setResultData(servicesFiltered);
    }
  }, [
    searchResult,
    sparePartsFiltered,
    servicesFiltered,
    isLoading,
    isCar,
    isSparePart,
    isService,
  ]);

  const actualList = [
    {
      text: 'Дате размещения',
      filter: () => {
        setSortColumn(isCar ? 'date' : '');
        setSortValue(isCar ? 'desc' : '');
      },
    },
    {
      text: 'Количеству просмотров',
      filter: () => {
        setSortColumn('view');
        setSortValue('desc');
      },
    },
    {
      text: !isService ? 'Возрастанию цены' : '',
      filter: () => {
        setSortColumn('price');
        setSortValue('asc');
      },
    },
    {
      text: !isService ? 'Убыванию цены' : '',
      filter: () => {
        setSortColumn('price');
        setSortValue('desc');
      },
    },
    {
      text: isCar && country !== 'kz' ? 'Году: новее' : '',
      filter: () => {
        setSortColumn('year');
        setSortValue('desc');
      },
    },
    {
      text: isCar && country !== 'kz' ? 'Году: cтарше' : '',
      filter: () => {
        setSortColumn('year');
        setSortValue('asc');
      },
    },
  ];

  const getKey = React.useCallback((car, index) => car.alias + index, []);
  // ---------- End Actual ----------

  const listTab = [
    {id: 0, name: 'Все'},
    {id: 1, name: 'Новые'},
    {id: 2, name: 'С пробегом'},
  ];

  // ---------- animation ----------
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(
      setData({
        params: {},
        carcaseForFilter: '',
        brandForFilter: '',
        modelForFilter: '',
        regionForFilter: '',
        townForFilter: '',
        serviceForFilter: '',
        sparePartForFilter: '',
        showParamsResult: false,
      }),
    );
    setText(isService ? 'Выберите раздел' : 'Марка');
    setTimeout(() => setRefreshing(false), 3000);
  }, []);
  return (
    <SafeAreaView style={{backgroundColor: '#f2f1f6'}}>
      <Toast style={{zIndex: 10000}} ref={ref => Toast.setRef(ref)} />
      {/* ----- Start Body ----- */}
      <View style={{backgroundColor: 'white'}}>
        <FlatList
          ref={flatList}
          style={{paddingBottom: 50}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#EA4F3D']}
              tintColor="#EA4F3D"
              enabled
            />
          }
          showsVerticalScrollIndicator={false}
          data={isLoading && page === 1 ? [] : data}
          keyExtractor={getKey}
          renderItem={({item, index}) => {
            return (
              <>
                <FavoritesComponent
                  navigation={navigation}
                  imgStyle={{marginHorizontal: -20}}
                  car={isCar ? item : false}
                  sparePart={Boolean(isSparePart) ? item : false}
                  service={Boolean(isService) ? item : false}
                  salon={false}
                  isOwnCar={false}
                  country={country}
                />
                {data.length !== index + 1 && (
                  <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
                )}
              </>
            );
          }}
          ListHeaderComponent={() => (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* ----- Header Start ----- */}
              <View
                style={[
                  styles.headerBlock,
                  {marginHorizontal: 0, paddingHorizontal: 0, paddingTop: 10},
                ]}>
                <GoBack
                  navigation={() => {
                    navigation.goBack();
                    if (Boolean(route.params?.cleanBrandForFilter)) {
                      dispatch(
                        setData({
                          bottomNavStateIsSparePart: false,
                          carcaseForFilter: '',
                          brandForFilter: '',
                          modelForFilter: '',
                          regionForFilter: '',
                          townForFilter: '',
                        }),
                      );
                      setText('Марка');
                    }
                  }}
                />

                <View style={{marginLeft: -50}}>{IMAGE.LogoIcon}</View>
                <View />
              </View>
              {/* ----- Header End ----- */}
              <View style={{paddingHorizontal: 10}}>
                {/* ----- Filter Start ----- */}
                <Card
                  elevation={Platform.OS === 'ios' ? 2 : 10}
                  style={styles.FilterFilterBLock}>
                  {/* ----- Start Marks ----- */}
                  <TouchableOpacity
                    style={styles.FilterInputs}
                    onPress={() =>
                      navigation.navigate(
                        isService
                          ? 'ServiceCategory'
                          : Boolean(isSparePart)
                          ? 'PartsMarks'
                          : 'Marks',
                        {
                          isPartSearch: Boolean(isSparePart),
                        },
                      )
                    }>
                    <View>
                      <Text
                        style={{
                          color: '#9C9C9C',
                          fontSize: 8,
                          marginBottom: 2,
                        }}>
                        {isService ? 'Категория' : 'Марка'}
                      </Text>
                      <Text
                        style={{
                          color:
                            (!isService && text !== 'Марка') ||
                            (isService && serviceForFilter !== '')
                              ? 'black'
                              : '#9C9C9C',
                        }}>
                        {text}
                      </Text>
                    </View>
                    {(!isService && text !== 'Марка') ||
                    (isService && serviceForFilter !== '') ? (
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            setData(
                              !isService
                                ? {brandForFilter: '', modelForFilter: ''}
                                : {serviceForFilter: ''},
                            ),
                          );
                        }}
                        style={styless.clearField}>
                        <Image
                          style={{width: 14, height: 14}}
                          source={require('../../assets/MinX.png')}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </TouchableOpacity>
                  {/* ----- End Marks ----- */}

                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#F2F2F2',
                      marginVertical: 8.5,
                    }}
                  />

                  {/* ----- Start Models ----- */}
                  <TouchableOpacity
                    style={styles.FilterInputs}
                    onPress={() => {
                      if (Boolean(isService)) {
                        return navigation.navigate('Region', {
                          cleanBrandForFilter:
                            route.params?.cleanBrandForFilter,
                        });
                      }
                      if (brandForFilter !== '') {
                        navigation.navigate(
                          Boolean(isSparePart) ? 'PartsModels' : 'Models',
                          {
                            alias: brandForFilter.alias,
                            isSparePart,
                          },
                        );
                      } else {
                        ToastShow(
                          'Сначала выберите марку',
                          3000,
                          'error',
                          'top',
                        );
                      }
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#9C9C9C',
                          fontSize: 8,
                          marginBottom: 2,
                        }}>
                        {Boolean(isService) ? 'Любой регион' : 'Модель'}
                      </Text>
                      <Text
                        style={{
                          color:
                            (modelForFilter !== '' && !isService) ||
                            (regionForFilter !== '' && isService)
                              ? 'black'
                              : '#9C9C9C',
                        }}>
                        {!Boolean(isService) && modelForFilter !== ''
                          ? modelForFilter.name
                          : Boolean(isService) && regionForFilter !== ''
                          ? `${regionForFilter.name}${
                              townForFilter !== ''
                                ? `, ${townForFilter.name}`
                                : ''
                            }`
                          : Boolean(isService)
                          ? 'Любой регион'
                          : 'Модель'}
                      </Text>
                    </View>
                    {modelForFilter !== '' ? (
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(setData({modelForFilter: ''}));
                        }}
                        style={styless.clearField}>
                        <Image
                          style={{width: 14, height: 14}}
                          source={require('../../assets/MinX.png')}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </TouchableOpacity>
                  {/* ----- End Models ----- */}
                </Card>
                {/* ----- Filter End ----- */}
                {/* ----- Second Filter Start ----- */}
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: isCar ? 'center' : 'space-between',
                    width: '100%',
                  }}>
                  {Boolean(isCar) && (
                    <Card
                      elevation={Platform.OS === 'ios' ? 2 : 10}
                      style={{
                        width: '100%',
                        margin: 0,
                        marginRight: Platform.OS === 'ios' ? 2 : 0,
                      }}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() =>
                          navigation.navigate('Parametrs', {
                            sort_column,
                            sort_value,
                          })
                        }
                        style={{
                          backgroundColor: 'white',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: 15,
                          height: 40,
                          width: '100%',
                          borderRadius: 10,
                        }}>
                        <Text>Параметры</Text>
                        <Image
                          style={{width: 20, height: 20}}
                          source={require('../../assets/FilterIcon.png')}
                        />
                      </TouchableOpacity>
                    </Card>
                  )}
                  {Boolean(isSparePart) && (
                    <>
                      <Card
                        elevation={Platform.OS === 'ios' ? 2 : 10}
                        style={[
                          styles.FilterSecondBlock,
                          {width: Boolean(isCar) ? '31.3%' : '49%'},
                        ]}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate(
                              Boolean(isSparePart) ? 'PartsRegion' : 'Region',
                              {
                                cleanBrandForFilter:
                                  route.params?.cleanBrandForFilter,
                              },
                            );
                          }}
                          style={styles.FilterInnerButton}>
                          <Text>
                            {regionForFilter !== ''
                              ? regionForFilter.name.replace('область', '')
                              : 'Любой регион'}
                          </Text>
                        </TouchableOpacity>
                      </Card>
                      <Card
                        elevation={Platform.OS === 'ios' ? 2 : 10}
                        style={[styles.FilterSecondBlock, {width: '49%'}]}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('PartCategory', {
                              cleanBrandForFilter:
                                route.params?.cleanBrandForFilter,
                            });
                          }}
                          style={styles.FilterInnerButton}>
                          <Text>
                            {sparePartForFilter !== ''
                              ? sparePartForFilter.name
                              : 'Категория'}
                          </Text>
                        </TouchableOpacity>
                      </Card>
                    </>
                  )}
                </View>
                {/* ----- Second Filter End ----- */}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text
                  style={{color: '#9C9C9C', fontSize: 12, paddingVertical: 10}}>
                  {`${
                    Boolean(isSparePart)
                      ? Boolean(totalCounts.foundSparePartsCount)
                        ? totalCounts.foundSparePartsCount
                        : '0'
                      : isService
                      ? Boolean(totalCounts.foundServices)
                        ? totalCounts.foundServices
                        : '0'
                      : Boolean(totalCounts.foundCarsCount)
                      ? totalCounts.foundCarsCount
                      : '0'
                  } предложений`}
                </Text>
                <TouchableOpacity
                  onPress={() => setActualShow(!ActualShow)}
                  style={[styles.fdRow, {paddingVertical: 10}]}>
                  <Text
                    style={{
                      fontSize: 12,
                    }}>{`По ${filterBy.toLowerCase()}`}</Text>
                  <Image
                    style={{width: 16, height: 16}}
                    source={require('../../assets/actualIcon.png')}
                  />
                </TouchableOpacity>
              </View>
              {/* ----- Start ActualBox ----- */}
              {ActualShow && (
                <View style={styless.actualBox}>
                  {actualList.map((item, key) =>
                    Boolean(item.text) ? (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          item.filter();
                          setFilterBy(item.text);
                          setActualShow(false);
                        }}
                        style={[
                          styless.row,
                          {
                            borderBottomWidth:
                              actualList.length === key + 1 ? 0 : 1,
                          },
                        ]}
                        key={key}>
                        <Text style={{fontSize: 18}}>{item.text}</Text>
                        <CheckboxComponent
                          isChecked={item.text === filterBy}
                          onClick={() => {
                            item.filter();
                            setFilterBy(item.text);
                            setActualShow(false);
                          }}
                        />
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>
              )}
              {/* ----- End ActualBox ----- */}
            </ScrollView>
          )}
          ListFooterComponent={
            <View style={{marginVertical: 10}}>
              {isLoading || refreshing
                ? load
                : isNoData || data.length === 0
                ? noData
                : null}
            </View>
          }
          onEndReached={() => {
            if (
              (isCar &&
                totalCounts.foundCarsCount > data.length &&
                !isLoading) ||
              (Boolean(isSparePart) &&
                totalCounts.foundSparePartsCount > data.length &&
                !isLoading) ||
              (isService &&
                totalCounts.foundServices > data.length &&
                !isLoading)
            ) {
              setLoading(true);
              if (Boolean(isSparePart)) {
                dispatch(
                  getSparePartsFiltered(
                    {
                      page,
                      brand: brandForFilter.alias,
                      model: modelForFilter.alias,
                      region: regionForFilter.id,
                      town: townForFilter.id,
                      category: sparePartForFilter.value,
                      sort_column,
                      sort_value,
                    },
                    () => {
                      setLoading(false);
                      setRefreshing(false);
                    },
                  ),
                );
              }
              if (isService) {
                dispatch(
                  getServicesFiltered(
                    {
                      page,
                      region: regionForFilter.id,
                      town: townForFilter.id,
                      category: serviceForFilter.value,
                      sort_column,
                      sort_value,
                    },
                    () => {
                      setLoading(false);
                      setRefreshing(false);
                    },
                  ),
                );
              }
              if (isCar) {
                getData(page);
              }
              setPage(parseInt(page) + 1);
            }
            if (
              (isCar &&
                data.length >= totalCounts.foundCarsCount &&
                !isLoading) ||
              (Boolean(isSparePart) &&
                data.length >= totalCounts.foundSparePartsCount &&
                !isLoading) ||
              (isService &&
                data.length >= totalCounts.foundServices &&
                !isLoading)
            ) {
              setNoData(true);
            }
          }}
          onEndReachedThreshold={0}
        />
      </View>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default SearchPage;

const styless = StyleSheet.create({
  actualBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#F2F2F2',
    paddingVertical: 5,
  },
  clearField: {
    zIndex: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
