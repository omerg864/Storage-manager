import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Cookies from 'universal-cookie';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, Select, TextField } from '@mui/material';


function NewOrder() {

  const [itemData, setItemData] = useState({name: '', serial_number: '', quantity: 1, replacement: false, order_to: ''});
  const [orderData, setOrderData] = useState({ status: 0, reject_description: ''});
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'NewOrder' });
  const cookies = new Cookies();

  const handleItemChange = (e) => {
    setItemData({...itemData, [e.target.name]: e.target.value})
  }

  const handleOrderChange = (e) => {
    setOrderData({...orderData, [e.target.name]: e.target.value})
  }


  const toggleReplacement = () => {
      setItemData({...itemData, replacement: !itemData.replacement})
  }

  const handleSubmit = async (e) => {
      setIsLoading(true);
      e.preventDefault();
      try {
          const response = await fetch('/api/order', { method: 'POST', headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}, body: JSON.stringify({
            item: itemData,
            order: orderData
          })})
          const data = await response.json();
          if (!data.success) {
              toast.error(data.message);
          } else {
              toast.success(t('orderCreated'));
              setItemData({name: '', serial_number: '', storage: '', quantity: 1, replacement: false, order_to: ''});
              setOrderData({ status: 0, reject_description: ''});
          }
      } catch (err) {
          toast.error('Internal Server Error')
      }
      setIsLoading(false);
  }

  if(isLoading){
      return <Spinner />
  }

  return (
    <main>
        <h1>{t('newOrder')}</h1>
        <Box className='box-container' sx={{xs: {width: "100%"}, md: {width: "60%"}}} component={Paper}>
          <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit} >
            <TextField color='error' fullWidth id="name" value={itemData.name} label={t('name')} name='name' type="text" required variant="outlined" onChange={handleItemChange} />
            <TextField color='error' fullWidth id="serial_number" value={itemData.serial_number} label={t('serialNumber')} name='serial_number' type="text" required variant="outlined" onChange={handleItemChange} />
            <TextField color='error' fullWidth id="quantity" value={itemData.quantity} label={t('quantity')} name='quantity' type="number" required variant="outlined" onChange={handleItemChange} />
            <FormControlLabel control={<Checkbox  checked={itemData.replacement} sx={{padding: 0}} onClick={toggleReplacement} color="error" />} label={t('replacement')}/>
            <TextField color='error' fullWidth id="order_to" value={itemData.order_to} label={t('orderTo')} name='order_to' type="text" variant="outlined" onChange={handleItemChange} />
            <Select
                id="status"
                color='error'
                name='status'
                value={orderData.status}
                label={t('status')}
                onChange={handleOrderChange}
            >
                <MenuItem value={0}>{t('pending')}</MenuItem>
                <MenuItem value={1}>{t('ordered')}</MenuItem>
                <MenuItem value={2}>{t('approved')}</MenuItem>
                <MenuItem value={3}>{t('rejected')}</MenuItem>
                <MenuItem value={4}>{t('received')}</MenuItem>
            </Select>
            {orderData.status === 3 && <TextField color='error' fullWidth id="reject_description" value={orderData.reject_description} label={t('rejectDescription')} name='reject_description' type="text" variant="outlined" onChange={handleOrderChange} />}
            <div>
            <Button variant="contained" color="primary" type="submit" >{t('create')}</Button>
            </div>
          </form>
      </Box>
    </main>
  )
}

export default NewOrder