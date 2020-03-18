import React from 'react';
import {Radio, Form} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class MyRadio extends React.Component {

    render() {
        const {childArr, label, fieldName, initialValue, isRequired, disabled, form: {getFieldDecorator}} = this.props;
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName, {
                        initialValue,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <RadioGroup disabled={disabled}>
                            {
                                childArr.map((item, index) => {
                                    return (
                                        <Radio key={`radio_key_${index}`} value={item.value}>{item.text}</Radio>
                                    )
                                })
                            }
                        </RadioGroup>
                    )
                }
            </FormItem>
        );
    }
}
