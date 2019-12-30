import React from 'react';
import { ITransaction } from './interfaces'

const Transaction = ( props: ITransaction ) => {

    const {
        id,
        store,
        revenue,
        timestamp,
        items
    } = props;

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    }

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp);
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        const minutes = date.getMinutes() + 1 < 10 ? `0${date.getMinutes() + 1}` : `${date.getMinutes() + 1}`;
        // const seconds = date.getSeconds() + 1 < 10 ? `0${date.getSeconds() + 1}` : `${date.getSeconds() + 1}`;
        
        return `${hours}:${minutes}`;
    }

    return (
        <div className="transaction-wrapper" key={id}>
            <img src={require('../../assets/icons/check .svg')} id="bullet" alt=""></img>
            <div id="arrow" className="arrow left"></div>
            <div className="transaction-container">
            <div className="transaction-header">
                <div>
                    <img
                        className="transaction-header-icon"
                        src={require('../../assets/icons/calendar.svg')}
                        alt="calendar icon"
                    />
                    <p>{formatDate(timestamp)}</p>
                </div>
                <div>
                    <img
                        className="transaction-header-icon"
                        src={require('../../assets/icons/clock.svg')}
                        alt="clock icon"
                    />
                    <p>{formatTime(timestamp)}</p>
                </div>
                <div>
                    <img
                        className="transaction-header-icon"
                        src={require('../../assets/icons/place.svg')}
                        alt="place icon"
                    />
                    <p>{store}</p>
                </div>
                <div>
                    <img
                        className="transaction-header-icon"
                        src={require('../../assets/icons/money.svg')}
                        alt="money icon"
                    />
                    <p>R$ {revenue.toFixed(2).toString().replace('.', ',')}</p>
                </div>
            </div>
            <div className="transaction-items">
                <table>
                    <thead>
                        <tr>
                            <th>produto</th>
                            <th>preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.map( ({ product, price}, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{product}</td>
                                        <td>R$ {price.toFixed(2).toString().replace('.', ',')}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    )

} 

export default Transaction;
