import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import CircleCheckBoxComp from '../../Components/CircleCheckBoxComp';
import { Modal } from 'react-native';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BusinessGraphick = ({
  state,
  setState,
  label,
  setDate,
  date,
  setDateSecond,
  dateSecond,
  setShow,
  show,
  showSecond,
  setShowSecond,
}) => {
  const [dateFrom, setDateFrom] = useState(date)
  const [dateTo, setDateTo] = useState(dateSecond)
  const height = Dimensions.get('window').height
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS !== 'ios') {
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
    } else {
      setDateFrom(currentDate)
    }
  };
  const onChangeSecond = (event, selectedDate) => {
    const currentDatesec = selectedDate || dateSecond;
    if (Platform.OS !== 'ios') {
      setShowSecond(Platform.OS === 'ios');
      setDateSecond(currentDatesec);
    } else {
      setDateTo(currentDatesec)
    }
  };
  return (
    <View style={[styles.container]}>
      <CircleCheckBoxComp state={state} setState={setState} label={label} />
      {show && Platform.OS !== 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
          style={{ width: 320, backgroundColor: "white" }}
        />
      )}
      {Platform.OS === 'ios' && <Modal visible={show} animationType="fade" onRequestClose={() => setShow(false)}>
        <LinearGradient style={{ display: "flex", paddingVertical: 20, flexDirection: 'column', justifyContent: 'center', height: height }} colors={["#ffffff00", "#ffffff"]} locations={[0, 0.7]}>
          <View style={{ paddingHorizontal: 20, flexDirection: 'column', height: height / 3 }}>
            <View style={{ flexDirection: 'row', display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setShow(false)}><Text style={{ fontSize: 16, color: '#000' }}>Отмена</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setDate(dateFrom); setShow(false) }}><Text style={{ fontSize: 16, color: 'green' }}>Ок</Text></TouchableOpacity>
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              value={dateFrom}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            /></View></LinearGradient>
      </Modal>}
      <TouchableOpacity
        style={styles.firstInput}
        onPress={() => setShow(true)}
        disabled={!state}>
        <Text style={{ alignSelf: 'center', color: state ? 'black' : '#A7A7A7' }}>
          {`${date.getHours() === 0
            ? '00'
            : `${date.getHours() < 10 ? '0' : ''}${date.getHours()}`
            }:${date.getMinutes() === 0
              ? '00'
              : `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
            }`}
        </Text>
      </TouchableOpacity>
      <Text>-</Text>
      {showSecond && Platform.OS !== 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateSecond}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChangeSecond}
        />
      )}
      {Platform.OS === 'ios' && <Modal visible={showSecond} animationType="fade" onRequestClose={() => setShowSecond(false)}>
        <LinearGradient style={{ display: "flex", paddingVertical: 20, flexDirection: 'column', justifyContent: 'center', height: height }} colors={["#ffffff00", "#ffffff"]} locations={[0, 0.7]}>
          <View style={{ paddingHorizontal: 20, flexDirection: 'column', height: height / 3 }}>
            <View style={{ flexDirection: 'row', display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setShowSecond(false)}><Text style={{ fontSize: 16, color: '#000' }}>Отмена</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setDateSecond(dateTo); setShowSecond(false) }}><Text style={{ fontSize: 16, color: 'green' }}>Ок</Text></TouchableOpacity>
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              value={dateTo}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChangeSecond}
            /></View></LinearGradient>
      </Modal>}
      <TouchableOpacity
        style={styles.secondInput}
        onPress={() => setShowSecond(true)}
        disabled={!state}>
        <Text style={{ alignSelf: 'center', color: state ? 'black' : '#A7A7A7' }}>
          {`${dateSecond.getHours() === 0
            ? '00'
            : `${dateSecond.getHours() < 10 ? '0' : ''
            }${dateSecond.getHours()}`
            }:${dateSecond.getMinutes() === 0
              ? '00'
              : `${dateSecond.getMinutes() < 10 ? '0' : ''
              }${dateSecond.getMinutes()}`
            }`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusinessGraphick;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  firstInput: {
    width: 120,
    height: 50,
    borderRadius: 7,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 10,
  },
  secondInput: {
    width: 120,
    height: 50,
    borderRadius: 7,
    backgroundColor: '#EEE',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
