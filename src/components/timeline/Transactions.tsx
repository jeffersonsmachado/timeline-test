import { useEffect, useState } from 'react'
import { ICustomData, IEvent, IItem, ITransaction } from './interfaces'

const BOUGHT = 'comprou';
const BOUGHT_PRODUCT = 'comprou-produto';
const URL = 'https://storage.googleapis.com/dito-questions/events.json';

export type Transactions = Map<string, ITransaction>;

/**
 * Custom hook similar to a headless component
 * @param events Array containing every event got from API
 */
export const useTransactions = (): [boolean, Transactions] => {

    const [transactions, setTransactions] = useState(new Map() as Transactions);
    const [isLoading, setIsLoading] = useState(true);

    const formatEventsIntoTransactions = (transactionsAccumulator: Transactions, event: IEvent): Transactions => {

        const { event: eventType, custom_data: customData } = event;

        // Extract all properties from custom_data and return an object
        // in [key]: [value] format so it can be easily destructured
        const extractProperties = (dataSet: Array<ICustomData>) => {
            const properties: { [property: string]: string | number } = {};
            dataSet.forEach(({ key, value }) => {
                properties[key] = value;
            });
            return properties;
        }

        const sortMap = ( map: Transactions ): Transactions => {

            const sortFunction = ( [key1, transaction1] : [string, ITransaction], [key2, transaction2] : [string, ITransaction]) => {
                if (transaction1.timestamp > transaction2.timestamp) return -1;
                if (transaction1.timestamp < transaction2.timestamp) return 1;
                return 0

            }

            const sortedMap = new Map([...Array.from(map.entries())].sort(sortFunction));

            return sortedMap;
        }

        switch (eventType) {

            case BOUGHT_PRODUCT:
                const {
                    product_name: product,
                    product_price: price,
                    transaction_id
                } = extractProperties(customData);
                const existingTransaction = transactionsAccumulator.get(String(transaction_id));
                // Does any transactions has been registered before?
                if (existingTransaction) {
                    // If transactions exists, add item to transactions.items
                    transactionsAccumulator.set(String(transaction_id), {
                        ...existingTransaction,
                        items: [
                            ...existingTransaction.items,
                            { product: String(product), price: Number(price) }
                        ]
                    })
                } else {
                    // If not, create a transactions registry temporary
                    transactionsAccumulator.set(String(transaction_id), {
                        id: String(transaction_id),
                        store: '',
                        revenue: 0,
                        timestamp: 0,
                        items: [{
                            product: String(product),
                            price: Number(price)
                        }]
                    })
                }
                break;

            case BOUGHT:

                const { store_name: store, transaction_id: id } = extractProperties(customData);
                const { revenue, timestamp } = event;
                
                if (transactionsAccumulator.has(String(id))) {

                    const { items } = transactionsAccumulator.get(String(id)) || { items: [] };
                    
                    transactionsAccumulator.set(String(id), {
                        id: String(id),
                        store: String(store),
                        revenue: revenue || 0,
                        timestamp: timestamp || 0,
                        items: items
                    })

                } else {

                    transactionsAccumulator.set(String(id), {
                        id: String(id),
                        store: String(store),
                        revenue: revenue || 0,
                        timestamp: timestamp || 0,
                        items: [] as Array<IItem>
                    })

                }
                break;
            default:
                break;
        }

        return sortMap(transactionsAccumulator);
    }

    useEffect(() => {

        try {
            fetch(URL)
            .then( data => data.json() )
            .then( ({ events } : {events: Array<IEvent> }) => {
                setTransactions(currentState => {
                    return events.reduce<Transactions>(formatEventsIntoTransactions, currentState);
                })
            })
            .then( () => setIsLoading(false));
        } catch (error) {
            setIsLoading(true);
            console.log('ERROR', error);
            throw new Error('FETCHING ERROR');
        }
        return () => { };
    }, []);
    
    return [isLoading, transactions];
}
