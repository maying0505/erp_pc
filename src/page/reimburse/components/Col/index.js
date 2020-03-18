import React from 'react';
import {Col} from 'antd';

export default class MyCol extends React.Component {
    render() {
        const {children, _others} = this.props;
        return (
            <Col {..._others}>
                {children}
            </Col>
        )
    }
}
