import React, { Fragment, useEffect, useState } from 'react'
import ItemDisplay from './ItemDisplay';
import { useTranslation } from 'react-i18next';
import ItemEdit from './ItemEdit';

function OrderList({ index, value, list, saveOrder, setDisableSearch, storagesList}) {

    const { t } = useTranslation('translation', { keyPrefix: 'OrderList' });
    const [editItem, setEditItem] = useState(false);
    const [editOrder, setEditOrder] = useState(false);

    useEffect(() => {
        if(editItem) {
            setDisableSearch(true);
        }
    }, [editItem, editOrder, setDisableSearch]);

    const handleChange = (e) => {
        setEditItem({...editItem, [e.target.name]: e.target.value});
    }

    const toggleChange = (e) => {
        setEditItem({...editItem, replacement: !editItem.replacement});
    }

    const handleOrderChange = (e) => {
        console.log(e.target.value, e.target.name);
        setEditOrder({...editOrder, [e.target.name]: e.target.value});
    }

    const saveItem = (index) => {
        saveOrder(editOrder, editItem);
        setEditItem(false);
    }

    if (value !== index) {
        return null;
    }
  return (
    <div style={{ width: '100%', padding: "10px", boxSizing: 'border-box'}}>
        {list.map((order, index2) => {
            return (
                <Fragment key={order._id}>
                {editItem._id === order.item._id ? <ItemEdit storagesList={storagesList} index={index2} saveItem={saveItem} handleOrderChange={handleOrderChange} handleChange={handleChange} toggleChange={toggleChange} order={editOrder} item={editItem} setEditItem={setEditItem}/> 
                : <ItemDisplay order={order} setEditOrder={setEditOrder} setEditItem={setEditItem} key={order._id} item={order.item} rejected={order.rejected_description} />}
                </Fragment>
            )
        })}
        {list.length === 0 && <h3>{t('noOrders')}</h3>}
    </div>
  )
}

export default OrderList