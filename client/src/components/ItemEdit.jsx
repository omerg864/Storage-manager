import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, FormControlLabel, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { Fragment } from "react";


function ItemEdit({item, handleChange, toggleChange, index, saveItem, setEditItem, order, handleOrderChange, storagesList}) {

  const { t } = useTranslation('translation', { keyPrefix: 'ItemEdit' });

  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.serial_number);
    toast.info(t('copied'));
  }
  
  return (
    <Accordion expanded={true}>
          <AccordionSummary
          sx={{width: '100%'}}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
          <div className='space w-100 wrap' style={{padding: "0 5px 0 0"}}>
              <div className='item-header wrap'>
                <Typography>{item.name}</Typography>
                <Divider orientation="vertical" flexItem />
                <Typography>{item.serial_number.substring(0, 4)}-{item.serial_number.substring(4, 10)}</Typography>
              </div>
              <div className='center' style={{gap: '5px'}}>
                <Typography>{item.quantity}</Typography>
                {item.replacement && <RecyclingIcon />}
                <IconButton onClick={copy}>
                  <ContentCopyIcon/>
                </IconButton>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <TextField id="name" onClick={(e) => {e.stopPropagation();}} value={item.name} label={t('name')} name='name' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
            <TextField id="serial_number" onClick={(e) => {e.stopPropagation();}} value={item.serial_number} label={t('serialNumber')} name='serial_number' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
            <TextField id="quantity" onClick={(e) => {e.stopPropagation();}} value={item.quantity} label={t('quantity')} name='quantity' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
            <TextField id="order_to" value={item.order_to} label={t('orderTo')} name='order_to' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
                        <FormControlLabel control={<Checkbox  checked={item.replacement} sx={{padding: 0}} onClick={toggleChange} color="error" />} label={t('replacement')}/>
            {order &&
            <Fragment>
              <Select
                id="status"
                color='error'
                name='status'
                value={order.status}
                label={t('status')}
                onChange={handleOrderChange}
            >
                <MenuItem value={0}>{t('pending')}</MenuItem>
                <MenuItem value={1}>{t('ordered')}</MenuItem>
                <MenuItem value={2}>{t('approved')}</MenuItem>
                <MenuItem value={3}>{t('rejected')}</MenuItem>
                <MenuItem value={4}>{t('received')}</MenuItem>
            </Select>
            {order.status === 3 && <TextField id="reject_description" value={order.reject_description} label={t('reject_description')} name='reject_description'/>}
            {order.status === 4 && 
                        <Select
                        id="storage"
                        color='error'
                        name='storage'
                        value={item.storage}
                        label={t('storage')}
                        onChange={handleChange}
                    >
                        {storagesList.map((storage, index) => {
                            return (
                                <MenuItem key={index} value={storage._id}>{storage.name}</MenuItem>
                            )
                        })}
                    </Select>}
            </Fragment>}
            <div className={`space w-100`} style={{marginTop: '10px'}}>
            <Button color="secondary" onClick={() => setEditItem(false)}>{t('cancel')}</Button>
              <Button color='error' onClick={() => saveItem(index)}>{t('save')}</Button>
            </div>
          </AccordionDetails>
        </Accordion>
  )
}

export default ItemEdit