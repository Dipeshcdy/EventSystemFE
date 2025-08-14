import { EventTimeStatus } from '../../constants/constants'
import Events from './Events'

const OngoingEvent = () => {
  return (
    <Events status={EventTimeStatus.Ongoing} />
  )
}

export default OngoingEvent