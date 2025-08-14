import React from 'react'
import Events from './Events'
import { EventTimeStatus } from '../../constants/constants'

const PastEvents = () => {
  return (
    <Events status={EventTimeStatus.Past} />
  )
}

export default PastEvents