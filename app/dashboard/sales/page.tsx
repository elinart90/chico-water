'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Truck, Package, Download, Bell, LogOut, Droplets, ShoppingBag, Clock, Filter } from 'lucide-react'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency } from '@/lib/utils'
import { Order, OrderStatus } from '@/types'
import toast from 'react-hot-toast'

export default function SalesDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o))
    toast.success(`Order updated to ${ORDER_STATUS_LABELS[status]}`)
  }

  const filtered = orders.filter(o => filter === 'all' || o.status === filter)
  const pending = orders.filter(o => o.status === 'pending').length
  const inTransit = orders.filter(o => o.status === 'in_transit').length
  const todayRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-water-800 text-white flex flex-col fixed h-full z-40">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-water-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Chico Water</div>
              <div className="text-water-300 text-[10px] uppercase tracking-widest">Sales</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { label: 'My Orders', icon: ShoppingBag, active: true },
            { label: 'Deliveries', icon: Truck, active: false },
          ].map(item => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-300 hover:bg-white/10">
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      <main className="ml-56 flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-gray-900">My Orders</h1>
            <p className="text-gray-500 text-sm">Manage and process incoming orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {pending > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">{pending}</span>}
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-water-400 to-water-600 rounded-full flex items-center justify-center text-white text-xs font-bold">KA</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending', value: pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'In Transit', value: inTransit, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: "Today's Revenue", value: formatCurrency(todayRevenue), icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {(['all', 'pending', 'confirmed', 'packed', 'in_transit', 'delivered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-water-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
            >
              {f === 'all' ? 'All' : ORDER_STATUS_LABELS[f]}
              {f === 'pending' && pending > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">{pending}</span>}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition-all ${order.status === 'pending' ? 'border-yellow-200' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-black text-water-600">{order.order_number}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <span className="capitalize text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{order.segment}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{order.customer_name} · {order.customer_phone}</p>
                  <p className="text-sm text-gray-500">{order.delivery_address}, {order.delivery_region}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-gray-900">{formatCurrency(order.total)}</div>
                  <div className="text-xs text-gray-400 capitalize">{order.payment_method} · {order.payment_status}</div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                {order.items.map(item => (
                  <div key={item.product_id} className="flex justify-between text-sm py-1">
                    <span className="text-gray-700">{item.quantity}× {item.product_name}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(order.id, 'confirmed')} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button onClick={() => updateStatus(order.id, 'packed')} className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <Package className="w-3.5 h-3.5" /> Mark as Packed
                  </button>
                )}
                {order.status === 'packed' && (
                  <button onClick={() => updateStatus(order.id, 'in_transit')} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <Truck className="w-3.5 h-3.5" /> Dispatch
                  </button>
                )}
                {order.status === 'in_transit' && (
                  <button onClick={() => updateStatus(order.id, 'delivered')} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" /> Mark Delivered
                  </button>
                )}
                <button className="ml-auto flex items-center gap-1.5 text-gray-500 hover:text-water-600 text-xs font-semibold border border-gray-200 hover:border-water-300 px-4 py-2 rounded-xl transition-all">
                  <Download className="w-3.5 h-3.5" /> Download Receipt
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders in this category</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
