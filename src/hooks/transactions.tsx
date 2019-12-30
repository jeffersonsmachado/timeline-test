import { useEffect, useState } from 'react'
import { ICustomData, IEvent, IItem, ITransaction } from '../components/timeline/interfaces'

const BOUGHT = 'comprou';
const BOUGHT_PRODUCT = 'comprou-produto';

type Transactions = Map<string, ITransaction>;

/**
 * Custom hook similar to a headless component
 * @param events Array containing every event got from API
 */
export const useTransactions = (events: Array<IEvent>) => {

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
                        items: [{
                            product: String(product),
                            price: Number(price)
                        }]
                    })
                }
                break;

            case BOUGHT:
                const { store_name: store, transaction_id: id } = extractProperties(customData);
                if (transactionsAccumulator.has(String(id))) {
                    const { items } = transactionsAccumulator.get(String(id)) || { items: [] };
                    transactionsAccumulator.set(String(id), {
                        id: String(id),
                        store: String(store),
                        items: items
                    })
                } else {
                    transactionsAccumulator.set(String(id), {
                        id: String(id),
                        store: String(store),
                        items: [] as Array<IItem>
                    })
                }
                break;
            default:
                break;
        }
        return transactionsAccumulator;
    }

    useEffect(() => {
        setTransactions(currentState => {
            return events.reduce<Transactions>(formatEventsIntoTransactions, currentState)
        })
        setIsLoading(false);
        return () => { };
    }, [events])
    return [isLoading, transactions];
}