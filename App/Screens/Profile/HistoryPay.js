import moment from 'moment';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getUserTransactions} from '../../api';

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
import {load, noData} from '../../Components/Loader';

const HistoryPay = ({navigation}) => {
  const dispatch = useDispatch();
  const {operationHistories, totalCounts} = useSelector(
    store => store.appReducer,
  );

  const [page, setPage] = React.useState('0');
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (operationHistories.length === 0) {
      setLoading(true);
      dispatch(getUserTransactions({page}, () => setLoading(false)));
      setPage(1);
    }
  }, []);
  React.useEffect(() => {
    if (!Boolean(operationHistories)) {
      setLoading(true);
      dispatch(getUserTransactions({page}, () => setLoading(false)));
      setPage(1);
    }
  }, []);
  return (
    <SafeAreaView>
      {Platform.OS !== 'ios' && (
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      )}
      <HeaderComponent
        arrow={true}
        title="История платежей"
        navigation={navigation}
      />
      {/* ----- Start Body ----- */}
      <View style={styles.ph20}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={operationHistories}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            let buy = item.operation === '2';
            let date = moment
              .unix(item.date_creation)
              .format('yyyy/MM/DD hh:mm');
            return (
              <>
                <View
                  style={[
                    styless.Container,
                    {marginTop: index === 0 ? 41 : 20},
                  ]}>
                  <View style={styless.Block}>
                    <Text style={styless.fsz18}>
                      {buy ? 'Покупка' : 'Пополнение'}
                    </Text>
                    <Text
                      style={[styless.fsz18, {color: buy ? 'red' : 'green'}]}>
                      {buy ? `-${item.credit}` : `+${item.debit}`}
                    </Text>
                  </View>
                  <View style={styless.Block}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styless.secondText}>
                        {item.memo}
                      </Text>
                    </ScrollView>
                    <Text
                      style={[
                        styless.secondText,
                        {fontSize: 10, marginLeft: 10},
                      ]}>
                      {date}
                    </Text>
                  </View>
                </View>
              </>
            );
          }}
          ListFooterComponent={
            <View style={{marginTop: 10, marginBottom: 150}}>
              {isLoading ? load : noData}
            </View>
          }
          onEndReached={() => {
            if (
              totalCounts.all_user_transactions > operationHistories.length &&
              !isLoading
            ) {
              setLoading(true);
              dispatch(getUserTransactions({page}, () => setLoading(false)));
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0}
        />
      </View>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default HistoryPay;
const styless = StyleSheet.create({
  Block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fsz18: {fontSize: 18},
  secondText: {marginTop: 15, fontSize: 12, color: '#636363'},
  Container: {
    paddingBottom: 16,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
});
