import React from 'react'
import { useTransactions } from '../../hooks/transactions';
import { IEvent } from './interfaces';


/**
 * Using Functional Programming
 */
const Timeline = () => {

    const { events } : { events: Array<IEvent> } = require('../../data.json');
    const [ isLoading, transactions ] = useTransactions(events);

    if (!isLoading) {
        
        return (
            <div className="timeline-container">
                
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