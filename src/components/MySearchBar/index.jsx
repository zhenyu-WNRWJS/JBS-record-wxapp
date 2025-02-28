import { View, ScrollView } from '@tarojs/components'
import moment from 'moment'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'
import { Input, Dialog, SearchBar } from '@nutui/nutui-react-taro'
import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from 'ahooks';
import Taro from '@tarojs/taro';
import './index.less'


export default function MySearchBar({ value, onChange, placeholder, setVisible, visible }) {
  // console.log(value)
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, { wait: 500 });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [db] = useState(Taro.cloud.database());
  const _ = db.command;

  const handleSearch = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await db.collection('dramaInfo').where({
        name: new RegExp(term, 'i') // 模糊匹配 name 字段
      }).get();

      setSearchResults(res.data);
    } catch (err) {
      console.error('搜索失败', err);
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      handleSearch(debouncedValue);
    }
  }, [debouncedValue])

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const onConfirm = () => {
    console.log(selectedItem)
    onChange(selectedItem.name, selectedItem)
    setVisible(false)
  }

  useEffect(() => {

    return () => {
      setSearchValue('')
      setSearchResults([])
      setSelectedItem(null)
    }
  }, [visible])

  return (<View className="my-search-bar">
    <Input value={value} placeholder={placeholder} type="text" readOnly />
    <Dialog
      className="test-dialog"
      title=""
      visible={visible}
      onConfirm={onConfirm}
      onCancel={() => setVisible(false)}
      style={{
        '--nutui-dialog-width': '100vw',
        '--nutui-dialog-min-height': '100vh'
      }}
    >
      <>
        <SearchBar onChange={(val) => setSearchValue(val)} />
        <View className="popup-content">
          <ScrollView scrollY className="scroll-view">
            {searchResults.map((item, index) => (
              <View
                key={index}
                className={`list-item ${selectedItem && selectedItem._id === item._id ? 'selected' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                {item.name}
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    </Dialog>
  </View>)
} 