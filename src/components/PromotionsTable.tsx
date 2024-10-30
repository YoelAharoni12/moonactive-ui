import React, { useEffect, useRef } from 'react';
import { Promotion } from "../shared/promotion.model";
import { useInfiniteQuery } from "@tanstack/react-query";

const PromotionsTable = () => {
    const fetchPromotions = async ({ pageParam = 1 }) => {
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
            return lastPage.length ? pages.length + 1 : undefined;
        }
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

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
                root: containerRef.current,   // Set the root to the scrollable container
                rootMargin: '200px',          // Start fetching when 200px away from the bottom
                threshold: 0.1,               // Trigger when half of loadMoreRef is visible
            }
        );

        const currentLoadMoreRef = loadMoreRef.current;
        observer.observe(currentLoadMoreRef);

        return () => {
            observer.unobserve(currentLoadMoreRef);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            <h1>Promotions</h1>
            <div ref={containerRef} style={{ overflow: 'auto', maxHeight: '400px' }}>
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
                    {data?.pages.map((promotions: Promotion[]) =>
                        promotions.map(({ name, type, startDate, endDate, group }, i) => (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{type}</td>
                                <td>{startDate}</td>
                                <td>{endDate}</td>
                                <td>{group}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <div ref={loadMoreRef} style={{ height: '20px' }}>
                    {isFetchingNextPage && <span>Loading more...</span>}
                </div>
            </div>
        </>
    );
};

export default PromotionsTable;
