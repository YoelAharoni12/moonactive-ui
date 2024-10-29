import React, {useEffect, useState} from 'react'

interface Promotion {
    id: string,
    name: string,
    type: string,
    group: string,
    startDate: string
    endDate: string
}

const PromotionsTable = () => {
    const [promotions1, setPromotions] = useState<Promotion[]>([]);
    useEffect(() => {
        async function fetchPromotions() {
            try {
                const response = await fetch('http://localhost:8000/promotions'); // Adjust the path if needed
                const data: Promotion[] = await response.json();
                setPromotions(data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        }

        fetchPromotions();
    }, []);
    useEffect(() => {
        // Connect to WebSocket server
        const ws = new WebSocket('ws://localhost:8000');

        ws.onmessage = (event) => {
            console.log(event.data);
            const newPromotion = JSON.parse(event.data);
            setPromotions((prevPromotions) => [newPromotion, ...prevPromotions]);
        };

        return () => ws.close();
    }, []);
    return (
        <>
            <h1>Promotions</h1>
            <table>
                <thead>
                <tr>
                    <th>Promotion name</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>User Group Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    promotions1.map(({name, type, startDate, endDate, group}, i) => {
                        // .toISOString()
                        //         .toISOString()
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{type}</td>
                                <td>{startDate}</td>
                                <td>{endDate}</td>
                                <td>{group}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}

export default PromotionsTable