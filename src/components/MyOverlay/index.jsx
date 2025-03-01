
import { Overlay, Loading } from '@nutui/nutui-react-taro'

const WrapperStyle = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function MyOverlay({ loading }) {

  return <Overlay visible={loading}>
    <div className="wrapper" style={WrapperStyle}>
      <Loading direction="vertical">加载中</Loading>
    </div>
  </Overlay>
}