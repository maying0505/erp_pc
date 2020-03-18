import React from 'react';
import './index.scss';

export default class Button extends React.Component {
    render() {
        const {type, children, backgroundColor, ghost, textColor, onClick, style = {}} = this.props;
        const defaultBackgroundColor = 'white';
        const defaultTextColor = 'black';
        if (type === 'primary' && !ghost) {
            const bgc = backgroundColor ? backgroundColor : defaultBackgroundColor;
            const c = textColor ? textColor : defaultTextColor;
            return (
                <div
                    className='reimburse-my-button'
                    style={{
                        backgroundColor: bgc,
                        color: c,
                        ...style,
                    }}
                    onClick={onClick}
                >
                    {children}
                </div>
            )
        } else if (type === 'primary' && ghost) {
            const bgc = defaultBackgroundColor;
            const c = backgroundColor;
            const bc = backgroundColor;
            return (
                <div
                    className='reimburse-my-button'
                    style={{
                        backgroundColor: bgc,
                        color: c,
                        border: `${bc} solid 1px`,
                        ...style,
                    }}
                    onClick={onClick}
                >
                    {children}
                </div>
            )
        }

    }
}
