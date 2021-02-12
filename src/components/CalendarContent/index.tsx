import React, { FC, useEffect, useState } from 'react';
import { Menu, Modal, message, Input } from 'antd';
import styles from './index.less'
import router from 'umi/router';
import Calendar from 'react-calendar';
import moment from 'moment'

const CalendarContent: FC = () => {

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'

  useEffect(() => {
  }, []);

  const onChange = (value) => {
    console.log('value', value)
  }

  const showTitleContent = ({ date, view }) => {
    console.log('date',  moment(date).format(dateFormat))
    return <div className={styles.itemContent}>国际会议</div>
  }

    return (
        <div className={styles.calendar}>
          <div className={styles.title}>
            <span className={styles.calendarIcon}/>
            会议日程安排</div>
          <Calendar
            onChange={onChange}
            // value={new Date()}
            showNavigation={true}
            tileContent={showTitleContent}
        />
      </div>
    )
}

export default CalendarContent
