'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, Package, Users, Truck, TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronRight, Download, Bell, LogOut, Droplets, ShoppingBag, Settings } from 'lucide-react'
import { MOCK_ORDERS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatCurrency, SEGMENT_LABELS } from '@/lib/utils'
import { OrderStatus } from '@/types'

const stats = [
  { label: "Today's Orders", value: '24', change: '+12%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: "Today's Revenue", value: 'GH₵ 4,820', change: '+8.3%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Active Deliveries', value: '7', change: 'Live', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Low Stock Alerts', value: '2', change: 'Needs attention', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
]

const weeklyData = [
  { day: 'Mon', orders: 18, revenue: 3240 },
  { day: 'Tue', orders: 24, revenue: 4820 },
  { day: 'Wed', orders: 21, revenue: 3960 },
  { day: 'Thu', orders: 28, revenue: 5400 },
  { day: 'Fri', orders: 32, revenue: 6100 },
  { day: 'Sat', orders: 19, revenue: 3600 },
  { day: 'Sun', orders: 12, revenue: 2280 },
]
const maxOrders = Math.max(...weeklyData.map(d => d.orders))

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'customers'>('overview')

  const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'pending' || o.status === 'confirmed')
  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-water-900 text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-water-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Chico Water</div>
              <div className="text-water-300 text-[10px] uppercase tracking-widest">Admin</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'customers', label: 'Customers', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => item.id === 'settings' ? (window.location.href = '/dashboard/admin/settings') : setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10">
            <Droplets className="w-4 h-4" /> View Website
          </Link>
          <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-red-300 hover:bg-white/10">
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'All Orders'}
              {activeTab === 'inventory' && 'Inventory'}
              {activeTab === 'customers' && 'Customers'}
            </h1>
            <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-water-400 to-water-600 rounded-full flex items-center justify-center text-white text-sm font-bold">AD</div>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-green-600' : stat.change === 'Live' ? 'text-blue-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Chart + segment breakdown */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bar chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Orders This Week</h3>
                  <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-water-600"><Download className="w-3.5 h-3.5" /> Export</button>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {weeklyData.map(d => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-bold text-water-600">{d.orders}</div>
                      <div className="w-full bg-water-100 rounded-t-lg relative overflow-hidden" style={{ height: `${(d.orders / maxOrders) * 100}px` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-water-600 to-water-400 rounded-t-lg" />
                      </div>
                      <div className="text-xs text-gray-400">{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segment breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-6">Revenue by Segment</h3>
                <div className="space-y-4">
                  {[
                    { segment: 'wholesale', pct: 45, amount: 2169 },
                    { segment: 'retail', pct: 28, amount: 1350 },
                    { segment: 'corporate', pct: 17, amount: 819 },
                    { segment: 'household', pct: 10, amount: 482 },
                  ].map(s => (
                    <div key={s.segment}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{SEGMENT_LABELS[s.segment as keyof typeof SEGMENT_LABELS]}</span>
                        <span className="text-sm font-bold text-gray-900">{s.pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-water-600 rounded-full" style={{ width: `${s.pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{formatCurrency(s.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-sm text-water-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Order', 'Customer', 'Segment', 'Items', 'Total', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_ORDERS.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 font-mono text-sm font-bold text-water-600">{order.order_number}</td>
                        <td className="py-3 pr-4 text-sm font-medium text-gray-900">{order.customer_name}</td>
                        <td className="py-3 pr-4"><span className="capitalize text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{order.segment}</span></td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                        <td className="py-3 pr-4 text-sm font-bold text-gray-900">{formatCurrency(order.total)}</td>
                        <td className="py-3"><span className={`px-3 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">All Orders</h3>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-water-600 border border-gray-200 px-4 py-2 rounded-xl">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Order #', 'Customer', 'Phone', 'Segment', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ORDERS.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono text-sm font-bold text-water-600">{order.order_number}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">{order.customer_name}</td>
                      <td className="p-4 text-sm text-gray-500">{order.customer_phone}</td>
                      <td className="p-4"><span className="capitalize text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{order.segment}</span></td>
                      <td className="p-4 text-sm text-gray-600">{order.items.map(i => `${i.quantity}× ${i.product_name}`).join(', ')}</td>
                      <td className="p-4 text-sm font-bold text-gray-900">{formatCurrency(order.total)}</td>
                      <td className="p-4"><span className="capitalize text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{order.payment_method}</span></td>
                      <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                      <td className="p-4">
                        <button className="text-xs text-water-600 font-semibold hover:underline flex items-center gap-1">
                          <Download className="w-3 h-3" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-5">
              {[
                { label: 'Total Products', value: MOCK_PRODUCTS.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Low Stock', value: MOCK_PRODUCTS.filter(p => p.stock < 200).length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Total Units', value: MOCK_PRODUCTS.reduce((s, p) => s + p.stock, 0).toLocaleString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-1">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Stock Levels</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {MOCK_PRODUCTS.map(p => {
                  const pct = Math.min((p.stock / 10000) * 100, 100)
                  const low = p.stock < 200
                  return (
                    <div key={p.id} className="p-5 flex items-center gap-4">
                      <div className="text-2xl shrink-0">{p.category === 'bottled' ? '💧' : p.category === 'sachet' ? '🛍️' : '🫙'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                          {low && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Low Stock</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${low ? 'bg-red-500' : 'bg-water-600'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-sm font-bold text-gray-900 shrink-0">{p.stock.toLocaleString()} units</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-500 mb-6">Connect your Supabase database to load live customer data.</p>
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" /> Schema ready — add SUPABASE_URL to .env to activate
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
