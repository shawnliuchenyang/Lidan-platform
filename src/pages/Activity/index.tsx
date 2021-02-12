import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getSkuList, skuApply, skuApprove, skuStop } from '@/service/cargo'
import { PRIORITY_INFO, SKU_STATUS_INFO } from '@/constants/basic'
import { getSkuStatus, cargoStatus, realStatus, skuType } from '@/utils/common'
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const Cargo: FC = () => {

  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState([]);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [operateId, setoperateId] = useState(0);
  const [showOfflineModal, setshowOfflineModal] = useState(false);
  const [showOnlineModal, setshowOnlineModal] = useState(false);
  const [showCheckModal, setshowCheckModal] = useState(false);
  const [auditor, setauditor] = useState(username);
  const [auditStatus, setauditStatus] = useState('');

  useEffect(() => {
    getActivityList()
  }, []);

  useEffect(() => {
    getActivityList()
  }, [page]);

  const getActivityList = async(init?:boolean) => {
    const params = form.getFieldsValue()
    const statusParams = realStatus[params.status]
    const enable_time = params.dateRange?params.dateRange[0].format('YYYY-MM-DD'):''
    const expire_time = params.dateRange?params.dateRange[1].format('YYYY-MM-DD'):''
    delete params.dateRange
    setloading(true)
    try{
      let staff_list = [
      {
        id: 0,
        name: "会议一",
        scene: "线下会议",
        city: "北京",
        place: "北京会议红心-北京市朝阳区来广营西路88号",
        dateRange: "2021-02-02 00:00:00~2021-03-02 23:59:59",
        status:-1,
        budget: 100000.00,
        creator: "liuchenyang"
      },
      {
        id: 1,
        name: "会议二",
        scene: "线下会议",
        city: "成都",
        place: "武侯会议中心-四川省成都市武侯区置信北路3号",
        dateRange: "2021-01-28 00:00:00~2021-02-23 23:59:59",
        status: 1,
        budget: 200000.00,
        creator: "liuchenyang"
      },
      {
        id: 2,
        name: "会议三",
        scene: "线上会议",
        city: "",
        place: "Zoom-25847652",
        dateRange: "2021-05-28 00:00:00~2021-06-23 23:59:59",
        status: 2,
        budget: 25000.00,
        creator: "liuchenyang"
      },
    ]
    console.log('params.status', params.status)
      if(params.status == -1){
        staff_list = [staff_list[0]]
      }

      if(params.status == 1){
        staff_list = [staff_list[1]]
      }

      if(params.status == 2){
        staff_list = [staff_list[2]]
      }
      setStaffList(staff_list)
      // const res = await getSkuList({
      //   ...params,
      //   ...statusParams,
      //   enable_time,
      //   expire_time,
      //   page: init?1:page,
      //   limit: 20,
      // })
      // if(res.data){
      //   setStaffList(res.data.data)
      //   settotal(res.data.pagination.total_records)
      //   if(init){
      //     setpage(1)
      //   }
      // }
      
    }catch(err){
      message.error(err)
    }
    setloading(false)
  }

  const goDetail = (item:any, type: string) => {
    const query = item.id?
    {
      id: item.id,
      type,
    }:
    {
      type,
    }
    router.push({
      pathname: '/activity/detail',
      query
    });
  }

  const checkSKU = async() => {
    try {
      const params = {
        id: operateId,
        auditor,
        audit_status: auditStatus,
      }
      const res = await skuApprove(params)
      if(res.errno === 0){
        message.success("签到成功")
        toggleCheckModal(-1)
        getActivityList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const onlineSKU = async() => {
    const list = staffList
    list[operateId].status = 1
    setStaffList(list)
        toggleOnlineModal(-1)
    // try {
    //   const res = await skuApply({id: operateId})
    //   if(res.errno === 0){
    //     message.success("申请上架成功")
    //     toggleOnlineModal(-1)
    //     getActivityList()
    //   }
    // }catch(err){
    //   message.error(err)
    // }
  }

  const offlineSKU = async() => {
    const list = staffList
    list[operateId].status = -1
    setStaffList(list)
    toggleOfflineModal(-1)
    // try {
    //   const res = await skuStop({id: operateId})
    //   if(res.errno === 0){
    //     message.success("商品下架成功")
    //     toggleOfflineModal(-1)
    //     getActivityList()
    //   }
    // }catch(err){
    //   message.error(err)
    // }
  }

  // const toggleCheckModal = (operateId: number) => {
  //   setshowCheckModal(!showCheckModal)
  //   setoperateId(operateId)
  // }

  const toggleOnlineModal = (operateId: number) => {
    setshowOnlineModal(!showOnlineModal)
    setoperateId(operateId)
  }

  const toggleOfflineModal = (operateId: number) => {
    setshowOfflineModal(!showOfflineModal)
    setoperateId(operateId)
  }



   const renderOperation = (audit_status:number, status:number, item:any) => {
    if(status === 1){
        return(
          <div>
            <a  onClick={() => goDetail(item, "check")}>
              查看
            </a>
            <a  onClick={() => goDetail(item, "check")}>
              编辑
            </a>
            <a onClick={() => toggleOfflineModal(item.id)}>
              活动下线
            </a>
          </div>
        )
    }

    if(status === -1 || status === -2){
      return(
        <div>
          <a  onClick={() => goDetail(item, "check")}>
            查看
          </a>
          <a  onClick={() => goDetail(item, "check")}>
            编辑
          </a>
          <a onClick={() => toggleOnlineModal(item.id)}>
            活动审核
          </a>
        </div>
      )
  }
  }

  const renderColumns = () => {
    const { type } = form.getFieldsValue()
    const columns = [
      {
        title: '活动ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '活动形式',
        dataIndex: 'scene',
        key: 'scene',
      },
      {
        title: '活动城市',
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: '活动地点',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '活动预算',
        dataIndex: 'budget',
        key: 'budget',
        render: (price:number, item:any) => (
          <div>
            {price+"元"}
          </div>
      )
      },
      {
        title: '活动有效期',
        dataIndex: 'dateRange',
        key: 'dateRange',
      },
      {
        title: '活动状态',
        dataIndex: 'status',
        key: 'status',
        render: (status:number, item:any) => (
          <div>
            {getSkuStatus(status)}
          </div>
      )
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'status',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (_:any, item:any) => (
          <div className="operate-wrap">
              <div>
              {renderOperation(item.audit_status, item.status, item)}
              </div>
          </div>
        )
      }
    ]

    return columns
  }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>活动管理</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
        initialValues={{
        }}
      >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="活动名称" name="name">
            <Input placeholder="活动名称"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="活动形式" name="title">
            <Input placeholder="活动形式"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="活动城市" name="phone">
            <Input placeholder="活动城市"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="活动状态" name="status" >
              <Select placeholder="活动状态" allowClear defaultValue="">
                {skuType.map((item:any) => (
                  <Option key={item.key} value={item.key}>{item.desc}</Option>
                ))}
              </Select>
          </Form.Item>
        </Col>
      </Row>     
      </Form>
      <div className={styles.btnGroup}>
        <Button type="primary" onClick={() => getActivityList(true)} className={styles.searchBtn}>查询</Button>
        <Button type="primary" onClick={() => goDetail({}, "create")} className={styles.createNew}>创建</Button>
      </div>

          <div className={styles.tableArea}>
          <Spin spinning={loading}>
          <Table
              columns={renderColumns()}
              dataSource={staffList}
              pagination={{current:page, pageSize:20, total, onChange:(page: number) => setpage(page)}}
              rowKey='id'
        />
          </Spin>
          </div>
        </div>
        <Modal
          visible={showCheckModal}
          title="签到管理"
          onOk={checkSKU}
          onCancel={() => toggleCheckModal(-1)}
        >
        <div>
        <div className={styles.condition}>
            <div className={styles.title}>
            <span className="coupon-required">*</span>
              审批人</div>
            <Input 
              value={auditor}
              disabled={true}
              placeholder="请输审批人名称"
              onChange={(e) => setauditor(e.target.value)}/>
          </div>

          <div className={styles.condition}>
            <div className={styles.title}>
            <span className="coupon-required">*</span>
              审批状态</div>
            <Radio.Group  onChange={(e) => setauditStatus(e.target.value)} value={auditStatus}>
              <Radio value={2}>驳回</Radio>
              <Radio value={3}>通过</Radio>
            </Radio.Group>
          </div>

        </div>
      </Modal>

      <Modal
          visible={showOnlineModal}
          title="人员签到"
          onOk={onlineSKU}
          onCancel={() => toggleOnlineModal(-1)}
        >
        <div>
          确定要签到吗？
        </div>
      </Modal>

      <Modal
          visible={showOfflineModal}
          title="商品下架"
          onOk={offlineSKU}
          onCancel={() => toggleOfflineModal(-1)}
        >
        <div>
          确定要下架该商品吗？
        </div>
      </Modal>
      </div>
    )
}

export default Cargo
