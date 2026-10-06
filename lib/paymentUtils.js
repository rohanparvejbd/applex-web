/**
 * Applex payment type helpers.
 * IDs are loaded dynamically from GET /payment-type-list/{userId}.
 */

export function getStoreUserId() {
    return process.env.NEXT_PUBLIC_USER_ID || process.env.NEXT_PUBLIC_PAYMENT_SETTINGS_USER_ID || "";
}

export function parsePaymentTypeList(response) {
    const list = response?.data?.data;
    if (!Array.isArray(list)) {
        return { cash: null, ssl: null, all: [] };
    }

    const findByType = (typeName) => {
        const paymentType = list.find(
            (item) => String(item?.type_name || "").trim().toLowerCase() === typeName.toLowerCase()
        );
        if (!paymentType) return null;

        const category = paymentType.payment_type_category?.[0];
        if (!category?.id) return null;

        return { paymentType, category };
    };

    return {
        cash: findByType("cash"),
        ssl: findByType("ssl"),
        all: list,
    };
}

export function buildPaymentMethodPayload(config, amount) {
    if (!config?.paymentType?.id || !config?.category?.id) {
        return null;
    }

    return [
        {
            payment_type_id: config.paymentType.id,
            payment_type_category_id: config.category.id,
            payment_amount: Number(amount) || 0,
        },
    ];
}

export function getPaymentUrl(initiateResponse) {
    return (
        initiateResponse?.data?.url ||
        initiateResponse?.url ||
        initiateResponse?.data?.GatewayPageURL ||
        initiateResponse?.GatewayPageURL ||
        null
    );
}

export function getInvoiceIdFromOrderResponse(response) {
    return (
        response?.data?.data?.invoice_id ||
        response?.data?.invoice_id ||
        response?.invoice_id ||
        null
    );
}

export function resolveGatewayAmount(gatewayAmount) {
    const testAmount = process.env.NEXT_PUBLIC_SSLCOMMERZ_TEST_AMOUNT;
    if (testAmount != null && String(testAmount).trim() !== "") {
        const parsed = Number(testAmount);
        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return Math.max(0, Number(gatewayAmount) || 0);
}

const PENDING_PURCHASE_KEY = "applex_pending_purchase";

export function savePendingPurchase(data) {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(data));
    } catch {
        // ignore quota errors
    }
}

export function readPendingPurchase() {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearPendingPurchase() {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.removeItem(PENDING_PURCHASE_KEY);
    } catch {
        // ignore
    }
}
