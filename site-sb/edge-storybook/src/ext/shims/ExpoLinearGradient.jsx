import React from 'react';
import { View } from 'react-native';

export const LinearGradient = ({ colors, ...props }) => {
  return (
    <View 
      {...props}
      style={[
        props.style,
        { 
          background: `linear-gradient(to right, ${colors.join(', ')})`,
          width: '100%',
          height: '100%'
        }
      ]}
    />
  );
};

export default LinearGradient;
