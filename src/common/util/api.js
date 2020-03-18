const api = {
    login: '/login', //登陆
    loginOut: '/login/out', //登出
    loanApplicationList: '/loans/enter/list', //进件列表信息
    riskManagementlist: '/loans/common/list', //风控到复核阶段列表信息
    loanApplicationDetailSave: '/loans/enter/save', //进件详情保存
    riskManagementAuditSave: '/loans/risk/save', //风控审核保存
    signAuditSave: '/loans/sign/save', //签约审核保存
    reCheckedSave: '/loans/recheckCommon/save', //复核审核保存
    riskManagementAuditDetail: '/loans/branchrisk/auditInfo', //风控审核展示
    riskManagementAuditSubmit: '/loans/common/submit', //风控审核提交
    loanApplicationBusinessSave: '/loans/customerEnter/save',//进件基本信息保存接口
    loanApplicationBusinessSave1: '/loans/customerEnter/save2',//进件基本信息保存接口
    loanApplicationSubmit: '/loans/enter/submit', //进件详情提交
    addressLinkage: '/common/area/json', //省市区联动
    repaymentType: '/common/getRepaymentType', //还款类型
    relationshipWithTheApplicant: '/common/getRelation', //与申请人关系
    loanTermUnit: '/common/getTimeUnit', //借款期限单位
    typeOfInterestRate: '/common/getInterestTimeUnit', //利率类型
    imgUpload: '/common/uploadFile',//图片上传
    ProductSelectInfo: '/loans/productName/list',//产品下拉显示
    InterestRateType: '/common/getInterestTimeUnit',//利率类型
    findRiskGet: '/loans/enter/findRisk',//风控审核人员
    productEnterSave: '/loans/productEnter/save',//多款产品信息录入
    customerByGet: '/loans/customerBy/list?id=',//查看借款人信息
    productByGet: '/loans/productBy/list?id=',//查看进件产品信息
    groupEnterSubmit: '/loans/groupEnter1/submit',//产品提交到风控
    repaymentCalculator: '/loans/repayment/plan',//还款计算器
    branchOffice: '/office/branch',//分公司列表，
    financeStatus: '/common/getQueryStages',//放款状态列表，
    financeTableList: '/loans/finace/list',//放款分页列表，
    searchStatusInfo: '/common/getQueryStages',//查询阶段接口
    ifSetValueDate: '/loans/contract/work/',//是否设置过起息日
    setValueDate: '/loans/contract/date',//设置起息日
    contractList: '/loans/contract/produce',//获取合同列表
    financeSave: '/loans/finance/save',//放款保存
    onceReceipt: '/loans/receipt/save',//一次性收费凭证保存接口
    expirationRemindingList: '/loans/expire/list',//贷后到期提醒列表
    overdueCollectList: '/loans/overdue/list',//贷后逾期催收列表
    repaymentsList: '/loans/refund/list',//贷后还款列表
    loansRepaymentList: '/loans/repayment/list',//还款列表查询接口
    loansRepaymentSave: '/loans/repayment/save',//还款操作保存和提交
    loansRepaymentInfo: '/loans/repayment/info?id=',//财务根据还款id加载单
    commonFavoriteFileList: '/common/favorite/filelist', //获取常用模板文件列表接口
    remRecSave: '/loans/remRec/save',//催收记录保存接口
    remRecGet: '/loans/remRec/list',//催收记录查询接口
    extendATimeLimitAdd: '/loans/defer2/save',//展期复制新增接口
    loanGiveSubmit: '/loans/give/submit', //财务放款确认提交到还款中
    loanFinishSubmit: '/loans/finish/submit',//财务还款中确认完成提交到还
    getRepaymentPlanByProductId: '/loans/repayment/list/',//通过产品Id得到还款详情
    notGroupAuditHistory: '/loans/notGroupAuditHistory/list',//审批流程记录不分组查询
    groupAuditHistory: '/loans/groupAuditHistory/list',//审批流程记录分组查询
    productDelete: '/loans/product/delete',//产品删除
    loansRepaymentProduce: '/loans/repayment/produce',//生成Excel表
    getSearchInfo: '/loans/search/info',//查询案件列表
    passwordUpdate: '/login/password/update',//修改密码
    allLenderList: '/lender/list',//所有出借人
    loansRecordList: '/loans/record/list?repaymentId=', //根据还款id查询还款记录
    loansRepaymentSubmit: '/loans/repayment/submit',//还款完成提交,
    repaymentExport: '/loans/repayment/lists',//还款列表导出,
    caseListExport: '/loans/repayment/excel',//案件列表导出
    creditGetModule: '/credit/enter/getModule',//征信查询待选模块
    emergencyEnterSave: '/loans/emergencyEnter/save',//紧急联系人信息保存
    wereborrowedSave: '/loans/wereborrowed/save',//共借人信息保存
    creditSaveModule: '/credit/enter/saveModule',//征信信息保存生成二维码
    creditReportType: '/credit/enter/report/type',//征信报告是企业还是个人
    enterpriseCreditReport: '/credit/enter/report/company',//企业征信报告查询
    personCreditReport: '/credit/enter/report/person',//个人征信报告查询,
    getEndDate: '/loans/product/getEndDate?id=',//根据产品id查询展期起息日和是否是展期
    advancePay: '/loans/repayment/rpepayment',//提前还款
    zipDownload: '/loans/zip/produce',//文件归档打包下载
    checkTable: '/loans/contract/loans?productId=',//放款审批单生成
    QYexportDownload: '/credit/pdf/exportPdfCreditQY',//企业pdf征信报告下载
    GRexportDownload: '/credit/pdf/exportPdfCreditGR',//企业pdf征信报告下载
    summaryGraphList: '/loans/summaryGraph/list',//统计图数据
    pendingPayment: '/loans/summaryGraph/pendingPayment',//待收与放款明细
    repaymentDetail: '/finance/repayment/detail/list/export',//财务还款明细
    repaymentListTotal: '/finance/repayment/list/export',//财务还款汇总
    loansFinanceList: '/loans/finace/list',//财务放款列表接口
    financeCheckSave: '/loans/fin/save',//财务审核保存接口
    /*   OA api   */
    reimburseApplyList: '/act/actPub/findMyCreate', // 申请列表查询
    approvalHistory: '/act/actPub/findComment?procInsId=', // 历史审批记录查询
    verifyList: '/act/actPub/findMyAudit',// 待审核列表查询
    listDetail: '/act/actPub/getBusinessReimburseId',// list详细信息
    company: '/sys/office/getAllCompany',// 所有机构
    department: '/sys/office/getDptByCompany?companyId=',// 机构部门
    submitVerify: '/act/actPub/completeTask',// 提交审核
    submitLoan: '/act/reimburse/loanReimburse',// 提交收放款
    inspectorInfo: '/act/actPub/findNextNode?procInsId=',// 获取审核人员信息
    reimburseSave: '/act/reimburse/save',// oa保存
    reimburseSubmit: '/act/reimburse/submit',// oa保存
    reimburseDelete: '/act/actPub/delete',// 删除我申请的
    reimburseCancel: '/act/actPub/cancel',// 撤销我申请的
    verifiedList: '/act/actPub/findMyComplete',// 已审核列表查询
    downloadReimburse: '/act/reimburse/exportPdfReimburse?id=', //下载审批单
    exportList: '/act/actPub/findExcel', // 报销列表
    exportExcel: '/act/actPub/export?', // 导出excel
    /*   OA 审批   */
    getAllApproval: '/wf/process/findAllProcess', //新建审批列表查询
    getFormJson: '/wf/proIns/getProcessForm',//查询审批表单
    approvalFileUpload: '/common/uploadFile2', //新的文件上传
    saveApproval: '/wf/proIns/formSave',//保存表单
    myCreateApproval: '/wf/proIns/findMyCreate',//我发起的审批单
    myCompletedApproval: '/wf/proIns/findMyComplete',//我已审核的审批单
    cancelApproval: '/wf/proIns/cancel', //撤销审批
    deleteApproval: '/wf/proIns/delete', //删除审批
    detailInfoById: '/wf/proIns/myCreateCheck',//我发起的--查看
    editInfoById: '/wf/proIns/formCheck',//查看展示编辑页面
    completedDetailInfoById: '/wf/proIns/myCompleteCheck',//我已审核--查看
    deleteFile: '/common/delFile?id=',//删除上传文件2
    downloadFile: '/wf/proIns/exportPdf',//下载文件
    submitApproval: '/wf/proIns/formSubmit',//流程表单提交
    getTreeData: '/sys/office/treeDataRest',//获取组织机构用户树形菜单
    willBeChecked: '/wf/proIns/findMyAudit',//待我审核
    auditInfo: '/wf/proIns/auditForm',//审核界面
    rejectAndPassAudit: '/wf/proIns/completeTaskByUser',//节点审批提交
    downEnclosure: '/common/downloadFile?id=',//下载附件
    auditedCopyFor: '/wf/proIns/completeAuditCopyFor',//我已审核-查看-抄送
    copyForMe: '/wf/proIns/copyForMine',//抄送我的
    copyForMeSubmit: '/wf/proIns/copyForWhoSubmit',//抄送我的-审核-评论-提交

    /*   文件流上传   */
    uploadFileStream: '/common/uploadFile2',//文件上传（文件流）2
};
export default api;
