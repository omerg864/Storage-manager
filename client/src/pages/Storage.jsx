
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
import ItemDisplay from '../components/ItemDisplay';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';


function Storage() {

  const params = useParams();
  const [query] = useSearchParams();
  const [search, setSearch] = useState('');
  const { t } = useTranslation('translation', { keyPrefix: 'NewStorage' });
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storageData, setStorageData] = useState({
    name: '',
    items: []
  });

  useEffect(() => {
    getStorage();
  }, [params, query]);

  useEffect(() => {
    getStorage(false);
  }, [search]);

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
      <TextField fullWidth id="search" value={search} label={t('search')} name='search' type="text" variant="outlined" onChange={(e) => setSearch(e.target.value)} />
      {storageData.items.map((item, index) => {
        return (
          <ItemDisplay item={item} key={index} />
        )
      })}
      </Box>
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
    </main>
  )
}

export default Storage