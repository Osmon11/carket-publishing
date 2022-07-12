import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';

import styles from '../../styles';
import ShadowButton from '../../Components/ShadowButton';
import GoBack from '../../Components/GoBack';
import CustomInput from '../../Components/CustomInput';
import {pickerStyles, pickerWrapper, SimpleSelect} from '../Add/InputComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBrandModels,
  getBrands,
  getCarcase,
  getCarsFiltered,
  getColors,
  getDrive,
  getFuels,
  getGeneration,
  getRegions,
  getRegionsTowns,
  getSteering,
  getTransmission,
} from '../../api';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import {load} from '../../Components/Loader';

const Parametrs = ({navigation, route}) => {
  const modalToastRef = React.useRef();
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {sort_column, sort_value, isSparePart} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  // ----------------------------------------------
  const [price_from, setPriceFrom] = useState('');
  const [price_to, setPriceTo] = useState('');
  // ----------------------------------------------
  const [year_from, setYearFrom] = useState('Год: от');
  const [year_to, setYearTo] = useState('Год: до');
  // ----------------------------------------------
  const [Color, setColor] = useState('');
  const [Transmission, setTransmission] = useState('');
  // ----------------------------------------------
  const [Carcase, setCarcase] = useState('');
  const [Fuel, setFuel] = useState('');
  // ----------------------------------------------
  const [Marka, setMarka] = useState('Марка');
  const [Model, setModel] = useState({alias: 'Модель'});
  // ----------------------------------------------
  const [Drive, setDrive] = useState('');
  const [Type, setType] = useState('');
  // ----------------------------------------------
  const [Region, setRegion] = useState('Регион');
  const [City, setCity] = useState('Город');
  // ----------------------------------------------
  const [Steering, setSteering] = useState('');
  const [models, setModels] = useState({brandAlias: Marka});
  const [cities, setCities] = useState({regionAlias: 'Регион'});

  React.useEffect(() => {
    getData(data);
    // Получение всех Областей
    if (!Boolean(state.regions)) {
      dispatch(getRegions());
    }
    // Получение всех Руль
    if (!Boolean(state.steering)) {
      dispatch(getSteering());
    }
    // Получение всех Кузовов
    if (!Boolean(state.carcase)) {
      dispatch(getCarcase());
    }
    // Получение всех Топливо
    if (!Boolean(state.fuels)) {
      dispatch(getFuels());
    }
    // Получение всех Приводов
    if (!Boolean(state.drive)) {
      dispatch(getDrive());
    }
    // Получение всех КПП
    if (!Boolean(state.transmission)) {
      dispatch(getTransmission());
    }
    // Получение всех Цветов автомобиля
    if (!Boolean(state.colors)) {
      dispatch(getColors());
    }
    // Получение всех Брендов
    if (!Boolean(state.brands)) {
      dispatch(getBrands());
    }
  }, []);
  React.useEffect(() => {
    if (!state.bottomNavStateIsSparePart) {
      if (state.brandForFilter !== '') {
        setMarka(state.brandForFilter.alias);
      } else {
        setMarka('Марка');
        setModels({brandAlias: Marka});
      }
      if (state.modelForFilter !== '') {
        setModel(state.modelForFilter);
      } else {
        setModel({alias: 'Марка'});
      }
      if (Boolean(state.regionForFilter) && state.regionForFilter !== '') {
        setRegion(state.regionForFilter.id);
      } else {
        setRegion('Регион');
        setCities({regionAlias: 'Регион'});
      }
      if (state.townForFilter !== '') {
        setCity(state.townForFilter.id);
      } else {
        setCity('Город');
      }
      dispatch(setData({generation: {model: 'Модель', data: []}}));
    }
  }, [
    state.brandForFilter,
    state.modelForFilter,
    state.regionForFilter,
    state.townForFilter,
    state.bottomNavStateIsSparePart,
  ]);
  React.useEffect(() => {
    // Получение Моделей бренда
    if (
      models.brandAlias !== Marka &&
      Marka !== 'Марка' &&
      Boolean(state.models) &&
      Boolean(state.models[Marka])
    ) {
      setModels(state.models[Marka]);
    }
    // Получение городов выбранного региона
    if (
      cities.regionAlias !== Region &&
      Region !== 'Регион' &&
      Boolean(state.regions) &&
      Boolean(state.towns[Region])
    ) {
      setCities(state.towns[Region]);
    }
  }, [state, Marka, Model, Type, models, cities, Region]);
  React.useEffect(() => {
    if (Object.keys(state.params).length === 0) {
      setPriceFrom('');
      setPriceTo('');
      setYearFrom('Год: от');
      setYearTo('Год: до');
      setColor('');
      setTransmission('');
      setCarcase('');
      setFuel('');
      setDrive('');
      setType('');
      setSteering('');
      setMarka('Марка');
      setModel({alias: 'Модель'});
    }
  }, [state.params]);
  let data = {
    page: '0',
    brand: Marka !== 'Марка' ? Marka : '',
    model: Model.alias !== 'Модель' ? Model.alias : '',
    price_from,
    price_to,
    year_from: year_from !== 'Год: от' ? year_from : '',
    year_to: year_to !== 'Год: до' ? year_to : '',
    transmission: Transmission !== 'КПП' ? Transmission : '',
    carcase: Carcase !== 'Кузов' ? Carcase : '',
    drive: Drive !== 'Привод' ? Drive : '',
    color: Color,
    steering: Steering !== 'Руль' ? Steering : '',
    region: Region !== 'Регион' ? Region : '',
    town: City !== 'Город' ? City : '',
    fuel: Fuel !== 'Топливо' ? Fuel : '',
    isSparePart,
    sort_column,
    sort_value,
    country: state.country,
    carcase: state.carcaseForFilter.alias,
  };
  const getData = requestData => {
    setLoading(true);
    dispatch(
      getCarsFiltered(Boolean(requestData) ? requestData : data, json => {
        setLoading(false);
      }),
    );
  };

  let Years = [];
  for (let i = 1965; i <= new Date().getFullYear(); i++) {
    Years.unshift(i.toString());
  }
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <GoBack navigation={() => navigation.goBack()} />
        {/* -------------------- */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            marginVertical: 20,
            marginLeft: 17,
          }}>
          Параметры
        </Text>
        <View style={{paddingHorizontal: 20}}>
          <SimpleSelect
            state={Marka}
            setState={alias => {
              setModel({alias: 'Модель'});
              setMarka(alias);
              if (alias === 'Марка') {
                getData({...data, brand: ''});
                return setModels({brandAlias: 'Марка', data: []});
              } else {
                if (Boolean(state.models[alias])) {
                  setModels(state.models[alias]);
                } else {
                  dispatch(getBrandModels({brand: alias}));
                }
              }
              getData({...data, brand: alias});
            }}
            defaultValue="Марка"
            data={state.brands}
            isLoading={Boolean(state.brands)}
          />
          {/* ------------ */}
          <SimpleSelect
            state={Model.alias}
            setState={value => {
              if (value !== 'Модель') {
                getData({...data, model: value});
                let currentModel = models.data.filter(
                  model => model.alias === value,
                )[0];
                setModel(currentModel);
                dispatch(
                  getGeneration({
                    brand: Marka,
                    model: value,
                    year: currentModel.c_to,
                  }),
                );
              } else {
                getData({...data, model: ''});
                setModel({alias: value});
                dispatch(setData({modelForFilter: ''}));
              }
            }}
            defaultValue="Модель"
            data={models.data}
            isLoading={Marka === 'Марка' || models.brandAlias === Marka}
          />
          {/* ------------ */}
          <SimpleSelect
            state={Type}
            setState={state => {
              setType(state);
              if (state === 'Поколение') {
                getData({...data, generation: ''});
              }
              getData({...data, generation: state});
            }}
            defaultValue="Поколение"
            data={state.generation.data}
            isLoading={
              Model.alias === 'Модель' || state.generation.model === Model.alias
            }
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Руль"
            state={Steering}
            setState={state => {
              setSteering(state);
              if (state === 'Руль') {
                return getData({...data, steering: ''});
              }
              getData({...data, steering: state});
            }}
            data={state.steering}
            isLoading={Boolean(state.steering)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Кузов"
            state={Carcase}
            setState={state => {
              setCarcase(state);
              if (state === 'Кузов') {
                return getData({...data, carcase: ''});
              }
              getData({...data, carcase: state});
            }}
            data={state.carcase}
            isLoading={Boolean(state.carcase)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Топливо"
            state={Fuel}
            setState={state => {
              setFuel(state);
              if (state === 'Топливо') {
                return getData({...data, fuel: ''});
              }
              getData({...data, fuel: state});
            }}
            data={state.fuels}
            isLoading={Boolean(state.fuels)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Привод"
            state={Drive}
            setState={state => {
              setDrive(state);
              if (state === 'Привод') {
                return getData({...data, drive: ''});
              }
              getData({...data, drive: state});
            }}
            data={state.drive}
            isLoading={Boolean(state.drive)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="КПП"
            state={Transmission}
            setState={state => {
              setTransmission(state);
              if (state === 'КПП') {
                return getData({...data, transmission: ''});
              }
              getData({...data, transmission: state});
            }}
            data={state.transmission}
            isLoading={Boolean(state.transmission)}
          />
          <SimpleSelect
            defaultValue="Регион"
            state={Region}
            setState={value => {
              setRegion(value);
              setCity('Город');
              if (state === 'Регион') {
                return getData({...data, region: ''});
              } else {
                if (Boolean(state.towns[value])) {
                  setCities(state.towns[value]);
                } else {
                  dispatch(getRegionsTowns({region_id: value}));
                }
              }
              getData({...data, region: value});
            }}
            data={state.regions}
            isLoading={Boolean(state.regions)}
            valueKey="id"
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Город"
            state={City}
            setState={value => {
              setCity(value);
              if (state === 'Город') {
                return getData({...data, town: ''});
              }
              getData({...data, town: value});
            }}
            data={cities.data}
            isLoading={Region === 'Регион' || cities.regionAlias === Region}
            valueKey="id"
          />
          <View style={{width: '100%', height: 5}} />
          {/* ------------ */}
          <CustomInput
            keyboardType="number-pad"
            value={price_from}
            Title="Цена от"
            Placeholder="Цена от"
            onChange={setPriceFrom}
            WIDTH="100%"
          />
          <CustomInput
            keyboardType="number-pad"
            value={price_to}
            Title="Цена до"
            Placeholder="Цена до"
            onChange={setPriceTo}
            WIDTH="100%"
          />
          <Text style={styles.AddPageTitleStyles}>Цвет автомобиля</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {state.colors &&
              state.colors.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    marginRight: state.colors.length === index + 1 ? 0 : 15,
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    alignItems: 'center',
                    elevation: 0.5,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (Color !== item.id) {
                        setColor(item.id);
                        getData({...data, color: item.id});
                      } else {
                        setColor('');
                        getData({...data, color: ''});
                      }
                    }}
                    activeOpacity={1}
                    style={{
                      backgroundColor: 'white',
                      width: 28,
                      height: 28,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // padding: 4,
                    }}>
                    <View
                      style={{
                        backgroundColor: `#${item.hex}`,
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 50,
                      }}>
                      <Image
                        style={{
                          width: 24,
                          height: 24,
                          opacity: Color === item.id ? 1 : 0,
                          alignSelf: 'center',
                        }}
                        source={
                          item.alias === 'white' || item.alias === 'beige'
                            ? require('../../assets/CheckIcon.png')
                            : require('../../assets/DoneIcon.png')
                        }
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
          <View style={{width: '100%', height: 30}} />
          {/* ------------ */}
          {state.country !== 'kz' ? (
            Platform.OS === 'ios' ? (
              <TouchableOpacity
                onPress={() => setModal(true)}
                style={[
                  pickerStyles,
                  {
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  },
                ]}>
                <Text style={{fontSize: 18, color: '#000'}}>
                  {`Год выпуска: ${
                    year_from !== 'Год: от' ? year_from : 'от'
                  } и ${year_to !== 'Год: до' ? year_to : 'до'}`}
                </Text>
              </TouchableOpacity>
            ) : Years.length > 0 ? (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={[pickerWrapper, {width: '48%'}]}>
                  <Picker
                    onValueChange={value => {
                      setYearFrom(value);
                      if (value !== 'Год: от') {
                        return getData({...data, year_from: value});
                      }
                      getData({...data, year_from: ''});
                    }}
                    selectedValue={year_from}
                    dropdownIconColor="#000000"
                    style={pickerStyles}>
                    <Picker.Item label="Год: от" value="Год: от" />
                    {Years.map(str => (
                      <Picker.Item
                        label={str}
                        value={str}
                        key={'year_from' + str}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={[pickerWrapper, {width: '48%'}]}>
                  <Picker
                    onValueChange={value => {
                      setYearTo(value);
                      if (value !== 'Год: до') {
                        return getData({...data, year_to: value});
                      }
                      getData({...data, year_to: ''});
                    }}
                    selectedValue={year_to}
                    dropdownIconColor="#000000"
                    style={pickerStyles}>
                    <Picker.Item label="Год: до" value="Год: до" />
                    {Years.map(str => (
                      <Picker.Item
                        label={str}
                        value={str}
                        key={'year_to' + str}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            ) : (
              load
            )
          ) : null}
          <View
            style={{height: Platform.OS === 'ios' ? styles.HEIGHT / 2 : 150}}
          />
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modal}
        onRequestClose={() => setModal(false)}>
        <LinearGradient
          style={{
            width: '100%',
            height: styles.HEIGHT,
            flex: 1,
            position: 'relative',
          }}
          colors={['#ffffff00', '#ffffff', '#ffffff', '#ffffff00']}
          locations={[0, 0.2, 0.8, 1]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModal(false)}
            style={{
              height: styles.HEIGHT,
              width: '100%',
              position: 'absolute',
              top: 0,
            }}
          />
          <View
            style={[
              pickerWrapper,
              {
                height: 200,
                width: styles.WIDTH - 40,
                marginHorizontal: 20,
                bottom: (styles.HEIGHT - 200) / 2,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              },
            ]}>
            <Picker
              onValueChange={value => {
                setYearFrom(value);
                if (value !== 'Год: от') {
                  return getData({...data, year_from: value});
                }
                getData({...data, year_from: ''});
              }}
              selectedValue={year_from}
              dropdownIconColor="#000000"
              style={[pickerStyles, {width: '50%'}]}>
              <Picker.Item label="Год: от" value="Год: от" />
              {Years.map(str => (
                <Picker.Item label={str} value={str} key={str} />
              ))}
            </Picker>
            <Picker
              onValueChange={value => {
                setYearTo(value);
                if (value !== 'Год: до') {
                  return getData({...data, year_to: value});
                }
                getData({...data, year_to: ''});
              }}
              selectedValue={year_to}
              dropdownIconColor="#000000"
              style={[pickerStyles, {width: '50%'}]}>
              <Picker.Item label="Год: до" value="Год: до" />
              {Years.map(str => (
                <Picker.Item label={str} value={str} key={str} />
              ))}
            </Picker>
          </View>
        </LinearGradient>
      </Modal>
      <ShadowButton
        width="80%"
        text={`Показать объявления: ${
          state.totalCounts.foundCarsCount
            ? state.totalCounts.foundCarsCount
            : '0'
        }`}
        Press={() => {
          getData(data);
          dispatch(
            setData({
              params: data,
              showParamsResult: true,
              brandForFilter:
                Marka !== 'Марка' && Boolean(state.brands)
                  ? state.brands.filter(item => item.alias === Marka)[0]
                  : '',
              modelForFilter:
                Model.alias !== 'Модель' && Boolean(models.data)
                  ? models.data.filter(model => model.alias === Model.alias)[0]
                  : '',
              regionForFilter:
                Region !== 'Регион' && Boolean(state.regions)
                  ? state.regions.filter(region => region.id === Region)[0]
                  : '',
              townForFilter:
                City !== 'Город' && Boolean(cities.data)
                  ? cities.data.filter(city => city.id === City)[0]
                  : '',
              searchPageParams: {
                isCar: true,
                isSparePart: false,
                isService: false,
              },
            }),
          );
          navigation.navigate('Search');
        }}
        isLoading={isLoading}
        fixed
        mb={30}
      />
      <Toast ref={modalToastRef} />
    </SafeAreaView>
  );
};

export default Parametrs;
