import React from 'react';
import {DatePicker, Row, Form} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const FormItem = Form.Item;

export default class RangePicker extends React.Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        const {placeholder, label, fieldName, isRequired, initialValue} = this.props;
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName[0], {
                        initialValue: initialValue[0] ? moment(initialValue[0]) : undefined,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <DatePicker
                            locale={locale}
                            style={{width: '42%'}}
                            placeholder={'年/月/日'}
                        />
                    )
                }
                <span>至</span>
                {
                    getFieldDecorator(fieldName[1], {
                        initialValue: initialValue[1] ? moment(initialValue[1]) : undefined,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <DatePicker
                            locale={locale}
                            style={{width: '42%'}}
                            placeholder={'年/月/日'}
                        />
                    )
                }
            </FormItem>
        )
    }
}
