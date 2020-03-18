import React from 'react';
import {Row, Col, Form} from 'antd';
import InputTextItem from 'component/InputTextItem';
import InputNumberItem from 'component/inputItem';
import InputTextAreaItem from 'component/InputTextAreaItem';
import api from 'common/util/api';

import MyRadio from '../Radio';
import MyCheckbox from '../Checkbox';
import MySelect from '../Select';
import FileUpload from '../FileUpload';
import MyRangePicker from '../RangePicker';
import MyDatePicker from '../DatePicker';
import MakeCopy from '../MakeCopy';
import ApprovalProcess from '../ApprovalProcess';

const ColConfig = {
    sm: 24,
    md: 12,
};
const ColConfigOneRow = {
    sm: 24,
    md: 24,
};
const FormItem = Form.Item;

const ComponentType = [
    {id: 0, label: '文本输入框', type: 'text'},
    {id: 1, label: '多行输入框', type: 'textarea'},
    {id: 2, label: '数字输入框', type: 'number'},
    {id: 3, label: '单选框', type: 'radio'},
    {id: 4, label: '多选框', type: 'checkbox'},
    {id: 5, label: '下拉框', type: 'select'},
    {id: 6, label: '日期', type: 'date'},
    {id: 7, label: '时间', type: 'datetime'},
    {id: 8, label: '时间选择器', type: 'timePick'},
    {id: 9, label: '附件上传框', type: 'fileUpload'},
    {id: 10, label: '图片上传框', type: 'imageUpload'},
    {id: 11, label: '抄送人选择', type: 'copyFor'},
    {id: 12, label: '审核过程', type: 'auditProcess'},

];

export default class RenderChildComponent extends React.Component {

    _renderComponent = () => {
        const {
            itemArr = [],
            form,
            instId,
            disabled: globDisabled = false,
            auditTaskId,
            isDelete = true,
            operateType,
        } = this.props;
        console.log('_renderComponent', this.props);
        return (
            <Row gutter={16}>
                {
                    itemArr.map((item, i) => {
                        const {
                            isRequire,
                            label,
                            name: fieldName,
                            type,
                            properties,
                            value: initialValue = undefined,
                            disabled: componentDisabled = undefined,
                        } = item;
                        const isRequired = function () {
                            if (isRequire === '1') {
                                return true;
                            } else if (isRequire === '0') {
                                return false;
                            } else {
                                return false;
                            }
                        }();
                        const disabled = function (_this) {
                            if (componentDisabled !== undefined) {
                                return componentDisabled !== '0';
                            } else {
                                return globDisabled;
                            }
                        }(this);
                        const dIdAndBType = function (_this) {
                            if (operateType === 'audit' || operateType === 'copyForMe') {
                                return {businessId: auditTaskId, businessType: 'task'};
                            } else {
                                return {businessId: instId, businessType: 'inst'};
                            }
                        }(this);
                        const newLabel = label.replace(/:|：/, '');
                        switch (type) {
                            case ComponentType[0].type: {
                                return (
                                    <Col {...ColConfig} key={`${label}_${i}`}>
                                        <InputTextItem
                                            form={form}
                                            label={label}
                                            isRequired={isRequired}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[1].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <InputTextAreaItem
                                            form={form}
                                            label={label}
                                            isRequired={isRequired}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[2].type: {
                                return (
                                    <Col {...ColConfig} key={`${label}_${i}`}>
                                        <InputNumberItem
                                            form={form}
                                            label={label}
                                            isRequired={isRequired}
                                            placeholder={`--请输入${label}--`}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                            display='block'
                                            marginBottom='0'
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[3].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <MyRadio
                                            form={form}
                                            label={label}
                                            childArr={properties}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            isRequired={isRequired}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[4].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <MyCheckbox
                                            form={form}
                                            label={label}
                                            childArr={properties}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            isRequired={isRequired}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[5].type: {
                                return (
                                    <Col {...ColConfig} key={`${label}_${i}`}>
                                        <MySelect
                                            form={form}
                                            label={label}
                                            childArr={properties}
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            isRequired={isRequired}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[6].type: {
                                return (
                                    <Col {...ColConfig} key={`${label}_${i}`}>
                                        <MyDatePicker
                                            form={form}
                                            label={label}
                                            disabled={disabled}
                                            isRequired={isRequired}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[7].type: {
                                return (
                                    <Col {...ColConfig} key={`${label}_${i}`}>
                                        <MyDatePicker
                                            form={form}
                                            label={label}
                                            disabled={disabled}
                                            isRequired={isRequired}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                            showTime={true}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[8].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <MyRangePicker
                                            placeholder={['--请选择开始时间--', '--请选择结束时间--']}
                                            form={form}
                                            label={label}
                                            disabled={disabled}
                                            isRequired={isRequired}
                                            fieldName={fieldName}
                                            initialValue={initialValue}
                                        />
                                    </Col>
                                )
                            }
                            case ComponentType[9].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <FormItem
                                            label={isRequired ?
                                                <span><span
                                                    style={{color: 'red'}}>*</span>{newLabel}</span>
                                                : <span>{newLabel}</span>
                                            }>
                                            <FileUpload
                                                defaultFileList={initialValue}
                                                disabled={disabled}
                                                isDelete={!disabled}
                                                fileType='file'
                                                form={form}
                                                fileName={fieldName}
                                                businessId={dIdAndBType.businessId}
                                                businessType={dIdAndBType.businessType}
                                                action={api.approvalFileUpload}
                                                isRequired={isRequired}
                                                label={label}
                                            />
                                        </FormItem>
                                    </Col>
                                )
                            }
                            case ComponentType[10].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <FormItem label={isRequired ?
                                            <span><span style={{color: 'red'}}>*</span>{newLabel}</span>
                                            : <span>{newLabel}</span>
                                        }>
                                            <FileUpload
                                                defaultFileList={initialValue}
                                                disabled={disabled}
                                                isDelete={!disabled}
                                                fileType='image'
                                                form={form}
                                                fileName={fieldName}
                                                businessId={dIdAndBType.businessId}
                                                businessType={dIdAndBType.businessType}
                                                action={api.approvalFileUpload}
                                                isRequired={isRequired}
                                                label={label}
                                            />
                                        </FormItem>
                                    </Col>
                                )
                            }
                            case ComponentType[11].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <FormItem label={label}>
                                            <MakeCopy
                                                disabled={disabled}
                                                fieldName={fieldName}
                                                isRequired={isRequired}
                                                initialValue={initialValue}
                                                form={form}
                                                label={label}
                                            />
                                        </FormItem>
                                    </Col>
                                )
                            }
                            case ComponentType[12].type: {
                                return (
                                    <Col {...ColConfigOneRow} key={`${label}_${i}`}>
                                        <ApprovalProcess
                                            disabled={disabled}
                                            fieldName={fieldName}
                                            isRequired={isRequired}
                                            initialValue={initialValue}
                                            form={form}
                                            label={label}
                                        />
                                    </Col>
                                )
                            }
                        }
                    })
                }
            </Row>
        )

    };

    render() {
        const {itemArr = []} = this.props;
        return itemArr.length > 0 ? this._renderComponent() : null
    }
}
