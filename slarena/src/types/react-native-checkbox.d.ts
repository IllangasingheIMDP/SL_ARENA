declare module 'react-native-checkbox' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    labelStyle?: TextStyle;
    checkboxStyle?: ViewStyle;
    containerStyle?: ViewStyle;
  }

  export default class Checkbox extends Component<CheckboxProps> {}
} 