import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, Divider, Row, Col, Button, message, Tabs, Icon  } from 'antd';
import api from 'api'
import { request, apiUrl } from 'common/request/request.js'
import { local, session } from 'common/util/storage.js'
const TabPane = Tabs.TabPane
const enterpriseReport = [
    {
        title: '基本信息',
        mainValues: ['qy_qiyegongshang'],
        children: [
            {
                title: '企业工商信息',
                value: 'qy_qiyegongshang',
                type: '3',
                children: [
                    {
                        name: '企业名称',
                        value: 'name',
                        style: 'long'
                    },
                    {
                        name: '工商注册号',
                        value: 'reg_no',
                    },
                    {
                        name: '统一社会信用代码',
                        value: 'credit_no',
                    },
                    {
                        name: '法定代表人',
                        value: 'oper_name',
                    },
                    {
                        name: '组织机构代码',
                        value: 'org_no',
                    },
                    {
                        name: '企业类型',
                        value: 'econ_kind',
                    },
                    {
                        name: '成立日期',
                        value: 'start_date',
                    },
                    {
                        name: '注册资本',
                        value: 'regist_capi',
                    },
                    {
                        name: '经营状态',
                        value: 'status',
                    },
                    {
                        name: '注册地址',
                        value: 'address',
                        style: 'long'
                    },
                    {
                        name: '经营范围',
                        value: 'scope',
                        style: 'long'
                    },
                    {
                        name: '登记机关',
                        value: 'belong_org',
                    },
                    {
                        name: '登记日期',
                        value: 'check_date',
                    }
                ]
            },
            {
                type: '5',
                title: '变更记录',
                childVal: 'changerecords',
                value: 'qy_qiyegongshang',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '变更事项',
                        value: 'change_item',
                    },
                    {
                        name: '变更前内容',
                        value: 'before_content',
                    },
                    {
                        name: '变更后内容',
                        value: 'after_content',
                    },
                    {
                        name: '变更日期',
                        value: 'change_date',
                    },
                ]
            },
            {
                type: '5',
                title: '主要成员',
                childVal: 'employees',
                value: 'qy_qiyegongshang',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '职位',
                        value: 'job_title',
                    },
                ]
            },
            {
                title: '经营异常',
                type: '5',
                value: 'qy_qiyegongshang',
                childVal: 'abnormal_items',
                children: [
                    {
                        name: '列入经营异常原因',
                        value: 'in_reason',
                    },
                    {
                        name: '移除经营异常原因',
                        value: 'out_reason',
                    },
                    {
                        name: '列入日期',
                        value: 'in_date',
                    },
                    {
                        name: '移除日期',
                        value: 'out_date',
                    },
                ]
            },
        ]
    },
    {
        title: '行政处罚及涉诉信息',
        mainValues: ['qy_beizhixingrenxiangqing', 'qy_qiyeshixinbeizhixing', 'qy_caipanwenshu', 'qy_fayuangonggao', 'qy_sifapaimai', 'qy_qiyekaitinggonggao', 'qy_sifaxiezhu', 'qy_qiyeqianshui'],
        children: [
            {
                title: '被执行人信息',
                type: '5',
                value: 'qy_beizhixingrenxiangqing',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '案号',
                        value: 'case_number',
                    },
                    {
                        name: '执行法院',
                        value: 'court',
                    },
                    {
                        name: '立案时间',
                        value: 'case_date',
                    },
                ]
            },
            {
                title: '失信被执行人',
                type: '5',
                value: 'qy_qiyeshixinbeizhixing',
                // childVal: 'dishonests',
                children: [
                    {
                        name: '执行法院',
                        value: 'executiveCourt',
                    },
                    {
                        name: '省份',
                        value: 'province',
                    },
                    {
                        name: '执行依据文号',
                        value: 'executiveBaiscNo',
                    },
                    {
                        name: '立案时间',
                        value: 'filingTime',
                    },
                    {
                        name: '案号',
                        value: 'caseNo',
                    },
                    {
                        name: '作出执行依据单位',
                        value: 'executiveArm',
                    },
                    {
                        name: '生效法律文书确定的义务',
                        value: 'legalObligation',
                    },
                    {
                        name: '被执行履行情况',
                        value: 'executiveCase',
                    },
                    {
                        name: '发布时间',
                        value: 'releaseTime',
                    },
                ]
            },
            {
                title: '判决文书信息',
                type: '5',
                value: 'qy_caipanwenshu',
                children: [
                    {
                        name: '案号',
                        value: 'case_no',
                    },
                    {
                        name: '类型',
                        value: 'type',
                    },
                    {
                        name: '标题',
                        value: 'title',
                    },
                    {
                        name: '正文',
                        value: 'case_cause',
                    },
                    {
                        name: '日期',
                        value: 'date',
                    },
                ]
            },
            {
                title: '法院公告信息',
                type: '5',
                value: 'qy_fayuangonggao',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '类型',
                        value: 'type',
                    },
                    {
                        name: '法院',
                        value: 'court',
                    },
                    {
                        name: '正文',
                        value: 'content',
                    },
                    {
                        name: '公告时间',
                        value: 'date',
                    },
                ]
            },
            {
                title: '司法拍卖信息',
                type: '5',
                value: 'qy_sifapaimai',
                children: [
                    {
                        name: '拍卖名称',
                        value: 'full_name',
                    },
                    {
                        name: '起拍价',
                        value: 'start_price',
                    },
                    {
                        name: '拍卖时间',
                        value: 'date',
                    },
                    {
                        name: '处置法院',
                        value: 'court',
                    },
                ]
            },
            {
                title: '开庭公告',
                type: '5',
                value: 'qy_qiyekaitinggonggao',
                children: [
                    {
                        name: '案号',
                        value: 'case_no',
                    },
                    {
                        name: '法庭',
                        value: 'court',
                    },
                    {
                        name: '开庭日期',
                        value: 'hearing_date',
                    },
                    {
                        name: '案由',
                        value: 'case_reason',
                    },
                    {
                        name: '承办部门',
                        value: 'department',
                    },
                    {
                        name: '审判长',
                        value: 'judge',
                    },
                    {
                        name: '上诉人',
                        value: 'plaintiff',
                    },
                    {
                        name: '被上诉人',
                        value: 'defendant',
                    },
                ]
            },
            {
                title: '司法协助',
                type: '5',
                value: 'qy_sifaxiezhu',
                children: [
                    {
                        name: '序号',
                        value: 'seq_no',
                    },
                    {
                        name: '被执行人',
                        value: 'be_executed_person',
                    },
                    {
                        name: '股权数额',
                        value: 'amount',
                    },
                    {
                        name: '执行法院',
                        value: 'executive_court',
                    },
                    {
                        name: '执行通知书文号',
                        value: 'detail',
                        childVal: 'notice_no',
                        childValType: '2'
                    },
                    {
                        name: '类型|状态',
                        value: 'type',
                    },
                ]
            },
            {
                title: '欠税信息',
                type: '5',
                value: 'qy_qiyeqianshui',
                children: [
                    {
                        name: '纳税人识别号',
                        value: 'taxpayer_num',
                    },
                    {
                        name: '欠税税种',
                        value: 'overdue_type',
                    },
                    {
                        name: '欠税余额',
                        value: 'overdue_amount',
                    },
                    {
                        name: '当前新发生的欠税额',
                        value: 'curr_overdue_amount',
                    },
                    {
                        name: '发布时间',
                        value: 'pub_date',
                    },
                ]
            },
        ]
    },
    {
        title: '投资信息',
        mainValues: ['qy_qiyeduiwaitouzi', 'qy_qiyefarenduiwaitouzi','qy_qiyegudongjichuziqingkuang'],
        children: [
            {
                type: '5',
                title: '企业对外投资',
                childVal: 'entinvItemList',
                value: 'qy_qiyeduiwaitouzi',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '企业名称',
                        value: 'entName',
                    },
                    {
                        name: '营业执照',
                        value: 'regNo',
                    },
                    {
                        name: '企业类型',
                        value: 'entType',
                    },
                    {
                        name: '企业状态',
                        value: 'entStatus',
                    },
                    {
                        name: '注册资本（万元）',
                        value: 'regCap',
                    },
                    {
                        name: '出资比例',
                        value: 'fundedRatio',
                    },
                    {
                        name: '法定代表人',
                        value: 'name',
                    },
                ]
            },
            {
                type: '5',
                title: '法定代表人对外投资信息',
                childVal: 'frinvList',
                value: 'qy_qiyefarenduiwaitouzi',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '企业名称',
                        value: 'entName',
                    },
                    {
                        name: '营业执照',
                        value: 'regNo',
                    },
                    {
                        name: '开业日期',
                        value: 'esDate',
                    },
                    {
                        name: '企业状态',
                        value: 'entStatus',
                    },
                    {
                        name: '注册资本（万元）',
                        value: 'regCap',
                    },
                    {
                        name: '认缴出资额（万元）',
                        value: 'subConam',
                    },
                    {
                        name: '出资比例',
                        value: 'fundedRatio',
                    },
                    {
                        name: '法定代表人',
                        value: 'frName',
                    },
                ]
            },
            {
                type: '5',
                title: '法定代表人在外任职信息',
                childVal: 'frPositionList',
                value: 'qy_qiyefarenduiwaitouzi',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '企业名称',
                        value: 'entName',
                    },
                    {
                        name: '营业执照',
                        value: 'regNo',
                    },
                    {
                        name: '开业日期',
                        value: 'esDate',
                    },
                    {
                        name: '企业状态',
                        value: 'entStatus',
                    },
                    {
                        name: '注册资本（万元）',
                        value: 'regCap',
                    },
                    {
                        name: '职务',
                        value: 'position',
                    },
                    {
                        name: '法定代表人',
                        value: 'frName',
                    },
                ]
            },
            {
                type: '5',
                title: '股东信息',
                childVal: 'shareHolderList',
                value: 'qy_qiyegudongjichuziqingkuang',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '股东',
                        value: 'shareholderName',
                    },
                    {
                        name: '股东类型',
                        value: 'invtype',
                    },
                    // {
                    //     name: '证照/证件类型',
                    //     value: 'identify_type',
                    // },
                    // {
                    //     name: '证照/证件号码',
                    //     value: 'identify_no',
                    // },
                    {
                        name: '认缴出资额（万元）',
                        value: 'subConam',
                    },
                    {
                        name: '币种',
                        value: 'regCapCur',
                    },
                    {
                        name: '出资比例',
                        value: 'fundedRatio',
                    },
                    {
                        name: '认缴出资日期',
                        value: 'conDate',
                    },
                ]
            },
        ]
    },
    {
        title: '融资信息',
        mainValues: ['qy_guquandongjie', 'qy_dongchandiya', 'qy_guquanchuzhi'],
        children: [
            {
                title: '动产抵押',
                type: '5',
                value: 'qy_dongchandiya',
                children: [
                    {
                        name: '登记编号',
                        value: 'number',
                    },
                    {
                        name: '登记日期',
                        value: 'date',
                    },
                    {
                        name: '登记机关被担保债权种类',
                        value: 'type',
                    },
                    {
                        name: '债权数额',
                        value: 'amount',
                    },
                    {
                        name: '债务期限',
                        value: 'period',
                    },
                    {
                        name: '担保范围',
                        value: 'scope',
                    },
                    {
                        name: '备注',
                        value: 'remarks',
                    },
                ]
            },
            {
                title: '股权出质',
                type: '5',
                value: 'qy_guquanchuzhi',
                children: [
                    {
                        name: '登记编号',
                        value: 'number',
                    },
                    {
                        name: '状态',
                        value: 'status',
                    },
                    {
                        name: '出质人',
                        value: 'pledgor',
                    },
                    {
                        name: '出质人证件号码',
                        value: 'pledgor_identify_no',
                    },
                    {
                        name: '出质股权数',
                        value: 'pledgor_amount',
                    },
                    {
                        name: '质权人',
                        value: 'pawnee',
                    },
                    {
                        name: '质权人证件号码',
                        value: 'pawnee_identify_no',
                    },
                    {
                        name: '登记日期',
                        value: 'date',
                    },
                ]
            },
            {
                title: '股权冻结',
                type: '5',
                value: 'qy_guquandongjie',
                children: [
                    {
                        name: '序号',
                        value: 'seq_no',
                    },
                    {
                        name: '被执行人',
                        value: 'be_executed_person',
                    },
                    {
                        name: '股权数额',
                        value: 'amount',
                    },
                    {
                        name: '执行法院',
                        value: 'executive_court',
                    },
                    {
                        name: '执行通知书文号',
                        value: 'detail',
                        childVal: 'notice_no',
                        childValType: '2'
                    },
                    {
                        name: '类型|状态',
                        value: 'type',
                    },
                ]
            },
        ]
    },
    {
        title: '系统记录',
        mainValues: ['qy_recordPhone','qy_recordCertificateNo'],
        children: [
            {
                type: '5',
                title: '联系号码关联',
                value: 'qy_recordPhone',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '证件号码',
                        value: 'cardNo',
                    },
                    {
                        name: '	案件编号',
                        value: 'contractNo',
                    },
                    {
                        name: '	类型',
                        value: 'type',
                    },
                    {
                        name: '案件状态',
                        value: 'state',
                    },
                    {
                        name: '	放款日期',
                        value: 'startDate',
                    },
                    {
                        name: '逾期情况',
                        value: 'overdue',
                    },
                ]
            },
            {
                type: '5',
                title: '证件号码关联',
                value: 'qy_recordCertificateNo',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '联系号码',
                        value: 'phone',
                    },
                    {
                        name: '	案件编号',
                        value: 'contractNo',
                    },
                    {
                        name: '	类型',
                        value: 'type',
                    },
                    {
                        name: '案件状态',
                        value: 'state',
                    },
                    {
                        name: '	放款日期',
                        value: 'startDate',
                    },
                    {
                        name: '逾期情况',
                        value: 'overdue',
                    },
                ]
            },
        ]
    },
    // {
    //     title: '资质专利信息',
    //     children: [
    //         {
    //             title: '商标信息',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '注册号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '名称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '商品/服务列表',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '状态',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '使用权限',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '专利信息',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '标题',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '类型',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '申请公布号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '申请公布日',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '软件著作权信息',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '登记号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '分类号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '软件全称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '软件简称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '版本号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '著作权人',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '登记批准日期',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '著作权信息',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '著作权登记号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '登记日期',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '作品名称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '类别',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '著作权人',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '完成日期',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '首次发布日期',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '资质认证',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '类别证书',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '发证日期',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '截止日期',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '证书编号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '状态',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '备注',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '域名信息',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '域名',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '备案号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '网站名称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '审核时间',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '招投标',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '域名',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '所属区域',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '项目分类',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '发布时间',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '招聘信息',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '序号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '职位名称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '工作地点',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '薪资',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '发布时间',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '行政许可证',
    //             type: '5',
    //             value: '',
    //             children: [
    //                 {
    //                     name: '行政许可证编号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '许可文件名称',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '有限期自',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '有限期至',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '许可机关',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '许可内容',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //     ]
    // },
]
const personalReport = [
    // {
    //     title: '个人身份验证',
    //     children: [
    //         {
    //             title: '手机号码验证',
    //             type: '1',
    //             children_two: [
    //                 {
    //                     name: '认证结果',
    //                     value: ''
    //                 },
    //                 {
    //                     name: '描述',
    //                     value: ''
    //                 }
    //             ],
    //             children_one: [
    //                 {
    //                     name: '用户填写',
    //                     children: [
    //                         {
    //                             name: '姓名',
    //                             value: ''
    //                         },
    //                         {
    //                             name: '身份证号码',
    //                             value: ''
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: '查询所得内容',
    //                     children: [
    //                         {
    //                             name: '姓名',
    //                             value: ''
    //                         },
    //                         {
    //                             name: '身份证号码',
    //                             value: ''
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             title: '银行卡验证',
    //             type: '1',
    //             children_two: [
    //                 {
    //                     name: '认证结果',
    //                     value: ''
    //                 },
    //                 {
    //                     name: '描述',
    //                     value: ''
    //                 }
    //             ],
    //             children_one: [
    //                 {
    //                     name: '用户填写',
    //                     children: [
    //                         {
    //                             name: '姓名',
    //                             value: ''
    //                         },
    //                         {
    //                             name: '身份证号码',
    //                             value: ''
    //                         },
    //                         {
    //                             name: '手机号',
    //                             value: ''
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: '查询所得内容',
    //                     children: [
    //                         {
    //                             name: '姓名',
    //                             value: ''
    //                         },
    //                         {
    //                             name: '身份证号码',
    //                             value: ''
    //                         },
    //                         {
    //                             name: '手机号',
    //                             value: ''
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // },
    {
        title: '央行征信、失信被执行及涉案记录',
        mainValues: ['gr_yanghangzhengxin', 'gr_sheanxiangqing', 'gr_gerenshixinbeizhixing'],
        children: [
            {
                title: '信贷记录',
                type: '4',
                value: 'gr_yanghangzhengxin',
                childVal: 'creditRecord',
                children_two: {
                    value: 'detail',
                    childText: {
                        type: 'type',
                        headTitle: 'headTitle',
                        item: 'item'
                    }
                },
                children_one: {
                    value: 'summary',
                    showValue : 'count',
                    childTextX : [
                        {
                            name: '信用卡',
                            value: 'type'
                        },
                        {
                            name: '购房贷款',
                            value: 'type'
                        },
                        {
                            name: '其他贷款',
                            value: 'type'
                        },
                    ],
                    childTextY : [
                        {
                            name: '账户数',
                            style: 'flex-pack-left',
                            value: 'var'
                        },
                        {
                            name: '未结清/未销户账户数',
                            style: 'flex-pack-left text-indent2',
                            value: 'var'
                        },
                        {
                            name: '发生过逾期的账户数',
                            style: 'flex-pack-left',
                            value: 'var'
                        },
                        {
                            name: '发生过90天以上逾期的账户数',
                            style: 'flex-pack-left text-indent2',
                            value: 'var'
                        },
                        {
                            name: '为他人担保笔数',
                            style: 'flex-pack-left',
                            value: 'var'
                        },
                    ]
                }
            },
            {
                title: '欠税记录',
                type: '5',
                value: 'gr_yanghangzhengxin',
                childVal: 'publicRecord',
                childVal_v: 'taxArrearsRecords',
                children: [
                    {
                        name: '主管税务机关',
                        value: 'taxOffice'
                    },
                    {
                        name: '欠税时间',
                        value: 'statisticalTime'
                    },
                    {
                        name: '欠税总额',
                        value: 'amt'
                    },
                    {
                        name: '纳税人识别号',
                        value: 'taxpayerNo'
                    }
                ]
            },
            {
                title: '民事判决记录',
                type: '5',
                value: 'gr_yanghangzhengxin',
                childVal: 'publicRecord',
                childVal_v: 'civilJudgmentRecords',
                children: [
                    {
                        name: '立案法院',
                        value: 'executiveCourt'
                    },
                    {
                        name: '案号',
                        value: 'caseNo'
                    },
                    {
                        name: '案由',
                        value: 'caseCause'
                    },
                    {
                        name: '结案方式',
                        value: 'closedWay'
                    },
                    {
                        name: '立案时间',
                        value: 'filingTime'
                    },
                    {
                        name: '判决/调解结果',
                        value: 'judgmentResult'
                    },
                    {
                        name: '诉讼标的',
                        value: 'actionObject'
                    },
                    {
                        name: '判决/调解生效时间',
                        value: 'judgmentEffectTime'
                    },
                    {
                        name: '诉讼标的金额',
                        value: 'actionObjectAmt'
                    },
                ]
            },
            {
                title: '强制执行记录',
                type: '5',
                value: 'gr_yanghangzhengxin',
                childVal: 'publicRecord',
                childVal_v: 'enforcementRecords',
                children: [
                    {
                        name: '立案法院',
                        value: 'executiveCourt'
                    },
                    {
                        name: '案号',
                        value: 'caseNo'
                    },
                    {
                        name: '案由',
                        value: 'caseCause'
                    },
                    {
                        name: '结案方式',
                        value: 'closedWay'
                    },
                    {
                        name: '立案时间',
                        value: 'filingTime'
                    },
                    {
                        name: '案件状态',
                        value: 'caseStatus'
                    },
                    {
                        name: '申请执行标的',
                        value: 'actionObject'
                    },
                    {
                        name: '已执行标的',
                        value: 'executedObject'
                    },
                    {
                        name: '申请执行标的金额',
                        value: 'actionObjectAmt'
                    },
                    {
                        name: '已执行标的金额',
                        value: 'executedObjectAmt'
                    },
                    {
                        name: '结案时间',
                        value: 'closedTime'
                    },
                ]
            },
            {
                title: '行政处罚记录',
                type: '5',
                value: 'gr_yanghangzhengxin',
                childVal: 'publicRecord',
                childVal_v: 'administrativePenaltyRecords',
                children: [
                    {
                        name: '处罚机构',
                        value: 'penaltyOffice'
                    },
                    {
                        name: '文书编号',
                        value: 'basicNo'
                    },
                    {
                        name: '处罚内容',
                        value: 'penaltyContent'
                    },
                    {
                        name: '是否行政复议',
                        value: 'isReview'
                    },
                    {
                        name: '处罚金额',
                        value: 'penaltyAmt'
                    },
                    {
                        name: '行政复议结果',
                        value: 'reviewResult'
                    },
                    {
                        name: '处罚生效时间',
                        value: 'penaltyEffectTime'
                    },
                    {
                        name: '处罚截止时间',
                        value: 'penaltyEndTime'
                    },
                ]
            },
            {
                title: '查询记录',
                type: '6',
                value: 'gr_yanghangzhengxin',
                childVal: 'searchRecord',
                childVal_v: 'searchRecordDet',
                childVal_v_v: 'item',
                childVal_v_title: ['个人查询记录明细','机构查询记录明细'],
                children: [
                    {
                        name: '编号',
                        value: 'no'
                    },
                    {
                        name: '查询日期',
                        value: 'time'
                    },
                    {
                        name: '查询操作员',
                        value: 'user'
                    },
                    {
                        name: '查询原因',
                        value: 'reason'
                    },
                ]
            },
            {
                title: '涉案详情',
                type: '3',
                childValType: '1',
                value: 'gr_sheanxiangqing',
                children: [
                    {
                        name: '法院名称',
                        value: 'court'
                    },
                    {
                        name: '法院等级',
                        value: 'court_type'
                    },
                    {
                        name: '案号',
                        value: 'jnum'
                    },
                    {
                        name: '案件类别',
                        value: 'jtype'
                    },
                    {
                        name: '案件标题',
                        value: 'title'
                    },
                    {
                        name: '审结时间',
                        value: 'judge_date'
                    },
                    {
                        name: '审理程序',
                        value: 'jprocess'
                    },
                    {
                        name: '当事人',
                        value: 'danshiren'
                    },
                    {
                        name: '原告',
                        value: 'yuangao'
                    },
                    {
                        name: '被告',
                        value: 'beigao'
                    },
                    {
                        name: '上诉人',
                        value: 'shangshuren'
                    },
                    {
                        name: '被上诉人',
                        value: 'beishangshuren'
                    },
                    {
                        name: '当事人身份证',
                        value: 'identity_card'
                    },
                    {
                        name: '案由',
                        value: 'jcase'
                    },
                    {
                        name: '委托辩护人',
                        value: 'weitobianhuren'
                    },
                    {
                        name: '案件摘要',
                        value: 'jsummary'
                    },
                    {
                        name: '判决结果',
                        value: 'result_str'
                    },
                    {
                        name: '匹配度',
                        value: 'matchfit'
                    },
                ]
            },
            {
                title: '失信被执行记录',
                type: '5',
                value: 'gr_gerenshixinbeizhixing',
                // childVal: 'dishonests',
                children: [
                    {
                        name: '序号',
                        value: 'no'
                    },
                    {
                        name: '立案时间',
                        value: 'filingTime'
                    },
                    {
                        name: '被执行人姓名/名称',
                        value: 'name'
                    },
                    {
                        name: '案号',
                        value: 'caseNo'
                    },
                    {
                        name: '身份证号码/组织机构代码',
                        value: 'identityNo'
                    },
                    {
                        name: '做出执行依据单位',
                        value: 'executiveArm'
                    },
                    {
                        name: '性别（个人）',
                        value: 'sex'
                    },
                    {
                        name: '生效法律文书确定的义务',
                        value: 'legalObligation'
                    },
                    {
                        name: '年龄（个人）',
                        value: 'age'
                    },
                    {
                        name: '被执行人的履行情况',
                        value: 'executiveCase'
                    },
                    {
                        name: '执行法院',
                        value: 'executiveCourt'
                    },
                    {
                        name: '具体情形',
                        value: 'specificSituation'
                    },
                    {
                        name: '省份',
                        value: 'province'
                    },
                    {
                        name: '发布时间',
                        value: 'releaseTime'
                    },
                    {
                        name: '执行依据文号',
                        value: 'executiveBaiscNo'
                    },
                ]
            },
        ]
    },
    {
        title: '公积金记录',
        mainValues: ['gr_gongjijin'],
        children: [
            {
                title: '基本信息',
                type: '3',
                value: 'gr_gongjijin',
                children: [
                    {
                        name: '公积金账户',
                        value: 'acctNo',
                        style: 'long'
                    },
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '身份证',
                        value: 'identityNo',
                    },
                    {
                        name: '单位姓名',
                        value: 'corpName',
                    },
                    {
                        name: '账户余额',
                        value: 'bal',
                    },
                    {
                        name: '月缴存',
                        value: 'monthlyDeposit',
                    },
                    {
                        name: '缴存基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '末次缴存年份',
                        value: 'lastDepostDate',
                    },
                    {
                        name: '账号状态',
                        value: 'accStatus',
                    },
                    {
                        name: '个人缴存比例',
                        value: 'personMonthlyScale',
                    },
                    {
                        name: '单位缴存比例',
                        value: 'unitMonthlyScale',
                    },
                    {
                        name: '开户日期',
                        value: 'openDate',
                    },
                    {
                        name: '地区',
                        value: 'area',
                    }
                ]
            },
            {
                title: '缴存明细',
                value: 'gr_gongjijin',
                childVal: 'details',
                type: '5',
                children: [
                    {
                        name: '日期',
                        value: 'accDate',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '金额',
                        value: 'amt',
                    },
                    {
                        name: '余额',
                        value: 'bal',
                    },
                    {
                        name: '缴存基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '缴存年月',
                        value: 'payMonth',
                    },
                    {
                        name: '业务描述',
                        value: 'bizDesc',
                    },
                ]
            },
            {
                title: '贷款信息',
                type: '3',
                value: 'gr_gongjijin',
                childVal: 'loadInfo',
                children: [
                    {
                        name: '贷款账号',
                        value: 'loadAccNo',
                    },
                    {
                        name: '贷款期限（月）',
                        value: 'loadLimit',
                    },
                    {
                        name: '贷款总额',
                        value: 'loadAll',
                    },
                    {
                        name: '贷款余额',
                        value: 'loadBal',
                    },
                    {
                        name: '还款方式',
                        value: 'paymentMethod',
                    },
                    {
                        name: '末次还款年月',
                        value: 'lastPaymentDate',
                    },
                    {
                        name: '贷款状态',
                        value: 'loadStatus',
                    },
                    {
                        name: '开户日期',
                        value: 'openDate',
                    },
                ]
            },
        ]
    },
    {
        title: '社保记录',
        mainValues: ['gr_shebao'],
        children: [
            {
                title: '基本信息',
                type: '3',
                value: 'gr_shebao',
                children: [
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '身份证号',
                        value: 'identityNo',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '开户日期',
                        value: 'openDate',
                    },
                    {
                        name: '账户状态',
                        value: 'accStatus',
                    },
                ]
            },
            {
                title: '累计缴费',
                type: '5',
                value: 'gr_shebao',
                childVal: 'insurances',
                children: [
                    {
                        name: '险种',
                        value: 'insuranceType',
                        childValType: '3'
                    },
                    {
                        name: '账户余额',
                        value: 'bal'
                    },
                    {
                        name: '累计缴纳月数',
                        value: 'sumPayMonth'
                    },
                    {
                        name: '余额截止日期',
                        value: 'dueToMonth'
                    },
                    {
                        name: '账号状态',
                        value: 'accStatus'
                    },
                ]
            },
            {
                title: '养老保险存缴明细',
                type: '5',
                value: 'gr_shebao',
                childVal: 'pensionDetails',
                children: [
                    {
                        name: '日期',
                        value: 'accDate',
                    },
                    {
                        name: '缴费金额',
                        value: 'amt',
                    },
                    {
                        name: '缴费基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '缴费年月',
                        value: 'payMonth',
                    },
                ]
            },
            {
                title: '医疗保险存缴明细',
                type: '5',
                value: 'gr_shebao',
                childVal: 'medicareDetails',
                children: [
                    {
                        name: '日期',
                        value: 'accDate',
                    },
                    {
                        name: '缴费金额',
                        value: 'amt',
                    },
                    {
                        name: '缴费基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '缴费年月',
                        value: 'payMonth',
                    },
                ]
            },
            {
                title: '失业保险存缴明细',
                type: '5',
                value: 'gr_shebao',
                childVal: 'jobSecurityDetails',
                children: [
                    {
                        name: '日期',
                        value: 'accDate',
                    },
                    {
                        name: '缴费金额',
                        value: 'amt',
                    },
                    {
                        name: '缴费基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '缴费年月',
                        value: 'payMonth',
                    },
                ]
            },
            {
                title: '生育保险存缴明细',
                type: '5',
                value: 'gr_shebao',
                childVal: 'maternityDetails',
                children: [
                    {
                        name: '日期',
                        value: 'accDate',
                    },
                    {
                        name: '缴费金额',
                        value: 'amt',
                    },
                    {
                        name: '缴费基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '缴费年月',
                        value: 'payMonth',
                    },
                ]
            },
            {
                title: '工伤保险存缴明细',
                type: '5',
                value: 'gr_shebao',
                childVal: 'employmentInjuryDetails',
                children: [
                    {
                        name: '日期',
                        value: 'accDate',
                    },
                    {
                        name: '缴费金额',
                        value: 'amt',
                    },
                    {
                        name: '缴费基数',
                        value: 'baseDeposit',
                    },
                    {
                        name: '单位名称',
                        value: 'corpName',
                    },
                    {
                        name: '缴费年月',
                        value: 'payMonth',
                    },
                ]
            },
        ]
    },
    // {
    //     title: '信用卡账单',
    //     children: [
    //         {
    //             title: '基本信息',
    //             type: '3',
    //             children: [
    //                 {
    //                     name: '姓名',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '信用额度',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '银行',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '可提现额度',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '卡号',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '账单分期',
    //             type: '3',
    //             children: [
    //                 {
    //                     name: '分期日期',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '分期总金额',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '总期数',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '每期本金',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '每期手续费',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '每期总还款金额',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //         {
    //             title: '最近三个月账单',
    //             type: '3',
    //             children: [
    //                 {
    //                     name: '到期还款日',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '本期应还金额',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '本期消费总金额',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '上期应还金额',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '上期还款金额',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '最低还款',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '交易明细日期',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '币种',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '交易卡号',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '交易描述',
    //                     value: '',
    //                 },
    //                 {
    //                     name: '交易金额',
    //                     value: '',
    //                 },
    //             ]
    //         },
    //     ]
    // },
    {
        title: '网银流水',
        mainValues: ['gr_wangyinliushui'],
        children: [
            {
                title: '基本信息',
                type: '3',
                value: 'gr_wangyinliushui',
                children: [
                    {
                        name: '姓名',
                        value: 'realName',
                    },
                    {
                        name: '身份证号',
                        value: 'identityNo',
                    },
                    {
                        name: '手机号',
                        value: 'mobile',
                    },
                ]
            },
            {
                title: '网银流水信息',
                type: '3',
                value: 'gr_wangyinliushui',
                childVal: 'cards',
                arrayIndex : '0',
                children: [
                    {
                        name: '卡号',
                        value: 'cardNo',
                    },
                    {
                        name: '开户时间',
                        value: 'openDate',
                    },
                    {
                        name: '账号类型',
                        value: 'accType',
                    },
                    {
                        name: '支出金额总计',
                        value: 'zhiChu',
                    },
                    {
                        name: '币种',
                        value: 'currency;',
                    },
                    {
                        name: '月均支出金额',
                        value: 'meanZhiChu',
                    },
                    {
                        name: '余额',
                        value: 'balance',
                    },
                    {
                        name: '存入金额总计',
                        value: 'shouRu',
                    },
                    {
                        name: '可用余额',
                        value: 'availableBalance',
                    },
                    {
                        name: '月均存入金额',
                        value: 'meanShouRu',
                    },
                ]
            },
            {
                title: '交易明细',
                type: '5',
                value: 'gr_wangyinliushui',
                childVal: 'cards',
                childVal_v: 'bills',
                arrayIndex : '0',
                children: [
                    {
                        name: '交易时间',
                        value: 'trdDate',
                    },
                    {
                        name: '交易账户名称',
                        value: 'counterparty',
                    },
                    {
                        name: '交易金额',
                        value: 'amt',
                    },
                    {
                        name: '交易币种',
                        value: 'currency',
                    },
                    {
                        name: '交易类型',
                        value: 'trdType',
                    },
                    {
                        name: '交易摘要',
                        value: 'remark',
                    },
                ]
            },
        ]
    },
    {
        title: '运营商报告',
        mainValues: ['gr_yunyinshangbaogao'],
        children: [
            {
                type: '5',
                title: '风险清单检测',
                value: 'gr_yunyinshangbaogao',
                childVal: 'riskListCheck',
                children: [
                    {
                        name: '项目',
                        value: 'desc',
                    },
                    {
                        name: '命中次数',
                        value: 'result',
                        style: 'red-style',
                        unit: '次'
                    },
                ]
            },
            {
                type: '2',
                title: '信贷逾期',
                value: 'gr_yunyinshangbaogao',
                childVal: 'overdueLoanCheck',
                children: [
                    {
                        name: '类别',
                        value: 'desc',
                        width: '30'
                    },
                    {
                        name: '内容',
                        value: 'details',
                        width: '70',
                        childText: [
                            {
                                children: [
                                    {
                                        name: '逾期金额',
                                        value: 'overdueAmt',
                                        style: 'red-style',
                                        unit: '元；'
                                    },
                                    {
                                        name: '逾期天数',
                                        value: 'overdueDays',
                                        style: 'red-style',
                                        unit: '天；'
                                    },
                                    {
                                        name: '逾期时间',
                                        value: 'overdueTime',
                                        style: 'red-style'
                                    },
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                type: '2',
                title: '多头借贷',
                value: 'gr_yunyinshangbaogao',
                childVal: 'multiLendCheck',
                children: [
                    {
                        name: '类别',
                        value: 'desc',
                        width: '30'
                    },
                    {
                        name: '内容',
                        value: 'details',
                        width: '70',
                        childText: [
                            {
                                children: [
                                    {
                                        value: 'lendType',
                                        name: ''
                                    },
                                    {
                                        value: 'lendCnt',
                                        name: '',
                                        unit: '次',
                                        style: 'red-style'
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                type: '2',
                title: '风险通话监测',
                value: 'gr_yunyinshangbaogao',
                childVal: 'riskCallCheck',
                children: [
                    {
                        name: '风险项',
                        value: 'desc',
                        width: '25'
                    },
                    {
                        name: '通话频率',
                        value: 'details',
                        titleVal: 'hitDesc',
                        childText: [
                            {
                                children:[
                                    {
                                        name: '',
                                        value: 'callTag',
                                    },
                                ]
                            },
                        ],
                        width: '25'
                    },
                    {
                        name: '通话次数',
                        value: 'details',
                        unit: '次',
                        style: 'red-style',
                        titleVal: 'cnt',
                        childText: [
                            {
                                children:[
                                    {
                                        name: '',
                                        value: 'callType',
                                    },
                                    {
                                        name: '',
                                        value: 'callCnt',
                                        unit: '次',
                                    }
                                ]
                            },
                        ],
                        width: '25'
                    },
                    {
                        name: '通话时长',
                        value: 'details',
                        unit: '秒',
                        style: 'red-style',
                        text: '共',
                        titleVal: 'duration',
                        childText: [
                            {
                                children:[
                                    {
                                        name: '共',
                                        value: 'callTime',
                                        unit: '秒',
                                    },
                                ]
                            },
                        ],
                        width: '25'
                    },
                ]
            },
            {
                type: '5',
                title: '通话时间段分析',
                value: 'gr_yunyinshangbaogao',
                childVal: 'callDurationAnalysis',
                children: [
                    {
                        name: '时间段',
                        value: 'desc',
                    },
                    {
                        name: '通话次数',
                        value: 'callCnt',
                    },
                    {
                        name: '号码数',
                        value: 'callNumCnt',
                    },
                    {
                        name: '最常联系号码及联系次数',
                        childValType: '4',
                        width: '154px',
                        childText: [
                            {
                                name: '',
                                value: 'freqContactNum',
                            },
                            {
                                name: '',
                                value: 'freqContactNumCnt',
                                unit: '次'
                            },
                        ]
                    },
                    {
                        name: '平均通话时长（分钟）',
                        value: 'avgCallTime',
                        childValType: '6',
                        unitType: 'time',
                        TransformationType: 'minute',
                    },
                    {
                        name: '主叫次数',
                        value: 'callingCnt',
                    },
                    {
                        name: '主叫时长（分钟）',
                        value: 'callingTime',
                        childValType: '6',
                        unitType: 'time',
                        TransformationType: 'minute',
                    },
                    {
                        name: '被叫次数',
                        value: 'calledCnt',
                    },
                    {
                        name: '被叫时长（分钟）',
                        value: 'calledTime',
                        childValType: '6',
                        unitType: 'time',
                        TransformationType: 'minute',
                    },
                ]
            },
            {
                type: '3',
                title: '手机静默情况',
                value: 'gr_yunyinshangbaogao',
                childVal: 'silenceAnalysis',
                children: [
                    {
                        name: '总次数',
                        value: 'silenceCnt',
                    },
                    {
                        name: '静默时长（小时）',
                        value: 'silenceTime',
                        unitType: 'time',
                        TransformationType: 'hour',
                    },
                    {
                        name: '最长一次静默开始时间',
                        value: 'longestSilenceStart',
                    },
                    {
                        name: '最长一次静默时长（小时）',
                        value: 'longestSilenceTime',
                        unitType: 'time',
                        TransformationType: 'hour',
                    },
                    {
                        name: '最近一次静默开始时间',
                        value: 'lastSilenceStart',
                    },
                    {
                        name: '最近一次静默时长（小时）',
                        value: 'lastSilenceTime',
                        unitType: 'time',
                        TransformationType: 'hour',
                    },
                ]
            },
            {
                type: '5',
                title: '通话联系人分析（通话次数最多的前20个号码）',
                value: 'gr_yunyinshangbaogao',
                childVal: 'contactAnalysis',
                limit: 20,
                children: [
                    {
                        name: '号码',
                        value: 'callNum',
                    },
                    {
                        name: '互联网标志',
                        value: 'callTag',
                    },
                    {
                        name: '风险名单',
                        value: 'isHitRiskList',
                        childValType: '5'
                    },
                    {
                        name: '归属地',
                        value: 'attribution',
                    },
                    {
                        name: '通话次数',
                        value: 'callCnt',
                    },
                    {
                        name: '通话时长（分钟）',
                        value: 'callTime',
                        childValType: '6',
                        unitType: 'time',
                        TransformationType: 'minute',
                    },
                    {
                        name: '主叫次数',
                        value: 'callingCnt',
                    },
                    {
                        name: '主叫时长（分钟）',
                        value: 'callingTime',
                        childValType: '6',
                        unitType: 'time',
                        TransformationType: 'minute',
                    },
                    {
                        name: '最早一次通话时间',
                        value: 'lastStart',
                    },
                    {
                        name: '最近一次通话时长（分钟）',
                        value: 'lastTime',
                        childValType: '6',
                        unitType: 'time',
                        TransformationType: 'minute',
                    },
                ]
            },
        ]
    },
    {
        title: '个人对外投资信息',
        mainValues: ['gr_gerenduiwaitouzi'],
        children: [
            {
                type: '5',
                title: '个人担任法定代表人信息',
                value: 'gr_gerenduiwaitouzi',
                childVal: 'frList',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '企业名称',
                        value: 'entName',
                    },
                    {
                        name: '统一社会信用代码/注册号',
                        value: 'regNo',
                    },
                    {
                        name: '企业类型',
                        value: 'entType',
                    },
                    {
                        name: '企业状态',
                        value: 'entStatus',
                    },
                    {
                        name: '注册资本',
                        value: 'regCap',
                    },
                ]
            },
            {
                type: '5',
                title: '个人对外投资的企业信息',
                value: 'gr_gerenduiwaitouzi',
                childVal: 'shareholderList',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '企业名称',
                        value: 'entName',
                    },
                    {
                        name: '统一社会信用代码/注册号',
                        value: 'regNo',
                    },
                    {
                        name: '企业类别',
                        value: 'entType',
                    },
                    {
                        name: '企业状态',
                        value: 'entStatus',
                    },
                    {
                        name: '注册资本',
                        value: 'regCap',
                    },
                    {
                        name: '认缴出资额（万元）',
                        value: 'subConAm',
                    },
                    {
                        name: '出资比例',
                        value: 'fundedratio',
                    },
                ]
            },
            {
                type: '5',
                title: '个人任职的企业信息',
                value: 'gr_gerenduiwaitouzi',
                childVal: 'managementList',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '企业名称',
                        value: 'entName',
                    },
                    {
                        name: '统一社会信用代码/注册号',
                        value: 'regNo',
                    },
                    // {
                    //     name: '注册时间',
                    //     value: '',
                    // },
                    {
                        name: '企业类别',
                        value: 'entType',
                    },
                    {
                        name: '企业状态',
                        value: 'entStatus',
                    },
                    {
                        name: '注册资本',
                        value: 'regCap',
                    },
                ]
            },
        ]
    },
    {
        title: '银行卡认证',
        mainValues: ['gr_yinhangkarenzheng'],
        children: [
            {
                title: '认证结果',
                type: '3',
                value: 'gr_yinhangkarenzheng',
                children: [
                    {
                        name: '所属银行',
                        value: 'bank_description',
                        style: 'long'
                    },
                    {
                        name: '认证结果',
                        value: 'desc',
                        style: 'long'
                    },
                ]
            },
        ]
    },
    {
        title: '手机号码认证',
        mainValues: ['gr_yunyingshangrenzheng'],
        children: [
            {
                title: '认证结果',
                type: '3',
                value: 'gr_yunyingshangrenzheng',
                children: [
                    {
                        name: '认证结果',
                        value: 'desc',
                        style: 'long'
                    },
                ]
            },
        ]
    },
    {
        title: '逾期档案',
        mainValues: ['gr_yuqidangan'],
        children: [
            {
                title: '逾期档案',
                type: '3',
                value: 'gr_yuqidangan',
                childVal: 'result_detail',
                children: [
                    {
                        summarizeName: '逾期总览（近六个月内）',
                        child: [
                            {
                                name: '逾期机构数',
                                value: 'member_count',
                                style: 'long'
                            },
                            {
                                name: '逾期订单数',
                                value: 'order_count',
                                style: 'long'
                            },
                            {
                                name: '逾期总金额',
                                value: 'debt_amount',
                                style: 'long'
                            },
                        ],
                    },
                ]
            },
            {
                type: '5',
                title: '逾期详情',
                value: 'gr_yuqidangan',
                childVal: 'result_detail',
                childVal_v: 'details',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '逾期时间',
                        value: 'date',
                    },
                    {
                        name: '逾期金额',
                        value: 'amount',
                    },
                    {
                        name: '逾期天数',
                        value: 'count',
                    },
                    {
                        name: '是否结清',
                        value: 'settlement',
                        childValType: '7'
                    },
                ]
            },
        ]
    },
    {
        title: '共债档案',
        mainValues: ['gr_gongzhaidangan'],
        children: [
            {
                type: '3',
                title: '共债情况（近一个月）',
                value: 'gr_gongzhaidangan',
                childVal: 'result_detail',
                children: [
                    {
                        name: '共债机构数',
                        value: 'current_org_count',
                    },
                    {
                        name: '共债订单数',
                        value: 'current_order_count',
                    },
                    {
                        name: '已还共债金额',
                        value: 'current_order_amt',
                    },
                    {
                        name: '共债总金额',
                        value: 'current_order_lend_amt',
                    },
                ]
            },
            {
                type: '5',
                title: '共债情况（近六个月）',
                value: 'gr_gongzhaidangan',
                childVal: 'result_detail',
                childVal_v: 'totaldebt_detail',
                children: [
                    {
                        name: '统计时间范围',
                        value: 'totaldebt_date',
                    },
                    {
                        name: '共债机构数',
                        value: 'totaldebt_org_count',
                    },
                    {
                        name: '共债订单数',
                        value: 'totaldebt_order_count',
                    },
                    {
                        name: '已还共债金额',
                        value: 'totaldebt_order_amt',
                    },
                    {
                        name: '共债总金额',
                        value: 'totaldebt_order_lend_amt',
                    },
                    {
                        name: '是否疑似借新还旧',
                        value: 'new_or_old',
                        childValType: '8'
                    },
                ]
            },
        ]
    },
    {
        title: '借款全景雷达报告',
        mainValues: ['gr_daikuanquanjingbaogao'],
        children: [
            {
                title: '借款申请报告',
                type: '3',
                value: 'gr_daikuanquanjingbaogao',
                childVal: 'result_detail',
                childVal_v: 'apply_report_detail',
                children: [
                    {
                        name: '查询机构数',
                        value: 'query_org_count',
                    },
                    {
                        name: '近1个月总查询笔数',
                        value: 'latest_one_month',
                    },
                    {
                        name: '查询消费类机构数',
                        value: 'query_finance_count',
                    },
                    {
                        name: '近3个月总查询笔数',
                        value: 'latest_three_month',
                    },
                    {
                        name: '查询网络贷款类机构数',
                        value: 'query_cash_count',
                    },
                    {
                        name: '近6个月总查询笔数',
                        value: 'latest_six_month',
                    },
                    {
                        name: '总查询次数',
                        value: 'query_sum_count',
                    },
                    {
                        name: '最近查询时间',
                        value: 'latest_query_time',
                    },
                ]
            },
            {
                title: '借款行为报告',
                type: '3',
                value: 'gr_daikuanquanjingbaogao',
                childVal: 'result_detail',
                childVal_v: 'behavior_report_detail',
                children: [
                    {
                        name: '放款总订单数（12个月内）',
                        value: 'loans_count',
                    },
                    {
                        name: '近1个月贷款笔数',
                        value: 'latest_one_month',
                    },
                    {
                        name: '已结清订单数（12个月内）',
                        value: 'loans_settle_count',
                    },
                    {
                        name: '近3个月贷款笔数',
                        value: 'latest_three_month',
                    },
                    {
                        name: '逾期订单数（12个月内）',
                        value: 'loans_overdue_count',
                    },
                    {
                        name: '近6个月贷款笔数',
                        value: 'latest_six_month',
                    },
                    {
                        name: '贷款机构数（12个月内）',
                        value: 'loans_org_count',
                    },
                    {
                        name: '近1个月机构成功扣款笔数',
                        value: 'latest_one_month_suc',
                    },
                    {
                        name: '消费金融类机构数（12个月内）',
                        value: 'consfin_org_count',
                    },
                    {
                        name: '近1个月机构失败扣款笔数',
                        value: 'latest_one_month_fail',
                    },
                    {
                        name: '网络贷款类机构数（12个月内）',
                        value: 'loans_cash_count',
                    },
                    {
                        name: '信用贷款时长',
                        value: 'loans_long_time',
                    },
                    {
                        name: '机构成功扣款笔数（12个月内）',
                        value: 'history_suc_fee',
                    },
                    {
                        name: '最近一次贷款时间',
                        value: 'loans_latest_time',
                    },
                    {
                        name: '机构失败扣款笔数（12个月内）',
                        value: 'history_fail_fee',
                    },
                ]
            },
            {
                title: '信用现状报告',
                type: '3',
                value: 'gr_daikuanquanjingbaogao',
                childVal: 'result_detail',
                childVal_v: 'current_report_detail',
                children: [
                    {
                        titleTip: ['网络贷款类']
                    },
                    {
                        name: '网络贷款类建议授信额度',
                        value: 'loans_credit_limit',
                        style: 'long'
                    },
                    {
                        name: '网络贷款类机构数（12个月内）',
                        value: 'loans_org_count',
                    },
                    {
                        name: '网络贷款机构最大授信额度',
                        value: 'loans_max_limit',
                    },
                    {
                        name: '网络贷款类产品数（12个月内）',
                        value: 'loans_product_count',
                    },
                    {
                        name: '网络贷款机构平均授信额度',
                        value: 'loans_avg_limit',
                    },
                    {
                        titleTip: ['消费金金融类'],
                    },
                    {
                        name: '消费金融类建议授信额度',
                        value: 'consfin_credit_limit',
                        style: 'long'
                    },
                    {
                        name: '消费金融类机构数（12个月内）',
                        value: 'consfin_org_count',
                    },
                    {
                        name: '消费金融类机构最大授信额度',
                        value: 'consfin_max_limit',
                    },
                    {
                        name: '消费金融类产品数（12个月内）',
                        value: 'consfin_product_count',
                    },
                    {
                        name: '消费金融类机构平均授信额度',
                        value: 'consfin_avg_limit',
                    },
                ]
            },
        ]
    },
    {
        title: '银行卡画像',
        mainValues: ['gr_yinhangkaxiangqing'],
        children: [
            {
                title: '人口属性',
                type: '3',
                value: 'gr_yinhangkaxiangqing',
                fieldNameArr: ['result_detail',0,'result_item_normal','population_attribute'],
                children: [
                    {
                        titleTip: ['基本信息']
                    },
                    {
                        name: '近12月常住城市（交易笔数最多）',
                        value: 'trans_count_permanent_city_enum',
                        fieldNameArr: ['popu_basic_info','popu_basic_regional_info'],
                    },
                    {
                        name: '近12月常住城市（交易天数最多）',
                        value: 'trans_day_most_permanent_city_enum',
                        fieldNameArr: ['popu_basic_info','popu_basic_regional_info'],
                    },
                    {
                        name: '地域流动性',
                        value: 'regional_mobility',
                        fieldNameArr: ['popu_basic_info','popu_basic_regional_info'],
                    },
                    {
                        name: '各年常住城市枚举',
                        value: 'enum_of_permanent_city',
                        fieldNameArr: ['popu_basic_info','popu_basic_regional_info'],
                    },
                    {
                        titleTip: ['家庭信息'],
                    },
                    {
                        name: '是否有房',
                        value: 'is_have_house',
                        fieldNameArr: ['popu_family_info','popu_family_house_info'],
                    },
                    {
                        name: '是否有车',
                        value: 'is_have_car',
                        fieldNameArr: ['popu_family_info','popu_family_vehicle_info'],
                    },
                    {
                        name: '孩子特征',
                        value: 'child_features',
                        fieldNameArr: ['popu_family_info','popu_family_marry_info'],
                    },
                ]
            },
            {
                title: '银行卡及账户信息',
                type: '3',
                value: 'gr_yinhangkaxiangqing',
                fieldNameArr: ['result_detail',0,'result_item_normal','bank_info','bank_card_info'],
                children: [
                    {
                        name: '卡种',
                        value: 'card_type',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                    {
                        name: '卡性质',
                        value: 'card_property',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                    {
                        name: '卡品牌',
                        value: 'card_brand',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                    {
                        name: '卡产品',
                        value: 'card_product',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                    {
                        name: '卡等级',
                        value: 'card_rank',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                    {
                        name: '账户性质',
                        value: 'account_type',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                    {
                        name: '是否银联高端客户',
                        value: 'is_high_user',
                        fieldNameArr: ['bank_card_card_info'],
                    },
                ]
            },
            {
                title: '基本消费',
                type: '3',
                value: 'gr_yinhangkaxiangqing',
                fieldNameArr: ['result_detail',0,'result_item_normal','con_behavior_info'],
                children: [
                    {
                        titleTip: ['消费行为']
                    },
                    {
                        name: '消费档次',
                        value: 'consume_grade',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        name: '消费性别',
                        value: 'sex_of_consume',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        name: '消费年龄',
                        value: 'age_of_consume',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        name: '是否无业',
                        value: 'is_unemployed',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        name: '学生特征',
                        value: 'student_feature',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        name: '近6月同商户多笔消费最小时间间隔（精确到秒）',
                        value: 'consume_mini_time_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        name: '疑似套现行为甄别',
                        value: 'dismt_of_suspected_arbitrage',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                    },
                    {
                        titleTip: ['消费详情']
                    },
                    {
                        titleTip: ['项目','名目','金额','笔数'],
                        widths: [6,6,6,6]
                    },
                    {
                        summarizeName: '政府机构交易',
                        child: [
                            {
                                name: '近6月纳税',
                                style: 'long',
                                values: ['tax_last_6m','tax_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_gover_trans_info'],
                            },
                        ],
                    },
                    {
                        summarizeName: '行业消费',
                        child: [
                            {
                                name: '近6月娱乐消费',
                                style: 'long',
                                values: ['entertain_consume_last_6m','entertain_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月餐饮类消费',
                                style: 'long',
                                values: ['restaurant_consume_last_6m','restaurant_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月旅行类消费',
                                style: 'long',
                                values: ['travel_consume_last_6m','travel_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月医药消费',
                                style: 'long',
                                values: ['medical_consume_last_6m','medical_trans_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月化妆品消费',
                                style: 'long',
                                values: ['makeup_consume_last_6m','makeup_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月住宿服务',
                                style: 'long',
                                values: ['accommodation_consume_last_6m','accommodation_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月按摩、保健、美容SPA消费',
                                style: 'long',
                                values: ['spa_consume_last_6m','spa_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月高档运动消费',
                                style: 'long',
                                values: ['upscale_sports_consume_last_6m','upscale_sports_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月饮酒场所消费',
                                style: 'long',
                                values: ['drink_consume_last_6m','drink_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月KTV消费',
                                style: 'long',
                                values: ['ktv_consume_last_6m','ktv_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月大型超市消费',
                                style: 'long',
                                values: ['large_supermarket_consume_last_6m','large_supermarket_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月航空消费',
                                style: 'long',
                                values: ['air_consume_last_6m','air_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月铁路消费',
                                style: 'long',
                                values: ['railway_consume_last_6m','railway_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月证券消费',
                                style: 'long',
                                values: ['securities_consume_last_6m','securities_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月贵重珠宝、首饰、钟表、银器消费',
                                style: 'long',
                                values: ['jewelry_consume_last_6m','jewelry_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月博彩消费',
                                style: 'long',
                                values: ['gambling_consume_last_6m','gambling_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近12月博彩消费',
                                style: 'long',
                                values: ['gambling_consume_last_12m','gambling_consume_count_last_12m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月法律服务消费',
                                style: 'long',
                                values: ['consume_of_legal_services_last_6m','consume_count_of_legal_services_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月罚款',
                                style: 'long',
                                values: ['fines_last_6m','fines_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月保险',
                                style: 'long',
                                values: ['insurance_expend_last_6m','insurance_expend_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近12月夜消费（TOP10 MTC）',
                                style: 'long',
                                values: ['night_trans_amount_top10_mtc_last_12m','night_trans_count_top10_mtc_last_12m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近12月夜消费占比',
                                style: 'long',
                                values: ['night_trans_amount_percent_last_12m','night_trans_count_percent_last_12m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月信用卡还款',
                                style: 'long',
                                values: ['credit_card_repay_last_6m','credit_card_repay_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月加油站交易',
                                style: 'long',
                                values: ['gas_station_trans_last_6m','gas_station_trans_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月汽车类消费',
                                style: 'long',
                                values: ['car_consume_last_6m','car_consume_count_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近1月夜消费',
                                style: 'long',
                                values: ['night_consume_last_1m','night_consume_cnt_last_1m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月夜消费',
                                style: 'long',
                                values: ['night_consume_last_6m','night_consume_cnt_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近6月夜消费MTC分布',
                                style: 'long',
                                values: ['night_consume_mtc_last_6m','night_consume_cnt_mtc_last_6m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近12月月均消费',
                                style: 'long',
                                values: ['avg_consume_12m','avg_consume_cnt_12m'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近12月医院单笔大额支出',
                                style: 'long',
                                values: ['large_amount_medical_expenses_last_12m',''],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                            {
                                name: '近12月日用品消费',
                                style: 'long',
                                values: ['daily_nece_consume_last_12m',''],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_industry_con_info'],
                            },
                        ],
                    },
                    {
                        titleTip: ['大额/整额交易']
                    },
                    {
                        name: '单笔1万元以上的交易城市',
                        value: 'city_of_more10_thousand_once',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        name: '单笔1万元以上的交易金额',
                        value: 'amount_of_more10_thousand_once',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        name: '每月高占比消费天数（各月明细）',
                        value: 'high_trans_detail_perm',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        name: '近6月最大单日累计消费金额',
                        value: 'max_cumulative_consume_later_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        name: '近12月整额消费金额',
                        value: 'trans_much_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        name: '高额交易占比',
                        value: 'high_volume_percent',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        name: '单笔最大金额、交易类型（近1月）',
                        value: 'amount_and_type_of_once_large_1m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_lager_trans_info'],
                    },
                    {
                        titleTip: ['金额区间统计']
                    },
                    {
                        name: '低额交易占比',
                        value: 'low_volume_percent',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                    },
                    {
                        name: '中额交易占比',
                        value: 'middle_volume_percent',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                    },
                    {
                        titleTip: ['','内容','金额','笔数'],
                        widths: [6,6,6,6]
                    },
                    {
                        summarizeName: '区间统计详情',
                        child: [
                            {
                                name: '每月单笔[0,200]交易',
                                style: 'long',
                                values: ['trans0_200_per_account','trans0_200_per_count'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                            },
                            {
                                name: '每月单笔(200,600]交易',
                                style: 'long',
                                values: ['trans200_600_per_account','trans200_600_per_count'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                            },
                            {
                                name: '每月单笔(600,1000]交易',
                                style: 'long',
                                values: ['trans600_1000_per_account','trans600_1000_per_count'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                            },
                            {
                                name: '每月单笔(1000,5000]交易',
                                style: 'long',
                                values: ['trans1000_5000_per_account','trans1000_5000_per_count'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                            },
                            {
                                name: '每月单笔(5000,20000]交易',
                                style: 'long',
                                values: ['trans5000_20000_per_account','trans5000_20000_per_count'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                            },
                            {
                                name: '每月单笔(20000,+]交易',
                                style: 'long',
                                values: ['trans_20000_per_account','trans_20000_per_count'],
                                fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_amount_info'],
                            },
                        ],
                    },
                    {
                        titleTip: ['基础交易统计']
                    },
                    {
                        name: '最常用的交易渠道交易笔数占比',
                        value: 'common_trans_channel_percent',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '2011年至今有交易的月数',
                        value: 'number_of_trans_from_2011',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月平均每笔单价',
                        value: 'avg_price_last_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月月均消费金额',
                        value: 'avg_consume_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '全部历史交易总天数',
                        value: 'historical_trans_day',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近期交易金额增长率（有交易的近4个月）',
                        value: 'trans_amount_increase_rate_lately',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '交易过的MCC数量',
                        value: 'transd_mcc',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '工作时间消费笔数占比',
                        value: 'consume_count_percent_work_day',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '电脑、手机支付金额、笔数',
                        value: 'computer_mobile_pay_amount_count',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月出差次数',
                        value: 'travel_times_last_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月最常交易时间间隔（天）',
                        value: 'trans_top_time_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月最常消费时间间隔（天）',
                        value: 'consume_top_time_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月有过交易的MTC',
                        value: 'have_trans_day_mtc_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '还款能力指标',
                        value: 'repayment_capability',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月网购笔数',
                        value: 'net_purchase_count_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月网购金额',
                        value: 'net_purchase_amount_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月总交易笔数（部分消费类）',
                        value: 'top_trans_count_last_12mp',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月总交易金额（部分消费类）',
                        value: 'trans_amount_12m_part',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月最大单日累计消费',
                        value: 'max_consume_count_later_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月单日同同商户多笔交易',
                        value: 'consume_count_one_day_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月单日同商户多笔等额消费',
                        value: 'consume_same_amount_one_day_last_6m',
                        style: 'long',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近1月整额消费',
                        value: 'trans_much_1m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月整额消费',
                        value: 'trans_much_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '全部历史交易金额记录',
                        value: 'historical_trans_amount',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '全部历史交易总数记录',
                        value: 'historical_trans_count',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '工作日的工作时间消费金额',
                        value: 'consume_amount_work_day_work_time',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '工作日的工作时间消费笔数',
                        value: 'consume_count_work_day_work_time',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '工作日的非工作时间消费金额',
                        value: 'consume_amount_work_day_other_time',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '工作日的非工作时间消费笔数',
                        value: 'consume_count_work_day_other_time',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '双休日消费金额',
                        value: 'consume_amount_week_day',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '双休日消费笔数',
                        value: 'consume_count_week_day',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '节假日消费金额',
                        value: 'consume_amount_holiday',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '节假日消费笔数',
                        value: 'consume_count_holiday',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月总交易金额记录（消费类）',
                        value: 'trans_amount_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近12月总交易笔数记录（消费类）',
                        value: 'top_consume_count_last_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '每月交易金额环比增长',
                        value: 'trans_amount_increase_perm',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '每月交易笔数环比增长',
                        value: 'trans_count_increase_perm',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '夜交易金额',
                        value: 'night_trans_amount',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '夜交易笔数',
                        value: 'night_trans_count',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月消费金额全国排名',
                        value: 'rank_consume_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月消费笔数全国排名',
                        value: 'top_consume_count_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月消费金额全市排名',
                        value: 'rank_consume_city_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月消费笔数全市排名',
                        value: 'rank_consume_count_city_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月中消费金额MTC分布',
                        value: 'amount_distribution_mtc_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        name: '近6月中消费笔数MTC分布',
                        value: 'count_distribution_mtc_last_6m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_statics_info'],
                    },
                    {
                        titleTip: ['基本消费：交易概览'],
                        align: 'no-center'
                    },
                    {
                        name: '使用交易的渠道数',
                        value: 'trans_channel_count',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '最常用的交易渠道类型',
                        value: 'trans_channel_type',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '最长交易天数间隔（过滤小额交易）',
                        value: 'trans_days_interval_filter',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '最长交易天数间隔',
                        value: 'trans_days_interval',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '交易过的交易类型数量',
                        value: 'transd_trans_type',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月消费笔单价列举',
                        value: 'comsume_per_m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '近12月有交易的月数',
                        value: 'trans_m_last_12_m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '低于近12月月均消费金额的有效月份枚举',
                        value: 'avg_consume_less_12m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '交易活跃度（天）',
                        value: 'trans_activity_day',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '交易活跃度（月）',
                        value: 'trans_activity_m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '交易过的MCC列举',
                        value: 'transd_mcc_enum',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '近3月TOP3交易地列表',
                        value: 'trans_top3_addr_last_3m',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每小时消费金额枚举',
                        value: 'enum_consume_amount_per_hour',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每小时消费笔数枚举',
                        value: 'enum_consume_count_per_hour',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月交易金额枚举（消费类）',
                        value: 'enum_m_trans_amount_c',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月交易笔数枚举（消费类）',
                        value: 'enum_m_trans_c',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月交易金额枚举（银行类）',
                        value: 'enum_m_trans_amount_b',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月交易笔数枚举（银行类）',
                        value: 'enum_m_trans_b',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月交易金额枚举（全部）',
                        value: 'enum_m_trans_amount_a',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        name: '每月交易笔数枚举（全部）',
                        value: 'enum_m_trans_a',
                        fieldNameArr: ['con_beha_basic_info','con_beha_basic_trans_view_info'],
                    },
                    {
                        titleTip: ['消费偏好'],
                    },
                    {
                        titleTip: ['消费偏好：交易偏好'],
                        align: 'no-center'
                    },
                    {
                        name: '行业偏好',
                        value: 'consume_preference',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '地域偏好',
                        value: 'reg_preference_for_trans',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '是否城市消费达人',
                        style: 'long',
                        value: 'is_top_consumer',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '夜交易MCC金额分布',
                        value: 'night_trans_mcc',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '夜交易MCC笔数分布',
                        value: 'night_trans_count_mcc',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '交易过的MCC金额分布',
                        value: 'amount_distribution_mcc',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '交易过的MCC笔数分布',
                        value: 'count_distribution_mcc',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '交易过的MTC金额分布',
                        value: 'amount_distribution_mtc',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        name: '交易过的MTC笔数分布',
                        value: 'count_distribution_mtc',
                        fieldNameArr: ['con_beha_prefer_info','consume_prefer_transp_info'],
                    },
                    {
                        titleTip: ['消费偏好：交易排名'],
                        align: 'no-center'
                    },
                    {
                        name: '每月交易金额同城排名（消费类）',
                        value: 'rank_trans_amount_same_city',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        name: '每月交易笔数同城排名（消费类）',
                        value: 'rank_trans_count_same_city',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        name: '每月交易天数同城排名（全部）',
                        style: 'long',
                        value: 'rank_trans_day_same_city',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        name: '年交易金额同城排名（消费类）',
                        value: 'annual_trans_amount_rank',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        name: '年交易笔数同城排名（消费类）',
                        value: 'annual_trans_count_rank',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        name: '近12月平均笔单价同时排名',
                        value: 'avg_price_top_last12_vilid_month',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        name: '近12月月均消费金额本市对比',
                        value: 'avg_consume12_month_comp',
                        fieldNameArr: ['con_beha_prefer_info','con_beha_prefer_transr_info'],
                    },
                    {
                        titleTip: ['出行交易'],
                    },
                    {
                        name: '近1月跨城市消费最小时间间隔',
                        value: 'cross_consume_little_time_last_1m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近6月跨城市消费最小时间间隔',
                        value: 'cross_consume_little_time_last_6m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近1月,1小时内跨城市消费笔数',
                        value: 'cross_consume_count_last_1m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月,1小时内跨城市消费笔数 ',
                        value: 'cross_consume_count_last_12m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月交易天数城市分布',
                        style: 'long',
                        value: 'trans_city_day_last_12m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近6月最常用外币交易币种',
                        value: 'foreign_c_coins_last_6m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近6月外币交易币种数',
                        value: 'foreign_coins_last_6m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月有无境外消费',
                        value: 'is_overseas_consume_last_12m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '跨境交易国家列举',
                        value: 'cross_trade_contrys',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近6月交易金额城市分布（部分消费类）',
                        value: 'trans_city_amount_last_6mp',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近6月交易笔数城市分布（部分消费类）',
                        value: 'trans_city_count_last_6mp',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月交易金额城市分布（部分消费类）',
                        value: 'trans_city_amount_last_12mp',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月交易笔数城市分布（部分消费类）',
                        value: 'trans_city_count_last_12mp',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月交易金额城市分布',
                        value: 'trans_city_amount_last_12m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '近12月交易笔数城市分布',
                        value: 'trans_city_count_last_12m',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_city_trans_info'],
                    },
                    {
                        name: '境外交易金额',
                        value: 'overseas_trans_amount',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_overs_trans_info'],
                    },
                    {
                        name: '境外交易笔数',
                        value: 'overseas_trans_count',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_overs_trans_info'],
                    },
                    {
                        name: '境外交易金额占比',
                        value: 'overseas_trans_percent',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_overs_trans_info'],
                    },
                    {
                        name: '境外交易笔数占比',
                        value: 'overseas_trans_count_percent',
                        fieldNameArr: ['con_beha_travel_trans_info','con_beha_travel_overs_trans_info'],
                    },
                    {
                        titleTip: ['信用统计']
                    },
                    {
                        titleTip: ['信用统计：信用相关'],
                        align: 'no-center'
                    },
                    {
                        name: '是否存在盗卡风险',
                        value: 'is_risk_of_theft_of_cards',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_connect_info'],
                    },
                    {
                        name: '是否发生吞卡',
                        value: 'whether_swallow_card',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_connect_info'],
                    },
                    {
                        name: '是否有超过笔数限制交易',
                        value: 'is_over_the_limit_trans',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_connect_info'],
                    },
                    {
                        name: '是否有金额不足交易',
                        value: 'is_have_less_amount_trans',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_connect_info'],
                    },
                    {
                        titleTip: ['信用统计：出入账交易'],
                        align: 'no-center'
                    },
                    {
                        name: '近1月最大单日累计取现金额',
                        value: 'take_highest_amount_in_later_1m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近1月最大单日累计取现笔数',
                        value: 'take_highest_count_in_later_1m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近6月最大单日累计取现金额',
                        value: 'take_highest_amount_in_later_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近6月最大单日累计取现笔数',
                        value: 'take_highest_count_in_later_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月最大单日累计取现金额',
                        value: 'take_highest_amount_in_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月最大单日累计取现笔数',
                        value: 'take_highest_count_in_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近6月大额入账金额[1万，+）',
                        value: 'large_entry_amount_later_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月大额入账金额[1万，+）',
                        value: 'large_entry_amount_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近6月大额入账后取现金额占比[1万，+）',
                        value: 'large_entry_take_percent_later_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近6月大额入账后消费金额占比[1万，+）',
                        value: 'large_entry_consume_percent_later_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '取现金额占交易金额比例',
                        value: 'take_percent_of_trans',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月每月取现地点',
                        value: 'take_address_per_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月每月取现金额',
                        value: 'take_amount_per_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月每月取现笔数',
                        value: 'take_count_per_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近期取现金额枚举（有取现的近3个月）',
                        value: 'take_amount_enum',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近期取现笔数枚举（有取现的近3个月）',
                        value: 'take_count_enum',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月银行卡入账总金额',
                        value: 'entry_amount_of_bank_card_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        name: '近12月银行卡入账总笔数',
                        value: 'entry_count_of_bank_card_later_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_en_et_info'],
                    },
                    {
                        titleTip: ['信用统计：预授权类交易'],
                        align: 'no-center'
                    },
                    {
                        name: '近6月预授权扣款金额',
                        value: 'pre_empowerment_last_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_preg_info'],
                    },
                    {
                        name: '近6月预授权扣款笔数',
                        value: 'pre_empowerment_count_last_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_preg_info'],
                    },
                    {
                        titleTip: ['信用统计：交易失败'],
                        align: 'no-center'
                    },
                    {
                        name: '近6月最大单日累计交易失败笔数',
                        value: 'trans_fail_top_count_enum_last_6m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_tans_f_info'],
                    },
                    {
                        name: '近12月各月失败交易原因枚举',
                        value: 'trans_fail_reason_enum_last_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_tans_f_info'],
                    },
                    {
                        name: '近12月各月失败交易笔数',
                        value: 'trans_fail_count_enum_last_12m',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_tans_f_info'],
                    },
                    {
                        name: '最近一笔失败交易原因',
                        value: 'trans_fail_reason_lately',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_tans_f_info'],
                    },
                    {
                        name: '最近一笔失败交易日期',
                        value: 'trans_fail_time_lately',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_tans_f_info'],
                    },
                    {
                        name: '最近一日失败交易原因列举',
                        value: 'trans_fail_reason_list_lately',
                        fieldNameArr: ['con_beha_credit_statics_info','con_beha_credit_stat_tans_f_info'],
                    },
                ]
            },
        ]
    },
    {
        title: '系统记录',
        mainValues: ['gr_recordPhone','gr_recordCertificateNo'],
        children: [
            {
                type: '5',
                title: '联系号码关联',
                value: 'gr_recordPhone',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '证件号码',
                        value: 'cardNo',
                    },
                    {
                        name: '	案件编号',
                        value: 'contractNo',
                    },
                    {
                        name: '	类型',
                        value: 'type',
                    },
                    {
                        name: '案件状态',
                        value: 'state',
                    },
                    {
                        name: '	放款日期',
                        value: 'startDate',
                    },
                    {
                        name: '逾期情况',
                        value: 'overdue',
                    },
                ]
            },
            {
                type: '5',
                title: '证件号码关联',
                value: 'gr_recordCertificateNo',
                children: [
                    {
                        name: '序号',
                        value: 'order_index',
                    },
                    {
                        name: '姓名',
                        value: 'name',
                    },
                    {
                        name: '联系号码',
                        value: 'phone',
                    },
                    {
                        name: '	案件编号',
                        value: 'contractNo',
                    },
                    {
                        name: '	类型',
                        value: 'type',
                    },
                    {
                        name: '案件状态',
                        value: 'state',
                    },
                    {
                        name: '	放款日期',
                        value: 'startDate',
                    },
                    {
                        name: '逾期情况',
                        value: 'overdue',
                    },
                ]
            },
        ]
    },
]
class TableTemplateHandle extends React.Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        data: PropTypes.object,
    };

    static defaultProps = {
        data: {}
    };
    type5Show = (val_v, val_v_v, k) => {
        if (val_v_v.value === 'order_index') {
            return k+1
        } else if(val_v_v.childValType === '1') {
           return val_v[val_v_v.value] && val_v[val_v_v.value][0] ? val_v[val_v_v.value][0][val_v_v.childVal] : '--'
        } else if(val_v_v.childValType === '2') {
            return val_v[val_v_v.value] ? val_v[val_v_v.value][val_v_v.childVal] : '--'
        } else if(val_v_v.childValType === '3') {
             switch (val_v[val_v_v.value]) {
                case '1' : return '养老';break;
                case '2' : return '医疗';break;
                case '3' : return '失业';break;
                case '4' : return '工伤';break;
                case '5' : return '生育';break;
                default: return '--';
            }
        } else if(val_v_v.childValType === '4') {
            let text = ''
            for (let item of val_v_v.childText) {
                text = <div>{text}{item.name}{val_v[item.value]}{item.unit? item.unit:''}</div>
            }
            return text
        } else if(val_v_v.childValType === '5') {
            switch (val_v[val_v_v.value]) {
               case '1' : return '是';break;
               case '0' : return '否';break;
               default: return '--';
           }
       } else if(val_v_v.childValType === '6') {
            return this.timeUnitTransformation(val_v_v,val_v[val_v_v.value])
       } else if(val_v_v.childValType === '7') {
            switch (val_v[val_v_v.value]) {
                case 'Y' : return '已结清';break;
                case 'N' : return '未结清';break;
                default: return '--';
            }
       } else if(val_v_v.childValType === '8') {
        switch (val_v[val_v_v.value]) {
            case 'Y' : return '是';break;
            case 'N' : return '否';break;
            default: return '--';
        }
      }else {
            return <span><span className={`${val_v_v.style? val_v_v.style : ''} betw2`}>{val_v[val_v_v.value] ? val_v[val_v_v.value] : '--'}</span>{val_v_v.unit ? val_v_v.unit : ''}</span>
       }
   }
   type4Show = (val,val_v) => {
        if(val_v.childValType === '1') {
            return val[val_v.value] ? val[val_v.value][val_v.childVal] : '--'
        } else {
            return val[val_v.value] ? val[val_v.value] : '--'
        }
    }
    timeTypeDo = (val_v,value) => {
        if (val_v.unitType === 'time' && value) {
            switch (val_v.TransformationType) {
                case 'hour': value = (value/3600).toFixed(2);break;
                case 'minute': value = (value/60).toFixed(2);break;
                default: value = value;
            }
        }
        return value ? value : '--'
    }
    timeUnitTransformation = (val,value) => {
        if (val.unitType === 'time') {
            switch (val.TransformationType) {
                case 'hour': return (value/3600).toFixed(2);break;
                case 'minute': return (value/60).toFixed(2);break;
                default: return value
            }
        } else {
            console.log('sd',value)
            return value
        }
    }
    type3ShowText = (val_v,val,k) => {
        let value = val[val_v.value] ? val[val_v.value] : null;
        let spanNumS = 12;
        let spanNumB = 12;
        if (val_v.style === 'long') {
            spanNumS = val_v.values ? 24/(val_v.values.length+1) : 18
            spanNumB = val_v.values ? 24/(val_v.values.length+1) : 6
        }
        return <Col key={k} span={val_v.style === 'long' ? 24: 12} className="flex">
                    <Col span={spanNumB} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">{val_v.name}</Col>
                    {val_v.values ?
                        val_v.values.map((item,index)=>
                        <Col key={index} span={spanNumS} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                {this.timeTypeDo(val_v,val[item] ? val[item] : null)}
                        </Col>
                        )
                        :<Col span={spanNumS} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                         {this.timeTypeDo(val_v,value)}
                    </Col>}
                </Col>
    }
    type3Show = (val_v, value, k) => {
        if (val_v.summarizeName) {
              return (<span key={k} className="full-width flex">
                    <span className="flex-1 gray-border-right-bot flex flex-align-center flex-pack-center">{val_v.summarizeName}</span>
                    <span className="flex-3">
                        {val_v.child.map((item,index)=>
                            this.type3ShowDo(item,value,index)
                        )}
                    </span>
                </span>)

        } else {
            return this.type3ShowDo(val_v,value,k)
        }
    }
    type3ShowDo  = (val_v, value, k) => {
        let val_b = value;
        if (val_v.fieldNameArr) {
            for (let item of val_v.fieldNameArr) {
                val_b ? val_b = val_b[item] : null
            }
        }
        return this.type3ShowText(val_v,val_b,k)
    }
    mainValuesShow = (mainValues,data) => {
        let ifShow = false
        for (let item of mainValues){
            data[item] || data[item] === '' ?  ifShow = true : null
        }
        return  ifShow
    }
    valueEffective = (values) =>{
        if (values && JSON.stringify(values) !== '[]' && JSON.stringify(values) !== '{}' ) {
            return true
        }
        return false
    }
    ModuleTextShow = (val, data) =>{
        let ModuleTextShowData = ''
        if (!data[val.value]) {
            ModuleTextShowData= data[val.value] === '' ? this.ModuleText(val,0) : ''
        } else if (val.childVal) {
            data[val.value][val.childVal] ?
            ModuleTextShowData = this.ModuleText(val,val.arrayIndex ? data[val.value][val.childVal][val.arrayIndex] : data[val.value][val.childVal]) :
            ModuleTextShowData = this.ModuleText(val,undefined)
        } else if (val.fieldNameArr) {
            let valB = data[val.value];
            for (let item of val.fieldNameArr) {
                valB ? valB = valB[item] : null
            }
            valB ? ModuleTextShowData = this.ModuleText(val,val.arrayIndex ? valB[val.arrayIndex] : valB) :
            ModuleTextShowData = this.ModuleText(val,undefined)
        } else {
            ModuleTextShowData = this.ModuleText(val,val.arrayIndex ? data[val.value][val.arrayIndex] : data[val.value])
        }
        return ModuleTextShowData
    }
    ModuleText = (val,values) =>{
        val.childVal_v && values ? values = values[val.childVal_v] : null
        console.log('values-val:',values)
        let textArray = [values]
        let isSheAn = false
        if (val.childValType === '1' && val.type === '3' && values && JSON.stringify(values) !== '[]' && JSON.stringify(values) !== '{}') {
            textArray = values
            isSheAn = true
        }

        return (
            textArray.map((values,i)=>
                <div key={i}>
                    <div className="green-style height30 padd-left-30">{isSheAn ? `${val.title}${i+1}`: val.title}</div>
                    {
                    (!values  || JSON.stringify(values) === '[]' || JSON.stringify(values) === '{}') &&  <div className="gray-border-left margin-bot20">
                        <Row className="center-style">
                            <Col span={24} className="gray-border-right-bot report-td">{values === 0 ? '未查询' : '无信息'}</Col>
                        </Row>
                    </div>
                    }
                    {val.type === '1' && this.valueEffective(values) &&
                        <div className="gray-border-left margin-bot20">
                            <Row className="center-style">
                                {val.children_one.map((val_v,k)=>
                                <Col span={12} key={k}>
                                    <Row>
                                        <Col span={24} className="gray-border-right-bot report-td">{val_v.name}</Col>
                                    </Row>
                                    {
                                        val_v.children.map((val_v_v,kk)=>
                                        <Row key={kk}>
                                            <Col span={12} className="gray-bg gray-border-right-bot report-td">{val_v_v.name}</Col>
                                            <Col span={12} className="gray-border-right-bot report-td"></Col>
                                        </Row>
                                    )}
                                </Col>)}
                            </Row>
                            {
                                val.children_two.map((val_v,k)=>
                                <Row className="center-style flex" key={k}>
                                    <Col span={6} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">{val_v.name}</Col>
                                    <Col span={18} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex"></Col>
                                </Row>
                            )}
                        </div>
                    }
                    {val.type === '2' && this.valueEffective(values) &&
                        <div className="gray-border-left margin-bot20">
                            {!val.noTitle && <Row className="center-style flex">
                                {
                                    val.children.map((val_v,index)=>
                                    <span key={index} style={{width:`${val_v.width}%`}} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                        {val_v.name}
                                    </span>
                                )}

                            </Row>}
                            {values && values.map((val_v,k)=>
                            <Row key={k} className="center-style flex">
                                {
                                    val.children.map((val_v_v,kk)=>
                                    <span key={kk} style={{width:`${val_v_v.width}%`}} className={val_v_v.childText? '': 'flex'}>
                                    {val_v_v.titleVal && <div className="full_width flex">
                                            <span className="full_width gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                                {val_v_v.text ? val_v_v.text: ''}<span className={`${val_v_v.style? val_v_v.style: ''} betw2`}>{val_v[val_v_v.titleVal]}</span>{val_v_v.unit? val_v_v.unit:''}
                                            </span>
                                    </div>}
                                    { val_v_v.childText ?  val_v[val_v_v.value].map((child,child_k)=>
                                        <div className="full_width flex" key={child_k}>
                                            {val_v_v.childText.map((child_v,child_v_k)=>
                                                <span key={child_v_k} style={{width:`${100/val_v_v.childText.length}%`}} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                                {
                                                    child_v.children.map((child_v_v,child_v_v_k)=>
                                                    <span key={child_v_v_k}>
                                                        {child_v_v.name? child_v_v.name: ''}<span className={`${child_v_v.style? child_v_v.style:''} betw2`}> {child[child_v_v.value]? child[child_v_v.value]: '--'} </span>{child_v_v.unit? child_v_v.unit:''}
                                                    </span>
                                                )}

                                                </span>
                                            )}
                                        </div>
                                    )
                                    :
                                        <span className={`${kk === 0 ? 'gray-bg': ''} full_width gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex`}>
                                            {val_v[val_v_v.value] ? val_v[val_v_v.value]: '--'}
                                        </span>
                                    }
                                    </span>
                                )}

                            </Row>)}
                        </div>
                    }
                    {val.type === '3' && this.valueEffective(values) &&
                        <div className="gray-border-left margin-bot20">
                            <Row className="center-style flex flex-wrap-wrap">
                            {
                                val.children.map((val_v,k)=>
                                val_v.titleTip ?
                                val_v.titleTip.map((tItem,tKey)=>
                                    <Col key={tKey} span={val_v.widths ? val_v.widths[tKey]: 24/val_v.titleTip.length} className={`flex gray-border-right-bot ${val_v.align === 'no-center' ? '' : 'flex-align-center flex-pack-center'} report-td-flex`}>{tItem}</Col>
                                )
                                :this.type3Show(val_v, values, k)
                            )}
                            </Row>
                        </div>
                    }
                    {val.type === '4' && this.valueEffective(values) &&
                        <div className="gray-border-left margin-bot20">
                            <Row className="center-style flex">
                                <span key='-1' style={{width:`${100/(val.children_one.childTextX.length+1)}%`}} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                </span>
                            {
                                val.children_one.childTextX.map((val_v,k)=>
                                    <span key={k} style={{width:`${100/(val.children_one.childTextX.length+1)}%`}} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                        {val_v.name}
                                    </span>
                            )}
                            </Row>

                            {
                                val.children_one.childTextY.map((val_v,k)=>
                                <Row className="center-style flex" key={k}>
                                    <span key='-1' style={{width:`${100/(val.children_one.childTextX.length+1)}%`}} className={`${val_v.style} gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex`}>
                                        {val_v.name}
                                    </span>
                                    {
                                        val.children_one.childTextX.map((val_v_v,kk)=>
                                            <span key={kk} style={{width:`${100/(val.children_one.childTextX.length+1)}%`}} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                                {
                                                    values[val.children_one.value].map((val_v_v_v,kkk)=>
                                                    val_v_v_v[val_v_v.value] === val_v_v.name && val_v_v_v[val_v.value] === val_v.name ? val_v_v_v[val.children_one.showValue] : ''
                                                )}
                                            </span>
                                    )}
                                </Row>
                            )}
                            {values[val.children_two.value] &&
                                values[val.children_two.value].map((val_v,k)=>
                                <Row className="gray-border-right-bot" key={k} style={{padding: '10px'}}>
                                    <div className="title-style">{val_v[val.children_two.childText.type]}</div>
                                    <div>{val_v[val.children_two.childText.headTitle]}</div>
                                    <div>
                                        {val_v[val.children_two.childText.item] &&
                                            val_v[val.children_two.childText.item].map((val_v_v,kk)=>
                                                <div key={kk}>{kk+1}. {val_v_v}</div>
                                        )}
                                    </div>
                                </Row>
                            )}
                        </div>
                    }
                    {val.type === '5' && this.valueEffective(values) &&
                        <div className="gray-border-left margin-bot20">
                            <Row className="center-style flex">
                            {
                                val.children.map((val_v,k)=>
                                    <span key={k} style={{width:`${val_v.width? val_v.width: 100/val.children.length}${val_v.width? '':'%'}`}} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                        {val_v.name}
                                    </span>
                            )}
                            </Row>
                            {values &&
                                values.map((val_v,k)=>
                                    <Row className="center-style flex" key={k}>
                                        {val.children.map((val_v_v,kk)=>
                                                    (val.limit && val.limit >k) || !val.limit ? <span key={kk} style={{width:`${val_v_v.width? val_v_v.width: 100/val.children.length}${val_v_v.width? '':'%'}`}} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                                    { this.type5Show(val_v,val_v_v,k)

                                                        }
                                                    </span> : null
                                        )}
                                    </Row>
                            )}
                        </div>}
                        {val.type === '6' && values && val.childVal_v_title.map((child,child_k)=>
                            <div className={`${child_k === 1 ? 'margin-bot20' : ''} gray-border-left`} key={child_k}>
                                <div className="gray-border-right-bot report-td-flex">{child}</div>
                                <Row className="center-style flex">
                                {values[child_k] ?
                                    val.children.map((val_v,k)=>
                                        <span key={k} style={{width:`${100/val.children.length}%`}} className="gray-bg gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                            {val_v.name}
                                        </span>
                                ):
                                <Col span={24} className="gray-border-right-bot report-td">无信息</Col>
                                }
                                </Row>
                                {values[child_k] && values[child_k][val.childVal_v_v] &&
                                    values[child_k][val.childVal_v_v].map((val_v,k)=>
                                        <Row className="center-style flex" key={k}>
                                            {
                                            val.children.map((val_v_v,kk)=>
                                                    <span key={kk} style={{width:`${100/val.children.length}%`}} className="gray-border-right-bot flex flex-align-center flex-pack-center report-td-flex">
                                                        { this.type5Show(val_v,val_v_v,k)

                                                        }
                                                    </span>
                                            )}
                                        </Row>
                                )}
                            </div>
                        )}
                    </div>
                )
            )
    }
    render() {
        const {  items, data } = this.props

        return (<div>
            {data && JSON.stringify(data) !== '{}' && items.map((item,i)=>
            this.mainValuesShow(item.mainValues,data)&&
                <div className="" key={i}>
                    <h2 className="center-style report-m-t">{item.title}</h2>
                    {
                        item.children.map((val,index)=>
                            <div className="report-m" key={index}>
                                { this.ModuleTextShow(val,data) }
                            </div>
                        )
                    }
                </div>
            )}
        </div>)
    }
}
class CreditReport extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handlecancelCreditReport: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        personalBusinessId: PropTypes.string.isRequired,
        enterpriseBusinessId: PropTypes.string.isRequired,
    };

    static defaultProps = {
    };
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            loading: true,
            tabChanged: false,
            enterpriseCreditReportData: {},
            personCreditReportData: {},
            personCreditReportInfo: {}
        }
    }
    componentDidMount(){ //预加载数据
        this.propsDo(this.props)
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsDo(nextProps)
    }
    propsDo = (props) => {
        console.log("props1:",props)
        if (props.visible !== this.state.visible) {
            this.setState({
                visible: props.visible
             },function(){
                 if (props.type === '1') {
                    this.enterpriseDataGet()
                 } else {
                     this.personalDataGet()
                 }
             })
        }
    }
    personalDataGet () {
        request(api.personCreditReport,{
            businessId: this.props.personalBusinessId
        },'get',session.get('token'))
            .then(res => {
                console.log(JSON.stringify(res))
                this.setState({loading:false})
                if (res.success){
                    this.setState({
                        personCreditReportData: res.data? res.data : {},
                        personCreditReportInfo: res.data2? res.data2 : {},
                    })
                } else {
                   message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({loading:false})
            })
    }
    enterpriseDataGet () { //请求数据函数
        request(api.enterpriseCreditReport,{
            businessId: this.props.enterpriseBusinessId
        },'get',session.get('token'))
            .then(res => {
                console.log('enterpriseCreditReportData',JSON.stringify(res))
                this.setState({loading:false})
                if (res.success){
                    this.setState({
                        enterpriseCreditReportData: res.data? res.data : {},
                    })
                } else {
                   message.error(res.message)
                }
            })
            .catch(err => {
                this.setState({loading:false})
            })
    }

    _exportDownload (style) {
        let api_u = '';
        let param =  '';
        if (style === 'personal') {
            api_u = api.GRexportDownload;
            param =  this.props.personalBusinessId;
        } else if(style === 'enterprise') {
            api_u = api.QYexportDownload;
            param =  this.props.enterpriseBusinessId;
        }
        console.log(apiUrl+api_u+'?businessId='+param)
        window.open(apiUrl+api_u+'?businessId='+param)
    }

    handleCancel = (e) => {
        this.setState({
            tabChanged: false
        },function(){
            this.props.handlecancelCreditReport()
        })
    }
    tabChange = (e) => {
        if (e == 2 && !this.state.tabChanged) {
            this.personalDataGet()
            this.setState({
                loading: true,
                tabChanged: true
            })
        }
    }
    render() {
        const {  personCreditReportInfo, visible, loading, enterpriseCreditReportData, personCreditReportData } = this.state
        const { type } = this.props
        return (
            <Modal
                title=""
                visible={visible}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                width='70%'
                footer={[
                    <Button key="back" className="default-btn" onClick={this.handleCancel}>返回</Button>,
                ]}
            >
                <Spin spinning={loading} size="large">
                {type === '1' ? <Tabs onChange={this.tabChange} defaultActiveKey="1" style={{width: '100%'}}>
                    <TabPane tab="企业分析报告" key="1" forceRender={true}>
                        <div className="padding15">
                            <div>报告编号：{enterpriseCreditReportData.orderNo? enterpriseCreditReportData.orderNo : '--'}<Button className="green-style download_but" onClick={this._exportDownload.bind(this,'enterprise')}><Icon type="download" />下载企业分析报告</Button></div>
                            <div>生成时间：{enterpriseCreditReportData.generateDate? enterpriseCreditReportData.generateDate : '--'}</div>
                        </div>
                        <div className="padding15">
                            <h1 className="center-style">企业分析报告</h1>
                        </div>
                        <div className="padding15 gray-bg">
                            <div className="t-left"><div>企业名称：{enterpriseCreditReportData && enterpriseCreditReportData['qy_qiyegongshang'] ? enterpriseCreditReportData['qy_qiyegongshang'].name : '--'}</div></div>
                            <div className="t-right"><div>企业社会信用代码：{enterpriseCreditReportData && enterpriseCreditReportData['qy_qiyegongshang'] ? enterpriseCreditReportData['qy_qiyegongshang'].credit_no : '--'}</div></div>
                        </div>
                        <TableTemplateHandle items={enterpriseReport} data={enterpriseCreditReportData}/>
                    </TabPane>
                    {this.props.personalBusinessId && <TabPane tab="法人分析报告" key="2" forceRender={true}>
                        <div className="padding15">
                            <div>报告编号：{personCreditReportData.orderNo? personCreditReportData.orderNo : '--'}<Button className="green-style download_but" onClick={this._exportDownload.bind(this,'personal')}><Icon type="download" />下载法人分析报告</Button></div>
                            <div>生成时间：{personCreditReportData.generateDate? personCreditReportData.generateDate : '--'}</div>
                        </div>
                        <div className="padding15">
                            <h1 className="center-style">法人分析报告</h1>
                        </div>
                        <div className="padding15 gray-bg">
                            <div className="t-left"><div>姓名：{personCreditReportInfo.name ? personCreditReportInfo.name: '--'}</div><div>身份证号：{personCreditReportInfo.identityCard ? personCreditReportInfo.identityCard: '--'}</div></div>
                            <div className="t-right"><div>手机号：{personCreditReportInfo.phone ? personCreditReportInfo.phone: '--'}</div><div>银行卡号：{personCreditReportInfo.cardNo ? personCreditReportInfo.cardNo: '--'}</div></div>
                        </div>
                        <TableTemplateHandle items={personalReport} data={personCreditReportData}/>
                    </TabPane>}
                </Tabs> :
                <div className="full_width">
                    <div className="padding15">
                        <div>报告编号：{personCreditReportData.orderNo? personCreditReportData.orderNo : '--'}<Button className="green-style download_but" onClick={this._exportDownload.bind(this,'personal')}><Icon type="download" />下载个人分析报告</Button></div>
                        <div>生成时间：{personCreditReportData.generateDate? personCreditReportData.generateDate : '--'}</div>
                    </div>
                    <div className="padding15">
                        <h1 className="center-style">个人分析报告</h1>
                    </div>
                    <div className="padding15 gray-bg">
                        <div className="t-left"><div>姓名：{personCreditReportInfo.name ? personCreditReportInfo.name: '--'}</div><div>身份证号：{personCreditReportInfo.identityCard ? personCreditReportInfo.identityCard: '--'}</div></div>
                        <div className="t-right"><div>手机号：{personCreditReportInfo.phone ? personCreditReportInfo.phone: '--'}</div><div>银行卡号：{personCreditReportInfo.cardNo ? personCreditReportInfo.cardNo: '--'}</div></div>
                    </div>
                    <TableTemplateHandle items={personalReport} data={personCreditReportData}/>
                </div>
            }
                </Spin>
            </Modal>
        )
    }
}
export default CreditReport
