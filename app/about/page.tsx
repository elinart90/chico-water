'use client'
import Navbar from '@/components/layout/Navbar'
import { useSettings } from '@/components/SettingsProvider'
import Footer from '@/components/layout/Footer'
import { Shield, Award, Leaf, Heart, MapPin, Users } from 'lucide-react'

const values = [
  { icon: Shield, title: 'Quality Assured', desc: 'Every batch is tested and certified before it reaches you. We meet and exceed Ghana Standards Authority requirements.' },
  { icon: Leaf, title: 'Sustainable', desc: 'Our bottles are 100% recyclable. We partner with local communities on plastic collection initiatives.' },
  { icon: Heart, title: 'Community First', desc: 'We hire locally, pay fairly, and invest a portion of profits into clean water access in underserved areas.' },
  { icon: Award, title: 'Award-Winning', desc: 'GSA-certified, ISO quality standards, and recognized by the Ghana Chamber of Commerce since 2012.' },
]

const team = [
  { name: 'Emmanuel Chico', role: 'Founder & CEO', initials: 'EC' },
  { name: 'Abena Asante', role: 'Operations Director', initials: 'AA' },
  { name: 'Kofi Mensah', role: 'Sales Manager', initials: 'KM' },
  { name: 'Grace Twumasi', role: 'Quality Control', initials: 'GT' },
]

export default function AboutPage() {
  const s = useSettings()
  const founded = s.business_founded || '2008'
  const name = s.business_name || 'Chico Water Limited'
  const address = s.business_address || 'Industrial Area, Accra, Ghana'
  const statsOrders = s.home_stats_orders || '50,000'
  const statsCustomers = s.home_stats_customers || '12,000'
  const statsRegions = s.home_stats_regions || '16'

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-water-900 to-water-700 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-tag bg-white/10 text-white border border-white/20 mb-6">Our Story</div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">Bringing pure water<br />to every Ghanaian.</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            {`Founded in ${founded} in ${address.split(',')[1]?.trim() || 'Accra'}, ${name} started as a small bottling operation with one goal: deliver clean, affordable water to Ghanaian families and businesses.`}
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-tag mb-6">Our Mission</div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Water is not a luxury. It's a right.</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{name} was built on a simple idea: every Ghanaian — whether in Accra, Kumasi, or a rural community — deserves access to clean, safe drinking water at an honest price.</p>
                <p>What started as a 50-employee operation delivering to 200 homes in Greater Accra has grown into a national supplier serving over 12,000 customers across all 16 regions of Ghana.</p>
                <p>We sell bottled water, sachet water, and quality packaging to households, retail shops, wholesale distributors, and corporate accounts — each with pricing and service designed for their specific needs.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: founded, label: 'Founded', icon: Award },
                { value: parseInt(statsCustomers).toLocaleString() + '+', label: 'Customers', icon: Users },
                { value: statsRegions, label: 'Regions served', icon: MapPin },
                { value: parseInt(statsOrders).toLocaleString() + '+', label: 'Orders delivered', icon: Shield },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-2xl p-6 text-center">
                  <s.icon className="w-7 h-7 text-water-600 mx-auto mb-3" />
                  <div className="text-3xl font-black text-gray-900 mb-1">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag mb-4">What We Stand For</div>
            <h2 className="text-4xl font-black text-gray-900">Our values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="card p-6">
                <div className="w-12 h-12 bg-water-50 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-water-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag mb-4">Our Team</div>
            <h2 className="text-4xl font-black text-gray-900">The people behind the water</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-water-400 to-water-700 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
