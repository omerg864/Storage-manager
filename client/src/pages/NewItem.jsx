import { Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Cookies from 'universal-cookie';

function NewItem({ storageList }) {

    const [itemData, setItemData] = useState({name: '', serial_number: '', storage: '', quantity: 1, replacement: false, order_to: ''});
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation('translation', { keyPrefix: 'NewItem' });
    const cookies = new Cookies();

    const handleChange = (e) => {
        setItemData({...itemData, [e.target.name]: e.target.value})
        console.log(itemData);
    }

    const toggleReplacement = () => {
        setItemData({...itemData, replacement: !itemData.replacement})
    }

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await fetch('/api/item', { method: 'POST', headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}, body: JSON.stringify(itemData)})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                toast.success(t('itemCreated'));
                setItemData({name: '', serial_number: '', storage: '', quantity: 1, replacement: false, order_to: ''});
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
        <h1>{t('newItem')}</h1>
        <Box className='box-container' sx={{xs: {width: "100%"}, md: {width: "60%"}}} component={Paper}>
          <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit} >
            <TextField color='error' fullWidth id="name" value={itemData.name} label={t('name')} name='name' type="text" required variant="outlined" onChange={handleChange} />
            <TextField color='error' fullWidth id="serial_number" value={itemData.serial_number} label={t('serialNumber')} name='serial_number' type="text" required variant="outlined" onChange={handleChange} />
            <TextField color='error' fullWidth id="quantity" value={itemData.quantity} label={t('quantity')} name='quantity' type="number" required variant="outlined" onChange={handleChange} />
            <Select
                id="storage"
                color='error'
                name='storage'
                value={itemData.storage}
                label={t('storage')}
                onChange={handleChange}
            >
                {storageList.map((storage, index) => {
                    return (
                        <MenuItem key={index} value={storage._id}>{storage.name}</MenuItem>
                    )
                })}
            </Select>
            <FormControlLabel control={<Checkbox  checked={itemData.replacement} sx={{padding: 0}} onClick={toggleReplacement} color="error" />} label={t('replacement')}/>
            <TextField color='error' fullWidth id="order_to" value={itemData.order_to} label={t('orderTo')} name='order_to' type="text" variant="outlined" onChange={handleChange} />
            <div>
            <Button variant="contained" color="primary" type="submit" >{t('create')}</Button>
            </div>
          </form>
      </Box>
    </main>
  )
}

export default NewItem