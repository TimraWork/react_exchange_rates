import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import { useRequest } from './hooks/useRequest';
import banks from './banks.json';
import { Loading } from './components/Loading/Loading';
import logo from "./assets/img/logo.svg";

export const formatBalance = (balance) =>  balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// https://m.bank24.uz:2713
// export const PROD_API = "https://rates.kapitalbank.uz";
export const PROD_API = "https://191.168.6.78:2713";

var https = require('https')

// At instance level
const instance = axios.create({
  // baseURL: PROD_API,
  httpsAgent: new https.Agent({ 
    rejectUnauthorized: false
  })
});

function App() {
  const {requestStatus, sendRequest, removeStatusData } = useRequest();
  const [data, setData] = useState([]);

  const onSelectChange = (e) => {
    sendRequest(
      instance.post('/Mobile.svc/GetCoursesB2', { "tobo": e.target.value })
    );
  }

  useEffect(() => {
    sendRequest(
      instance.post('/Mobile.svc/GetCoursesB2', { "tobo": banks[0].ID })
    );

    return () => { removeStatusData(); }
  }, []); //eslint-disable-line

  useEffect(() => {
    if(requestStatus?.data?.length){
      setData(requestStatus.data);
    }
  }, [requestStatus]); //eslint-disable-line

  return (
    <div className="App">
      <header className="App-header">
        <div className="exchange_rates">
          <img src={logo} alt="logo" className="exchange_rates__logo" />
          <h1>Курсы Валют</h1>
          <div className="select-dropdown">
            <select name="course" className="select" onChange={onSelectChange}>
              {banks.map((el, idx) => <option key={idx} value={el.ID}>{el.SNAME}</option>)}
            </select>
          </div>

          <div className={`exchange_rates__table_wrap ${requestStatus?.loading ? 'exchange_rates__table_wrap--loading' : ''}`}>

            {data?.length ? (
              <table className="exchange_rates__table">
                <thead className="exchange_rates__thead" >
                  <tr>
                    <th>Валюта</th>
                    <th>Покупка</th>
                    <th>Продажа</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map( (el, idx) => (
                    <tr key={idx}>
                      <td>
                        <img className="exchange_rates__img" src={el.flag_url} alt="" />
                        <span className="exchange_rates__label exchange_rates__label--strong">{el.char_kod}</span>
                      </td>
                      <td><span className="exchangeRates__label">{formatBalance(el.course_buy)}</span></td>
                      <td><span className="exchangeRates__label">{formatBalance(el.course_sell)}</span> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null }

            {requestStatus?.loading &&  <Loading />}

          </div>

        </div>
      </header>
    </div>
  );
}

export default App;
