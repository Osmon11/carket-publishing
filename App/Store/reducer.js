import {SET_DATA, UPDATE_DATA} from './action';

const initialState = {
  token: '',
  user: '',
  country: 'kg',
  brandForFilter: '',
  modelForFilter: '',
  regionForFilter: '',
  carcaseForFilter: '',
  townForFilter: '',
  serviceForFilter: '',
  sparePartForFilter: '',
  region: '',
  userCars: '',
  userAdProps: '',
  models: {},
  towns: {},
  favorites: {
    cars: [],
    parts: [],
    services: [],
  },
  params: {},
  shouldUpdateAdsHistory: false,
  showParamsResult: false,
  newCars: [],
  cars: {},
  carsFiltered: {},
  searchResult: [],
  spareParts: {},
  sparePartsFiltered: [],
  services: {},
  tariffPlans: {},
  totalCounts: {},
  operationHistories: [],
  salons: {},
  salonsFiltered: [],
  salonCars: {},
  salonSpareParts: {},
  salonServices: {},
  comments: {},
  modification: {},
  generation: {model: 'Модель'},
  alert: {
    message: '',
  },
  adsPageHistory: [],
  favoritesArr: [],
  goBack: false,
  isNoData: false,
  updateComments: true,
  bottomNavStateIsSparePart: false,
  searchPageParams: {
    isSparePart: false,
    isService: false,
    isCar: false,
  },
};

export function appReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    // ------------------
    case SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    // ------------------
    case UPDATE_DATA: {
      const {key, value} = payload;

      return Array.isArray(value)
        ? {
            ...state,
            [key]: [...state[key], ...value],
          }
        : {
            ...state,
            [key]: {
              ...state[key],
              ...value,
            },
          };
    }
    // ------------------
    default: {
      return state;
    }
  }
}
