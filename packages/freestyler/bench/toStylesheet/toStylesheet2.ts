import {TStyles, TStyleSheet} from '../../src/ast';
import atoms from '../../src/atoms';

const isArray = Array.isArray;
export default function toStyleSheet2(pojso: TStyles): TStyleSheet {
    let stylesheet = [];
    for (let selector in pojso) {
        let values = pojso[selector];

        // Atrule: @media, @keyframe, ...
        if (selector[0] === '@') {
            stylesheet.push({
                type: 'Atrule',
                prelude: selector,
                rules: toStyleSheet2(values),
            });
            continue;
        }

        const selectors = selector.split(',');
        let styles = values;
        if (!isArray(styles)) styles = [styles];

        var statements = [];
        var block = [selector, statements];
        stylesheet.push(block);
        for (let i = 0; i < styles.length; i++) {
            const st = styles[i];
            for (let prop in st) {
                const declaration = st[prop];
                switch (typeof declaration) {
                    case 'string':
                    case 'number':
                        prop = atoms[prop] || prop;
                        statements.push([prop, declaration]);
                        break;
                    case 'object':
                        var props = prop.split(',');
                        var selector_list = [];

                        for (var p of props) {
                            if (p.indexOf('&') > -1) {
                                for (var sel of selectors) {
                                    selector_list.push(p.replace('&', sel));
                                }
                            } else {
                                for (var sel of selectors) {
                                    selector_list.push(sel + ' ' + p);
                                }
                            }
                        }

                        var selectors_combined = selector_list.join(',');
                        var innerpojo = {[selectors_combined]: declaration};
                        stylesheet = stylesheet.concat(toStyleSheet2(innerpojo));
                        break;
                }
            }
        }
    }

    return stylesheet;
}
