import React, { Fragment } from 'react';
import { View, DimensionValue } from 'react-native';

interface DividerProp {
    children?:React.ReactNode;
    orientation?: 'horizontal' | 'vertical';
    ends?: 'rounded' | 'squared'
    thickness?: number;
    color?: string;
    margin?: number;
    marginx?: number;
    marginy?: number;
    length?: DimensionValue;
}

export default function Divider({children, orientation = 'vertical', thickness = 1,color = '#484848', margin, marginx, marginy, length = '100%', ends = 'rounded'}: DividerProp) {
    const isHorizontal = orientation === 'horizontal';

    const Line = (
        <View
        style={{
            width: isHorizontal ? length : thickness,
            height: isHorizontal ? thickness : length,
            backgroundColor: color,
            margin: margin,
            marginHorizontal: marginx,
            marginVertical: marginy,
            alignSelf: 'center',
            borderRadius: ends === 'rounded' ? 25 : 0
        }}
        />
    );
    if (!children) return Line;
    const childrenArray = React.Children.toArray(children);

    return (
        <>
        {childrenArray.map((child, index) => (
            <Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && Line}
            </Fragment>
        ))}
        </>
    );
}
