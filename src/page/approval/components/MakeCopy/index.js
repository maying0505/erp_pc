import React from 'react';
import PropTypes from 'prop-types';
import {Tree, Modal, Icon, Button, Spin} from 'antd';

import {request} from 'common/request/request';
import {session} from 'common/util/storage';
import api from 'common/util/api';

import './index.less';

const {TreeNode} = Tree;

export default class MakeCopy extends React.Component {

    static  propTypes = {};

    static defaultProps = {};

    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        checkedValues: [],
        checkedTitles: [],
        selectedKeys: [],
        modalVisible: false,
        isLoading: false,
        treeData: null,
    };

    componentDidMount() {
        const {initialValue} = this.props;
        const {checkedKeys, checkedValues, checkedTitles} = this.state;
        if (initialValue) {
            initialValue.forEach(item => {
                checkedKeys.push(`${item.id}_${item.name}@1`);
                checkedValues.push(item.id);
                checkedTitles.push(item.name);
            });
            this.setState({
                checkedKeys,
                checkedValues,
                checkedTitles,
            });
        }
        const treeData = session.get('treeData');
        if (treeData) {
            this.setState({
                treeData,
            });
        } else {
            this.setState({
                isLoading: true,
            });
            this._getTreeData();
        }
    }

    _getTreeData = () => {
        request(api.getTreeData, {type: '3'}, 'post', session.get('token'))
            .then(res => {
                if (res.success) {
                    const treeData = [res.data];
                    session.set('treeData', treeData);
                    this.setState({
                        treeData,
                        isLoading: false,
                    });
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                });
            });
    };

    onExpand = (expandedKeys) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = (checkedKeys) => {
        let checkedKeyArr = [];
        let checkedTitleArr = [];
        let fieldObj = [];
        checkedKeys.forEach(item => {
            const obj = item.split('@');
            if (obj[1] === '1') {
                const userInfo = obj[0].split('_');
                const keys = userInfo[0];
                const title = userInfo[1];
                checkedKeyArr.push(keys);
                checkedTitleArr.push(title);
                fieldObj.push({
                    id: keys,
                    name: title,
                });
            }
        });
        this._setFieldsValue(fieldObj);
        this.setState({
            checkedKeys,
            checkedValues: checkedKeyArr,
            checkedTitles: checkedTitleArr,
        });
    };

    onSelect = (selectedKeys, info) => {
        this.setState({selectedKeys});
    };

    renderTreeNodes = data => data.map(item => {
        if (item.children) {
            return (
                <TreeNode
                    title={item.title}
                    key={`${item.key}_${item.title}@${item.isUser}`}
                    selectable={false}
                    dataRef={item}
                >
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode
            title={item.title}
            key={`${item.key}_${item.title}@${item.isUser}`}
            selectable={false}
        />;
    });

    _setModalVisible = (modalVisible) => {
        this.setState({
            modalVisible
        });
    };

    _handleOkPress = () => {
        this._setModalVisible(false);
    };

    _handleCancelPress = () => {
        this._setModalVisible(false);
    };

    _setFieldsValue = (obj) => {
        const {form: {setFieldsValue}, fieldName} = this.props;
        setFieldsValue({[fieldName]: obj});
    };

    render() {
        const {label, fieldName, initialValue, isRequired, disabled, form: {getFieldDecorator}} = this.props;
        const {modalVisible, isLoading, treeData, checkedTitles} = this.state;
        const clientHeight = document.body.clientHeight;
        const modalHeight = `${clientHeight * 0.55}px`;
        const bodyStyle = {
            padding: '0',
        };
        const divStyle = {
            maxHeight: modalHeight,
            minHeight: '240px',
            overflow: 'auto',
            padding: '0 24px 0 24px',
            width: '100%',
        };

        console.log('make copy this.props', this.props);
        console.log('make copy this.props', this.state);

        return (
            <div className='make-copy'>
                {
                    getFieldDecorator(fieldName, {
                        initialValue,
                        rules: [
                            {required: isRequired, message: `*${label}必填`}
                        ]
                    })(
                        <div>
                           <span className='user-view'>
                               {checkedTitles.toString()}
                           </span>
                            {
                                disabled === false &&
                                <Button type='dashed' disabled={disabled} onClick={() => this._setModalVisible(true)}>
                                    <Icon type='plus'/>
                                </Button>
                            }
                        </div>
                    )
                }
                <Modal
                    title='选择抄送人'
                    centered={true}
                    cancelText='取消'
                    okText='确认'
                    visible={modalVisible}
                    bodyStyle={bodyStyle}
                    onCancel={this._handleCancelPress}
                    onOk={this._handleOkPress}
                    destroyOnClose={true}
                >
                    <Spin size='large' spinning={isLoading}>
                        <div style={{width: '100%'}}>
                            <div style={divStyle}>
                                {
                                    treeData && treeData.length > 0 &&
                                    <Tree
                                        checkable
                                        onExpand={this.onExpand}
                                        expandedKeys={this.state.expandedKeys}
                                        autoExpandParent={this.state.autoExpandParent}
                                        onCheck={this.onCheck}
                                        checkedKeys={this.state.checkedKeys}
                                        onSelect={this.onSelect}
                                        selectedKeys={this.state.selectedKeys}
                                    >
                                        {this.renderTreeNodes(treeData)}
                                    </Tree>
                                }
                            </div>
                            {
                                checkedTitles.length > 0 &&
                                <div style={{bottom: '0px', padding: '10px'}}>
                                    已选：{checkedTitles.toString()}
                                </div>
                            }
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}
