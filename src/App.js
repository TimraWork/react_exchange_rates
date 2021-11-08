import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import { useRequest } from './hooks/useRequest';
import banks from './banks.json';
import { Loading } from './components/Loading/Loading';
import logo from "./assets/img/logo.svg";

export const formatBalance = (balance) =>  balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function App() {
  const {requestStatus, sendRequest, removeStatusData } = useRequest();
  const [data, setData] = useState([]);

  const onSelectChange = (e) => {
    sendRequest(
      axios.post('/Mobile.svc/GetCoursesB2', { "tobo": e.target.value })
    );
  }

  useEffect(() => {
    sendRequest(
      axios.post('/Mobile.svc/GetCoursesB2', { "tobo": banks[0].ID })
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
              {banks.map((el, idx) => <option key={idx} value={el.SITEID}>{el.SNAME}</option>)}
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
