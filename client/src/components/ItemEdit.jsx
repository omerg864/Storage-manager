import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, FormControlLabel, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function ItemEdit({item, handleChange, toggleChange, index, saveItem, setEditItem}) {
    const { t } = useTranslation('translation', { keyPrefix: 'ItemEdit' });
    
    console.log(item);
  return (
    <Accordion expanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className='space w-100' style={{padding: "0 5px 0 0"}}>
              <div className='item-header'>
                <TextField id="name" onClick={(e) => {e.stopPropagation();}} value={item.name} label={t('name')} name='name' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
                <Divider orientation="vertical" flexItem />
                <TextField id="serial_number" onClick={(e) => {e.stopPropagation();}} value={item.serial_number} label={t('serial_number')} name='serial_number' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
              </div>
              <div className='center'>
                <TextField id="quantity" onClick={(e) => {e.stopPropagation();}} value={item.quantity} label={t('quantity')} name='quantity' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space">
            <TextField id="order_to" value={item.order_to} label={t('order_to')} name='order_to' 
                type="text" required color="error" variant="outlined" onChange={handleChange} />
                        <FormControlLabel control={<Checkbox  checked={item.replacement} sx={{padding: 0}} onClick={toggleChange} color="error" />} label={t('replacement')}/>
            </div>
            <div className={`space w-100`} style={{marginTop: '10px'}}>
            <Button color="error" onClick={() => setEditItem(false)}>{t('cancel')}</Button>
              <Button onClick={() => saveItem(index)}>{t('save')}</Button>
            </div>
          </AccordionDetails>
        </Accordion>
  )
}

export default ItemEdit