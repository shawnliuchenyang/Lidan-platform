import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, InputNumber, Input, Radio, Select, message, Spin, DatePicker, Tooltip, Checkbox, Form, Space, Divider} from 'antd'
import router from 'umi/router';
import { saveModule, getMeetingDetail } from '@/service/cargoDetail'
import  WangEditor  from '@/components/WangEditor'
import  ImgUploader  from '@/components/img-uploader'
import Utils from '@/utils/common';

type IProps = {
  location: any
}

const ActivityBanner: FC<IProps> = (props) => {
  const moduleMaps = [
    {
      modelType:0,
      title:"会议信息",
      modelData: ""
    },
    {
      modelType:1,
      title:"组织机构",
      modelData: ""
    },
    {
      modelType:2,
      title:"大咖齐聚",
      modelData: ""
    },
    {
      modelType:3,
      title:"日程一览",
      modelData: ""
    },
    {
      modelType:4,
      title:"直播回放",
      modelData: ""
    },
    {
      modelType:5,
      title:"往期风采",
      modelData: ""
    },
    {
      modelType:6,
      title:"参展企业",
      modelData: ""
    },
    {
      modelType:7,
      title:"联系我们",
      modelData: ""
    },
    {
      modelType:8,
      title:"视频回放",
      modelData: ""
    },
  ]

  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [mode, setmode] = useState("");
  const [type, settype] = useState(1);
  const [moduleInfo, setmoduleInfo] = useState([]);

  const refInput = React.useRef(null);

  useEffect(() => {
    // setmoduleInfo(moduleMaps)
      const { query } = props.location
      const asyncOperate = async() => {
        setloading(true)
          const res  = await getMeetingDetail({meetingId:query.id})
          if(res && res.returncode === 0){
          let data = JSON.parse(JSON.stringify(res))      
          const { data : { expandInfo } } = data
          if(expandInfo.length){
            expandInfo.forEach(item => {
              const { modelType } = item
              const index = moduleMaps.findIndex(item => (item.modelType ==modelType))
              moduleMaps[index] = item 
            })
            setmoduleInfo(moduleMaps)
          }
          else{
            setmoduleInfo(moduleMaps)
          }
        }
        setloading(false)
      }
      asyncOperate()

      // setmode(query.type)
  }, []);

  const back = () => {
    router.goBack()
  }

  const changeValue = (e:any, id:number) => {
    const newInfo = moduleInfo
    const key = Number(id)
    newInfo[key].modelData = e
    setmoduleInfo(newInfo)
  }

  const renderModule = (item:any, index: number) => {
    const { modelType, modelData } = item
    const module = moduleMaps.find(item => (item.modelType == modelType))
    const title = module.title
      return (
        <div>
          <div className={styles.moduleTitle}>模块设置-{title}</div>
          {modelType == 4?
            <Input 
                placeholder="请输入直播链接"
                // value={item.modelData}
                onChange={(e) => changeValue(e.target.value, modelType)}
              />:null
          }
          {
            modelType !== 4?
              <WangEditor 
              value={modelData}
              editorid={item.modelType}
              changeEditor={changeValue}
                />:null
          }
          <Divider/>
        </div>
      )
  }

  const submit = async() => {
      try {
          const { query } = props.location
          const newInfo = moduleInfo.map(item => {
            return {
              ...item,
              isDel: 0,
            }
          })
          const params = {
            meetingId: query.id,
            modelList: newInfo
          }
          const res = await saveModule(params)
          if(res.returncode === 0){
            message.success(`成功编辑${res.data.successTotal}个模块` )
            if(res.data.failTotal){
              message.error(`失败${res.data.failTotal}个模块` )
            }
            // back()
          }
      }catch(err){
        message.error(err)
      }
  }

    return (
      <div className={styles.container}>
        <Spin spinning={loading}>
        <div className={styles.header}>
          <div className={styles.brumbs}>会议模块编辑</div>
        </div>
        <div className={styles.body}>
          <div>
          {moduleInfo.map((item, index) => (
            renderModule(item, index)
          ))}
          </div>
        <div>
        </div>
          <div className={styles.btnGroup}>
             <Button onClick={back} className={styles.cancel}>返回</Button>
             <Button onClick={submit} className={styles.submit} type="primary">保存</Button>
          </div>
        </div>
        </Spin>
      </div>
    )
}

export default ActivityBanner
