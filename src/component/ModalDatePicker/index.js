import React from 'react';
import {Modal, DatePicker} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

const DateFormat = 'YYYY-MM-DD';

export default class ModalDatePicker extends React.Component {

    static propTypes = {
        initialValue: PropTypes.string,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool,
        format: PropTypes.string,
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,
        okFunc: PropTypes.func.isRequired,
        modalVisible: PropTypes.func.isRequired,
    };

    static defaultProps = {
        initialValue: undefined,
        placeholder: '--请选择--',
        visible: false,
        title: '',
        disabled: false,
        format: DateFormat,
    };

    state = {
        dateValue: null,
    };

    _onChange = (e) => {
        const {format} = this.props;
        let dateValue = null;
        if (e !== null) {
            dateValue = moment(e).format(format);
        }
        this.setState({dateValue});
    };

    _onOk = () => {
        const {okFunc, initialValue,} = this.props;
        const {dateValue} = this.state;
        const value = dateValue ? dateValue : initialValue ? initialValue : null;
        okFunc && okFunc(value);
    };

    _onCancel = () => {
        const {modalVisible} = this.props;
        modalVisible && modalVisible(false);
    };

    render() {
        const {title, visible, placeholder, disabled, initialValue} = this.props;
        return (
            <Modal
                onOk={this._onOk}
                onCancel={this._onCancel}
                okText={'确定'}
                cancelText={'取消'}
                title={title}
                visible={visible}
                closable={true}
            >
                <DatePicker
                    style={{width: '100%'}}
                    disabled={disabled}
                    defaultValue={initialValue ? moment(initialValue) : initialValue}
                    placeholder={placeholder}
                    format={DateFormat}
                    onChange={this._onChange}
                />
            </Modal>
        )
    }
}
