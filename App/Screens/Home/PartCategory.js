import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  BackHandler,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSparePartsWithCategory} from '../../api';
import GoBack from '../../Components/GoBack';
import {load} from '../../Components/Loader';
import {setData} from '../../Store';

export default function PartCategory({navigation}) {
  const dispatch = useDispatch();
  const {sparePartsWithCategory} = useSelector(store => store.appReducer);

  React.useEffect(() => {
    if (!Boolean(sparePartsWithCategory)) {
      dispatch(getSparePartsWithCategory());
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('PartsSearch', {
          isSparePart: true,
          cleanBrandForFilter: false,
        });
      },
    );

    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={{marginLeft: 5}}>
        <GoBack
          navigation={() =>
            navigation.navigate('PartsSearch', {
              isSparePart: true,
              cleanBrandForFilter: false,
            })
          }
        />
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 20}}>
          Выберите раздел
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 140}}>
          {sparePartsWithCategory ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setData({sparePartForFilter: ''}));
                  navigation.goBack();
                }}
                style={{
                  paddingVertical: 15,
                  borderBottomColor: '#c8c8c8',
                  borderBottomWidth: 1,
                }}>
                <Text style={{fontSize: 18}}>Все</Text>
              </TouchableOpacity>
              {sparePartsWithCategory.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setData({sparePartForFilter: item}));
                    navigation.goBack();
                  }}
                  key={item.alias}
                  style={{
                    paddingVertical: 15,
                    borderBottomColor: '#c8c8c8',
                    borderBottomWidth:
                      sparePartsWithCategory.length === index + 1 ? 0 : 1,
                  }}>
                  <Text style={{fontSize: 18}}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            load
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
