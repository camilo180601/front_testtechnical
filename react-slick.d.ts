declare module 'react-slick' {
    import { ComponentType, ReactNode } from 'react';

    export interface Settings {
        dots?: boolean;
        infinite?: boolean;
        speed?: number;
        slidesToShow?: number;
        slidesToScroll?: number;
        [key: string]: any;
    }

    export interface SliderProps {
        settings?: Settings;
        children?: ReactNode;
    }

    const Slider: ComponentType<SliderProps>;

    export default Slider;
}
