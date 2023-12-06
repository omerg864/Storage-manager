import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Cookies from 'universal-cookie';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Pagination, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, TextField } from '@mui/material';
import OrderList from '../components/OrderList';
import AddIcon from '@mui/icons-material/Add';

function Orders({ isAuthenticated, storagesList }) {

  const { t } = useTranslation('translation', { keyPrefix: 'Orders' });
  const [orders, setOrders] = useState([]);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(true);
  const [disableSearch, setDisableSearch] = useState(false);
  const [nav, setNav] = useState(false);
  const cookies = new Cookies();
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
    query.set('page', 1);
    query.set('search', '');
    setSearch('');
    setSearched(true);
  };

  const handlePageChange = (e, page) => {
    navigate(`/?page=${page}`);
  }

  useEffect(() => {
    if(search === '' && searched) {
      getOrders(true);
    } else {
      getOrders(false);
      setSearched(false);
    }
  }, [query, tab, search]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const getOrders = async (loading) => {
    if(loading) 
      setIsLoading(true);
    let page = query.get('page') ? query.get('page') : 1;
    try {
      const response = await fetch(`/api/order?page=${page}&status=${tab}&search=${search}`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          setOrders(data.orders);
          setPages(data.pages ? data.pages : 1);
      }
    } catch (err) {
        toast.error('Internal Server Error')
    }
    if(loading) 
      setIsLoading(false);
  }

  const saveOrder = async (order, item) => {
    if(order.status === 4 && !item.storage){
      toast.error(t('chooseStorage'));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/order/${order._id}`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}, method: 'PUT', body: JSON.stringify({...order, item: {...item}})})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          toast.success(t('orderUpdated'));
          if(tab === data.order.status){
            setOrders(orders.map((order) => {
              if(order._id === data.order._id)
                return data.order;
              return order;
            }));
          } else {
            setOrders(orders.filter((order) => order._id !== data.order._id));
          }
      }
    } catch (err) {
        console.log(err);
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
        indicatorColor='secondary'
        textColor='secondary'
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
      <TextField sx={{marginTop: '10px'}} disabled={disableSearch} color='error' fullWidth id="search" value={search} label={t('search')} name='search' type="text" variant="outlined" onChange={(e) => setSearch(e.target.value)} />
      {[0, 1, 2, 3, 4].map((index) => {
        return (
          <OrderList key={index} list={orders} storagesList={storagesList} setDisableSearch={setDisableSearch} saveOrder={saveOrder} value={tab} index={index} />
        )
      })}
      <Pagination count={pages} page={query.get('page') ? parseInt(query.get('page')) : 1} color='secondary' onChange={handlePageChange} />
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