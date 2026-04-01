'use client'
import { useState, Suspense } from 'react'
import React from 'react'
import { useSettings } from '@/components/SettingsProvider'
import { useSearchParams } from 'next/navigation'
import { Search, Truck, Package, CheckCircle, Clock, XCircle, MapPin, Phone, User } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency } from '@/lib/utils'
import { OrderStatus } from '@/types'

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'packed', 'in_transit', 'delivered']
const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = { pending: Clock, confirmed: CheckCircle, packed: Package, in_transit: Truck, delivered: CheckCircle }
const stepLabels: Record<string, string> = { pending: 'Order Placed', confirmed: 'Confirmed', packed: 'Packed', in_transit: 'Out for Delivery', delivered: 'Delivered' }

function TrackPageInner() {
  const searchParams = useSearchParams()
  const s = useSettings()
  const [orderId, setOrderId] = useState(searchParams.get('id') || '')
  const [searched, setSearched] = useState(!!searchParams.get('id'))
  const [result, setResult] = useState<typeof MOCK_ORDERS[0] | null | undefined>(
    searchParams.get('id') ? MOCK_ORDERS.find(o => o.order_number === searchParams.get('id')) || null : undefined
  )

  const handleSearch = () => {
    setSearched(true)
    const found = MOCK_ORDERS.find(o => o.order_number.toLowerCase() === orderId.toLowerCase().trim())
    setResult(found || null)
  }

  const currentStepIndex = result ? statusSteps.indexOf(result.status as OrderStatus) : -1

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-water-900 to-water-700 pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-tag bg-white/10 text-white border border-white/20 mb-4">Order Tracking</div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Where's your order?</h1>
          <p className="text-white/70 text-lg mb-10">Enter your order number to see real-time delivery status.</p>

          <div className="flex gap-3 max-w-md mx-auto">
            <input
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. CW-10422"
              className="input flex-1 bg-white text-gray-900 placeholder-gray-400 text-center font-semibold text-lg"
            />
            <button onClick={handleSearch} className="bg-white hover:bg-gray-50 text-water-700 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
              <Search className="w-5 h-5" /> Track
            </button>
          </div>

          <p className="text-white/50 text-sm mt-4">Try: CW-10422 or CW-10421 for demo orders</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Not searched yet */}
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <Truck className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Enter your order number above</p>
            <p className="text-sm mt-1">Your order number was sent via SMS after placing your order</p>
          </div>
        )}

        {/* Not found */}
        {searched && result === null && (
          <div className="card p-10 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
            <p className="text-gray-500">We couldn't find an order with number <strong>{orderId}</strong>. Please check and try again.</p>
          </div>
        )}

        {/* Found */}
        {searched && result && (
          <div className="space-y-6">
            {/* Order header */}
            <div className="card p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order number</p>
                  <h2 className="text-3xl font-black text-gray-900">{result.order_number}</h2>
                  <p className="text-sm text-gray-500 mt-1">Placed {new Date(result.created_at).toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${ORDER_STATUS_COLORS[result.status]}`}>
                  {ORDER_STATUS_LABELS[result.status]}
                </span>
              </div>
            </div>

            {/* Progress tracker */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-6">Delivery Progress</h3>
              <div className="relative">
                {/* Progress bar */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-water-600 transition-all duration-1000"
                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {statusSteps.map((status, i) => {
                    const Icon = stepIcons[status]
                    const done = i <= currentStepIndex
                    const current = i === currentStepIndex
                    return (
                      <div key={status} className="flex flex-col items-center gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                          done ? 'bg-water-600 border-water-600' : 'bg-white border-gray-200'
                        } ${current ? 'ring-4 ring-water-100' : ''}`}>
                          <Icon className={`w-5 h-5 ${done ? 'text-white' : 'text-gray-300'}`} />
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-semibold ${done ? 'text-water-700' : 'text-gray-400'}`}>
                            {stepLabels[status]}
                          </p>
                          {current && result.status === 'in_transit' && (
                            <p className="text-xs text-green-600 font-medium mt-0.5">ETA: Today, 3:30 PM</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Driver info (if in transit) */}
            {result.status === 'in_transit' && (
              <div className="card p-6 border-l-4 border-l-green-500">
                <h3 className="font-bold text-gray-900 mb-4">Your driver is on the way</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-water-400 to-water-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    KA
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Kojo Asante</p>
                    <p className="text-sm text-gray-500">3.2 km from your location</p>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Active delivery
                    </div>
                  </div>
                  <a href={`tel:${s.business_phone || "+233200000000"}`} className="flex items-center gap-2 bg-water-50 text-water-700 border border-water-200 px-4 py-2 rounded-xl text-sm font-semibold">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                </div>
              </div>
            )}

            {/* Order details */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3 mb-6">
                {result.items.map(item => (
                  <div key={item.product_id} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-500">Qty {item.quantity} × {formatCurrency(item.unit_price)}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500"><span>Delivery fee</span><span>{formatCurrency(result.delivery_fee)}</span></div>
                <div className="flex justify-between font-black text-gray-900 text-lg pt-2 border-t border-gray-200">
                  <span>Total</span><span className="text-water-600">{formatCurrency(result.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Delivery Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Customer</p>
                    <p className="font-medium text-gray-900 text-sm">{result.customer_name}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <p className="font-medium text-gray-900 text-sm">{result.customer_phone}</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Delivery address</p>
                    <p className="font-medium text-gray-900 text-sm">{result.delivery_address}, {result.delivery_region}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackPageInner />
    </Suspense>
  )
}
