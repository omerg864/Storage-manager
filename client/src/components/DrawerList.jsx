import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StorageIcon from '@mui/icons-material/Storage';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';

function DrawerList({list, toggleDrawer}) {

    const { t } = useTranslation('translation', { keyPrefix: 'DrawerList' });

    const navigate = useNavigate();

    const goto = (e, path) => {
        toggleDrawer(e);
        navigate(path);
    }

  return (
    <Box
      className="drawer_list"
      role="presentation"
    >
      <List>
        <Typography variant="h6" component="div" >
            {t("storages")}
        </Typography>
        {list.length ? list.map((storage, index) => (
          <ListItem key={storage._id} disablePadding>
            <ListItemButton onClick={(e) => goto(e, `/storage/${storage._id}`)}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={storage.name} />
            </ListItemButton>
          </ListItem>
        )) :         <ListItem disablePadding>
        <ListItemButton>
            <ListItemIcon>
            <DoNotDisturbAltIcon />
            </ListItemIcon>
            <ListItemText primary={t("noStorages")} />
        </ListItemButton>
    </ListItem>}
        <Divider />
        <ListItem disablePadding>
            <ListItemButton onClick={(e) => goto(e, '/')}>
                <ListItemIcon>
                <PendingActionsIcon />
                </ListItemIcon>
                <ListItemText primary={t("orders")} />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton onClick={(e) => goto(e, '/transactions')}>
                <ListItemIcon>
                <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={t("transactions")} />
            </ListItemButton>
        </ListItem>
      </List>
      <List sx={{width: '100%'}}>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => goto(e, '/new/storage')}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={t("newStorage")} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  )
}

export default DrawerList