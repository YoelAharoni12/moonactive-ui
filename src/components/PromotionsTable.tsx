import React, {useEffect, useRef, useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Promotion} from "../shared/promotion.model";
import PromotionRow from "./promotion-row/promotionRow";
import Notification from "./popup/sharePopup";

const PromotionsTable = () => {
    const [promotionsData, setPromotionsData] = useState<{ [key: string]: Promotion }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [showToast, setShowToast] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    const fetchPromotions = async ({pageParam = 1}) => {
        const response = await fetch(`http://localhost:8000/promotions?page=${pageParam}&limit=10`);
        return response.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['promotions'],
        initialPageParam: 1,
        queryFn: fetchPromotions,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length ? pages.length + 1 : undefined;
        },
    });


    useEffect(() => {
        if (data) {
            const newPromotions: Record<string, Promotion> = data.pages.flat().reduce((acc, promotion) => {
                acc[promotion._id] = promotion;
                return acc;
            }, {});
            setPromotionsData((prevData) => {
                return ({...prevData, ...newPromotions});
            });
        }
    }, [data]);

    useEffect(() => {
        if (!containerRef.current || !loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                root: containerRef.current,
                rootMargin: '50%',
                threshold: 0.1,
            }
        );

        const currentLoadMoreRef = loadMoreRef.current;
        observer.observe(currentLoadMoreRef);

        return () => {
            observer.unobserve(currentLoadMoreRef);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (!hasNextPage && !isFetchingNextPage && data?.pages.length) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        }
    }, [hasNextPage, isFetchingNextPage, data]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');
        wsRef.current = ws
        ws.onmessage = (event) => {
            const updatePromotion = JSON.parse(event.data);

            setPromotionsData((prevData) => {
                return prevData[updatePromotion._id] ? ({
                    ...prevData,
                    [updatePromotion._id]: updatePromotion,
                }) : prevData
            });

        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <>
            <h1>Promotions</h1>
            <div ref={containerRef} style={{overflow: 'auto', maxHeight: '50vh'}}>
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
                    {Object.values(promotionsData).map((promotion) => (
                        <PromotionRow key={promotion._id} promotion={promotion}/>
                    ))}
                    </tbody>
                </table>
                <div ref={loadMoreRef} style={{height: '20px', border: '1px solid red', visibility: 'hidden'}}>
                    {isFetchingNextPage && <span>Loading more...</span>}
                </div>
            </div>
            {showToast && <Notification message="No more promotions to load." type={'success'}/>}
            {isError && <Notification message={error.message} type={'error'}/>}
        </>
    );
};

export default PromotionsTable;
