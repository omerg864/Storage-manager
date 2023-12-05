import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Cookies from 'universal-cookie';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs } from '@mui/material';
import OrderList from '../components/OrderList';
import AddIcon from '@mui/icons-material/Add';

function Orders({ isAuthenticated }) {

  const { t } = useTranslation('translation', { keyPrefix: 'Orders' });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nav, setNav] = useState(false);
  const cookies = new Cookies();
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  useEffect(() => {
    getOrders();
  }, [query, tab]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const getOrders = async () => {
    setIsLoading(true);
    let page = query.get('page') ? query.get('page') : 1;
    try {
      const response = await fetch(`/api/order?page=${page}&status=${tab}`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          setOrders(data.orders);
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
      <h1>{t('orders')}</h1>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
      >
        <Tab label={t('pendingOrder')} />
        <Tab label={t('ordered')} />
        <Tab label={t('approved')} />
        <Tab label={t('rejected')} />
        <Tab label={t('received')} />
      </Tabs>
      </Box>
      <OrderList list={orders} value={tab} index={0} />
      <OrderList list={orders} value={tab} index={1} />
      <OrderList list={orders} value={tab} index={2} />
      <OrderList list={orders} value={tab} index={3} />
      <OrderList list={orders} value={tab} index={4} />
      <SpeedDial
                ariaLabel="navigation"
                sx={{ position: 'sticky', bottom: 16, marginLeft: "auto", marginRight: "1rem", marginTop: "auto" }}
                icon={<SpeedDialIcon />}
                onClose={() => setNav(false)}
                onOpen={() => setNav(true)}
                open={nav}>
                    <SpeedDialAction 
                        icon={<AddIcon/>}
                        tooltipTitle={t('newOrder')}
                        tooltipOpen
                        onClick={() => navigate('/new/order')}
                    />
      </SpeedDial>
    </main>
  )
}

export default Orders