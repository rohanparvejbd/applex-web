"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { saveSalesOrder, getCouponList, applyCoupon } from "../../lib/api";
import {
    MapPin,
    CreditCard,
    ShoppingBag,
    Shield,
    Truck,
    User,
    Phone,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import AddressSelect from "../../components/Checkout/AddressSelect";

const courierOptions = [
    { id: "steadfast", name: "Steadfast", logo: "https://cdn.brandfetch.io/idVIARrbJa/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1767913017056", scale: 1 },
    { id: "pathao", name: "Pathao", logo: "https://cdn.brandfetch.io/id7IYUlTKr/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1771516344575", scale: 1 },
    { id: "redx", name: "RedX", logo: "https://redx.com.bd/images/new-redx-logo.svg", scale: 1 },
    { id: "gogobangla", name: "Gogo Bangla", logo: "https://play-lh.googleusercontent.com/zZQ1U5hhpFE69BBlOwztaMjbMze-t0FTWmpwpgFAXQYdQpIFK5_znB7kqEBOUnzFExs", scale: 2.2 },
    { id: "sundarban", name: "Sundarban Courier", scale: 1 },
    { id: "saparibahan", name: "S.A Paribahan", logo: "https://www.satv.tv/wp-content/uploads/2021/09/SA-Paribahan-1.jpg", scale: 1.4 },
    { id: "postoffice", name: "Post Office", logo: "https://ecdn.dhakatribune.net/contents/cache/images/1200x630x1xxxxx1/uploads/dten/2020/04/bangladesh-post-office-1587482379713.gif", scale: 1.2 },
    { id: "dhl", name: "DHL (International)", logo: "https://cdn.brandfetch.io/idv0ZbfQqf/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667569261953", scale: 1 },
];

export default function CheckoutPage() {
    const { cartItems, getSubtotal, deliveryFee, updateDeliveryFee, clearCart, updateQuantity, removeFromCart } =
        useCart();

    const router = useRouter();
    const subTotal = getSubtotal();

    // Format price helper function
    const formatPrice = (amount) => {
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    // District & City state
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [selectedCourier, setSelectedCourier] = useState(courierOptions[0].id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [isAccepted, setIsAccepted] = useState(false);

    const formRef = useRef(null);

    // Load saved details on mount
    useEffect(() => {
        const savedDetails = localStorage.getItem("applexCheckoutDetails");
        if (savedDetails) {
            try {
                const parsed = JSON.parse(savedDetails);
                setFormData(prev => ({
                    ...prev,
                    firstName: parsed.firstName || prev.firstName,
                    phone: parsed.phone || prev.phone,
                    email: parsed.email || prev.email,
                    address: parsed.address || prev.address,
                }));
                if (parsed.district) setSelectedDistrict(parsed.district);
                if (parsed.city) setSelectedCity(parsed.city);
                if (parsed.courier) setSelectedCourier(parsed.courier);
            } catch (e) {
                console.error("Failed to parse saved checkout details", e);
            }
        }
    }, []);

    // Update delivery fee based on selection
    const updateDeliveryFeeCallback = useCallback(() => {
        if (!selectedDistrict && !selectedCity) {
            updateDeliveryFee(0);
            return;
        }

        let fee = 130; // Default: Outside Dhaka

        if (
            selectedCity === "Demra" ||
            selectedCity?.includes("Savar") ||
            selectedDistrict === "Gazipur" ||
            selectedCity?.includes("Keraniganj")
        ) {
            fee = 90;
        } else if (selectedDistrict === "Dhaka") {
            fee = 70;
        } else {
            fee = 130;
        }
        updateDeliveryFee(fee);
    }, [selectedDistrict, selectedCity, updateDeliveryFee]);

    useEffect(() => {
        updateDeliveryFeeCallback();
    }, [updateDeliveryFeeCallback]);

    const grandTotal = subTotal + deliveryFee - couponDiscount;

    // Coupon handling
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const response = await getCouponList(true);

            if (response.success && response.data) {
                const matchingCoupon = response.data.find(
                    coupon => coupon.coupon_code.toUpperCase() === couponCode.trim().toUpperCase()
                );

                if (matchingCoupon) {
                    const now = new Date();
                    const expireDate = new Date(matchingCoupon.expire_date);
                    expireDate.setHours(23, 59, 59, 999);

                    if (expireDate < now) {
                        setCouponError("This coupon has expired");
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const usageLimit = parseInt(matchingCoupon.usage_limit, 10) || 0;
                    const usedCount = parseInt(matchingCoupon.used_count, 10) || 0;
                    if (usageLimit > 0 && usedCount >= usageLimit) {
                        setCouponError("This coupon usage limit has been reached");
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const minOrderAmount = parseFloat(matchingCoupon.minimum_order_amount) || 0;
                    if (minOrderAmount > 0 && subTotal < minOrderAmount) {
                        setCouponError(`Minimum order amount is ${formatPrice(minOrderAmount)}`);
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const couponAmount = parseFloat(matchingCoupon.amount) || 0;
                    const amountLimit = parseFloat(matchingCoupon.amount_limit) || 0;
                    let discount = 0;

                    if (matchingCoupon.coupon_amount_type === "percentage") {
                        discount = Math.round(subTotal * (couponAmount / 100));
                    } else {
                        discount = couponAmount;
                    }

                    if (amountLimit > 0 && discount > amountLimit) {
                        discount = amountLimit;
                    }

                    discount = Math.min(discount, subTotal);

                    setCouponDiscount(discount);
                    setAppliedCoupon(matchingCoupon);
                    toast.success(`Coupon applied! You saved ${formatPrice(discount)}`);
                } else {
                    setCouponError("Invalid coupon code");
                    setCouponDiscount(0);
                    setAppliedCoupon(null);
                }
            } else {
                setCouponError("Unable to validate coupon");
                setCouponDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError("Failed to apply coupon");
            setCouponDiscount(0);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleCouponEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleApplyCoupon();
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDistrict || !selectedCity) {
            toast.error("Please select both District and Area");
            return;
        }

        if (!isAccepted) {
            toast.error("Please accept the Terms, Warranty, and Refund Policy to proceed.");
            return;
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 11-digit Bangladeshi phone number");
            return;
        }

        setIsSubmitting(true);
        const selectedCourierObj = courierOptions.find((c) => c.id === selectedCourier) || courierOptions[0];
        const courierSuffix = ` (Courier - ${selectedCourierObj.name})`;

        // Save details to localStorage
        try {
            const detailsToSave = {
                firstName: formData.firstName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                district: selectedDistrict,
                city: selectedCity,
                courier: selectedCourier,
            };
            localStorage.setItem("applexCheckoutDetails", JSON.stringify(detailsToSave));
        } catch (error) {
            console.error("Failed to save checkout details to local storage", error);
        }

        const orderPayload = {
            pay_mode: paymentMethod,
            paid_amount: 0,
            user_id: process.env.NEXT_PUBLIC_USER_ID,
            sub_total: subTotal,
            vat: 0,
            tax: 0,
            discount: couponDiscount,
            product: cartItems.filter(item => !item.isCareplan).map((item) => ({
                product_id: item.id,
                qty: item.quantity,
                price: item.numericPrice,
                mode: 1,
                size: item.variants?.storage || "Free Size",
                sales_id: process.env.NEXT_PUBLIC_USER_ID,
            })),
            delivery_method_id: 1,
            delivery_info_id: 1,
            delivery_customer_name: formData.firstName,
            delivery_customer_address: `${formData.address}, ${selectedCity}, ${selectedDistrict}${courierSuffix}`,
            delivery_customer_phone: formData.phone,
            delivery_fee: deliveryFee,
            variants: [],
            imeis: [null],
            created_at: new Date().toISOString(),
            customer_name: formData.firstName,
            customer_phone: formData.phone,
            sales_id: process.env.NEXT_PUBLIC_USER_ID,
            wholeseller_id: 1,
            status: 1,
            delivery_city: selectedCity,
            delivery_district: selectedDistrict,
            detailed_address: `${formData.address}${courierSuffix}`,
            courier: selectedCourierObj.id,
            courier_name: selectedCourierObj.name,
        };

        try {
            if (appliedCoupon && couponCode) {
                try {
                    await applyCoupon(couponCode);
                } catch (couponError) {
                    console.warn("Error tracking coupon usage:", couponError);
                }
            }

            const response = await saveSalesOrder(orderPayload);

            if (response.success) {
                clearCart();
                toast.success("Order placed successfully!");
                const invoiceId = response.data?.invoice_id || response.invoice_id || "INV-" + Date.now();
                router.push(`/order-success?invoice=${invoiceId}`);
            } else {
                toast.error("Failed to place order. Please try again.");
                console.error("Order failed:", response);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white font-[family-name:var(--font-outfit)]">
                <div className="text-center px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        Your cart is empty
                    </h2>
                    <p className="mt-2 text-gray-500 max-w-xs mx-auto">
                        Add some products to your cart before checking out.
                    </p>
                    <Link
                        href="/" className="mt-6 inline-block rounded-lg bg-black px-8 py-3.5 text-white font-bold hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Minimal Header */}
            <div className="bg-white py-8 border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
                        <p className="text-gray-500 font-medium mt-1">Complete your order by providing delivery and payment info.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Secure Checkout</p>
                            <p className="text-xs text-gray-500">Your data is protected</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-10">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-12">

                    {/* ═══ Left Column: Shipping & Payment ═══ */}
                    <div className="space-y-10">
                        {/* Delivery Address Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-black text-white rounded-lg">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                            </div>

                            {/* Estimated Delivery Box */}
                            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Truck size={16} className="text-gray-700" /> Estimated Delivery Time
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Inside Dhaka</span>
                                        <span className="text-gray-900 font-bold">1-3 Working Days</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Outside Dhaka</span>
                                        <span className="text-gray-900 font-bold">3-5 Working Days</span>
                                    </div>
                                </div>
                            </div>

                            <form id="checkout-form" ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-12 pr-4 text-gray-900 font-medium focus:bg-white focus:border-gray-900 focus:outline-none transition-all"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full bg-gray-50 border rounded-lg py-3 pl-12 pr-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-all ${formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone) ? "border-red-500" : "border-gray-200 focus:border-gray-900"}`}
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-900 font-medium focus:bg-white focus:border-gray-900 focus:outline-none transition-all"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <AddressSelect
                                        selectedDistrict={selectedDistrict}
                                        setSelectedDistrict={setSelectedDistrict}
                                        selectedCity={selectedCity}
                                        setSelectedCity={setSelectedCity}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Detailed Address</label>
                                    <textarea
                                        required
                                        name="address"
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House no, Flat, Road, Area..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-900 font-medium focus:bg-white focus:border-gray-900 focus:outline-none transition-all resize-none"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method Section */}
                        <div className="space-y-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-black text-white rounded-lg">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`group relative flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${paymentMethod === "Cash" ? "border-gray-900 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-400"}`}>
                                    <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === "Cash"} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${paymentMethod === "Cash" ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}>
                                        {paymentMethod === "Cash" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">Cash on Delivery</span>
                                        <span className="text-[11px] text-gray-500 font-medium">Pay when you receive the order</span>
                                    </div>
                                    <Truck className={`ml-auto w-6 h-6 transition-colors ${paymentMethod === "Cash" ? "text-gray-900" : "text-gray-300"}`} />
                                </label>

                                <div className="group relative flex items-center p-4 rounded-lg border border-gray-100 bg-gray-50/50 opacity-60">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 mr-4"></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-400">Online Payment</span>
                                        <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full w-fit mt-1">COMING SOON</span>
                                    </div>
                                    <CreditCard className="ml-auto w-6 h-6 text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Courier Section */}
                        <div className="hidden space-y-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 text-[#ff8a1f] rounded-lg">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Courier Service</h2>
                            </div>
                            <p className="text-sm text-gray-500 -mt-2">Choose your preferred courier partner.</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {courierOptions.map((courier) => {
                                    const isSelected = selectedCourier === courier.id;
                                    return (
                                        <button
                                            key={courier.id}
                                            type="button"
                                            onClick={() => setSelectedCourier(courier.id)}
                                            className={`relative h-24 rounded-lg border bg-white transition-all overflow-hidden ${isSelected
                                                ? "border-gray-900 ring-2 ring-gray-200 shadow-sm"
                                                : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            {isSelected && (
                                                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#ff8a1f] text-white text-[10px] flex items-center justify-center">
                                                    •
                                                </span>
                                            )}
                                            <div className="h-full w-full flex items-center justify-center px-3">
                                                {courier.logo ? (
                                                    <Image
                                                        src={courier.logo}
                                                        alt={courier.name}
                                                        width={140}
                                                        height={50}
                                                        className="object-contain max-h-[56px]"
                                                        style={{ transform: `scale(${courier.scale || 1})` }}
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold text-gray-700 text-center">{courier.name}</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Courier Partners - Brief */}
                        <div className="hidden pt-6 border-t border-gray-100 flex items-center gap-6 opacity-30 grayscale">
                            <span className="text-[10px] font-bold tracking-widest uppercase">Our Delivery Partners:</span>
                            <div className="flex gap-4">
                                <span className="text-[10px] font-black italic">PATHAO</span>
                                <span className="text-[10px] font-black italic">STEADFAST</span>
                                <span className="text-[10px] font-black italic">REDX</span>
                            </div>
                        </div>
                    </div>

                    {/* ═══ Right Column: Order Summary ═══ */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                            {/* Cart Items List */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center relative group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 relative">
                                            <Image
                                                src={item.imageUrl || item.image || "/no-image.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] font-bold text-gray-400">Qty: {item.quantity}</span>
                                                <span className="text-[11px] font-black text-gray-900">{formatPrice(item.numericPrice * item.quantity)}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (item.quantity <= 1) {
                                                    removeFromCart(item.id, item.variantKey);
                                                } else {
                                                    updateQuantity(item.id, item.variantKey, item.quantity - 1);
                                                }
                                            }}
                                            className="shrink-0 w-5 h-5 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-400 flex items-center justify-center transition-colors text-xs font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value);
                                            if (couponError) setCouponError("");
                                        }}
                                        onKeyDown={handleCouponEnter}
                                        placeholder="Coupon code"
                                        className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white focus:border-gray-900 transition-all uppercase"
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="rounded-xl px-4 py-2 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="rounded-xl px-4 py-2 text-xs font-bold bg-gray-900 text-white hover:bg-[#ff8a1f] disabled:opacity-50 transition-all"
                                        >
                                            {couponLoading ? "..." : "Apply"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="mt-2 text-[11px] font-bold text-red-500 ml-1">{couponError}</p>}
                                {appliedCoupon && (
                                    <p className="mt-2 text-[11px] font-bold text-green-600 ml-1">
                                        Coupon "{appliedCoupon.coupon_code}" Applied!
                                    </p>
                                )}
                            </div>

                            {/* Costs Breakdown */}
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">{formatPrice(subTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Delivery Charge</span>
                                    <span className="text-gray-900 font-bold">{formatPrice(deliveryFee)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <span>Discount</span>
                                        <span>-{formatPrice(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                                    <span className="text-base font-bold text-gray-900 uppercase tracking-tight">Total Bill</span>
                                    <span className="text-2xl font-black text-gray-900">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Policies & Confirm */}
                            <div className="space-y-6">
                                <label className="flex items-start gap-3 cursor-pointer select-none group">
                                    <div className="relative mt-0.5">
                                        <input 
                                            type="checkbox" 
                                            checked={isAccepted} 
                                            onChange={(e) => setIsAccepted(e.target.checked)} 
                                            className="peer sr-only" 
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-200 rounded-md transition-all peer-checked:bg-gray-900 peer-checked:border-gray-900"></div>
                                        <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-white scale-0 transition-all peer-checked:scale-100 p-0.5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 leading-tight">
                                        I agree to the <Link href="/terms" className="text-gray-900 font-bold underline hover:text-black">Terms</Link>, <Link href="/warranty" className="text-gray-900 font-bold underline hover:text-black">Warranty</Link> & <Link href="/refund" className="text-gray-900 font-bold underline hover:text-black">Refund Policy</Link>
                                    </span>
                                </label>

                                <button 
                                    type="submit" 
                                    form="checkout-form" 
                                    disabled={isSubmitting} 
                                    className="w-full py-4 bg-black text-white rounded-lg text-base font-bold uppercase tracking-wider hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? "Processing..." : "Confirm My Order"}
                                    {!isSubmitting && <ArrowRight size={20} />}
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 text-gray-400 opacity-60">
                                    <Shield size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
