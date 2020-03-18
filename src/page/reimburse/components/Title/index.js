import React from 'react';
import './index.scss';

export default class Title extends React.Component {
    render() {
        const {title, imgSrc, type} = this.props;
        if (type && type === 'bar') {
            return (
                <div className='reimburse-my-title' style={{padding: '5px 0', fontSize: '14px'}}>
                    <div style={{width: '4px', height: '18px', backgroundColor: '#5166e9', marginRight: '10px'}}/>
                    {title}
                </div>
            )
        } else {
            return (
                <div className='reimburse-my-title' style={{padding: '10px 0', fontSize: '18px'}}>
                    <img className='img' src={imgSrc} alt={title}/>
                    {title}
                </div>
            )
        }
    }

}
