// src/pages/Dashboard.jsx  [MODIFIED for Phase 2B]
// Adds: weekly hours chart, subject distribution chart, goal card, weekly hours stat,
//       most-studied subject, placement summary, resume score card.
// Existing 4 metric cards are preserved unchanged.

import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import DashboardCard from '../components/DashboardCard.jsx'
import GoalCard from '../components/GoalCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getStudySessions } from '../services/studyService.js'
import { getPlacementProgress } from '../services/placementService.js'
import { getCurrentGoal } from '../services/goalService.js'
import { getLatestAnalysis } from '../services/resumeService.js'
import { useNavigate } from 'react-router-dom'

const PIE_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6']

function Dashboard() {
  const navigate = useNavigate()
  const [sessions,   setSessions]   = useState([])
  const [placement,  setPlacement]  = useState(null)
  const [goal,       setGoal]       = useState(null)
  const [resumeScore,setResumeScore]= useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [studyRes, placementRes, goalRes, resumeRes] = await Promise.all([
        getStudySessions(),
        getPlacementProgress(),
        getCurrentGoal(),
        getLatestAnalysis(),
      ])
      setSessions(studyRes.data.sessions || [])
      setPlacement(placementRes.data.progress || null)
      setGoal(goalRes.data.goal || null)
      setResumeScore(resumeRes.data.analysis?.score ?? null)
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Computed values ----
  const totalSessions = sessions.length
  const totalHours    = sessions.reduce((s, x) => s + (x.durationHours || 0), 0)
  const totalDSA      = placement ? (placement.easySolved||0)+(placement.mediumSolved||0)+(placement.hardSolved||0) : 0
  const projectsDone  = placement?.projectsCompleted || 0

  // Weekly hours (Mon–Sun of current week)
  const getMondayOfThisWeek = () => {
    const now = new Date(); const d = now.getDay()
    const mon = new Date(now); mon.setDate(now.getDate() + (d===0?-6:1-d)); mon.setHours(0,0,0,0)
    return mon
  }
  const monday = getMondayOfThisWeek()
  const weeklyHours = sessions.filter(s => new Date(s.date) >= monday).reduce((s,x) => s+(x.durationHours||0),0)

  // Most studied subject
  const subjectMap = sessions.reduce((acc, s) => { acc[s.subject]=(acc[s.subject]||0)+s.durationHours; return acc }, {})
  const topSubject = Object.entries(subjectMap).sort((a,b)=>b[1]-a[1])[0]

  // ---- Chart Data ----
  // Last 7 days bar chart
  const last7 = Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i)); d.setHours(0,0,0,0)
    const next = new Date(d); next.setDate(d.getDate()+1)
    const hrs = sessions.filter(s=>{const sd=new Date(s.date);return sd>=d&&sd<next}).reduce((s,x)=>s+x.durationHours,0)
    return { day: d.toLocaleDateString('en-IN',{weekday:'short'}), hours: parseFloat(hrs.toFixed(1)) }
  })

  // Subject pie chart
  const pieData = Object.entries(subjectMap)
    .map(([name,value])=>({name,value:parseFloat(value.toFixed(1))}))
    .sort((a,b)=>b.value-a.value).slice(0,6)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Dashboard" />
        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Overview</h2>
            <p className="page-subtitle">Your placement preparation at a glance</p>
          </div>

          {loading && <LoadingSpinner text="Loading your data..." />}
          {!loading && error && <div className="alert alert-error">{error}</div>}

          {!loading && !error && (
            <>
              {/* ---- Row 1: Original 4 metric cards ---- */}
              <div className="dashboard-cards-grid" style={{marginBottom:'20px'}}>
                <DashboardCard icon="📋" value={totalSessions}           label="Total Study Sessions" color="#4F46E5" />
                <DashboardCard icon="⏱️" value={`${totalHours.toFixed(1)}h`} label="Total Study Hours"    color="#10B981" />
                <DashboardCard icon="💻" value={totalDSA}                label="DSA Questions Solved" color="#F59E0B" />
                <DashboardCard icon="🚀" value={projectsDone}            label="Projects Completed"   color="#EF4444" />
              </div>

              {/* ---- Row 2: New analytics cards ---- */}
              <div className="dashboard-cards-grid" style={{marginBottom:'24px'}}>
                <DashboardCard icon="📅" value={`${weeklyHours.toFixed(1)}h`} label="This Week's Hours"     color="#3B82F6" />
                <DashboardCard icon="🏆" value={topSubject?topSubject[0]:'—'} label="Most Studied Subject"  color="#8B5CF6" />
                <DashboardCard icon="🎤" value={placement?.mockInterviews||0}  label="Mock Interviews Done"  color="#10B981" />
                <DashboardCard
                  icon="📄"
                  value={resumeScore !== null ? `${resumeScore}/100` : '—'}
                  label="Resume Score"
                  color="#F59E0B"
                  onClick={() => navigate('/resume')}
                />
              </div>

              {/* ---- Row 3: Goal Card + Placement Summary ---- */}
              <div className="db-two-col" style={{marginBottom:'24px'}}>
                <GoalCard goal={goal} completedHours={weeklyHours} />

                {/* Placement Summary */}
                <div className="db-placement-summary">
                  <h3 className="section-title">🎯 Placement Summary</h3>
                  {placement ? (
                    <div className="db-placement-rows">
                      {[
                        { label: 'Easy Solved',   val: placement.easySolved||0,        target: 100, color:'#10B981' },
                        { label: 'Medium Solved',  val: placement.mediumSolved||0,      target: 75,  color:'#F59E0B' },
                        { label: 'Hard Solved',    val: placement.hardSolved||0,        target: 25,  color:'#EF4444' },
                        { label: 'Aptitude Hours', val: placement.aptitudeHours||0,     target: 30,  color:'#3B82F6' },
                        { label: 'Mock Interviews',val: placement.mockInterviews||0,    target: 5,   color:'#8B5CF6' },
                      ].map(item => {
                        const pct = Math.min(Math.round((item.val/item.target)*100),100)
                        return (
                          <div key={item.label} className="db-pl-row">
                            <div className="db-pl-row-header">
                              <span className="db-pl-label">{item.label}</span>
                              <span className="db-pl-val" style={{color:item.color}}>{item.val}/{item.target}</span>
                            </div>
                            <div className="db-pl-track">
                              <div className="db-pl-fill" style={{width:`${pct}%`,background:item.color}} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="empty-state" style={{padding:'24px'}}>
                      <p>No placement data yet. Visit <strong>Placement Tracker</strong> to add progress.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ---- Row 4: Charts ---- */}
              {sessions.length > 0 && (
                <div className="db-two-col" style={{marginBottom:'24px'}}>

                  {/* Bar Chart: Last 7 days */}
                  <div className="db-chart-card">
                    <div className="db-chart-title">📈 Study Hours — Last 7 Days</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={last7} margin={{top:8,right:8,left:-24,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="day" tick={{fontSize:12,fill:'var(--color-text-muted)'}} />
                        <YAxis tick={{fontSize:12,fill:'var(--color-text-muted)'}} />
                        <Tooltip
                          contentStyle={{borderRadius:'8px',border:'1px solid var(--color-border)',fontSize:'13px'}}
                          formatter={v=>[`${v}h`,'Hours']}
                        />
                        <Bar dataKey="hours" fill="#4F46E5" radius={[5,5,0,0]} name="Hours" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart: Subject Distribution */}
                  <div className="db-chart-card">
                    <div className="db-chart-title">📊 Subject Distribution</div>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={pieData} cx="45%" cy="50%" outerRadius={80}
                            dataKey="value" nameKey="name"
                            label={({name,percent})=>`${name.split(' ')[0]} ${(percent*100).toFixed(0)}%`}
                            labelLine={false} fontSize={11}
                          >
                            {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={v=>`${v}h`} contentStyle={{borderRadius:'8px',border:'1px solid var(--color-border)',fontSize:'13px'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state" style={{padding:'40px'}}><p>Log sessions to see subject breakdown</p></div>
                    )}
                  </div>

                </div>
              )}

              {/* ---- Recent Sessions (unchanged from Phase 2A) ---- */}
              {sessions.length > 0 && (
                <div className="dashboard-recent">
                  <h3 className="section-title">Recent Study Sessions</h3>
                  <div className="recent-sessions-list">
                    {sessions.slice(0,5).map(session=>(
                      <div key={session._id} className="recent-session-item">
                        <div className="recent-session-left">
                          <span className="recent-session-subject">{session.subject}</span>
                          <span className="recent-session-notes">{session.notes||'No notes'}</span>
                        </div>
                        <div className="recent-session-right">
                          <span className="recent-session-hours">{session.durationHours}h</span>
                          <span className="recent-session-date">
                            {new Date(session.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalSessions===0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <h3>No study sessions yet</h3>
                  <p>Go to <strong>Study Tracker</strong> to log your first session!</p>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default Dashboard
