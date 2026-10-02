'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plane, Search, SlidersHorizontal, RotateCcw, MapPin, Clock3, Navigation, Radio, ArrowRight, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type FlightStatus = 'On time' | 'Boarding' | 'Delayed' | 'Landed'
type FilterStatus = 'All flights' | FlightStatus

type Flight = {
  id: string
  airline: string
  code: string
  from: string
  fromCity: string
  to: string
  toCity: string
  status: FlightStatus
  departure: string
  arrival: string
  departureTz: string
  arrivalTz: string
  terminal: string
  gate: string
  progress: number
  altitude: string
  speed: string
  route: string
  position: { x: number; y: number }
}

const flights: Flight[] = [
  { id: 'ai101', airline: 'Asteria Air', code: 'AS 101', from: 'DEL', fromCity: 'New Delhi', to: 'BOM', toCity: 'Mumbai', status: 'On time', departure: '09:10', arrival: '11:25', departureTz: 'IST', arrivalTz: 'IST', terminal: 'T3', gate: 'G18', progress: 68, altitude: '34,000 ft', speed: '486 kt', route: 'DEL → BOM', position: { x: 53, y: 45 } },
  { id: 'sa204', airline: 'Sundial Aviation', code: 'SD 204', from: 'HYD', fromCity: 'Hyderabad', to: 'DXB', toCity: 'Dubai', status: 'Boarding', departure: '14:30', arrival: '16:35', departureTz: 'IST', arrivalTz: 'GST', terminal: 'T1', gate: 'A07', progress: 0, altitude: 'Ground', speed: '—', route: 'HYD → DXB', position: { x: 34, y: 65 } },
  { id: 'pa330', airline: 'Pacific Arc', code: 'PA 330', from: 'BLR', fromCity: 'Bengaluru', to: 'SIN', toCity: 'Singapore', status: 'On time', departure: '07:45', arrival: '15:20', departureTz: 'IST', arrivalTz: 'SGT', terminal: '2', gate: 'C12', progress: 43, altitude: '38,000 ft', speed: '512 kt', route: 'BLR → SIN', position: { x: 61, y: 68 } },
  { id: 'nt718', airline: 'Northstar', code: 'NS 718', from: 'JFK', fromCity: 'New York', to: 'LHR', toCity: 'London', status: 'Delayed', departure: '18:05', arrival: '06:20', departureTz: 'EDT', arrivalTz: 'BST', terminal: '4', gate: 'B31', progress: 29, altitude: '31,000 ft', speed: '458 kt', route: 'JFK → LHR', position: { x: 28, y: 36 } },
  { id: 'oc442', airline: 'Oceania Lines', code: 'OC 442', from: 'SYD', fromCity: 'Sydney', to: 'HND', toCity: 'Tokyo', status: 'Landed', departure: '21:15', arrival: '05:40', departureTz: 'AEST', arrivalTz: 'JST', terminal: '1', gate: 'D04', progress: 100, altitude: 'Landed', speed: '—', route: 'SYD → HND', position: { x: 78, y: 74 } },
  { id: 'me515', airline: 'Meridian', code: 'MR 515', from: 'CDG', fromCity: 'Paris', to: 'FCO', toCity: 'Rome', status: 'On time', departure: '12:00', arrival: '14:05', departureTz: 'CEST', arrivalTz: 'CEST', terminal: '2E', gate: 'K22', progress: 74, altitude: '27,000 ft', speed: '421 kt', route: 'CDG → FCO', position: { x: 48, y: 40 } },
  { id: 'ca809', airline: 'Cobalt Air', code: 'CB 809', from: 'SFO', fromCity: 'San Francisco', to: 'NRT', toCity: 'Tokyo', status: 'On time', departure: '10:25', arrival: '13:55', departureTz: 'PDT', arrivalTz: 'JST', terminal: 'I', gate: 'E06', progress: 57, altitude: '36,000 ft', speed: '505 kt', route: 'SFO → NRT', position: { x: 17, y: 63 } },
  { id: 'ea620', airline: 'Eastwind', code: 'EW 620', from: 'AMS', fromCity: 'Amsterdam', to: 'CPH', toCity: 'Copenhagen', status: 'Boarding', departure: '16:40', arrival: '17:55', departureTz: 'CEST', arrivalTz: 'CEST', terminal: '3', gate: 'D18', progress: 0, altitude: 'Ground', speed: '—', route: 'AMS → CPH', position: { x: 44, y: 28 } },
]

const normalizeSearch = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const filterOptions: FilterStatus[] = ['All flights', 'On time', 'Boarding', 'Delayed', 'Landed']
const isFilterStatus = (value: unknown): value is FilterStatus => typeof value === 'string' && filterOptions.includes(value as FilterStatus)

const statusTone: Record<FlightStatus, string> = {
  'On time': 'status-on-time', Boarding: 'status-boarding', Delayed: 'status-delayed', Landed: 'status-landed',
}

function StatusDot({ status }: { status: FlightStatus }) {
  return <span aria-hidden="true" className={`status-dot ${statusTone[status]}`} />
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All flights')
  const [selectedId, setSelectedId] = useState('ai101')
  const filteredFlights = useMemo(() => flights.filter((flight) => {
    const searchable = normalizeSearch(`${flight.code}${flight.airline}${flight.from}${flight.to}${flight.fromCity}${flight.toCity}`)
    const matchesQuery = searchable.includes(normalizeSearch(query))
    const matchesStatus = status === 'All flights' || flight.status === status
    return matchesQuery && matchesStatus
  }), [query, status])
  const selected = filteredFlights.find((flight) => flight.id === selectedId) ?? filteredFlights[0] ?? null

  useEffect(() => {
    if (filteredFlights.length && !filteredFlights.some((flight) => flight.id === selectedId)) setSelectedId(filteredFlights[0].id)
    if (!filteredFlights.length && selectedId) setSelectedId('')
  }, [filteredFlights, selectedId])

  function clearFilters() {
    setQuery('')
    setStatus('All flights')
  }

  return (
    <main className="skytrack-shell">
      <div className="skytrack-grid" aria-hidden="true" />
      <header className="site-header">
        <a href="#top" className="brand" aria-label="SkyTrack home"><span className="brand-mark"><Plane /></span><span>SKY<span className="brand-accent">TRACK</span></span></a>
        <div className="header-meta"><span className="live-pulse" /> <span>SIMULATION MODE</span><Badge variant="outline" className="demo-badge">DEMO DATA</Badge></div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> AVIATION MONITORING / 01</div>
        <h1>Every journey,<br /><em>in view.</em></h1>
        <p>Explore a clear, focused view of simulated flights in motion.<br className="hidden md:block" /> Select a route to inspect its progress and schedule.</p>
      </section>

      <section className="dashboard" aria-label="Flight tracker dashboard">
        <div className="dashboard-toolbar">
          <div className="search-wrap"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flight, airline, or airport" aria-label="Search flight, airline, or airport" /></div>
          <ToggleGroup type="single" value={status} onValueChange={(value) => {
            const nextStatus = Array.isArray(value) ? value[0] : value
            if (isFilterStatus(nextStatus)) setStatus(nextStatus)
          }} className="status-filters" aria-label="Filter by flight status">
            {filterOptions.map((item) => <ToggleGroupItem key={item} value={item}>{item}</ToggleGroupItem>)}
          </ToggleGroup>
        </div>

        {selected ? <>
        <div className="tracker-layout">
          <Card className="flight-list-card">
            <CardHeader className="list-heading"><div><CardTitle>Flights in view</CardTitle><p>{filteredFlights.length} of {flights.length} routes</p></div><SlidersHorizontal aria-hidden="true" /></CardHeader>
            <CardContent className="flight-list-content">
              {filteredFlights.length ? filteredFlights.map((flight) => <button key={flight.id} className={`flight-row ${selectedId === flight.id ? 'selected' : ''}`} onClick={() => setSelectedId(flight.id)} aria-pressed={selectedId === flight.id}>
                <div className="flight-row-top"><span className="flight-code">{flight.code}</span><span className={`flight-status ${statusTone[flight.status]}`}><StatusDot status={flight.status} />{flight.status}</span></div>
                <div className="flight-route"><span>{flight.from}</span><ArrowRight aria-hidden="true" /><span>{flight.to}</span></div>
                <div className="flight-airline">{flight.airline}<span>{flight.progress}% route</span></div>
              </button>) : <div className="empty-state"><Radio aria-hidden="true" /><strong>No flights match</strong><span>Try a different search or status.</span><Button variant="outline" size="sm" onClick={clearFilters}><RotateCcw data-icon="inline-start" />Clear filters</Button></div>}
            </CardContent>
          </Card>

          <Card className="map-card">
            <CardHeader className="map-header"><div><p className="section-kicker">ROUTE VISUALIZATION</p><CardTitle>{selected.route}</CardTitle></div><Badge variant="outline" className="sim-badge"><span className="live-pulse" /> Simulated position</Badge></CardHeader>
            <CardContent className="map-content">
              <div className="route-map" role="img" aria-label={`Simulated route from ${selected.fromCity} to ${selected.toCity}`}>
                <div className="map-graticule" />
                <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 14 64 C 34 20, 61 25, 86 63" /><path d="M 18 64 C 36 70, 60 71, 86 63" className="route-secondary" /></svg>
                <div className="map-node origin-node" style={{ left: '14%', top: '64%' }}><span /><strong>{selected.from}</strong><small>{selected.fromCity}</small></div>
                <div className="map-node destination-node" style={{ left: '86%', top: '63%' }}><span /><strong>{selected.to}</strong><small>{selected.toCity}</small></div>
                <div className="plane-marker" style={{ left: `${18 + selected.progress * .64}%`, top: `${63 - Math.sin(selected.progress / 100 * Math.PI) * 35}%` }}><Plane /></div>
                <div className="map-coordinates">SIMULATED ROUTE / NOT FOR NAVIGATION</div>
                <div className="map-scale"><span>0</span><i /><span>500 NM</span></div>
              </div>
              <div className="map-footer"><div><span className="section-kicker">CURRENT STATUS</span><strong><StatusDot status={selected.status} /> {selected.status}</strong></div><div><span className="section-kicker">ROUTE PROGRESS</span><strong>{selected.progress}%</strong></div><div><span className="section-kicker">POSITION</span><strong>{selected.altitude}</strong></div></div>
            </CardContent>
          </Card>
        </div>

        <Card className="details-card">
          <CardHeader className="details-heading"><div><p className="section-kicker">SELECTED FLIGHT</p><CardTitle>{selected.code} <span>/ {selected.airline}</span></CardTitle></div><div className={`detail-status ${statusTone[selected.status]}`}><StatusDot status={selected.status} />{selected.status}</div></CardHeader>
          <CardContent className="details-content"><div className="detail-route"><div><span className="airport-code">{selected.from}</span><span>{selected.fromCity}</span><strong>{selected.departure} <small>{selected.departureTz}</small></strong></div><div className="detail-arrow"><span /> <Plane aria-hidden="true" /> <span /></div><div className="align-right"><span className="airport-code">{selected.to}</span><span>{selected.toCity}</span><strong>{selected.arrival} <small>{selected.arrivalTz}</small></strong></div></div><Separator /><div className="detail-stats"><div><Clock3 aria-hidden="true" /><span>Schedule</span><strong>{selected.departure} {selected.departureTz} → {selected.arrival} {selected.arrivalTz}</strong></div><div><MapPin aria-hidden="true" /><span>Terminal / gate</span><strong>{selected.terminal} / {selected.gate}</strong></div><div><Navigation aria-hidden="true" /><span>Position</span><strong>{selected.altitude} · {selected.speed}</strong></div></div></CardContent>
        </Card>
        </> : <Card className="no-results-panel"><CardContent><Radio aria-hidden="true" /><strong>No flights match these filters.</strong><span>Clear the search or choose another status to restore the route view.</span><Button variant="outline" size="sm" onClick={clearFilters}><RotateCcw data-icon="inline-start" />Clear filters</Button></CardContent></Card>}
      </section>

      <section className="about-section" id="about"><div className="section-kicker">ABOUT SKYTRACK</div><div><h2>A calmer way to follow the sky.</h2><p>SkyTrack is a Handshake first-website project exploring how flight information can feel precise, legible, and human. All schedules, routes, and positions shown here are simulated demo data — this is not live aviation information.</p><a className="source-link" href="https://github.com/Theja4/skytrack" target="_blank" rel="noreferrer">View source <ChevronRight aria-hidden="true" /></a></div></section>
      <footer><span>SKYTRACK / FLIGHT MONITORING</span><span>BUILT FOR CLARITY · <a href="#about">ABOUT</a></span></footer>
    </main>
  )
}
