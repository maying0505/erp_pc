import React from 'react';
import {Form} from 'antd';
import FileUpload from '../FileUpload';

const FormItem = Form.Item;

export default class ApprovalProcess extends React.Component {

    render() {
        const {disabled, fieldName, isRequired, initialValue = [], form, label} = this.props;
        const auditStyle = {
            borderTopWidth: '1px',
            borderTopColor: '#d9d9d9',
            borderTopStyle: 'solid',
            width: '100%',
        };
        return (
            <div style={auditStyle}>
                <FormItem label={label}>
                    {
                        initialValue && initialValue.map((item, index) => {
                            const {auditByName, stateName, nodeName, comment, taskId, auditFiles = [], auditImages = [], auditOpinion} = item;
                            const sstr = stateName ? stateName : '';
                            const cstr = comment ? comment : '';
                            const nstr = nodeName ? `【${nodeName}】` : '';
                            return (
                                <div>
                                    <div>{nstr}{auditByName}：{sstr}{cstr}</div>
                                    <div style={{marginLeft: '20px'}}>
                                        {
                                            auditOpinion &&
                                            <div>
                                                意见：{auditOpinion}
                                            </div>
                                        }
                                        {
                                            auditImages.length > 0 &&
                                            <div>

                                                <div>图片：</div>
                                                <FileUpload
                                                    defaultFileList={auditImages}
                                                    disabled={true}
                                                    isDelete={false}
                                                    fileType='image'
                                                    fileName={`${fieldName}_tempField_${index}`}
                                                    businessId={taskId}
                                                    businessType={'approvalProcess'}
                                                    form={form}
                                                />
                                            </div>
                                        }
                                        {
                                            auditFiles.length > 0 &&
                                            <div>
                                                <div>附件：</div>
                                                <FileUpload
                                                    defaultFileList={auditFiles}
                                                    disabled={true}
                                                    isDelete={false}
                                                    fileType='file'
                                                    fileName={`${fieldName}_tempField_${index}`}
                                                    businessId={taskId}
                                                    businessType={'approvalProcess'}
                                                    form={form}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </FormItem>
            </div>
        )
    }

}
