import React, {
  useCallback,
  useState
} from 'react'
import Taro from '@tarojs/taro';

const useCallFunction = (name, {
  data = {},
  success,
  error
}) => {

  const [loading, setLoading] = useState(false)

  const fetchFunc = useCallback(async (extra) => {
    try {
      setLoading(true)
      const result = await Taro.cloud.callFunction({
        name: name,
        data: {
          ...data,
          ...extra
        }
      })
      if (result.result.error) {
        console.error('云函数调用失败', result.result.error)
        await (async () => {
          if (error) {
            await (typeof error === 'function' ? new Promise((resolve) => {
              error(result.result.error)
              resolve();
            }) : Promise.resolve(success))
          }
          setLoading(false)
        })()
      } else {
        const data = result.result
        await (async () => {
          if (success) {
            await (typeof success === 'function' ? new Promise((resolve) => {
              success(data);
              resolve();
            }) : Promise.resolve(success))
          }
          setLoading(false)
        })()

      }
    } catch (err) {
      console.error('云函数调用失败', err)
    }
  }, [data])

  return {
    loading,
    run: fetchFunc
  }

}

export default useCallFunction;
