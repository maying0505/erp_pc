import React from 'react'
import {Button, Popconfirm, message, Menu, Dropdown, Icon, Modal, Form, Input} from "antd";

import FAIcon from 'component/faicon'
import {hashHistory} from 'react-router'
import {request} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import api from 'api'

import './index.scss'

import UpdateModal from './UpdateModal.jsx'

import logoWithName from './logoWithName.png';
import logoWithoutName from './logoWithoutName.png';
import userPng from '../header/user.png';

const FormItem = Form.Item;

class HeaderForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // update modal
            updateModalVisible: false,
            updateModalConfirmLoading: false,
            initialUpdateValue: {},
            visible: false
        }

        this.logout = this.logout.bind(this)
        this.onToggle = this.onToggle.bind(this)
    }

    logout() {

        this.props.onSetLoading(true)
        // this.props.onSetLoading(false)
        // session.set('isLogin', false)
        // hashHistory.push('/login')
        // return
        request(api.loginOut, {}, 'get', session.get('token'))
            .then(res => {
                this.props.onSetLoading(false)
                if (res.success) {
                    session.set('isLogin', false)
                    hashHistory.push('/login')
                } else {
                    message.error(res.message)
                }
            })
            .catch(err => {
                console.log('error>>>', err)
                message.error(err.statusText)
                this.props.onSetLoading(false)
            })


    }

    onToggle() {
        this.props.onMiniChange(!this.props.miniMode)
    }

    //更新相关 UpdateModal
    handleUpdateModalCancel() {
        this.setState({
            updateModalVisible: false
        })
    }

    handleUpdateModalOk(data) {
        this.setState({
            updateModalConfirmLoading: true
        })
        console.log('update data:', data)

        delete data.confirm

        this.setState({
            updateModalVisible: false,
            updateModalConfirmLoading: false
        })
        message.success('修改成功')

        return
        // 异步操作
        request({
            url: '/updateUserPwd',
            type: 'post',
            data: {
                ...data,
            },
            dataType: 'json',
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    updateModalVisible: false,
                    updateModalConfirmLoading: false
                })
                message.success('修改成功')
            } else {
                this.setState({
                    updateModalConfirmLoading: false
                })
                message.error(res.msg)
            }
        }).catch(err => {
            this.setState({
                updateModalConfirmLoading: false
            })
            message.error(err.statusText)
        })
    }

    // open update modal
    showUpdateModal() {

        this.setState({
            isLoading: false,
            updateModalVisible: true,
            initialUpdateValue: {}

        })

    }

    handleMenuClick(e) {
        if (e.key === 'updatePwd') {
            this.showUpdateModal()
        }
    }
    onchangePassward = () =>{
        this.showModal()
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e)
        this.props.form.validateFields((err, values) => {
            request(api.passwordUpdate,{
                ...values,
            },'post',session.get('token'))
                .then(res => {
                    console.log(JSON.stringify(res))
                    if (res.success){
                            this.setState({
                                visible: false,
                            })
                            session.set('isLogin', false)
                            hashHistory.push('/login')
                            message.success(res.message)
                    } else {
                        message.error(res.message)
                    }
                })
                .catch(err => {
                    this.setState({visible: false})
                })
        })

    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    render() {
        const mini = this.props.miniMode;
        const { getFieldDecorator } = this.props.form;
        const userInfo = session.get('userInfo') || '你好';
        const userAvatar = session.get('userAvatar');

        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                {/* <Menu.Item key="updatePwd">修改密码</Menu.Item> */}
            </Menu>
        )

        return (
            <header className="yt-admin-framework-header clearfix">
                <div className="yt-admin-framework-header-brand mainIcon">
                    {/*<a>金控平台1.0</a>*/}
                    <img className='brand-logo' src={mini ? logoWithoutName : logoWithName} alt="logo"/>
                </div>
                <div className="yt-admin-framework-header-sidebar-toggle header-toggle">
                    <a href="javascript:void(0);" onClick={this.onToggle}>
                        {
                            mini ? <Icon type="menu-unfold"/> : <Icon type="menu-fold"/>
                        }
                        {/* <FAIcon name="bars" className="toggle-icon"/> */}
                    </a>
                </div>
                <ul className="yt-admin-framework-header-menu clearfix">
                    {
                        //     <li className="menu-item">
                        //     <a href="javascript:;">
                        //         <FAIcon name="leaf"/>
                        //         <span className="header-menu-text">叶子</span>
                        //     </a>
                        // </li>
                    }
                    <li className="menu-item">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a>
                                {/*<FAIcon name="user"/>*/}
                                <img style={{width: '25px', height: '25px'}}
                                     src={userAvatar ? userAvatar : userPng}
                                     alt="用户"
                                />
                                <span className="header-menu-text">{userInfo}</span>
                            </a>
                        </Dropdown>
                    </li>
                    <li className="menu-item">
                        <a href="javascript:;" onClick={this.onchangePassward}>
                            <Icon type="unlock" />
                            <span className="header-menu-text">修改密码</span>
                        </a>
                    </li>
                    <li className="menu-item">
                        <Popconfirm placement="bottomRight" title="您确定要退出系统吗？" onConfirm={this.logout} cancelText="取消"
                                    okText="确认">
                            <a href="javascript:;">
                                <FAIcon name="sign-out"/>
                                <span className="header-menu-text">退出系统</span>
                            </a>
                        </Popconfirm>
                    </li>
                </ul>
                <UpdateModal
                    initialValue={this.state.initialUpdateValue}
                    visible={this.state.updateModalVisible}
                    confirmLoading={this.state.updateModalConfirmLoading}
                    onCancel={this.handleUpdateModalCancel.bind(this)}
                    onOk={this.handleUpdateModalOk.bind(this)}
                />
                <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确认"
                    cancelText="取消"
                    onCancel={this.handleCancel}
                    >
                   <Form>
                        <FormItem
                            label="原密码"
                        >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Input type="password"/>
                        )}
                        </FormItem>
                        <FormItem
                            label="新密码"
                        >
                        {getFieldDecorator('newPassword', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Input type="password"/>
                        )}
                        </FormItem>
                        <FormItem
                            label="确认新密码"
                        >
                        {getFieldDecorator('verifyNewPassword', {
                            rules: [{ required: true, message: '必填' }],
                        })(
                            <Input type="password"/>
                        )}
                        </FormItem>
                    </Form>
                </Modal>
            </header>
        )
    }
}
const Header = Form.create()(HeaderForm);
export default Header
