import React from 'react';
import PropTypes from 'prop-types';
import {Form, DatePicker} from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from "antd/lib/date-picker/locale/zh_CN";

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class NewDatePicker extends React.Component {
    static propTypes = {
        initialValue: PropTypes.string,
        label: PropTypes.string,
        disabled: PropTypes.bool,
        isRequired: PropTypes.bool,
        fieldName: PropTypes.string.isRequired,
        form: PropTypes.object.isRequired,
    };

    static defaultProps = {
        disabled: false,
        isRequired: false,
        initialValue: undefined,
        label: '申请日期'
    };

    _onChange = (value) => {
        const {form: {setFieldsValue}, fieldName, showTime} = this.props;
        const format = showTime ? dateTimeFormat : dateFormat;
        const v = moment(value).format(format);
        setFieldsValue({[fieldName]: v});
    };

    render() {
        const {form: {getFieldDecorator}, initialValue, fieldName, isRequired, disabled, label, showTime = false} = this.props;
        const iv = function () {
            if (initialValue) {
                return moment(initialValue);
            } else {
                return undefined;
            }
        }();
        const format = showTime ? dateTimeFormat : dateFormat;
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName, {
                        initialValue: initialValue ? moment(initialValue).format(format) : undefined,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <div/>
                    )
                }
                {
                    getFieldDecorator(`${fieldName}_tempField`, {
                        initialValue: iv,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <DatePicker
                            locale={locale}
                            disabled={disabled}
                            style={{width: '100%'}}
                            placeholder={`--请输入${label}--`}
                            format={showTime ? dateTimeFormat : dateFormat}
                            showTime={showTime}
                            onChange={this._onChange}
                        />
                    )}
            </FormItem>
        );
    }
}

export default NewDatePicker
