import {Component, createElement as h} from 'react';
import {styleit} from '../styleit';
import {extend} from 'fast-extend';
import renderer from '../../renderer';

const jsxstyle = (Comp, defaultStyles = {}) => {
    let staticClassNames: string = '';

    const JsxStyle = props => {
        let {
            component,
            props: customProps = null,
            children,
            mediaQueries,
            className,
            style,
            ref,
            ...customStyles
        } = props;

        if (process.env.FREESTYLER_JSXSTYLE_MEDIA_QUERIES) {
            for (let prefix in mediaQueries) {
                const prefixLength = prefix.length;
                const mediaQuery = mediaQueries[prefix];
                const mediaQueryStyles = {};
                let mediaQueryHasStyles = false;
                for (let styleName in customStyles) {
                    if (styleName.indexOf(prefix) === 0) {
                        mediaQueryHasStyles = true;
                        const styleNameSansPrefix =
                            styleName[prefixLength].toLowerCase() + styleName.substr(prefixLength + 1);
                        mediaQueryStyles[styleNameSansPrefix] = customStyles[styleName];
                        delete customStyles[styleName];
                    }
                }
                if (mediaQueryHasStyles) {
                    const mediaQueryPrelude = mediaQueries[prefix];
                    customStyles[mediaQueryPrelude] = mediaQueryStyles;
                }
            }
        }

        return styleit(
            customStyles,
            h(
                component || Comp,
                {
                    ...customProps,
                    className: staticClassNames + (className || ''),
                    style,
                    ref,
                },
                children
            )
        );
    };

    staticClassNames = renderer.renderStatic(JsxStyle, defaultStyles);

    return JsxStyle;
};

export default jsxstyle;
