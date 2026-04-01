'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader, Database, Settings, Package, ShoppingBag, RefreshCw } from 'lucide-react'

type TestResult = {
  name: string
  status: 'idle' | 'loading' | 'pass' | 'fail'
  detail?: string
  data?: string[]
}

const INITIAL_TESTS: TestResult[] = [
  { name: 'Connect to Supabase', status: 'idle' },
  { name: 'Read settings table', status: 'idle' },
  { name: 'Read products table', status: 'idle' },
  { name: 'Read orders table', status: 'idle' },
  { name: 'Write to settings (update)', status: 'idle' },
]

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>(INITIAL_TESTS)
  const [running, setRunning] = useState(false)
  const [rawEnv, setRawEnv] = useState<Record<string, string>>({})

  const update = (index: number, patch: Partial<TestResult>) => {
    setTests(prev => prev.map((t, i) => i === index ? { ...t, ...patch } : t))
  }

  const runTests = async () => {
    setRunning(true)
    setTests(INITIAL_TESTS.map(t => ({ ...t, status: 'loading' })))

    // Show env vars (masked)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET'
    setRawEnv({
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key.length > 20 ? key.slice(0, 20) + '...' : key,
    })

    // Test 0 — basic connection (ping with a lightweight query)
    try {
      const start = Date.now()
      const { error } = await supabase.from('settings').select('key').limit(1)
      const ms = Date.now() - start
      if (error) throw error
      update(0, { status: 'pass', detail: `Connected in ${ms}ms` })
    } catch (e: any) {
      update(0, { status: 'fail', detail: e?.message || 'Connection failed' })
      // If connection fails, mark rest as failed too
      for (let i = 1; i < 5; i++) update(i, { status: 'fail', detail: 'Skipped — connection failed' })
      setRunning(false)
      return
    }

    // Test 1 — read settings
    try {
      const { data, error, count } = await supabase
        .from('settings')
        .select('*', { count: 'exact' })
      if (error) throw error
      update(1, {
        status: 'pass',
        detail: `${count ?? data?.length ?? 0} settings rows found`,
        data: (data?.slice(0, 3).map(s => `${s.key} = "${s.value}"`) || []) as string[]
      })
    } catch (e: any) {
      update(1, { status: 'fail', detail: e?.message })
    }

    // Test 2 — read products
    try {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
      if (error) throw error
      update(2, {
        status: data && data.length > 0 ? 'pass' : 'fail',
        detail: `${count ?? data?.length ?? 0} products found`,
        data: (data?.map(p => p.name) || []) as string[]
      })
    } catch (e: any) {
      update(2, { status: 'fail', detail: e?.message })
    }

    // Test 3 — read orders
    try {
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
      if (error) throw error
      update(3, {
        status: 'pass',
        detail: `${count ?? data?.length ?? 0} orders in database`,
        data: (data?.map(o => o.order_number) || []) as string[]
      })
    } catch (e: any) {
      update(3, { status: 'fail', detail: e?.message })
    }

    // Test 4 — write to settings
    try {
      const testValue = `test_${Date.now()}`
      const { error: writeError } = await supabase
        .from('settings')
        .update({ value: testValue, updated_at: new Date().toISOString() })
        .eq('key', 'business_name')

      if (writeError) throw writeError

      // Verify the write actually happened
      const { data: verify, error: verifyError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'business_name')
        .single()

      if (verifyError) throw verifyError

      const writeWorked = verify?.value === testValue

      // Restore original value
      await supabase
        .from('settings')
        .update({ value: 'Chico Water Limited Company', updated_at: new Date().toISOString() })
        .eq('key', 'business_name')

      update(4, {
        status: writeWorked ? 'pass' : 'fail',
        detail: writeWorked ? 'Write + read-back confirmed. Value restored.' : 'Write appeared to succeed but read-back failed.'
      })
    } catch (e: any) {
      update(4, { status: 'fail', detail: e?.message || 'Write failed — check table permissions' })
    }

    setRunning(false)
  }

  const allPass = tests.every(t => t.status === 'pass')
  const anyFail = tests.some(t => t.status === 'fail')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-water-600 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Supabase Connection Test</h1>
          </div>
          <p className="text-gray-500 text-sm">Verifies your database is connected and all tables are accessible.</p>
        </div>

        {/* Env check */}
        {Object.keys(rawEnv).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Environment Variables</p>
            <div className="space-y-2">
              {Object.entries(rawEnv).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  {v === 'NOT SET'
                    ? <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    : <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  }
                  <span className="text-xs font-mono text-gray-500">{k}</span>
                  <span className={`text-xs font-mono ml-auto ${v === 'NOT SET' ? 'text-red-500 font-bold' : 'text-gray-700'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          {tests.map((test, i) => (
            <div key={test.name} className={`p-5 flex items-start gap-4 ${i < tests.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="mt-0.5 shrink-0">
                {test.status === 'idle' && <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                {test.status === 'loading' && <Loader className="w-5 h-5 text-water-600 animate-spin" />}
                {test.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {test.status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <p className={`font-semibold text-sm ${
                    test.status === 'pass' ? 'text-green-700' :
                    test.status === 'fail' ? 'text-red-700' :
                    'text-gray-700'
                  }`}>{test.name}</p>
                  {test.status === 'pass' && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold shrink-0">PASS</span>
                  )}
                  {test.status === 'fail' && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold shrink-0">FAIL</span>
                  )}
                </div>
                {test.detail && (
                  <p className={`text-xs mt-1 ${test.status === 'fail' ? 'text-red-500' : 'text-gray-500'}`}>
                    {test.detail}
                  </p>
                )}
                {test.data && Array.isArray(test.data) && test.data.length > 0 && (
                  <div className="mt-2 bg-gray-50 rounded-lg p-2">
                    {(test.data as string[]).map((d, j) => (
                      <p key={j} className="text-xs font-mono text-gray-500">{d}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Result banner */}
        {allPass && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-bold text-green-800">All tests passed!</p>
              <p className="text-green-600 text-sm">Supabase is connected and working correctly. You can delete this page now.</p>
            </div>
          </div>
        )}
        {anyFail && !running && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-bold text-amber-800 mb-1">&#x26A0;&#xFE0F; Is your Supabase project paused?</p>
              <p className="text-sm text-amber-700">Free Supabase projects pause after 1 week of inactivity. Go to <strong>supabase.com → your project</strong> and click <strong>"Restore project"</strong> if you see a paused banner. It takes about 1 minute to wake up.</p>
            </div>
            <div>
              <p className="font-bold text-red-800 mb-2">Other common fixes:</p>
              <ul className="space-y-1 text-sm text-red-700 list-disc list-inside">
                <li>Check your <code className="bg-red-100 px-1 rounded">.env.local</code> has the correct SUPABASE_URL and ANON_KEY</li>
                <li>Run <code className="bg-red-100 px-1 rounded">Remove-Item -Recurse -Force .next</code> then <code className="bg-red-100 px-1 rounded">npm run dev</code></li>
                <li>In Supabase SQL Editor run: <code className="bg-red-100 px-1 rounded">grant all on all tables in schema public to anon;</code></li>
                <li>Make sure you ran both <code className="bg-red-100 px-1 rounded">supabase-schema.sql</code> and <code className="bg-red-100 px-1 rounded">supabase-settings.sql</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* Run button */}
        <button
          onClick={runTests}
          disabled={running}
          className="w-full flex items-center justify-center gap-2 bg-water-600 hover:bg-water-700 disabled:bg-water-400 text-white font-bold py-4 rounded-2xl transition-all text-base"
        >
          {running
            ? <><Loader className="w-5 h-5 animate-spin" /> Running tests...</>
            : <><RefreshCw className="w-5 h-5" /> Run Connection Tests</>
          }
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          This page is for development only. Delete <code>app/test-db/</code> before going live.
        </p>
      </div>
    </div>
  )
}
