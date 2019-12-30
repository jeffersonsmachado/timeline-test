import React from 'react'
import { useTransactions } from './Transactions';
import Transaction from './Transaction';

import './styles.css';

/**
 * Using Functional Programming
 */
const Timeline = () => {

    const [ isLoading, transactions ] = useTransactions();

    if (!isLoading) {

        console.log(transactions);
        const transactionsElements: Array<JSX.Element> = [];

        transactions.forEach( (transaction, key) => {
            transactionsElements.push(
                <div className="" key={key}>
                    {
                        Transaction(transaction)
                    }
                </div>
            )
        })


        return (
            <div id="container">

                <div id="line">  
                </div>
                { transactionsElements.map( (element: JSX.Element): JSX.Element => element) }  
                            
            </div>
        )

    }

    return (
        <>
            <h1>Loading</h1>
        </>
    )
}

export default Timeline;
