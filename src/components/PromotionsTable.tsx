import React, {useEffect, useRef, useState} from 'react'
import {Promotion} from "../shared/promotion.model";
import {useInfiniteQuery} from "@tanstack/react-query";

const PromotionsTable = () => {
    const fetchPromotions = async ({pageParam = 1}) => {
        const response = await fetch(`http://localhost:8000/promotions?page=${pageParam}&limit=10`);
        return response.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['promotions'],
        initialPageParam: 1,
        queryFn: fetchPromotions,
        getNextPageParam: (lastPage, pages) => {
            console.log({pages});
            console.log({lastPage});
            if (lastPage?.length > 0) {
                return pages.length + 1;
            }
            return undefined;
        }
    });

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            console.log(entries,hasNextPage ,!isFetchingNextPage);
            if (entries[0].isIntersecting ) {
                fetchNextPage();
            }
        });

        const currentLoadMoreRef = loadMoreRef.current;
        if (currentLoadMoreRef) {
            observer.observe(currentLoadMoreRef);
        }

        return () => {
            if (currentLoadMoreRef) {
                observer.unobserve(currentLoadMoreRef);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // useEffect(() => {
    //     const ws = new WebSocket('ws://localhost:8000');
    //
    //     ws.onmessage = (event) => {
    //         const updatedPromotion = JSON.parse(event.data);
    //
    //         setPromotions((prevPromotions) =>
    //             prevPromotions.map((promo) =>
    //                 promo.id === updatedPromotion.id ? updatedPromotion : promo
    //             )
    //         );
    //     };
    //
    //     return () => ws.close();
    // }, []);

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
                <>{
                    // .toISOString()
                    data?.pages.map((promotions: Promotion[]) => {
                        console.log(promotions);
                        return promotions.map(({name, type, startDate, endDate, group}, i) =>
                            (
                                <tr key={i}>
                                    <td>{name}</td>
                                    <td>{type}</td>
                                    <td>{startDate}</td>
                                    <td>{endDate}</td>
                                    <td>{group}</td>
                                </tr>
                            ));
                    })
                }
                </>
                </tbody>
            </table>
            <div ref={loadMoreRef} style={{height: '20px', visibility: 'hidden'}}>
                {isFetchingNextPage && <span>Loading more...</span>}
            </div>
        </>
    )
}

export default PromotionsTable