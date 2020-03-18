import React from 'react';
import {Select, Form} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default class MyCheckbox extends React.Component {

    render() {
        const {childArr, label, fieldName, initialValue, isRequired, disabled, form: {getFieldDecorator}} = this.props;
        console.log('childArr', childArr);
        return (
            <FormItem label={label}>
                {
                    getFieldDecorator(fieldName, {
                        initialValue,
                        rules: [
                            {required: isRequired, message: '*必填'}
                        ]
                    })(
                        <Select
                            disabled={disabled}
                            allowClear={true}
                            placeholder={`--请选择${label}--`}
                            style={{width: '100%'}}
                        >
                            {
                                childArr.map((item, index) => {
                                    return (
                                        <Option key={`option_key_${index}`} value={item.value}>{item.text}</Option>
                                    )
                                })
                            }
                        </Select>
                    )
                }
            </FormItem>
        );
    }
}
