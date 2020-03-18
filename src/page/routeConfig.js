export default [
    {
        path: '/home',
        breadcrumbName: '首页',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./home'))
            })
        }
    },
    {
        path: '/loan-application',
        breadcrumbName: '借款申请列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./loan-application/loan-application'))
            })
        }
    },
    {
        path: '/loan-application/loan-application-detail/:id/:productId/:status',
        breadcrumbName: '借款申请列表新增',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./loan-application/loan-application-detail'))
            })
        }
    },
    {
        path: '/risk-management',
        breadcrumbName: '风控列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./risk-management/risk-management'))
            })
        }
    },
    {
        path: '/risk-management/risk-management-detail/:id/:productId/:auditId/:status',
        breadcrumbName: '风控详情',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./risk-management/risk-management-detail'))
            })
        }
    },
    {
        path: '/sign-contract',
        breadcrumbName: '签约列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./sign-contract/sign-contract'))
            })
        }
    },
    {
        path: '/sign-contract/sign-contract-detail/:id/:productId/:auditId/:status',
        breadcrumbName: '签约详情',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./sign-contract/sign-contract-detail'))
            })
        }
    },
    {
        path: '/re-checked',
        breadcrumbName: '复核列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./re-checked/re-checked'))
            })
        }
    },
    {
        path: '/re-checked/re-checked-detail/:type/:id/:productId/:auditId/:status',
        breadcrumbName: '复核详情',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./re-checked/re-checked-detail'))
            })
        }
    },
    {
        path: '/repayment-calculator',
        breadcrumbName: '贷款计算器',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./repayment-calculator/repayment-calculator'))
            })
        }
    },
    {
        path: '/finance',
        breadcrumbName: '放款',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./finance/finance'))
            })
        }
    },
    {
        path: '/finance/finance-detail/:borrowerId/:productId',
        breadcrumbName: '放款详情',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./finance/finance-detail'))
            })
        }
    },
    {
        path: '/aftnotice',
        breadcrumbName: '贷后-到期提醒',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./after-the-loan/expiration-reminding'))
            })
        }
    },
    {
        path: '/aftoverdue',
        breadcrumbName: '贷后-逾期催收',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./after-the-loan/overdue-collect'))
            })
        }
    },
    {
        path: '/srchrepay',
        breadcrumbName: '贷后-还款列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./after-the-loan/repayments-list'))
            })
        }
    },
    {
        path: 'after-the-loan/after-the-loan-detail/:id/:productId',
        breadcrumbName: '贷后-详情',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./after-the-loan/after-the-loan-detail'))
            })
        }
    },
    {
        path: '/common-file-list',
        breadcrumbName: '文档模板下载',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./document-template-download/index.jsx'))
            })
        }
    },
    {
        path: '/srchproduct',
        breadcrumbName: '案例列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                // cb(null, require('../component/charts/Recharts.jsx'))
                cb(null, require('./search/search'))
            })
        }
    },
    {
        path: '/aftrepay',
        breadcrumbName: '还款列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./search/repayments-list'))
            })
        }
    },
    {
        path: '/zip-download',
        breadcrumbName: '文件归档',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./zip-download/zip-download'))
            })
        }
    },
    {
        path: '/query-statistics',
        breadcrumbName: '统计',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./query-statistics/query-statistics'))
            })
        }
    },
    {
        path: '/reimapply',
        breadcrumbName: '财务报销-我申请的',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./reimburse/apply-list'))
            })
        }
    },
    {
        path: '/reimburse/add-apply/:pageType/:operationType/:reimburseType/:reimburseState/:listId/:taskId/:procInstId',
        breadcrumbName: '财务报销-添加申请',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./reimburse/apply-list/add-apply'))
            })
        }
    },
    {
        path: '/reimwait',
        breadcrumbName: '财务报销-待我审核',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./reimburse/verify-list'))
            })
        }
    },
    {
        path: '/reimdone',
        breadcrumbName: '财务报销-我已审核',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./reimburse/verified-list'))
            })
        }
    },
    {
        path: '/reimrep',
        breadcrumbName: '财务报销-报销列表',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./reimburse/export-list'))
            })
        }
    },
    {
        path: '/myCreate',
        breadcrumbName: '办公审批-我发起的',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./approval/approval-applied'))
            })
        }
    },
    {
        path: '/myAudit',
        breadcrumbName: '办公审批-待我审核',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./approval/approval-will-be-checked'))
            })
        }
    },
    {
        path: '/myComplete',
        breadcrumbName: '办公审批-我已审核',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./approval/approval-has-been-checked'))
            })
        }
    },
    {
        path: '/approval-add',
        breadcrumbName: '办公审批-新增申请',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./approval/approval-add'))
            })
        }
    },
    {
        path: '/copyForMe',
        breadcrumbName: '办公审批-抄送我的',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./approval/approval-copy-for-me'))
            })
        }
    },
    //404
    {
        path: '/404',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./not-found'))
            })
        }
    }
]

