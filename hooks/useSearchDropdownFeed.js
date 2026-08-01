'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    getBestDealsFromServer,
    getBestSellersFromServer,
    getNewArrivalsFromServer,
    getCategoryWiseProducts,
} from '../lib/api';
import { extractProductList, mapApiProductToCard } from '../lib/mapProductCard';

const PHASES = ['deals', 'sellers', 'arrivals', 'category'];
export const SEARCH_FEED_COLS = 4;
export const SEARCH_FEED_INITIAL_ROWS = 3;
export const SEARCH_FEED_SCROLL_ROWS = 2;

function createFeedState() {
    return {
        phaseIndex: 0,
        queues: { deals: [], sellers: [], arrivals: [] },
        fetched: { deals: false, sellers: false, arrivals: false },
        categoryIndex: 0,
        categoryPage: 1,
        categoryExhausted: false,
        done: false,
    };
}

export function useSearchDropdownFeed(categories = [], enabled = false) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const feedRef = useRef(createFeedState());
    const seenIdsRef = useRef(new Set());
    const loadingRef = useRef(false);
    const categoriesRef = useRef(categories);

    useEffect(() => {
        categoriesRef.current = categories;
    }, [categories]);

    const resetFeed = useCallback(() => {
        feedRef.current = createFeedState();
        seenIdsRef.current = new Set();
        setProducts([]);
        setHasMore(true);
    }, []);

    const mapUnique = useCallback((items) => {
        const mapped = [];
        for (const raw of items) {
            const card = mapApiProductToCard(raw);
            if (!card?.id || seenIdsRef.current.has(card.id)) continue;
            seenIdsRef.current.add(card.id);
            mapped.push(card);
        }
        return mapped;
    }, []);

    const pullFromQueue = useCallback((queueKey, max) => {
        const state = feedRef.current;
        const queue = state.queues[queueKey];
        if (!queue.length) return [];
        const batch = queue.splice(0, max);
        return mapUnique(batch);
    }, [mapUnique]);

    const fetchQueue = useCallback(async (queueKey) => {
        const state = feedRef.current;
        if (state.fetched[queueKey]) return;

        let res;
        if (queueKey === 'deals') res = await getBestDealsFromServer();
        else if (queueKey === 'sellers') res = await getBestSellersFromServer();
        else if (queueKey === 'arrivals') res = await getNewArrivalsFromServer();

        state.fetched[queueKey] = true;
        state.queues[queueKey] = extractProductList(res);
    }, []);

    const fetchCategoryPage = useCallback(async () => {
        const state = feedRef.current;
        const cats = categoriesRef.current;

        while (state.categoryIndex < cats.length) {
            const cat = cats[state.categoryIndex];
            const catId = cat?.category_id || cat?.id;
            if (!catId) {
                state.categoryIndex += 1;
                state.categoryPage = 1;
                continue;
            }

            const res = await getCategoryWiseProducts(catId, state.categoryPage);
            const items = extractProductList(res);
            const lastPage = Number(res?.pagination?.last_page || res?.data?.pagination?.last_page || 1);

            if (state.categoryPage >= lastPage) {
                state.categoryIndex += 1;
                state.categoryPage = 1;
            } else {
                state.categoryPage += 1;
            }

            if (items.length > 0) {
                return mapUnique(items);
            }
        }

        state.categoryExhausted = true;
        state.done = true;
        return [];
    }, [mapUnique]);

    const pullNext = useCallback(async (max) => {
        const state = feedRef.current;
        const collected = [];
        let safety = 0;

        while (collected.length < max && !state.done && safety < 40) {
            safety += 1;
            const phase = PHASES[state.phaseIndex];

            if (phase === 'deals') {
                if (!state.fetched.deals) await fetchQueue('deals');
                collected.push(...pullFromQueue('deals', max - collected.length));
                if (!state.queues.deals.length) state.phaseIndex += 1;
                continue;
            }

            if (phase === 'sellers') {
                if (!state.fetched.sellers) await fetchQueue('sellers');
                collected.push(...pullFromQueue('sellers', max - collected.length));
                if (!state.queues.sellers.length) state.phaseIndex += 1;
                continue;
            }

            if (phase === 'arrivals') {
                if (!state.fetched.arrivals) await fetchQueue('arrivals');
                collected.push(...pullFromQueue('arrivals', max - collected.length));
                if (!state.queues.arrivals.length) state.phaseIndex += 1;
                continue;
            }

            if (phase === 'category') {
                if (state.categoryExhausted) {
                    state.done = true;
                    break;
                }
                const batch = await fetchCategoryPage();
                collected.push(...batch);
                if (state.categoryExhausted && batch.length === 0) break;
                continue;
            }

            state.done = true;
            break;
        }

        if (state.done) setHasMore(false);
        return collected;
    }, [fetchCategoryPage, fetchQueue, pullFromQueue]);

    const pullNextRef = useRef(pullNext);
    pullNextRef.current = pullNext;

    const pullUntilUnique = useCallback(async (count) => {
        let collected = [];
        let attempts = 0;
        while (collected.length < count && !feedRef.current.done && attempts < 6) {
            attempts += 1;
            const batch = await pullNextRef.current(count - collected.length);
            if (batch.length === 0) break;
            collected = [...collected, ...batch];
        }
        return collected;
    }, []);

    const loadMore = useCallback(async (count) => {
        if (loadingRef.current || feedRef.current.done) return;
        loadingRef.current = true;
        setIsLoadingMore(true);

        try {
            const batch = await pullUntilUnique(count);
            if (batch.length > 0) {
                setProducts((prev) => [...prev, ...batch]);
            }
            if (feedRef.current.done) {
                setHasMore(false);
            } else if (batch.length === 0) {
                // All items in this batch were duplicates — keep hasMore so scroll can retry
                setHasMore(true);
            }
        } catch (err) {
            console.error('[SearchDropdownFeed]', err);
            setHasMore(false);
        } finally {
            loadingRef.current = false;
            setIsLoadingMore(false);
        }
    }, [pullUntilUnique]);

    useEffect(() => {
        if (!enabled) {
            resetFeed();
            return;
        }

        resetFeed();
        let cancelled = false;

        (async () => {
            loadingRef.current = true;
            setIsLoading(true);
            try {
                const batch = await pullUntilUnique(SEARCH_FEED_COLS * SEARCH_FEED_INITIAL_ROWS);
                if (!cancelled && batch.length > 0) {
                    setProducts(batch);
                }
                if (!cancelled && feedRef.current.done) setHasMore(false);
            } catch (err) {
                console.error('[SearchDropdownFeed]', err);
                if (!cancelled) setHasMore(false);
            } finally {
                if (!cancelled) {
                    loadingRef.current = false;
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [enabled, resetFeed, pullUntilUnique]);

    return {
        products,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMore,
    };
}
