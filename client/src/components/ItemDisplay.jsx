import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, IconButton, Typography } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';

function ItemDisplay({item, rejected, setEditItem, setUseItem}) {

  const { t } = useTranslation('translation', { keyPrefix: 'ItemDisplay' });

  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.serial_number);
    toast.info(t('copied'));
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
                <Typography>{item.serial_number}</Typography>
              </div>
              <div className='center'>
                <Typography>{item.quantity}</Typography>
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
            <div className='space w-100'>
            <Button color='secondary' onClick={() => setUseItem(item)}>{t('use')}</Button>
              <Button onClick={() => setEditItem(item)}>{t('edit')}</Button>
            </div>
          </AccordionDetails>
        </Accordion>
  )
}

export default ItemDisplay