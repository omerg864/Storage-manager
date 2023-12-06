
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
import ItemDisplay from '../components/ItemDisplay';
import { Box, Button, MenuItem, Modal, Pagination, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ItemEdit from '../components/ItemEdit';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  padding: '1rem',
  boxSizing: 'border-box',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function Storage({ storagesList}) {

  const params = useParams();
  const [query] = useSearchParams();
  const [search, setSearch] = useState('');
  const { t } = useTranslation('translation', { keyPrefix: 'NewStorage' });
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [useItem, setUseItem] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searched, setSearched] = useState(true);
  const [storageData, setStorageData] = useState({
    name: '',
    pages: 1,
    items: []
  });

  useEffect(() => {
    if(search === '' && searched) {
      getStorage(true);
    } else {
      getStorage(false);
      setSearched(false);
    }
  }, [params, query, search]);

  const saveItem = async (e, index) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/item/${editItem._id}`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}, method: 'PUT', body: JSON.stringify(editItem)})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          toast.success(t('itemUpdated'));
          setStorageData({...storageData, items: storageData.items.map((item) => {
            if(item._id === editItem._id)
              return editItem;
            return item;
          })});
          setEditItem(false);
      }
    } catch (err) {
        toast.error('Internal Server Error')
    }
    setIsLoading(false);
  }

  const openModal = (item) => {
    setModalOpen(true);
    setUseItem(item);
  }

  const saveUseItem = async (e) => {
    if(useItem.replacement && !useItem.storage) {
      toast.error(t('selectStorage'));
      return;
    }
    if(!useItem.quantity) {
      toast.error(t('selectQuantity'));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/item/${useItem._id}/use`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}, method: 'PATCH', body: JSON.stringify(useItem)})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          toast.success(t('itemUpdated'));
          if(data.removed) {
            setStorageData({...storageData, items: storageData.items.filter((item) => item._id !== data.item._id)});
          } else {
            setStorageData({...storageData, items: storageData.items.map((item) => {
              if(item._id === data.item._id)
                return data.item;
              return item;
            })});
          }
          setEditItem(false);
          setModalOpen(false);
      }
    } catch (err) {
        toast.error('Internal Server Error')
    }
    setIsLoading(false);
  }

  const restitutiveItem = async (e) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/item/${useItem._id}/restitution`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}, method: 'PATCH', body: JSON.stringify(useItem)})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          toast.success(t('itemUpdated'));
          if(data.removed) {
            setStorageData({...storageData, items: storageData.items.filter((item) => item._id !== data.item._id)});
          } else {
            setStorageData({...storageData, items: storageData.items.map((item) => {
              if(item._id === data.item._id)
                return data.item;
              return item;
            })});
          }
          setEditItem(false);
          setModalOpen(false);
      }
    } catch (err) {
        toast.error('Internal Server Error')
    }
    setIsLoading(false);
  }

  const handleUseChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUseItem({...useItem, [e.target.name]: e.target.value});
  }

  const handleEditChange = (e) => {
    setEditItem({...editItem, [e.target.name]: e.target.value});
  }

  const handleEditReplacementToggle = (e) => {
    setEditItem({...editItem, replacement: !editItem.replacement});
  }

  const handlePageChange = (e, page) => {
    navigate(`/storage/${params.storageId}?page=${page}`);
  }

  const getStorage = async (loading) => {
    if(loading)
      setIsLoading(true);
    try {
      const response = await fetch(`/api/storage/${params.storageId}?page=${query.get('page') ? query.get("page") : 1}&search=${search}`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          setStorageData(data.storage);
      }
  } catch (err) {
      toast.error('Internal Server Error')
  }

  if(loading)
    setIsLoading(false);
  }

  if(isLoading){
    return <Spinner />
  }

  return (
    <main>
      <h1>{storageData.name}</h1>
      <Box className="box-container">
      <TextField color='error' disabled={editItem} fullWidth id="search" value={search} label={t('search')} name='search' type="text" variant="outlined" onChange={(e) => setSearch(e.target.value)} />
      {storageData.items.map((item, index) => {
        return (
          <Fragment key={index}>
          {editItem._id === item._id ? <ItemEdit saveItem={saveItem} toggleChange={handleEditReplacementToggle} item={editItem} handleChange={handleEditChange} setEditItem={setEditItem} storageList={storagesList}/> 
          : <ItemDisplay used={storageData.used} setUseItem={openModal} item={item} setEditItem={setEditItem}/>}
          </Fragment>
        )
      })}
      </Box>
      <Pagination color='secondary' count={storageData.pages} page={query.get('page') ? parseInt(query.get('page')) : 1} onChange={handlePageChange} />
      <SpeedDial
        ariaLabel="navigation"
        sx={{ position: 'sticky', bottom: 16, marginLeft: "auto", marginRight: "1rem", marginTop: "auto" }}
        icon={<SpeedDialIcon />}
        onClose={() => setNav(false)}
        onOpen={() => setNav(true)}
        open={nav}>
          <SpeedDialAction 
              icon={<AddIcon/>}
              tooltipTitle={t('newItem')}
              tooltipOpen
              onClick={() => navigate('/new/item')}
          />
      </SpeedDial>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <h1>{t('useItem')}</h1>
          <div style={{marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <TextField id="quantity" onChange={handleUseChange} value={useItem.quantity} label={t('quantity')} name='quantity' 
                type="text" required color="error" variant="outlined"  />
            <TextField id="used_for" onChange={handleUseChange}  value={useItem.used_for} label={t('usedFor')} name='used_for' 
                type="text" color="error" variant="outlined"  />
            {useItem.replacement && !storageData.used && <Select
                id="storage"
                color='error'
                name='storage'
                value={useItem.storage}
                label={t('storage')}
                onChange={handleUseChange}
            >
                {storagesList.filter(storage => storage.used).map((storage, index) => {
                    return (
                        <MenuItem key={index} value={storage._id}>{storage.name}</MenuItem>
                    )
                })}
            </Select>}
            </div>
          <div className='space w-100' style={{marginTop: '10px'}}>
            <Button color="error" onClick={() => setModalOpen(false)}>{t('cancel')}</Button>
            <Button color="primary" onClick={storageData.used ? restitutiveItem : saveUseItem}>{t('save')}</Button>
          </div>
        </Box>
      </Modal>
    </main>
  )
}

export default Storage