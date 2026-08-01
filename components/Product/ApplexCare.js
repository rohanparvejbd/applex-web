"use client";

import { useState, useMemo, useEffect } from 'react';
import { FiTruck, FiCreditCard, FiShield, FiChevronRight, FiX, FiPackage, FiCheckCircle, FiHeadphones } from 'react-icons/fi';
import { bankEmiData } from '../../lib/emiData';

function EMICalculator({ currentPrice }) {
    const [selectedBank, setSelectedBank] = useState(bankEmiData[0]);
    const [customAmount, setCustomAmount] = useState(currentPrice);

    const calculateEMI = (price, months, chargePercent) => {
        if (!chargePercent) return null;
        const chargeAmount = (price * chargePercent) / 100;
        const totalAmount = price + chargeAmount;
        const monthlyEMI = totalAmount / months;
        return { emi: monthlyEMI, charge: chargePercent, effectiveCost: totalAmount };
    };

    const getEmiPlans = (bank) => {
        const plans = [];
        const months = [
            { key: 'm3', label: 3 }, { key: 'm6', label: 6 }, { key: 'm9', label: 9 },
            { key: 'm12', label: 12 }, { key: 'm18', label: 18 }, { key: 'm24', label: 24 }, { key: 'm36', label: 36 }
        ];
        months.forEach(({ key, label }) => {
            if (bank[key]) {
                const calc = calculateEMI(customAmount, label, bank[key]);
                if (calc) plans.push({ months: label, ...calc });
            }
        });
        return plans;
    };

    const plans = getEmiPlans(selectedBank);

    return (
        <div className="space-y-4 font-[family-name:var(--font-outfit)]">
            <h3 className="font-bold text-lg text-gray-900 tracking-tight">EMI Options</h3>
            <div className="flex flex-row gap-2 md:gap-4 h-[500px] md:h-[600px]">
                <div className="w-[110px] md:w-1/3 border border-gray-100 rounded-2xl flex flex-col h-full sticky top-0 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 font-black text-[10px] text-gray-400 uppercase tracking-widest sticky top-0 z-10">Select Bank</div>
                    <div className="overflow-y-auto flex-1 bg-white">
                        {bankEmiData.map((bank, idx) => (
                            <button key={idx} onClick={() => setSelectedBank(bank)} className={`w-full flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 text-center md:text-left border-b border-gray-50 last:border-0 transition-all ${selectedBank.bank === bank.bank ? 'bg-gray-100 border-l-4 border-black' : 'hover:bg-gray-50'}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 ${!bank.logo && bank.color} rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0 mx-auto md:mx-0 overflow-hidden bg-white shadow-sm`}>
                                    {bank.logo ? (
                                        <img src={bank.logo} alt={bank.bank} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <div className={`w-full h-full ${bank.color} flex items-center justify-center font-black`}>{bank.initial}</div>
                                    )}
                                </div>
                                <span className={`text-[10px] md:text-[13px] font-bold ${selectedBank.bank === bank.bank ? 'text-black' : 'text-gray-600'} truncate w-full`}>{bank.bank}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 space-y-4 h-full overflow-y-auto pr-1">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Purchase Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-black text-lg">৳</span>
                            <input type="number" value={customAmount} onChange={(e) => setCustomAmount(Number(e.target.value))} className="w-full py-3 px-4 pl-9 bg-white border-2 border-transparent rounded-xl text-lg font-black text-gray-900 focus:outline-none focus:border-blue-600/20 transition-all shadow-sm" />
                        </div>
                    </div>
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-[13px] whitespace-nowrap">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-center p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Plan</th>
                                    <th className="text-left p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Monthly EMI</th>
                                    <th className="text-right p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {plans.length > 0 ? plans.map((plan, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-center align-middle font-black text-gray-900">{plan.months} <span className="text-[10px] text-gray-400">Months</span></td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="text-black font-black text-sm">৳ {plan.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                <span className="text-[10px] font-bold text-gray-400">Charge {plan.charge}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right align-middle text-gray-900 font-black">৳ {plan.effectiveCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="p-8 text-center text-gray-400 font-bold italic uppercase">No EMI plans available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <FiCheckCircle className="text-gray-600 w-4 h-4 shrink-0" />
                        <p className="text-[11px] font-bold text-gray-600 leading-tight">EMI facility available for purchases over ৳5,000. Terms apply.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ApplexCare({ product, currentPrice, selectedCarePlans, toggleCarePlan, openEmiTrigger = 0 }) {
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const categoryLower = (product?.category?.name || '').toLowerCase();
    const categorySlugLower = (product?.category?.slug || '').toLowerCase();
    const productNameLower = (product?.name || '').toLowerCase();
    const phoneCategoryBlob = `${categoryLower} ${categorySlugLower} ${productNameLower}`;

    const isPhoneCategory = phoneCategoryBlob.includes('iphone') || phoneCategoryBlob.includes('smartphone') || phoneCategoryBlob.includes('mobile') || /\bphones?\b/.test(phoneCategoryBlob);
    const isAdapter = productNameLower.includes('adaptar') || productNameLower.includes('adapter');
    const isCable = productNameLower.includes('cable');
    const isLaptop = categoryLower.includes('laptop') || categoryLower.includes('macbook') || productNameLower.includes('macbook') || productNameLower.includes('laptop');

    const price = Number(currentPrice || 0);

    const carePlansToShow = useMemo(() => {
        if (isAdapter) return [{ id: 'warranty_adapter', name: '12 Month Instant Replacement', description: 'Instant replacement for issues', price: 0 }];
        if (isCable) return [{ id: 'warranty_cable', name: '6 Month Instant Replacement', description: 'Instant replacement for issues', price: 0 }];
        if (isLaptop) return [{ id: 'care_laptop', name: 'Applex Care+ 1 Year', description: 'Brand New Replacement Guarantee', price: Math.round(price * 0.05) }];
        if (isPhoneCategory) return [
            { id: 'care_phone', name: 'Applex Care+ 1 Year', description: 'Brand New Replacement Guarantee', price: Math.round(price * 0.05) },
            { id: 'screen_care', name: 'Applex Screen Care+', description: '730 Days · One time display replacement', price: Math.round(price * 0.10) },
        ];
        return [{ id: 'warranty_12', name: '6 Months Extended Warranty', description: 'Extended hardware coverage', price: Math.round(price * 0.10) }];
    }, [isAdapter, isCable, isLaptop, isPhoneCategory, price]);

    const closeDrawer = () => setActiveDrawer(null);

    useEffect(() => {
        if (openEmiTrigger > 0) setActiveDrawer('emi');
    }, [openEmiTrigger]);

    const handlePlanSelect = (plan) => {
        setSelectedPlanId(plan.id);
        toggleCarePlan(plan);
    };

    const renderDrawerContent = () => {
        switch (activeDrawer) {
            case 'shipping':
                return (
                    <div className="space-y-6 font-[family-name:var(--font-outfit)]">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center shrink-0">
                                <FiPackage className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Shipping Details</h3>
                                <p className="text-sm text-gray-500">Choose your preferred delivery option</p>
                            </div>
                        </div>

                        {/* Inside Dhaka */}
                        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            <div className="border-l-2 border-purple-200 pl-4 flex-1">
                                <p className="text-[11px] font-bold text-black uppercase tracking-widest mb-0.5">Inside Dhaka</p>
                                <p className="text-[18px] font-bold text-gray-900">24–48 Hours</p>
                                <p className="text-[12px] text-gray-500">Get your order within 1–2 days</p>
                            </div>
                            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
                                <span className="text-[12px] font-bold uppercase tracking-wider">Fast</span>
                            </div>
                        </div>

                        {/* Outside Dhaka */}
                        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                            </div>
                            <div className="border-l-2 border-blue-200 pl-4 flex-1">
                                <p className="text-[11px] font-bold text-black uppercase tracking-widest mb-0.5">Outside Dhaka</p>
                                <p className="text-[18px] font-bold text-gray-900">3–5 Business Days</p>
                                <p className="text-[12px] text-gray-500">Reliable delivery across Bangladesh</p>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-full shrink-0">
                                <FiShield className="w-4 h-4" />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Standard</span>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="flex items-start gap-2 text-gray-400">
                            <svg className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p className="text-[12px]">* Delivery charges vary based on location and parcel weight.</p>
                        </div>
                    </div>
                );
            case 'emi':
                return <EMICalculator currentPrice={price} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-3 font-[family-name:var(--font-outfit)]">
            {/* Main Card */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">

                {/* Shipping & EMI */}
                <div className="px-4 py-0">
                    {[
                        { id: 'shipping', icon: FiTruck, title: 'SHIPPING', sub: '0-3 Day Fast Delivery' },
                        { id: 'emi', icon: FiCreditCard, title: 'EMI PLANS', sub: 'All Banks & Cards Accepted' },
                    ].map((item, i) => (
                        <button key={item.id} onClick={() => setActiveDrawer(item.id)} className={`w-full flex items-center justify-between py-3 text-left group ${i === 0 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-700 group-hover:bg-gray-100 transition-colors">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-semibold tracking-tight text-gray-900 mb-0.5">{item.title}</h3>
                                    <p className="text-[12px] text-gray-500">{item.sub}</p>
                                </div>
                            </div>
                            <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </button>
                    ))}
                </div>

                {/* Applex Care+ Section */}
                <div className="px-4 pt-3 pb-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 18 58 C 20 72 30 84 44 91" stroke="#F97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray: '0', opacity: 1}} />
                                <path d="M 82 58 C 80 72 70 84 56 91" stroke="url(#fadeOrange)" strokeWidth="3.5" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="fadeOrange" x1="82" y1="58" x2="56" y2="91" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.05" />
                                    </linearGradient>
                                </defs>
                                <path d="M 50 15 C 62 18, 74 22, 82 26 V 52 C 82 74, 68 85, 50 92 C 32 85, 18 74, 18 52 V 26 C 26 22, 38 18, 50 15 Z" stroke="#27272A" strokeWidth="5" strokeLinejoin="round" fill="white" />
                                <path d="M 50 40 V 64 M 38 52 H 62" stroke="#27272A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="ml-1">
                            <h3 className="text-[14px] font-bold tracking-tight text-gray-900 mb-0.5">APPLEX CARE+</h3>
                            <p className="text-[11px] text-gray-500">Complete protection for your device</p>
                        </div>
                    </div>

                    {/* Plan Options */}
                    <div className="space-y-2">
                        {carePlansToShow.map((plan) => {
                            const isSelected = selectedPlanId === plan.id;
                            return (
                                <label
                                    key={plan.id}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-[1.5px] border-black bg-white' : 'border border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="applex_plan"
                                            checked={isSelected}
                                            onChange={() => handlePlanSelect(plan)}
                                            className="w-4 h-4 accent-black cursor-pointer shrink-0"
                                        />
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">{plan.name}</h4>
                                            <p className="text-[11px] text-gray-500">{plan.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-[15px] font-bold text-gray-900 shrink-0 ml-2">
                                        {plan.price === 0 ? <span className="text-green-600 text-[13px]">FREE</span> : <span>৳{plan.price.toLocaleString()}</span>}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Features */}
                <div className="px-4 py-3 mt-0">
                    <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100">
                        {[
                            { icon: <FiShield className="w-4 h-4" />, title: 'Genuine Parts', sub: '100% Original' },
                            { icon: <FiCheckCircle className="w-4 h-4" />, title: 'Expert Support', sub: 'Priority Service' },
                            { icon: <FiPackage className="w-4 h-4" />, title: 'No Hidden Cost', sub: 'Transparent Policy' },
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center px-1">
                                <div className="mb-1.5 text-gray-700">{f.icon}</div>
                                <h5 className="text-[11px] font-semibold text-gray-900 mb-0.5">{f.title}</h5>
                                <p className="text-[10px] text-gray-500">{f.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learn More */}
                <div className="border-t border-gray-100 p-3 bg-gray-50/50">
                    <a href="#" className="flex items-center justify-center gap-2 text-[13px] font-semibold text-gray-900 hover:text-black transition-colors group">
                        Learn more about Applex Care+
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-center">
                    {[
                        { icon: <FiShield className="w-5 h-5" />, title: 'Secure', sub: 'Payment' },
                        { icon: <FiCheckCircle className="w-5 h-5" />, title: '100%', sub: 'Authentic' },
                        { icon: <FiHeadphones className="w-5 h-5" />, title: '24/7', sub: 'Support' },
                    ].map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 min-w-0">
                            <div className="text-gray-800 shrink-0">{b.icon}</div>
                            <div className="min-w-0">
                                <h5 className="text-[11px] font-bold text-gray-900 leading-tight whitespace-nowrap">{b.title}</h5>
                                <p className="text-[10px] text-gray-500 leading-tight whitespace-nowrap">{b.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Drawer */}
            {activeDrawer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeDrawer} />
                    <div className={`relative bg-white shadow-2xl overflow-hidden flex flex-col transition-all animate-in zoom-in-95 slide-in-from-bottom-5 ${activeDrawer === 'emi' ? 'w-full max-w-5xl rounded-xl h-[90vh]' : 'w-full max-w-lg rounded-xl h-fit max-h-[85vh]'}`}>
                        <div className="absolute top-4 right-4 z-20">
                            <button onClick={closeDrawer} className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-xl transition-all">
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-6 md:p-8">
                            {renderDrawerContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
