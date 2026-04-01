'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Truck, Package, CheckCircle, Clock, ArrowRight, Plus, LogOut, Droplets, RefreshCw } from 'lucide-react'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency } from '@/lib/utils'

export default function CustomerDashboard() {
  const [tab, setTab] = useState<'orders' | 'profile'>('orders')
  const orders = MOCK_ORDERS.slice(0, 2) // demo: show 2

  const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completed = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-water-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-water-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">Chico Water</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/order" className="text-xs bg-white text-water-700 font-bold px-4 py-2 rounded-xl">+ New Order</Link>
            <Link href="/auth/login" className="text-white/60 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-water-600 to-water-800 rounded-3xl p-6 mb-8 text-white">
          <p className="text-white/70 text-sm mb-1">Welcome back,</p>
          <h1 className="text-2xl font-black mb-4">Abena Owusu 👋</h1>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Orders', value: orders.length },
              { label: 'Active', value: active.length },
              { label: 'Delivered', value: completed.length },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-white/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/order" className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 bg-water-50 rounded-2xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-water-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900">New Order</div>
              <div className="text-xs text-gray-500">Order water products</div>
            </div>
          </Link>
          <Link href="/track" className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Track Order</div>
              <div className="text-xs text-gray-500">Real-time delivery status</div>
            </div>
          </Link>
        </div>

        {/* Active orders */}
        {active.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-black text-gray-900 mb-4">Active Orders</h2>
            <div className="space-y-4">
              {active.map(order => (
                <div key={order.id} className="card p-5 border-l-4 border-l-water-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-black text-water-600">{order.order_number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {order.items.map(i => `${i.quantity}× ${i.product_name}`).join(', ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-gray-900">{formatCurrency(order.total)}</span>
                    <Link href={`/track?id=${order.order_number}`} className="text-water-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                      Track <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order history */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Order History</h2>
          {orders.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders yet. Place your first order!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="card p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-water-600">{order.order_number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
                      </div>
                      <p className="text-sm text-gray-500">{order.items.map(i => `${i.quantity}× ${i.product_name}`).join(', ')}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900">{formatCurrency(order.total)}</span>
                      <button className="flex items-center gap-1.5 text-xs text-water-600 font-semibold border border-water-200 bg-water-50 px-3 py-2 rounded-xl hover:bg-water-100 transition-colors">
                        <RefreshCw className="w-3 h-3" /> Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
