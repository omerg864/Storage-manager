import { ToastContainer, toast } from 'react-toastify';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Storage from './pages/Storage';
import Orders from './pages/Orders';
import Transactions from './pages/Transactions';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import 'react-toastify/dist/ReactToastify.css';
import NewStorage from './pages/NewStorage';
import NewItem from './pages/NewItem';
import Spinner from './components/Spinner';
import NewOrder from './pages/NewOrder';


function App() {

  const cookies = new Cookies();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(isAuthenticated) {
      getStorages();
    }
  }, [isAuthenticated]);

  const getStorages = async () => {
    setIsLoading(true);
      try {
        const response = await fetch(`/api/storage/`, { headers: {"Content-type": "application/json", "authorization": `Bearer ${cookies.get('userToken')}`}})
        const data = await response.json();
        if (!data.success) {
            toast.error(data.message);
        } else {
            setList(data.storages);
        }
    } catch (err) {
        toast.error('Internal Server Error')
    }
    setIsLoading(false);
  }

  if (cookies.get('userToken') && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  if(isLoading) {
    return <Spinner/>;
  }

  return (
    <>
    <ToastContainer theme="colored"/>
    <Router>
    <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} list={list}/>
      <Routes>
        <Route path="/login" element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/storage/:storageId" element={<Storage storagesList={list}/>} />
        <Route path="/" element={<Orders isAuthenticated />} />
        <Route path="/transactions" element={<Transactions/>} />
        <Route path="/new/storage" element={<NewStorage setList={setList}/>} />
        <Route path="/new/item" element={<NewItem storageList={list}/>} />
        <Route path="/new/order" element={<NewOrder />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
