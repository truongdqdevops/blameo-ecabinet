import React, { PureComponent } from 'react';
import { Path, Circle, Rect, Polygon, Image as ImageSvg } from 'react-native-svg';


const CHAIR_PATH = 'M201.21 45.61L201.61 45.66L202.01 45.71L202.4 45.78L202.79 45.87L203.17 45.97L203.55 46.09L203.92 46.22L204.28 46.37L204.64 46.53L204.98 46.7L205.32 46.88L205.66 47.08L205.98 47.29L206.29 47.51L206.6 47.74L206.9 47.99L207.18 48.24L207.46 48.51L207.72 48.79L207.98 49.07L208.22 49.37L208.46 49.68L208.68 49.99L208.89 50.31L209.09 50.65L209.27 50.99L209.44 51.33L209.6 51.69L209.75 52.05L209.88 52.42L209.99 52.8L210.1 53.18L210.18 53.57L210.26 53.96L210.31 54.36L210.35 54.76L210.38 55.17L210.39 55.58L210.39 198.37L210.38 198.78L210.35 199.19L210.31 199.6L210.26 199.99L210.18 200.39L210.1 200.78L209.99 201.16L209.88 201.53L209.75 201.9L209.6 202.26L209.44 202.62L209.27 202.97L209.09 203.31L208.89 203.64L208.68 203.96L208.46 204.28L208.22 204.58L207.98 204.88L207.72 205.17L207.46 205.44L207.18 205.71L206.9 205.96L206.6 206.21L206.29 206.44L205.98 206.66L205.66 206.87L205.32 207.07L204.98 207.26L204.64 207.43L204.28 207.59L203.92 207.73L203.55 207.86L203.17 207.98L202.79 208.08L202.4 208.17L202.01 208.24L201.61 208.3L201.21 208.34L200.8 208.36L200.39 208.37L21.16 208.37L20.75 208.36L20.34 208.34L19.94 208.3L19.54 208.24L19.15 208.17L18.76 208.08L18.38 207.98L18 207.86L17.63 207.73L17.27 207.59L16.92 207.43L16.57 207.26L16.23 207.07L15.9 206.87L15.57 206.66L15.26 206.44L14.95 206.21L14.65 205.96L14.37 205.71L14.09 205.44L13.83 205.17L13.57 204.88L13.33 204.58L13.09 204.28L12.87 203.96L12.66 203.64L12.46 203.31L12.28 202.97L12.11 202.62L11.95 202.26L11.8 201.9L11.67 201.53L11.56 201.16L11.45 200.78L11.37 200.39L11.29 199.99L11.24 199.6L11.2 199.19L11.17 198.78L11.16 198.37L11.16 55.58L11.17 55.17L11.2 54.76L11.24 54.36L11.29 53.96L11.37 53.57L11.45 53.18L11.56 52.8L11.67 52.42L11.8 52.05L11.95 51.69L12.11 51.33L12.28 50.99L12.46 50.65L12.66 50.31L12.87 49.99L13.09 49.68L13.33 49.37L13.57 49.07L13.83 48.79L14.09 48.51L14.37 48.24L14.65 47.99L14.95 47.74L15.26 47.51L15.57 47.29L15.9 47.08L16.23 46.88L16.57 46.7L16.92 46.53L17.27 46.37L17.63 46.22L18 46.09L18.38 45.97L18.76 45.87L19.15 45.78L19.54 45.71L19.94 45.66L20.34 45.61L20.75 45.59L21.16 45.58L200.39 45.58L200.8 45.59L201.21 45.61ZM208.96 8.41L209.36 8.45L209.76 8.5L210.15 8.58L210.54 8.66L210.92 8.77L211.3 8.88L211.67 9.01L212.03 9.16L212.39 9.32L212.74 9.49L213.08 9.67L213.41 9.87L213.73 10.08L214.05 10.3L214.35 10.53L214.65 10.78L214.93 11.03L215.21 11.3L215.48 11.58L215.73 11.86L215.98 12.16L216.21 12.47L216.43 12.78L216.64 13.1L216.84 13.44L217.02 13.78L217.2 14.12L217.35 14.48L217.5 14.84L217.63 15.21L217.75 15.59L217.85 15.97L217.94 16.36L218.01 16.75L218.07 17.15L218.11 17.55L218.13 17.96L218.14 18.37L218.14 28.6L218.13 29.02L218.11 29.42L218.07 29.83L218.01 30.23L217.94 30.62L217.85 31.01L217.75 31.39L217.63 31.77L217.5 32.13L217.35 32.5L217.2 32.85L217.02 33.2L216.84 33.54L216.64 33.87L216.43 34.2L216.21 34.51L215.98 34.82L215.73 35.11L215.48 35.4L215.21 35.68L214.93 35.94L214.65 36.2L214.35 36.44L214.05 36.68L213.73 36.9L213.41 37.11L213.08 37.3L212.74 37.49L212.39 37.66L212.03 37.82L211.67 37.96L211.3 38.09L210.92 38.21L210.54 38.31L210.15 38.4L209.76 38.47L209.36 38.53L208.96 38.57L208.55 38.6L208.14 38.6L11.86 38.6L11.45 38.6L11.04 38.57L10.64 38.53L10.24 38.47L9.85 38.4L9.46 38.31L9.08 38.21L8.7 38.09L8.33 37.96L7.97 37.82L7.61 37.66L7.26 37.49L6.92 37.3L6.59 37.11L6.27 36.9L5.95 36.68L5.65 36.44L5.35 36.2L5.07 35.94L4.79 35.68L4.52 35.4L4.27 35.11L4.02 34.82L3.79 34.51L3.57 34.2L3.36 33.87L3.16 33.54L2.98 33.2L2.8 32.85L2.65 32.5L2.5 32.13L2.37 31.77L2.25 31.39L2.15 31.01L2.06 30.62L1.99 30.23L1.93 29.83L1.89 29.42L1.87 29.02L1.86 28.6L1.86 18.37L1.87 17.96L1.89 17.55L1.93 17.15L1.99 16.75L2.06 16.36L2.15 15.97L2.25 15.59L2.37 15.21L2.5 14.84L2.65 14.48L2.8 14.12L2.98 13.78L3.16 13.44L3.36 13.1L3.57 12.78L3.79 12.47L4.02 12.16L4.27 11.86L4.52 11.58L4.79 11.3L5.07 11.03L5.35 10.78L5.65 10.53L5.95 10.3L6.27 10.08L6.59 9.87L6.92 9.67L7.26 9.49L7.61 9.32L7.97 9.16L8.33 9.01L8.7 8.88L9.08 8.77L9.46 8.66L9.85 8.58L10.24 8.5L10.64 8.45L11.04 8.41L11.45 8.38L11.86 8.37L208.14 8.37L208.55 8.38L208.96 8.41Z';

const ELEMENTS_MAP_MEETING_TYPE = {
    CIRCLE: 'circle',
    RECT: 'rect',
    GROUP: 'group',
    TRIANGLE: 'triangle',
    IMAGE: 'image',
    PARTICIPANT: 'participant',
};

const ELEMENTS_MAP_MEETING_OBJECT_TYPE = {
    TABLE: 'Bàn',
    CHAIR: 'Ghế',
};

class Loading extends PureComponent {
    tinhSaiSo = (angle, size) => {
        const pi = Math.PI;
        const rad = angle > 90 && angle < 270 ? -(angle / 180 * pi) : (angle / 180 * pi);
        const cos45 = Math.cos(pi / 4);
        const realSize = Math.round(size * cos45, 10);

        const cosRad = Math.round(Math.cos(rad) * realSize, 10);
        const sinRad = Math.round(Math.sin(rad) * realSize, 10);

        let top = 0;
        let left = 0;

        if (angle <= 90) {
            left = -sinRad;
        } else if (angle <= 180) {
            top = cosRad;
            left = -realSize;
        } else if (angle <= 270) {
            top = -realSize;
            left = cosRad;
        } else if (angle <= 360) {
            top = sinRad;
        }

        return { top: top * 1.5, left: left * 1.5 };
    }

    typeOfChair = (fixedType) => {
        const { width, height, fill = '#d17f26', x, y, angle = 0, scaleX, scaleY, path, toggleModalInforChair } = this.props;
        // const saiSo = this.tinhSaiSo(angle, width);
        const saiSo = width <= height ? width / 2 : height / 2;
        const r = ELEMENTS_MAP_MEETING_TYPE.CIRCLE === fixedType ? Math.round(width <= height ? width / 2 : height / 2) : 0;
        if (ELEMENTS_MAP_MEETING_TYPE.GROUP === fixedType) return (
            <Path
                d={CHAIR_PATH}
                fill={fill}
                stroke={fill}
                scaleX={scaleX}
                scaleY={scaleY}
                width={'100%'}
                height={'100%'}
                x={x}
                y={y}
                rotation={angle}
                onPress={toggleModalInforChair}
            />
        );
        if (ELEMENTS_MAP_MEETING_TYPE.CIRCLE === fixedType) return (
            <Circle
                width={'100%'}
                height={'100%'}
                r={r}
                fill={fill}
                x={x + saiSo}
                y={y + saiSo}
                scaleX={1}
                scaleY={1}
                onPress={toggleModalInforChair}
            />
        );
        if (ELEMENTS_MAP_MEETING_TYPE.RECT === fixedType) return (
            <Rect
                width={width}
                height={height}
                stroke={fill}
                strokeWidth={1}
                fill={fill}
                x={x}
                y={y}
                scaleX={1}
                scaleY={1}
                rotation={angle}
                originX={x}
                originY={y}
                onPress={toggleModalInforChair}
            />
        );
        if (ELEMENTS_MAP_MEETING_TYPE.TRIANGLE === fixedType) return (
            <Polygon
                points={`${width / 2},0 0,${height} ${width},${height}`}
                stroke={fill}
                strokeWidth={1}
                fill={fill}
                x={x}
                y={y + 5}
                scaleX={1}
                scaleY={1}
                rotation={angle}
                onPress={toggleModalInforChair}
            />
        );
        if (ELEMENTS_MAP_MEETING_TYPE.IMAGE === fixedType) return (
            <ImageSvg href={path} width={width} height={height} x={x} y={y} />
        );
        return null;
    }

    render() {
        const { type, path, objectType } = this.props;

        // const defaultType = objectType === ELEMENTS_MAP_MEETING_OBJECT_TYPE.CHAIR ? ELEMENTS_MAP_MEETING_TYPE.RECT : ELEMENTS_MAP_MEETING_TYPE.RECT;
        // const fixedType = ELEMENTS_MAP_MEETING_TYPE.GROUP === type && !path.match(/^.*(chair\.svg){1}$/) ? ELEMENTS_MAP_MEETING_TYPE.RECT : type;
        const fixedType = ELEMENTS_MAP_MEETING_TYPE.GROUP === type && !path.match(/^.*(\(9\)\.svg){1}$/) ? ELEMENTS_MAP_MEETING_TYPE.RECT : type;
        const indexType = Object.values(ELEMENTS_MAP_MEETING_TYPE).findIndex(element => element === fixedType);

        if (fixedType === ELEMENTS_MAP_MEETING_TYPE.PARTICIPANT || indexType <= -1) return null;
        return this.typeOfChair(fixedType);
    };
};

export default Loading;
