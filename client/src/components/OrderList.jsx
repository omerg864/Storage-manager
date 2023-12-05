import React from 'react'
import ItemDisplay from './ItemDisplay';
import { useTranslation } from 'react-i18next';

function OrderList({ index, value, list}) {

    const { t } = useTranslation('translation', { keyPrefix: 'OrderList' });

    if (value !== index) {
        return null;
    }
  return (
    <div style={{ width: '100%', padding: "10px", boxSizing: 'border-box'}}>
        {list.map((order) => {
            return (
                <ItemDisplay key={order._id} item={order.item} rejected={order.rejected_description}>
                </ItemDisplay>
            )
        })}
        {list.length === 0 && <h3>{t('noOrders')}</h3>}
    </div>
  )
}

export default OrderList