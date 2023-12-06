import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, IconButton, Typography } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import RecyclingIcon from '@mui/icons-material/Recycling';

function ItemDisplay({item, rejected, setEditItem, setUseItem, order, setEditOrder, used}) {

  const { t } = useTranslation('translation', { keyPrefix: 'ItemDisplay' });

  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.serial_number);
    toast.info(t('copied'));
  }

  const editMode = () => {
    if (order) {
      setEditOrder(order);
      setEditItem(item);
    } else {
      setEditItem(item);
    }
  }
  return (
    <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className='space w-100' style={{padding: "0 5px 0 0"}}>
              <div className='item-header'>
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
          <AccordionDetails>
            <Typography>{t('orderTo')}: {item.order_to}</Typography>
            {item.used_for && <Typography>{t('usedFor')}: {item.used_for}</Typography>}
            {rejected && <Typography>{t('rejected')}: {rejected}</Typography>}
            <div className={`${order ? 'center' : 'space'} w-100`}>
            {!order && <Button color='secondary' onClick={() => setUseItem(item)}>{used ? t('restitution') : t('use')}</Button>}
              <Button onClick={editMode}>{t('edit')}</Button>
            </div>
          </AccordionDetails>
        </Accordion>
  )
}

export default ItemDisplay