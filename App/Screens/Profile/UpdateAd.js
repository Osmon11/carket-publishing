import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';
import {Picker} from '@react-native-picker/picker';

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
import InputComponent, {
  pickerStyles,
  pickerStylesIOS,
  pickerWrapper,
  SimpleSelect,
} from '../Add/InputComponent';
import ImagePickerAdd from '../../Components/native/ImagePIckerAdd';
import ShadowButton from '../../Components/ShadowButton';
import CheckboxComponent from '../../Components/CheckboxComponent';
import {useDispatch, useSelector} from 'react-redux';

import {
  getBrandModels,
  getBrands,
  getCar,
  getCarcase,
  getCarStatuses,
  getColors,
  getDrive,
  getExterior,
  getFuels,
  getGeneration,
  getMedia,
  getModification,
  getOptions,
  getOwners,
  getRegions,
  getRegionsTowns,
  getService,
  getServicesWithCategory,
  getSparePart,
  getSparePartsWithCategory,
  getSteering,
  getTransmission,
  updateCar,
  updateService,
  updateSparePart,
  deleteImage,
} from '../../api';
import {load} from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';
import LinearGradient from 'react-native-linear-gradient';

export const getCurrentPhotos = photosArr => {
  let newArr = [];
  photosArr.forEach(url => {
    let arr = url.split('/');
    newArr.push({
      name: arr[arr.length - 1],
      type: `img/${arr[arr.length - 1].split('.')[1]}`,
      uri: url.split('/')[0] === 'https:' ? url : `https://carket.kg/${url}`,
    });
  });
  return newArr;
};
const getModelYears = (alias, models) => {
  let currentModel = models.filter(model => model.alias === alias)[0];
  let years = [];
  for (let i = currentModel.c_to; i >= currentModel.c_from; i--) {
    years.push(i.toString());
  }
  return years;
};

export default function UpdateAd({navigation, route}) {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {
    spareParts,
    services,
    cars,
    owners,
    colors,
    car_statuses,
    userCars,
    userServices,
    userSpareParts,
  } = state;
  // --------------------------------------
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const [Horizontal, setHorizontal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const {alias, isCar, isSparePart, isService} = route.params;

  useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
        setHorizontal(false);
      } else {
        setwidth(width);
        setHorizontal(true);
      }
      setwidth(width);
    });
  }, []);
  // -------------

  const offsetSecond = useSharedValue(0);
  const animatedStylesSecond = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offsetSecond.value,
        },
      ],
    };
  });

  // --------------- View Style ---------------
  const [currentAd, setCurrentAd] = useState(null);
  const [partCategory, setPartCategory] = useState('Выберите раздел');
  const [Video, setVideo] = useState('');
  const [exterior, setExterior] = useState([]);
  const [media, setMedia] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [options, setOptions] = useState([]);
  const [c_condition, setCarCondition] = useState('');
  const [description, setDescription] = useState('');
  const [transmission, setTransmission] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Выберите раздел');
  const [sts, setSts] = useState('');
  const [owner, setOwner] = useState(0);
  const [condition_part, setCondition_part] = useState('new');
  const [Marka, setMarka] = useState('Марка');
  const [Model, setModel] = useState('Модель');
  const [Title, setTitle] = useState('');
  const [Series, setSeries] = useState('');
  const [Type, setType] = useState('Поколение');
  const [Year, setYear] = useState('');
  const [Floor, setFloor] = useState('');
  const [FloorInHome, setFloorInHome] = useState('');
  const [Heating, setHeating] = useState('');
  const [Drive, setDrive] = useState('');
  const [Mileage, setMileage] = useState('');
  const [Vin, setVin] = useState('');
  const [Region, setRegion] = useState('');
  const [City, setCity] = useState('');
  const [Price, setPrice] = useState('');
  const [Color, setColor] = useState('1');
  const [Clearence, setClearence] = useState('no');
  const [modelYears, setModelYears] = useState([]);
  const [imagesToDelete, setImageToDelete] = useState([]);
  const [cities, setCities] = useState({regionAlias: Region});
  const [models, setModels] = useState({brandAlias: Marka});
  const [modifications, setModifications] = useState({generationAlias: Type});

  useEffect(() => {
    // Получение Моделей бренда
    if (
      models.brandAlias !== Marka &&
      Marka !== 'Марка' &&
      Boolean(state.models)
    ) {
      if (Boolean(state.models[Marka])) {
        setModels(state.models[Marka]);
        if (Model !== 'Модель') {
          setModelYears(getModelYears(Model, state.models[Marka].data));
        }
      } else {
        dispatch(getBrandModels({brand: Marka}));
      }
    }
  }, [Marka, Model, models, state.models]);
  useEffect(() => {
    // Получение городов выбранного региона
    if (
      cities.regionAlias !== Region &&
      Region !== 'Регион' &&
      Boolean(state.regions)
    ) {
      if (Boolean(state.towns[Region])) {
        setCities(state.towns[Region]);
      } else {
        dispatch(getRegionsTowns({region_id: Region}));
      }
    }
  }, [cities, models, Region, state.towns]);
  useEffect(() => {
    // Получение Поколении по параметрам
    if (
      isCar &&
      state.generation.year !== Year &&
      Year !== 'Год выпуска' &&
      Marka !== 'Марка' &&
      Model !== 'Модель'
    ) {
      dispatch(getGeneration({brand: Marka, model: Model, year: Year}));
    }
    // Получаем Модификации выбранной поколении
    if (
      isCar &&
      modifications.generationAlias !== Type &&
      Type !== 'Поколение'
    ) {
      if (state.modification[Type]) {
        setModifications(state.modification[Type]);
      } else {
        dispatch(getModification({generation: Type}));
      }
    }
  }, [Marka, Model, Year, Type, modifications, isCar]);
  // --------------------------------------
  useEffect(() => {
    if (!Boolean(currentAd)) {
      if (isSparePart && Boolean(spareParts[alias])) {
        setCurrentAd(spareParts[alias]);
      }
      if (isService && Boolean(services[alias])) {
        setCurrentAd(services[alias]);
      }
      if (isCar && Boolean(cars[alias])) {
        setCurrentAd(cars[alias]);
      }
      setImageToDelete([]);
    }
    if (isSparePart && !Boolean(state.spareParts[alias])) {
      dispatch(getSparePart({alias}));
    }
    if (isService && !Boolean(state.services[alias])) {
      dispatch(getService({alias}));
    }
    if (isCar && !Boolean(state.cars[alias])) {
      dispatch(getCar(alias, 'kg'));
    }
  }, [
    currentAd,
    spareParts,
    services,
    cars,
    isSparePart,
    isService,
    isCar,
    alias,
  ]);
  useEffect(() => {
    if (Boolean(currentAd)) {
      if (Boolean(currentAd.exterior)) {
        let arr = currentAd.exterior.split(',');
        setExterior(arr.splice(0, arr.length - 1));
      }
      if (Boolean(currentAd.media)) {
        let arr = currentAd.media.split(',');
        setMedia(arr.splice(0, arr.length - 1));
      }
      if (Boolean(currentAd.photos)) {
        setPhotos(getCurrentPhotos(currentAd.photos));
      }
      if (Boolean(currentAd.options)) {
        let arr = currentAd.options.split(',');
        setOptions(arr.splice(0, arr.length - 1));
      }
      if (Boolean(currentAd.c_condition_alias) && Boolean(car_statuses)) {
        let c_condition = car_statuses.filter(
          status => status.alias === currentAd.c_condition_alias,
        );
        setCarCondition(c_condition.length > 0 ? c_condition[0].alias : '');
      }
      if (Boolean(currentAd.description)) {
        setDescription(currentAd.description);
      }
      if (Boolean(currentAd.transmission_alias)) {
        setTransmission(currentAd.transmission_alias);
      }
      if (Boolean(parseInt(currentAd.category))) {
        setServiceCategory(currentAd.category);
      }
      if (Boolean(currentAd.sts)) {
        setSts(currentAd.sts);
      }
      if (Boolean(currentAd.owner_alias)) {
        setOwner(currentAd.owner_alias);
      }
      if (Boolean(currentAd.с_condition_alias)) {
        setCondition_part(
          currentAd.с_condition_alias === 'true'
            ? 'new'
            : currentAd.с_condition_alias === 'false'
            ? 'used'
            : currentAd.с_condition_alias,
        );
      }
      if (Boolean(currentAd.brand) || Boolean(currentAd.brand_alias)) {
        setMarka(currentAd.brand || currentAd.brand_alias);
      }
      if (Boolean(currentAd.model) || Boolean(currentAd.model_alias)) {
        setModel(currentAd.model || currentAd.model_alias);
      }
      if (Boolean(currentAd)) {
        setTitle(currentAd.title || currentAd.name);
      }
      if (Boolean(currentAd.modification)) {
        setSeries(currentAd.modification);
      }
      if (Boolean(currentAd.generation)) {
        setType(currentAd.generation);
      }
      if (Boolean(currentAd.year)) {
        setYear(currentAd.year);
      }
      if (Boolean(currentAd.steering_alias)) {
        setFloor(currentAd.steering_alias);
      }
      if (Boolean(currentAd.carcase_alias)) {
        setFloorInHome(currentAd.carcase_alias);
      }
      if (Boolean(currentAd.fuel_alias)) {
        setHeating(currentAd.fuel_alias);
      }
      if (Boolean(currentAd.drive_alias)) {
        setDrive(currentAd.drive_alias);
      }
      if (Boolean(currentAd.mileage)) {
        setMileage(currentAd.mileage);
      }
      if (Boolean(currentAd.vin)) {
        setVin(currentAd.vin);
      }
      if (Boolean(currentAd.region_id)) {
        setRegion(currentAd.region_id);
      }
      if (Boolean(currentAd.town_id) && parseInt(currentAd.town_id) > 0) {
        setCity(currentAd.town_id);
      }
      if (Boolean(currentAd.price)) {
        setPrice(currentAd.price);
      }
      if (Boolean(currentAd.color_alias) && Boolean(colors)) {
        setColor(
          colors.filter(color => color.alias === currentAd.color_alias)[0].id,
        );
      }
      if (Boolean(currentAd.custom_alias)) {
        setClearence(currentAd.custom_alias);
      }
    }
  }, [currentAd, colors, car_statuses]);
  useEffect(() => {
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
    if (!Boolean(colors)) {
      dispatch(getColors());
    }
    // Получение всех Областей
    if (!Boolean(state.regions)) {
      dispatch(getRegions());
    }
    // Получение всех Брендов
    if (!Boolean(state.brands)) {
      dispatch(getBrands());
    }
    // Получение всех Владельцев
    if (!Boolean(owners)) {
      dispatch(getOwners());
    }
    // Получение всех Опций
    if (!Boolean(state.options)) {
      dispatch(getOptions());
    }
    // Получение всех Медиа
    if (!Boolean(state.media)) {
      dispatch(getMedia());
    }
    // Получение всех Внешних вид
    if (!Boolean(state.exterior)) {
      dispatch(getExterior());
    }
    // Получение всех Состаяний авто
    if (!Boolean(state.car_statuses)) {
      dispatch(getCarStatuses());
    }
    // Получение всех Автозапчастей c Категорией
    if (!Boolean(state.sparePartsWithCategory)) {
      dispatch(getSparePartsWithCategory());
    }
    // Получение всех Услуг c Категорией
    if (!Boolean(state.servicesWithCategory)) {
      dispatch(getServicesWithCategory());
    }
  }, []);

  const callback = message => {
    setLoading(false);
    if (message) {
      setImageToDelete([]);
      ToastShow(message, 2000, 'success');
      setExterior([]);
      setMedia([]);
      setPhotos([]);
      setOptions;
      setModelYears([]);
      setVin('');
      setVideo('');
      setCarCondition('1');
      setDescription('');
      setTransmission('');
      setPartCategory('');
      setServiceCategory('');
      setSts('');
      setTitle('');
      setSeries('Модификация');
      setType('Поколение');
      setYear('Год выпуска');
      setFloor('');
      setFloorInHome('');
      setHeating('');
      setDrive('');
      setMileage('');
      setRegion('Регион');
      setCity('');
      setPrice('');
      setCondition_part('new');
      setMarka('Марка');
      setModel('Модель');
      setColor('1');
      setModels({brandAlias: 'Марка', data: []});
      setModelYears([]);
      setModifications({
        generationAlias: 'Поколение',
        data: [],
      });
      setTimeout(() => navigation.goBack(), 1000);
    }
  };
  const submitHandler = () => {
    if (photos.length === 0) {
      return dispatch(
        setData({
          alert: {message: 'Добавьте хотя бы одно фото!', severity: 'error'},
        }),
      );
    }
    if (
      (isSparePart && partCategory === 'Выберите раздел') ||
      (isService && serviceCategory === 'Выберите раздел')
    ) {
      return dispatch(
        setData({alert: {message: 'Вы не выбрали раздел', severity: 'error'}}),
      );
    }
    setLoading(true);
    let filteredPhotos = photos.filter(
      item => item.uri.split('/')[0] !== 'https:',
    );
    if (isCar) {
      let data = {
        alias,
        vin: Vin,
        video: Video,
        region: Region !== 'Регион' ? Region : '',
        town: City !== 'Город' ? City : '',
        price: Price,
        brand: Marka !== 'Марка' ? Marka : '',
        model: Model !== 'Модель' ? Model : '',
        year: Year !== 'Год выпуска' ? Year : '',
        mileage: Mileage,
        carcase: FloorInHome !== 'Кузов' ? FloorInHome : '',
        color: Color,
        modification: Series !== 'Модификация' ? Series : '',
        fuel: Heating !== 'Топливо' ? Heating : '',
        drive: Drive !== 'Привод' ? Drive : '',
        generation: Type !== 'Поколение' ? Type : '',
        steering: Floor !== 'Руль' ? Floor : '',
        custom: Clearence.toString(),
        condition: c_condition,
        owner,
        photos: filteredPhotos.length > 0 ? filteredPhotos : '',
        transmission: transmission !== 'КПП' ? transmission : '',
        description,
        exterior,
        sts,
        media,
        options,
      };
      dispatch(updateCar(data, callback, userCars));
    }
    if (isSparePart) {
      let data = {
        alias,
        category: partCategory,
        name: Title,
        region: Region !== 'Регион' ? Region : '',
        town: City !== 'Город' ? City : '',
        price: Price,
        brand: Marka !== 'Марка' ? Marka : '',
        model: Model !== 'Модель' ? Model : '',
        condition_part,
        description,
        photos: filteredPhotos.length > 0 ? filteredPhotos : '',
      };
      dispatch(updateSparePart(data, callback, userSpareParts));
    }
    if (isService) {
      let data = {
        alias,
        category: serviceCategory,
        name: Title,
        region: Region !== 'Регион' ? Region : '',
        town: City !== 'Город' ? City : '',
        photos: filteredPhotos.length > 0 ? filteredPhotos : '',
        description,
      };
      dispatch(updateService(data, callback, userServices));
    }
    if (imagesToDelete.length > 0) {
      dispatch(
        deleteImage({
          alias,
          photo: imagesToDelete,
          category: isCar ? 'cars' : isSparePart ? 'parts' : 'service',
        }),
      );
    }
  };
  return (
    <SafeAreaView>
      <Toast style={{zIndex: 1000}} ref={ref => Toast.setRef(ref)} />
      {Platform.OS !== 'ios' && (
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      )}
      <HeaderComponent
        arrow={true}
        title={`${
          isSparePart
            ? 'Автозапчасти • '
            : isService
            ? 'Автоуслуги • '
            : 'Легковые • '
        }${Boolean(Title) ? Title.replace(/\s/g, ' ') : '~'}`}
        navigation={navigation}
      />

      {/* ----- Start Body ----- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {Boolean(currentAd) ? (
          <View style={styles.ph20}>
            <Text style={styles.AddPageTitleStyles}>Фотографии (до 12 шт)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 10}}>
              {photos.length > 0 &&
                photos.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: width / 2,
                      position: 'relative',
                      marginHorizontal: 10,
                    }}>
                    <Image
                      resizeMode="cover"
                      source={{
                        uri: item.uri,
                      }}
                      style={{
                        width: '100%',
                        height: 100,
                        borderRadius: 5,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        let newState = photos.filter((_, i) => i !== index);
                        setPhotos(newState);
                        if (item.uri.split('/')[0] === 'https:') {
                          setImageToDelete([
                            ...imagesToDelete,

                            item.name.split('?')[0],
                          ]);
                        }
                      }}
                      style={{
                        width: 25,
                        height: 25,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#3a3a3a',
                        borderRadius: 12.5,
                      }}>
                      <Image
                        source={require('../../assets/X.png')}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
            <ImagePickerAdd images={photos} setImage={setPhotos} />
            <Text style={[styles.AddPageTitleStyles, {marginTop: 40}]}>
              {isCar
                ? 'Об авто'
                : isSparePart
                ? 'Об автозапчастях'
                : 'Заголовок и категория'}
            </Text>

            {isService && (
              <>
                <InputComponent
                  placeholder="Заголовок объявления"
                  value={Title}
                  change={setTitle}
                  noIcon
                />
                <SimpleSelect
                  state={serviceCategory}
                  setState={setServiceCategory}
                  defaultValue="Выберите раздел"
                  data={state.servicesWithCategory}
                  isLoading={Boolean(state.servicesWithCategory)}
                  valueKey="value"
                />
              </>
            )}
            {!isService && (
              <>
                {/* --------------------------- */}
                <SimpleSelect
                  state={Marka}
                  setState={marka => {
                    setMarka(marka);
                    setModel('Модель');
                    setModels({brandAlias: 'Марка', data: []});
                    setYear('Год выпуска');
                    setType('Поколение');
                    dispatch(setData({generation: [], year: 'Год выпуска'}));
                    setSeries('Модификация');
                    setModifications({
                      generationAlias: 'Модификация',
                      data: [],
                    });
                  }}
                  defaultValue="Марка"
                  data={state.brands}
                  isLoading={Boolean(state.brands)}
                />
                {/* ------------ */}
                <SimpleSelect
                  state={Model}
                  setState={value => {
                    setModel(value);
                    setModels({brandAlias: 'Марка', data: []});
                    setYear('Год выпуска');
                    setType('Поколение');
                    dispatch(setData({generation: [], year: 'Год выпуска'}));
                    setSeries('Модификация');
                    setModifications({
                      generationAlias: 'Модификация',
                      data: [],
                    });
                    if (value !== 'Модель') {
                      setModelYears(getModelYears(value, models.data));
                    }
                  }}
                  defaultValue="Модель"
                  data={models.data}
                  isLoading={models.brandAlias === Marka}
                />
              </>
            )}
            {isCar && (
              <>
                {/* ------------ */}
                <View style={pickerWrapper}>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      onPress={() => setModal(true)}
                      style={[
                        pickerStyles,
                        {justifyContent: 'center', alignItems: 'center'},
                      ]}>
                      <Text style={[pickerStylesIOS]}>
                        {Year !== 'Год выпуска' && Boolean(modelYears)
                          ? modelYears.filter(item => item === Year)[0]
                          : 'Год выпуска'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      onValueChange={value => setYear(value)}
                      selectedValue={Year}
                      dropdownIconColor="#000000"
                      style={pickerStyles}>
                      <Picker.Item label="Год выпуска" value="Год выпуска" />
                      {Boolean(modelYears) &&
                        modelYears.map((str, index) => (
                          <Picker.Item label={str} value={str} key={index} />
                        ))}
                    </Picker>
                  )}
                </View>
                {/* ------------ */}
                <SimpleSelect
                  state={Type}
                  setState={type => {
                    setType(type);
                    setSeries('Модификация');
                    setModifications({
                      generationAlias: 'Модификация',
                      data: [],
                    });
                  }}
                  defaultValue="Поколение"
                  data={state.generation.data}
                  isLoading={
                    Year === 'Год выпуска' || state.generation.year === Year
                  }
                />
                {/* ------------ */}
                <SimpleSelect
                  state={Series}
                  setState={setSeries}
                  defaultValue="Модификация"
                  data={modifications.data}
                  isLoading={
                    Type === 'Поколение' ||
                    modifications.generationAlias === Type
                  }
                />
                {/* ------------ */}
                <SimpleSelect
                  defaultValue="Кузов"
                  state={FloorInHome}
                  setState={setFloorInHome}
                  data={state.carcase}
                  isLoading={Boolean(state.carcase)}
                />
                {/* ------------ */}
                <SimpleSelect
                  defaultValue="Топливо"
                  state={Heating}
                  setState={setHeating}
                  data={state.fuels}
                  isLoading={Boolean(state.fuels)}
                />
                {/* ------------ */}
                <SimpleSelect
                  defaultValue="Привод"
                  state={Drive}
                  setState={setDrive}
                  data={state.drive}
                  isLoading={Boolean(state.drive)}
                />
                {/* ------------ */}
                <SimpleSelect
                  defaultValue="КПП"
                  state={transmission}
                  setState={setTransmission}
                  data={state.transmission}
                  isLoading={Boolean(state.transmission)}
                />
                <View style={[styles.fdRow, {marginTop: 40}]}>
                  <Image
                    style={{width: 24, height: 24}}
                    source={require('../../assets/YouTube.png')}
                  />
                  <Text
                    style={[
                      styles.AddPageTitleStyles,
                      {marginLeft: 10, marginTop: 0},
                    ]}>
                    Ссылка на YouTube
                  </Text>
                </View>
                <InputComponent
                  value={Video}
                  change={setVideo}
                  placeholder="Ссылка на YouTube"
                  noIcon
                />
                <Text style={{fontSize: 12, marginTop: 10}}>
                  Добавьте видеоролик с вашим автомобилем - это привлечет больше
                  внимания, повысить доверие к продавцу и увеличит вероятность
                  звонка
                </Text>
                {/* ----------------------- */}
                <Text style={styles.AddPageTitleStyles}>Цвет автомобиля</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {colors &&
                    colors.map((item, index) => (
                      <View
                        key={item.id}
                        style={{
                          marginRight: colors.length === index + 1 ? 0 : 15,
                          width: 30,
                          height: 30,
                          borderRadius: 20,
                          alignItems: 'center',
                          marginTop: 20,
                          elevation: 0.5,
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        }}>
                        <TouchableOpacity
                          onPress={() => setColor(item.id)}
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
                {/* --------------------------- */}
                <Text style={styles.AddPageTitleStyles}>Пробег</Text>
                <InputComponent
                  keyboardType="number-pad"
                  value={Mileage}
                  change={setMileage}
                  placeholder="Км"
                  noIcon
                />
                <CheckboxComponent
                  style={{paddingVertical: 15}}
                  isChecked={Clearence !== 'no'}
                  text="Растаможен"
                  textStyle={{fontSize: 14, color: 'black'}}
                  onClick={() =>
                    setClearence(Clearence !== 'no' ? 'no' : 'yes')
                  }
                />
              </>
            )}

            {/* ----- Start Location ----- */}
            <Text style={styles.AddPageTitleStyles}>Расположение</Text>
            <SimpleSelect
              defaultValue="Регион"
              state={Region}
              setState={value => {
                setRegion(value);
                setCity('Город');
              }}
              data={state.regions}
              isLoading={Boolean(state.regions)}
              valueKey="id"
            />
            {/* ------------ */}
            <SimpleSelect
              defaultValue="Город"
              state={City}
              setState={setCity}
              data={cities.data}
              isLoading={cities.regionAlias === Region}
              valueKey="id"
            />
            {/* ------------ */}
            {/* ################################## */}
            {/* ----- Start Location ----- */}
            {isSparePart && (
              <>
                <Text style={styles.AddPageTitleStyles}>
                  Заголовок и категория
                </Text>
                <InputComponent
                  placeholder="Заголовок объявления"
                  value={Title}
                  change={setTitle}
                  noIcon
                />
                {/* ------------ */}
                <SimpleSelect
                  state={partCategory}
                  setState={setPartCategory}
                  defaultValue="Выберите раздел"
                  data={state.sparePartsWithCategory}
                  isLoading={Boolean(state.sparePartsWithCategory)}
                  valueKey="value"
                />
              </>
            )}
            {/* ------------ */}
            {/* ################################## */}
            {!isService && (
              <>
                <Text style={styles.AddPageTitleStyles}>Цена</Text>
                <InputComponent
                  keyboardType="number-pad"
                  value={Price}
                  change={setPrice}
                  placeholder="$"
                  noIcon
                />
              </>
            )}
            {/* ################################## */}
            {isCar && (
              <>
                {/* ----- Start Second Filter ----- */}
                <Text style={styles.AddPageTitleStyles}>Какой вы владелец</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    height: 40,
                    marginVertical: 12,
                    backgroundColor: '#f4f6f8',
                    width: '100%',
                    borderRadius: 10,
                    alignSelf: 'center',
                    padding: 2,
                  }}>
                  {/* Second List */}
                  {owners &&
                    owners.map((item, key) => (
                      <TouchableOpacity
                        key={key}
                        style={{
                          width:
                            owner === item.alias ? width / 3.3 : width / 3.45,
                          backgroundColor:
                            owner === item.alias ? '#EA4F3D' : '#f4f6f8',
                          alignItems: 'center',
                          alignSelf: 'center',
                          justifyContent: 'center',
                          borderRadius: 9,
                          height: 40,
                        }}
                        onPress={() => {
                          setOwner(item.alias);
                        }}>
                        <Text
                          style={{
                            color: owner === item.alias ? 'white' : 'black',
                            textAlign: 'center',
                            fontSize: 13,
                            alignSelf: 'center',
                            width: width / 4.5,
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
                {/*  ----- End Second Filter ----- */}
                <Text style={styles.AddPageTitleStyles}>
                  Свидетельство о регистрации (СТС)
                </Text>
                <InputComponent
                  keyboardType="number-pad"
                  value={sts}
                  change={setSts}
                  placeholder="Свидетельство о регистрации"
                  noIcon
                />
                <Text style={styles.AddPageTitleStyles}>
                  Укажите Vin или номер кузова
                </Text>
                <InputComponent
                  keyboardType="number-pad"
                  value={Vin}
                  change={setVin}
                  placeholder="VIn/номер кузова"
                  noIcon
                />
                <Image
                  style={{width: 192, height: 28, marginVertical: 10}}
                  source={require('../../assets/AddPageSpecialIcon.png')}
                />
                {/* ----- Start ViewStyle ----- */}
                <Text style={styles.AddPageTitleStyles}>Внешний вид</Text>
                {state.exterior &&
                  state.exterior.map((item, index) => (
                    <View
                      style={{
                        paddingVertical: 5,
                        borderBottomWidth:
                          state.exterior.length === index + 1 ? 0 : 1,
                        borderBottomColor: '#F2F2F2',
                      }}
                      key={item.id}>
                      <CheckboxComponent
                        style={{paddingVertical: 10}}
                        isChecked={exterior.indexOf(item.id) !== -1}
                        text={item.name}
                        textStyle={{color: '#636363'}}
                        onClick={() =>
                          setExterior(state =>
                            exterior.indexOf(item.id) === -1
                              ? [...state, item.id]
                              : state.filter(id => id !== item.id),
                          )
                        }
                      />
                    </View>
                  ))}
                {/* ----- End ViewStyle ----- */}

                {/* ----- Start Media ----- */}
                <Text style={styles.AddPageTitleStyles}>Медиа</Text>
                {state.media &&
                  state.media.map((item, index) => (
                    <View
                      style={{
                        paddingVertical: 5,
                        borderBottomWidth:
                          state.media.length === index + 1 ? 0 : 1,
                        borderBottomColor: '#F2F2F2',
                      }}
                      key={item.id}>
                      <CheckboxComponent
                        style={{paddingVertical: 10}}
                        isChecked={media.indexOf(item.id) !== -1}
                        text={item.name}
                        textStyle={{color: '#636363'}}
                        onClick={() =>
                          setMedia(state =>
                            media.indexOf(item.id) === -1
                              ? [...state, item.id]
                              : state.filter(id => id !== item.id),
                          )
                        }
                      />
                    </View>
                  ))}
                {/* ----- End Media ----- */}
                {/* ----- Start Options ----- */}
                <Text style={styles.AddPageTitleStyles}>Опции</Text>
                {state.options &&
                  state.options.map((item, index) => (
                    <View
                      style={{
                        paddingVertical: 5,
                        borderBottomWidth:
                          state.options.length === index + 1 ? 0 : 1,
                        borderBottomColor: '#F2F2F2',
                      }}
                      key={item.id}>
                      <CheckboxComponent
                        style={{paddingVertical: 10}}
                        isChecked={options.indexOf(item.id) !== -1}
                        text={item.name}
                        textStyle={{color: '#636363'}}
                        onClick={() =>
                          setOptions(state =>
                            options.indexOf(item.id) === -1
                              ? [...state, item.id]
                              : state.filter(id => id !== item.id),
                          )
                        }
                      />
                    </View>
                  ))}
                {/* ----- End Options ----- */}
                {/* ----- Start State ----- */}
                <Text style={styles.AddPageTitleStyles}>Состояние</Text>
                {state.car_statuses &&
                  state.car_statuses.map((item, index) => (
                    <View
                      style={{
                        paddingVertical: 5,
                        borderBottomWidth:
                          state.car_statuses.length === index + 1 ? 0 : 1,
                        borderBottomColor: '#F2F2F2',
                      }}
                      key={item.id}>
                      <CheckboxComponent
                        style={{paddingVertical: 10}}
                        isChecked={c_condition === item.alias}
                        text={item.name}
                        textStyle={{color: '#636363'}}
                        onClick={() => setCarCondition(item.alias)}
                      />
                    </View>
                  ))}
                {/* ----- End Options ----- */}
              </>
            )}
            {isSparePart && (
              <>
                <Text style={styles.AddPageTitleStyles}>Состояние</Text>

                <View
                  style={[
                    styles.fdRow,
                    {justifyContent: 'space-between', marginTop: 15},
                  ]}>
                  <Text style={{color: '#0D0D0D'}}>Новый</Text>
                  <CircleCheckBox
                    checked={condition_part === 'new'}
                    filterSize={22}
                    outerColor="#ececec"
                    innerColor="#EA4F3D"
                    filterColor="#FFF"
                    onToggle={() => setCondition_part('new')}
                    labelPosition={LABEL_POSITION.LEFT}
                    label=""
                    styleLabel={{
                      color: '#A7A7A7',
                      fontSize: 16,
                      marginLeft: 20,
                    }}
                  />
                </View>
                <View
                  style={{
                    height: 1,
                    marginVertical: 17,
                    backgroundColor: '#F2F2F2',
                  }}
                />
                <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
                  <Text style={{color: '#0D0D0D'}}>Б/У</Text>
                  <CircleCheckBox
                    checked={condition_part === 'used'}
                    filterSize={22}
                    outerColor="#ececec"
                    innerColor="#EA4F3D"
                    filterColor="#FFF"
                    onToggle={() => setCondition_part('used')}
                    labelPosition={LABEL_POSITION.LEFT}
                    label=""
                    styleLabel={{
                      color: '#A7A7A7',
                      fontSize: 16,
                      marginLeft: 20,
                    }}
                  />
                </View>
              </>
            )}
            <Text style={[styles.AddPageTitleStyles, {marginBottom: 10}]}>
              Текст объявления
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline={true}
              placeholder="Текст объявления"
              style={{
                minHeight: 285,
                paddingBottom: 250,
                paddingHorizontal: 21,
                backgroundColor: '#EEEEEE',
                borderRadius: 7,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <Text style={{fontSize: 12, color: '#0D0D0D', marginVertical: 10}}>
              Запрещается давать ссылки, указывать адреса почты, адреса места
              осмотра, телефоны и цену
            </Text>
            {/* ------------------------ */}
            {/* ----- Start Price ----- */}

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
                colors={['#ffffff00', '#ffffff']}
                locations={[0, 0.7]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setModal(false)}
                  style={{
                    height: styles.HEIGHT - 240,
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
                      bottom: 25,
                      position: 'absolute',
                    },
                  ]}>
                  <Picker
                    onValueChange={value => setYear(value)}
                    selectedValue={Year}
                    dropdownIconColor="#000000"
                    style={pickerStyles}>
                    <Picker.Item label="Год выпуска" value="Год выпуска" />
                    {Boolean(modelYears) &&
                      modelYears.map((str, index) => (
                        <Picker.Item label={str} value={str} key={index} />
                      ))}
                  </Picker>
                </View>
              </LinearGradient>
            </Modal>
            {/* ------------ */}
            {/* --- End Switches --- */}
            <View style={{marginBottom: 30}} />

            <ShadowButton
              width="85%"
              text="ОБНОВИТЬ ОБЪЯВЛЕНИЕ"
              Press={submitHandler}
              isLoading={isLoading}
            />
          </View>
        ) : (
          <View style={{marginTop: 20}}>{load}</View>
        )}
        <View style={{marginVertical: 60}} />
      </ScrollView>
    </SafeAreaView>
  );
}
