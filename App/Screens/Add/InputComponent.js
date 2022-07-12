import {Picker} from '@react-native-picker/picker';
import React, {Component, PureComponent} from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Platform,
} from 'react-native';
import styles from '../../styles/index';
import {load} from '../../Components/Loader';
import LinearGradient from 'react-native-linear-gradient';

export default class InputComponent extends Component {
  render() {
    const {value, change, placeholder, PlusPress, noIcon} = this.props;

    return (
      <View
        style={{
          flex: 1,
          marginTop: 13,
          minHeight: 50,
          borderRadius: 7,
          backgroundColor: '#EEEEEE',
          alignItems: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}>
        <TextInput
          {...this.props}
          value={value}
          onChangeText={change}
          style={{flex: 1, width: '95%'}}
          placeholder={placeholder}
          placeholderTextColor="#636363"
        />

        {!noIcon && (
          <TouchableOpacity onPress={PlusPress}>
            <Image
              style={{
                width: 24,
                height: 24,
                transform: [{rotate: '-90deg'}],
              }}
              source={require('../../assets/PlusIcon.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export class SimpleSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  render() {
    const {
      setState,
      state,
      data = [],
      defaultValue,
      valueKey = 'alias',
      isLoading,
    } = this.props;
    const {modal} = this.state;
    let textValue =
      Boolean(state) && state !== defaultValue && Boolean(data)
        ? data.filter(item => item[valueKey] === state)
        : defaultValue;

    return (
      <View style={pickerWrapper}>
        {isLoading ? (
          Platform.OS === 'ios' ? (
            <>
              <Modal
                transparent={true}
                animationType="fade"
                visible={modal}
                onRequestClose={() => this.setState({modal: true})}>
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
                    onPress={() => this.setState({modal: false})}
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
                        bottom: 25,
                        width: styles.WIDTH - 40,
                        marginHorizontal: 20,
                        position: 'absolute',
                      },
                    ]}>
                    <PickerCom
                      setState={value => setState(value)}
                      state={state}
                      data={data}
                      defaultValue={defaultValue}
                      valueKey={valueKey}
                    />
                  </View>
                </LinearGradient>
              </Modal>
              <TouchableOpacity
                onPress={() => this.setState({modal: true})}
                style={[
                  pickerStyles,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <Text style={[pickerStylesIOS]}>
                  {textValue.length > 0
                    ? Array.isArray(textValue)
                      ? textValue[0].name
                      : textValue
                    : defaultValue}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <PickerCom
              setState={value => setState(value)}
              state={state}
              data={data}
              defaultValue={defaultValue}
              valueKey={valueKey}
            />
          )
        ) : (
          load
        )}
      </View>
    );
  }
}

class PickerCom extends PureComponent {
  render() {
    const {setState, defaultValue, state, data, valueKey} = this.props;
    return (
      <Picker
        onValueChange={value => setState(value)}
        selectedValue={state}
        dropdownIconColor="#000000"
        style={pickerStyles}>
        <Picker.Item label={defaultValue} value={defaultValue} />
        {Boolean(data) &&
          data.map(item => (
            <Picker.Item
              label={item.name}
              value={item[valueKey]}
              key={item.alias}
            />
          ))}
      </Picker>
    );
  }
}

export const pickerWrapper = {
  borderRadius: 7,
  width: '100%',
  height: 50,
  backgroundColor: '#EEEEEE',
  overflow: 'hidden',
  marginTop: 13,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
};
export const pickerStyles = {
  minHeight: 50,
  backgroundColor: '#EEEEEE',
  width: '100%',
};
export const pickerStylesIOS = {
  fontSize: 20,
  color: '#000',
};
