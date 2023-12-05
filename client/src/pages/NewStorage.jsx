import { Box, Button, Checkbox, FormControlLabel, Paper, TextField } from '@mui/material';
import {useState} from 'react'
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Spinner from '../components/Spinner';

function NewStorage({setList}) {
    const [storageData, setStorageData] = useState({name: '', used: false});
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation('translation', { keyPrefix: 'NewStorage' });
    const navigate = useNavigate();
    const cookies = new Cookies();

    const handleChange = (e) => {
        setStorageData({...storageData, [e.target.name]: e.target.value});
    }

    const toggleUsed = () => {
        setStorageData({...storageData, used: !storageData.used})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`/api/storage/`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`} ,method: 'POST', body: JSON.stringify(storageData)})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                toast.success(t('storageCreated'));
                setList((prev) => [...prev, data.storage]);
                navigate('/');
            }
        } catch (err) {
            toast.error('Internal Server Error')
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <main>
        <h1>{t('newStorage')}</h1>
        <Box className='box-container' sx={{xs: {width: "100%"}, md: {width: "60%"}}} component={Paper}>
          <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit} >
          <TextField color='error' fullWidth id="name" value={storageData.name} label={t('name')} name='name' type="text" required variant="outlined" onChange={handleChange} />
          <FormControlLabel sx={{margin: 0}} control={<Checkbox  checked={storageData.used} sx={{padding: 0}} onClick={toggleUsed} color="error" />} label={t('used')} />
            <div>
            <Button variant="contained" color="primary" type="submit" >{t('create')}</Button>
            </div>
          </form>
      </Box>
    </main>
  )
}

export default NewStorage