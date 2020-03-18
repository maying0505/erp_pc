import React from 'react';
import './index.scss';
import {Modal, Button, Form, message, Spin} from 'antd';
import {RenderChildComponent} from '../components';

import {request, apiUrl} from 'common/request/request';
import {session} from 'common/util/storage';
import DownloadFile from 'common/util/downloadFile';
import api from 'common/util/api';
import uuidv1 from 'uuid/v1';
import toQueryStr from 'common/util/toQueryStr';

class Main extends React.Component {

    state = {
        modalVisible: this.props.modalVisible,
        isLoading: false,
        formJsonObj: [],
        processId: null,
        instId: uuidv1(),
        listId: null,
        operateType: null,
        auditFormJson: [],
        auditTaskId: null,
        approvalState: null,
        auditedFormJson: [],
        copyForMeFormJson: [],
    };

    componentWillReceiveProps(nextProps) {
        let {
            modalVisible, listId, formJsonObj, instId, processId, operateType, auditFormJson, auditTaskId, approvalState,
            auditedFormJson, copyForMeFormJson,
        } = this.state;
        if (nextProps.modalVisible !== this.props.modalVisible) {
            modalVisible = nextProps.modalVisible;
        }
        if (nextProps.listId !== this.props.listId) {
            listId = nextProps.listId;
            this._getFormJosnByListId({processId: listId});
        }
        if (nextProps.formJson !== this.props.formJson) {
            formJsonObj = nextProps.formJson;
        }
        if (nextProps.instId !== this.props.instId) {
            instId = nextProps.instId;
        }
        if (nextProps.processId !== this.props.processId) {
            processId = nextProps.processId;
        }
        if (nextProps.auditTaskId !== this.props.auditTaskId) {
            auditTaskId = nextProps.auditTaskId;
        }
        if (nextProps.operateType !== this.props.operateType) {
            operateType = nextProps.operateType;
            if (operateType === 'audit') {
                auditFormJson = [
                    {
                        name: 'auditOpinion',
                        label: '审核意见',
                        type: 'textarea',
                        disabled: '0',
                    },
                    {
                        name: 'auditImages',
                        label: '图片',
                        type: 'imageUpload',
                        disabled: '0',
                    },
                    {
                        name: 'auditFiles',
                        label: '附件',
                        type: 'fileUpload',
                        disabled: '0',
                    },
                    {
                        name: 'auditCopyFor',
                        label: '抄送',
                        type: 'copyFor',
                        disabled: '0',
                    }
                ];
            }
            if (operateType === 'audited') {
                auditedFormJson = [
                    {
                        name: 'auditedCopyFor',
                        label: '抄送：',
                        type: 'copyFor',
                        disabled: '0',
                        isRequire: '1',
                    }
                ];
            }
            if (operateType === 'copyForMe') {
                copyForMeFormJson = [
                    {
                        name: 'cfmOpinion',
                        label: '评论意见',
                        type: 'textarea',
                        disabled: '0',
                    },
                    {
                        name: 'cfmImages',
                        label: '图片',
                        type: 'imageUpload',
                        disabled: '0',
                    },
                    {
                        name: 'cfmFiles',
                        label: '附件',
                        type: 'fileUpload',
                        disabled: '0',
                    },
                    {
                        name: 'cfmCopyFor',
                        label: '抄送',
                        type: 'copyFor',
                        disabled: '0',
                    }
                ];
            }
        }
        if (nextProps.approvalState !== this.props.approvalState) {
            approvalState = nextProps.approvalState;
        }
        this.setState({
            listId,
            instId,
            processId,
            auditTaskId,
            formJsonObj,
            modalVisible,
            auditFormJson,
            approvalState,
            auditedFormJson,
            copyForMeFormJson,
        });
    }

    componentDidMount() {
        this._getTreeData();
    }

    _getFormJosnByListId = (params) => {
        this.setState({isLoading: true});
        request(api.getFormJson, params, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                let processId = null;
                let formJsonObj = [];
                if (res.success) {
                    processId = res.data.id;
                    formJsonObj = res.data.formJsonObj.data;
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
                this.setState({
                    processId,
                    formJsonObj,
                    isLoading: false,
                }, () => {
                    console.log('this.state', this.state);
                });
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _getTreeData = () => {
        request(api.getTreeData, {type: '3'}, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    session.set('treeData', [res.data]);
                }
            })
            .catch(err => {
            });
    };

    _setModalVisible = (modalVisible, refresh = false) => {
        const {setModalVisible} = this.props;
        this.setState({modalVisible});
        setModalVisible && setModalVisible(modalVisible, refresh);
    };

    _handleSave = () => {
        //this._setModalVisible(false);
        this._getFileValue('save');
    };

    _handleSubmit = () => {
        //this._setModalVisible(false);
        this._getFileValue('submit');
    };

    _handleBack = () => {
        this._setModalVisible(false);
        const {history} = this.props;
        history && history.goBack();
    };

    _handleAuditReject = () => {
        this._getFileValue('reject');
    };

    _handleAuditPass = () => {
        this._getFileValue('pass');
    };

    _handleDownload = () => {
        const {instId} = this.state;
        if (!instId) {
            return;
        }
        const url = `${apiUrl}${api.downloadFile}`;
        const token = session.get('token');
        const obj = {
            instId: instId,
            token: token,
        };
        this._onDownloadFile(url + '?' + toQueryStr(obj));
    };

    _onDownloadFile = (fileUrl = undefined) => {
        if (!fileUrl) {
            return;
        }
        //DownloadFile(fileUrl);
        window.open(fileUrl);
    };

    _handleSubmitCopyFor = () => {
        this._getFileValue('audited');
    };

    _handleSubmitCopyForMe = () => {
        this._getFileValue('copyForMe');
    };

    _getFileValue = (handleType) => {
        const {form: {getFieldsValue, validateFields}} = this.props;
        const fieldsValue = getFieldsValue();
        console.log('fieldsValue', fieldsValue);
        validateFields((errors, values) => {
            if (!errors) {
                console.log('_getFileValue values', values);
                const {processId, instId, auditTaskId} = this.state;
                const objWithoutTempField = {};
                const keys = Object.keys(values);
                let newKeys = keys.filter(item => item.indexOf('_tempField') < 0);
                newKeys.forEach(item => {
                    objWithoutTempField[item] = values[item];
                });
                console.log('objWithoutTempField', objWithoutTempField);
                if (handleType === 'save' || handleType === 'submit') {
                    this._saveAndSubmitApproval({
                        handleType,
                        instId: instId,
                        processId: processId,
                        dataJson: JSON.stringify(objWithoutTempField),

                    });
                } else if (handleType === 'reject' || handleType === 'pass') {
                    this._rejectAddPassAudit({
                        handleType,
                        instId: instId,
                        dataJson: objWithoutTempField,
                    });
                } else if (handleType === 'audited') {
                    this._submitAuditedCopyFor({
                        handleType,
                        auditTaskId,
                        instId: instId,
                        dataJson: objWithoutTempField,
                    });
                } else if (handleType === 'copyForMe') {
                    this._submitCopyForMe({
                        auditTaskId,
                        instId: instId,
                        dataJson: objWithoutTempField,
                    });
                }
            } else {
                console.log('errors', errors);
                const values = Object.values(errors);
                for (let i = 0; i < values.length; i++) {
                    const {errors} = values[i];
                    const fieldObj = errors[0];
                    console.log('index', i);
                    message.info(fieldObj.message.replace(/:| ：/, ''));
                    return;
                }
            }
        });
    };

    _saveAndSubmitApproval = (params) => {
        let url = null;
        if (params.handleType === 'save') {
            url = api.saveApproval;
        } else if (params.handleType === 'submit') {
            url = api.submitApproval;
        }
        if (!url) {
            return;
        }
        this.setState({isLoading: true});
        const {handleType, ...others} = params;
        request(url, others, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    this._setModalVisible(false, true);
                } else {
                    const msg = res.message ? res.message : '请求失败';
                    message.error(msg);
                }
                this.setState({isLoading: false});
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _rejectAddPassAudit = (params) => {
        const {auditTaskId, auditNodeId, auditNodeType} = this.props;
        const {auditOpinion, auditCopyFor, ...others} = params.dataJson;
        const obj = {
            taskId: auditTaskId,
            nodeId: auditNodeId,
            nodeType: auditNodeType,
            instId: params.instId,
            dataJson: JSON.stringify({
                ...others,
                auditForm: {
                    auditResult: params.handleType,
                    auditOpinion: auditOpinion ? auditOpinion : '',
                    auditCopyFor: auditCopyFor ? auditCopyFor : '',
                }
            }),
        };
        console.log('obj', obj);
        this.setState({isLoading: true});
        request(api.rejectAndPassAudit, obj, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                let msg = '';
                if (res.success) {
                    msg = res.message ? res.message : '请求成功';
                    this.setState({
                        isLoading: false,
                    });
                    this._setModalVisible(false, true);
                } else {
                    msg = res.message ? res.message : '请求失败';
                }
                message.info(msg);
            })
            .catch(err => {
                console.log('err', err);
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _submitAuditedCopyFor = (params) => {
        const {auditedCopyFor, ...others} = params.dataJson;
        const obj = {
            instId: params.instId,
            taskId: params.auditTaskId,
            copyForSubmit: JSON.stringify(auditedCopyFor),
        };
        this.setState({isLoading: true});
        request(api.auditedCopyFor, obj, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                let msg = '';
                if (res.success) {
                    msg = res.message ? res.message : '请求成功';

                    this._setModalVisible(false, true);
                } else {
                    msg = res.message ? res.message : '请求失败';
                }
                this.setState({
                    isLoading: false,
                });
                message.info(msg);
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    _submitCopyForMe = (params) => {
        const {cfmOpinion, cfmCopyFor, cfmImages, cfmFiles, ...others} = params.dataJson;
        console.log(
            (cfmOpinion === undefined &&
                cfmCopyFor === undefined &&
                cfmImages === undefined &&
                cfmFiles === undefined)
        );
        if (
            cfmOpinion === undefined &&
            cfmCopyFor === undefined &&
            cfmImages === undefined &&
            cfmFiles === undefined
        ) {
            message.info('请填点儿什么吧！');
            return;
        }
        const obj = {
            taskId: params.auditTaskId,
            instId: params.instId,
            copyForSubmit: JSON.stringify({
                comment: cfmOpinion,
                copyPageFor: cfmCopyFor ? cfmCopyFor : '',
            }),
        };
        this.setState({isLoading: true});
        request(api.copyForMeSubmit, obj, 'post', session.get('token'))
            .then(res => {
                console.log('res', res);
                let msg = '';
                if (res.success) {
                    msg = res.message ? res.message : '请求成功';
                    this.setState({
                        isLoading: false,
                    });
                    this._setModalVisible(false, true);
                } else {
                    msg = res.message ? res.message : '请求失败';
                }
                message.info(msg);
            })
            .catch(err => {
                message.error('请求服务异常');
                this.setState({isLoading: false});
            });
    };

    render() {
        const {title = '', form, operateType, disabled} = this.props;
        const {
            modalVisible, isLoading, formJsonObj, instId, auditFormJson, auditTaskId, approvalState, auditedFormJson,
            copyForMeFormJson,
        } = this.state;
        const clientHeight = document.body.clientHeight;
        const modalHeight = `${clientHeight * 0.65}px`;
        const bodyStyle = {
            padding: '0',
        };
        const divStyle = {
            maxHeight: modalHeight,
            overflow: 'auto',
            padding: '0 24px 0 24px',
        };
        const auditStyle = {
            borderTopWidth: '1px',
            borderTopColor: '#d9d9d9',
            borderTopStyle: 'solid',
            width: '100%',
        };

        const saveBtn = <Button type='primary' onClick={this._handleSave}>保存</Button>;
        const submitBtn = <Button type='primary' onClick={this._handleSubmit}>提交</Button>;
        const backBtn = <Button onClick={this._handleBack}>返回</Button>;
        const passBtn = <Button type='primary' onClick={this._handleAuditReject}>拒绝</Button>;
        const refuseBtn = <Button type='primary' onClick={this._handleAuditPass}>通过</Button>;
        const downloadBtn = <Button type='primary' onClick={this._handleDownload}>下载审批单</Button>;
        const submitAuditedCopyForBtn = <Button type='primary' onClick={this._handleSubmitCopyFor}>提交抄送人</Button>;
        const submitCopyForMeBtn = <Button type='primary' onClick={this._handleSubmitCopyForMe}>提交</Button>;
        const footerArr = [];

        if (operateType === 'add' || operateType === 'edit') {
            footerArr.unshift(
                saveBtn,
                submitBtn,
                backBtn,
            );
        }

        if (operateType === 'check') {
            footerArr.unshift(
                backBtn,
            );
            if (approvalState === 'end') {
                footerArr.unshift(
                    downloadBtn,
                );
            }
        }

        if (operateType === 'audit') {
            footerArr.unshift(
                passBtn,
                refuseBtn,
                backBtn,
            );
        }

        if (operateType === 'audited') {
            footerArr.unshift(
                submitAuditedCopyForBtn,
                backBtn,
            );
            if (approvalState === 'end') {
                footerArr.unshift(
                    downloadBtn,
                );
            }
        }

        if (operateType === 'copyForMe') {
            footerArr.unshift(
                submitCopyForMeBtn,
                backBtn,
            );
            if (approvalState === 'end') {
                footerArr.unshift(
                    downloadBtn,
                );
            }
        }

        console.log('modal props', this.props);
        console.log('modal state', this.state);

        return (
            <div className='modal-page'>
                <Modal
                    title={title}
                    centered={true}
                    visible={modalVisible}
                    bodyStyle={bodyStyle}
                    footer={footerArr}
                    width='800px'
                    onCancel={() => this._setModalVisible(false)}
                    destroyOnClose={true}
                >
                    <div style={divStyle}>
                        <Spin size='large' spinning={isLoading}>
                            <RenderChildComponent
                                form={form}
                                instId={instId}
                                disabled={disabled}
                                itemArr={formJsonObj}
                                operateType={operateType}
                            />
                            {
                                operateType === 'audit' &&
                                <div style={auditStyle}>
                                    <RenderChildComponent
                                        form={form}
                                        instId={instId}
                                        disabled={disabled}
                                        itemArr={auditFormJson}
                                        operateType={operateType}
                                        auditTaskId={auditTaskId}
                                    />
                                </div>
                            }
                            {
                                operateType === 'audited' &&
                                <div style={auditStyle}>
                                    <RenderChildComponent
                                        form={form}
                                        instId={instId}
                                        disabled={disabled}
                                        itemArr={auditedFormJson}
                                        operateType={operateType}
                                        auditTaskId={auditTaskId}
                                    />
                                </div>
                            }
                            {
                                operateType === 'copyForMe' &&
                                <div style={auditStyle}>
                                    <RenderChildComponent
                                        form={form}
                                        instId={instId}
                                        disabled={disabled}
                                        itemArr={copyForMeFormJson}
                                        operateType={operateType}
                                        auditTaskId={auditTaskId}
                                    />
                                </div>
                            }
                        </Spin>
                    </div>
                </Modal>

            </div>
        )
    }
}

const MainForm = Form.create()(Main);
export default MainForm;
